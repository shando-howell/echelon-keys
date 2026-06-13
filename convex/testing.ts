// convex/testing.ts
import { mutation } from "./_generated/server";

export const seedProperties = mutation({
  handler: async (ctx) => {
    const testProperties = [
      {
        title: "Modern Apartment in New Kingston",
        description: "Centrally located with city views.",
        price: 25000000,
        propertyType: "apartment",
        status: "active",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        // Kingston coordinates
        latitude: 18.0075, 
        longitude: -76.7865,
        imageIds: [],
        agentId: "test-agent-1",
      },
      {
        title: "Luxury Villa in Norbrook",
        description: "Spacious estate with a pool.",
        price: 85000000,
        propertyType: "house",
        status: "active",
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 4500,
        // St. Andrew coordinates
        latitude: 18.0435, 
        longitude: -76.7762,
        imageIds: [],
        agentId: "test-agent-1",
      },
      {
        title: "Beachfront Condo in Montego Bay",
        description: "Steps away from the ocean.",
        price: 45000000,
        propertyType: "apartment",
        status: "active",
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 2000,
        // MoBay coordinates (Far outside our test box)
        latitude: 18.4762, 
        longitude: -77.8939,
        imageIds: [],
        agentId: "test-agent-2",
      }
    ];

    for (const prop of testProperties) {
      await ctx.db.insert("properties", prop);
    }
  }
});