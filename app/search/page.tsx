"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FilterSidebar, { FilterState } from "../components/FilterSidebar";

// A simple hook to debounce fast-changing state values
// function useDebounce<T>(value: T, delay: number): T {
//     const [debouncedValue, setDebouncedValue] = useState<T>(value);

//     useEffect(() => {
//         const handler = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);

//         return () => clearTimeout(handler);
//     }, [value, delay]);

//     return debouncedValue;
// }

const PropertyMapViewer = dynamic(
    () => import("../components/PropertyMapViewer"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 animate-pulse">
            Loading Map Engine...
        </div>
    }
);

export default function RealEstateSearchPage() {
    // 1. The Global Filter State
    const [filters, setFilters] = useState<FilterState>({
        minPrice: 0,
        maxPrice: 100000000,
        bedrooms: 0,
        propertyType: "all",
    });

    // 2. Raw map viewport state (changes continuously as user pans)
    const [mapBounds, setMapBounds] = useState({
        north: 18.0500,
        south: 17.9500,
        east: -76.7000,
        west: -76.8500,
    });

    // 2. Debounce the bounds by 500ms to eliminate the network storm
    // const debouncedBounds = useDebounce(mapBounds, 500);

    // 3. Reactive Convex query automatically runs only when debounced state settles
    // const properties = useQuery(api.properties.getByBounds, {
    //     bounds: debouncedBounds,
    // });

    // 3. The Reactive Database Connection
    // This automatically fires anytime `bounds` or `filters` change
    const properties = useQuery(api.properties.searchProperties, {
       ...mapBounds,
       ...filters,
    });

    return (
        <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden">
            {/* Left Column: The Filter Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)]
            relative bg-white">
                <FilterSidebar 
                    filters={filters} 
                    onFilterChange={setFilters} 
                    // @ts-expect-error: Type mismatch
                    properties={properties || []}
                />
            </div>

            {/* Right Column: The Geospatial Engine */}
            <div className="flex-1 relative">
                <PropertyMapViewer
                    currentBounds={mapBounds}
                    onBoundsChange={setMapBounds}
                    properties={properties || []}
                />

                {/* Loading overlay when Convex is crunching data */}
                {properties === undefined && (
                    <div className="abolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2
                    rounded-full shadow-md text-sm font-medium text-blue-600 z-10 animate-pulse">
                        Searching...
                    </div>
                )}
            </div>
        </div>
    );
}