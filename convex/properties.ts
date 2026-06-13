import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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