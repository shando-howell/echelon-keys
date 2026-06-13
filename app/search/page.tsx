"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PropertyCard from "../components/PropertyCard";
import PropertyMapViewer from "../components/PropertyMapViewer";

// A simple hook to debounce fast-changing state values
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default function RealEstateSearchPage() {
    // 1. Raw map viewport state (changes continuously as user pans)
    const [mapBounds, setMapBounds] = useState({
        north: 18.0500,
        south: 17.9500,
        east: -76.7000,
        west: -76.8500,
    });

    // 2. Debounce the bounds by 500ms to eliminate the network storm
    const debouncedBounds = useDebounce(mapBounds, 500);

    // 3. Reactive Convex query automatically runs only when debounced state settles
    const properties = useQuery(api.properties.getByBounds, {
        bounds: debouncedBounds,
    });

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            {/* Search Header Controls */}
            <header className="h-16 border-b -bg-white flex items-center px-6 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-gray-200">Available Listings</h1>
            </header>

            {/* Main Split View Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Side: Scrollable Sidebar Grid */}
                <aside className="w-full md:w-[450px] lg:w-[500px] h-full overflow-y-auto bg-gray-50
                border-r p-4 flex flex-col gap-4">
                    <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                        Showing {properties?.length || 0} homes in map view.
                    </div>

                    {!properties ? (
                        <div className="flex itemscenter justify-center py-20 text-gray-400">
                            Scanning coordinates...
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            No matching properties found in this area. Try panning somewhere else!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </aside>

                {/* Right Side: Interactive Map Engine Container */}
                <main className="hidden md:block flex-1 h-full bg-gray-200 relative">
                    <PropertyMapViewer
                        currentBounds={mapBounds}
                        onBoundsChange={(newBounds) => {
                            // As the third-party map engine fires raw camera change events,
                            // we update the raw state immediately for smooth rendering inside the map wrapper.
                            setMapBounds(newBounds);
                        }}
                        properties={properties || []}
                    />
                </main>
            </div>
        </div>
    );
}