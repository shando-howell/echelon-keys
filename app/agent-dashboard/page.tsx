"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AgentDashboard() {
    const { user, isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    //  Hook into the new sync mutation
    const syncAgentToDatabase = useMutation(api.agents.syncAgent);
    
    useEffect(() => {
        // Wait until Clerk is fully loaded
        if (!isLoaded) return;

        if (!isSignedIn) {
            router.push("/");
            return;
        }

        // Sync the Clerk user to the Convex "agents" table
        const performSync = async () => {
            try {
                const convexAgentId =await syncAgentToDatabase();
                console.log("Agent synchronized with DB ID:", convexAgentId);
            } catch (error) {
                console.error("Failed to sync agent:", error);
            }
        };

        performSync();
    }, [isLoaded, isSignedIn, user, router, syncAgentToDatabase])

    // Prevent layout flashing while Clerk loads
    if (!isLoaded || !isSignedIn) {
        return (
            <div className="h-screen flex items-center justify-center animate-pulse">
                Loading Secure Environment...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Top Nav */}
            <header className="px-18 py-4 flex items-center text-gray-900 justify-between">
                <h1 className="text-xl font-bold">
                    Agent Dashboard
                </h1>
                <div className="flex items-center">
                    Welcome back, {user.firstName}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Action Card: Add New Listing */}
                    <Link
                        href="/add-property"
                        className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center
                        justify-center text-center hover:shadow-md hover:border-blue-200 transition-all
                        cursor-pointer group"
                    >
                        <div className="w-12 h12 bg-blue-100 text-blue-600 rounded-full flex 
                        items-center justify-center text-2xl mb-4">
                            +
                        </div>
                        <h3 className="font-bold text-gray-800">New Listing</h3>
                        <p className="text-sm text-gray-500 mt-2">Publish a new property to the map.</p>
                    </Link>

                    {/* Placeholder for My Listings */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm md:col-span-2 flex items-center
                    justify-center text-gray-400">
                        Active Listings View (Coming Soon)
                    </div>
                </div>
            </main>
        </div>
    );
}