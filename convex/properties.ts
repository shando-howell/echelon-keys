import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getByBounds = query({
    args: {
        bounds: v.object({
            north: v.number(), // Maximum Latitude
            south: v.number(), // Minimum Latitude
            east: v.number(), // Maximum Longitude
            west: v.number() // Minimum Longitude
        }),
    },
    handler: async (ctx, args) => {
        const { north, south, east, west } = args.bounds;

        const properties = await ctx.db
            .query("properties")
            // 1) The DB index: Instantly slice away 90% of the world.
            // This happens at the DB level, so it is lightning fast.
            .withIndex("by_latitude", (q) => 
                q.gte("latitude", south).lte("latitude", north)
            )
            // 2) The In-Memory Filter: Check the remaining properties for Longitude.
            // Since the index already reduced the dataset, this filter is highly efficient.
            .filter((q) => 
                q.and(
                    q.gte(q.field("longitude"), west),
                    q.lte(q.field("longitude"), east)
                )
            )
            // 3. The Safety Valve: Prevent massive payloads if the user zooms completely out.
            .take(100);

        return properties;
    },
});

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const attachImagesToProperty = mutation({
    args: {
        propertyId: v.id("properties"),
        storageIds: v.array(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        // 1. Fetch the existing property
        const property = await ctx.db.get(args.propertyId);

        if (!property) {
            throw new Error("Property not found. Cannot attach images.");
        }

        // 2. Merge the new images with any exisitng ones to prevent overwriting
        const updatedImageIds = [...property.imageIds, ...args.storageIds];

        // 3. Patch the database record
        await ctx.db.patch(args.propertyId, {
            imageIds: updatedImageIds
        });

        return updatedImageIds;
    },
});

export const createProperty = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        price: v.number(),
        propertyType: v.string(),
        status: v.string(),
        bedrooms: v.number(),
        bathrooms: v.number(),
        squareFeet: v.number(),
        latitude: v.number(),
        longitude: v.number(),
    },
    handler: async (ctx, args) => {
        // 1. Verify the user is authenticated via Clerk
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized. You must be logged in to create a listing.")
        }

        // 2. Look up the agent's internal database ID using their secure token
        const agent = await ctx.db
            .query("agents")
            .withIndex("by_token", (q) => 
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!agent) {
            throw new Error("Agent profile not found. Please sync your account.");
        }

        // 3. Insert the new property, tying it firmly to this agent
        const newPropertyId = await ctx.db.insert("properties", {
            title: args.title,
            description: args.description,
            price: args.price,
            propertyType: args.propertyType,
            status: args.status,
            bedrooms: args.bedrooms,
            bathrooms: args.bathrooms,
            squareFeet: args.squareFeet,
            latitude: args.latitude,
            longitude: args.longitude,
            imageIds: [],
            agentId: agent._id,
        });

        return newPropertyId;
    },
});

export const searchProperties = query({
    args: {
        north: v.number(),
        south: v.number(),
        east: v.number(),
        west: v.number(),
        minPrice: v.number(),
        maxPrice: v.number(),
        bedrooms: v.number(),
        propertyType: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Perform the heavy lifting using the database index first
        const rawProperties = await ctx.db
            .query("properties")
            .filter((q) => {
                const conditions = [
                    q.gte(q.field("latitude"), args.south),
                    q.lte(q.field("latitude"), args.north),
                    q.gte(q.field("longitude"), args.west),
                    q.lte(q.field("longitude"), args.east),
                    q.gte(q.field("price"), args.minPrice),
                    q.gte(q.field("bedrooms"), args.bedrooms),
                ];

                if (args.maxPrice < 100000000) {
                    conditions.push(q.lte(q.field("price"), args.maxPrice))
                }

                // Check Property Type
                if (args.propertyType !== "all") {
                    conditions.push(q.eq(q.field("propertyType"), args.propertyType))
                }

                return q.and(...conditions);
            })
            .collect();

        // 2. Convert the internal storage IDs to valid URLS
        const propertiesWithUrls = await Promise.all(
            rawProperties.map(async (property) => {
                const resolvedUrls = property.imageIds && property.imageIds.length > 0
                    ? await Promise.all(property.imageIds.map(async (id) => {
                        const url = await ctx.storage.getUrl(id as Id<"_storage">);

                        console.log(`Resolving ID [${id}]:`, url ? "SUCCESS" : "FAILED - Returning null")

                        return url;
                        }))
                    : [];

                const validUrls = resolvedUrls.filter((url) => url !== null);

                const hydratedProperty =  {
                    ...property,
                    imageUrl: validUrls.length > 0 ? validUrls[0] : null,
                    imageUrls: validUrls,
                }

                console.log(`Outbound Payload for [${hydratedProperty._id}]:`, hydratedProperty.imageUrl);

                return hydratedProperty;
            })
        );
        return propertiesWithUrls;
    }
});

export const searchPaginatedProperties = query({
    args: {
        // The built-in validator for the cursor state
        paginationOpts: paginationOptsValidator,

        // The search parameters passed from the Next.js client component
        location: v.string(),
        bedrooms: v.number(),
    }, 
    handler: async (ctx, args) => {
        // Initialize the base query
        let propertiesQuery = ctx.db.query("properties");

        const hasLocation = args.location !== "";
        const hasBedrooms = args.bedrooms > 0;

        //  Only apply the .filter() method if we actually have active filters
        if (hasLocation || hasBedrooms) {
            propertiesQuery = propertiesQuery.filter((q) => {
                // Both filters applied
                if (hasLocation && hasBedrooms) {
                    return q.and(
                        q.eq(q.field("location"), args.location),
                        q.gte(q.field("bedrooms"), args.bedrooms)
                    );
                }

                        // Single filters applied
                        if (hasLocation) {
                            return q.eq(q.field("location"), args.location);
                        }

                        return q.gte(q.field("bedrooms"), args.bedrooms);
                    });
                }

                return await propertiesQuery.paginate(args.paginationOpts);
    },
});