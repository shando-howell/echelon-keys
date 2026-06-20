import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    properties: defineTable({
        title: v.string(),
        description: v.string(),
        location: v.optional(v.string()),
        price: v.number(),
        propertyType: v.string(),
        status: v.string(),

        // Core Specs
        bedrooms: v.number(),
        bathrooms: v.number(),
        squareFeet: v.number(),

        // The crucial coordinats for our map boundary queries
        latitude: v.number(),
        longitude: v.number(),

        // Media
        imageIds: v.array(v.id("_storage")),

        // Relationship
        agentId: v.string()
    })
    // Indexing for standard sidebar filters
    .index("by_status", ["status"])
    .index("by_type", ["propertyType"])
    // The geospatial index for map queries
    .index("by_latitude", ["latitude"]),

    agents: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string()
    })
    .index("by_token", ["tokenIdentifier"])
});