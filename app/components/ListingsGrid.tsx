"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PropertyCard from "./PropertyCard";

interface ListingsGridProps {
    location: string;
    bedrooms: number;
}

export default function ListingsGrid({ location, bedrooms }: ListingsGridProps) {
    // The Real-Time Pagination Hook
    const { results, status, loadMore } = usePaginatedQuery(
        api.properties.searchPaginatedProperties,
        { location, bedrooms },
        { initialNumItems: 6}
    );

    // The Skeleton State (Initial Load)
    if (status === "LoadingFirstPage") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                ))}
            </div>
        );
    }

    // The Empty State
    if (results.length === 0) {
        return (
            <div className="py-20 text-center">
                <h3 className="text-xl font-semibold text-gray-700">No properties found.</h3>
                <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center pb-12">
            {/* The Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {results.map((property) => (
                    <div key={property._id} className="h-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <PropertyCard key={property._id} property={property} />
                    </div>
                ))}
            </div>

            {/* The "Load More" Hybrid Pagination Control */}
            {status === "CanLoadMore" && (
                <button
                    onClick={() => loadMore(6)}
                    className="mt-12 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full
                    transition-colors shadow-md"
                >
                    Load More Properties
                </button>
            )}

            {/* The Appending Skeleoton State */}
            {status === "LoadingMore" && (
                <div className="mt-12 flex justify-center w-full">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent
                    rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}