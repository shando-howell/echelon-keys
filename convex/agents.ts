import { mutation } from "./_generated/server";

export const syncAgent = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Validate the Convex-Clerk handshake
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Authentication missing. Cannot sync agent.")
        }

        // 2. Check if this agent already exists in our database
        const existingAgent = await ctx.db
            .query("agents")
            .withIndex("by_token", (q) => 
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (existingAgent) {
            return existingAgent._id;
        }

        // 3. If it is a brand new login, create thier individual account profile
        const newAgentId = await ctx.db.insert("agents", {
            name: identity.name || "Real Estate Agent",
            email: identity.email || "No email provided",
            tokenIdentifier: identity.tokenIdentifier,
        });

        return newAgentId;
    },
});
