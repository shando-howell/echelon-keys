"use client";

import { ChangeEvent } from "react";
import PropertyCard, { Property } from "./PropertyCard";

export interface FilterState {
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    propertyType: string;
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    properties: Property[];
}

export default function FilterSidebar({ filters, onFilterChange, properties }: FilterSidebarProps) {
    // Generic handler to capture changes and push them up to the parent
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        onFilterChange({
            ...filters,
            [name]: type === "number" || type === "range" ? Number(value) : value,
        });
    };

    return (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]
        overflow-y-auto p-6 flex flex-col gap-8 shadow-sm">
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Filter Properties</h2>
                <p className="text-xs text-gray-500">Refine the map view in real-time.</p>
            </div>

            {/* Property Type Dropdown */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Property Type</label>
                <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:ring-2
                    focus:ring-blue-500 outline-none transition-all"
                >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                </select>
            </div>

            {/* Bedrooms Slider/Input */}
            <div className="flex flex-cols gap-2">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                    <span>Minimum Bedrooms</span>
                    <span className="text-blue-600">{filters.bedrooms > 0 ? `${filters.bedrooms}+` : 'Any'}</span>
                </label>
                <input
                    type="range"
                    name="bedrooms"
                    min="0"
                    max="6"
                    step="1"
                    value={filters.bedrooms}
                    onChange={handleChange}
                    className="w-full accent-blue-600"
                />
            </div>

            {/* Max Price Range (JMD scaling) */}
            <div className="flex flex-cols gap-2">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                    <span>Max Price (JMD)</span>
                    <span className="text-blue-600">
                        {filters.maxPrice >= 100000000 ? 'Any' : `$${(filters.maxPrice / 1000000).toFixed(1)}M`}
                    </span>
                </label>
                <input
                    type="range"
                    name="maxPrice"
                    min="5000000"
                    max="100000000"
                    step="5000000"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    className="w-full accent-blue-600"
                />
            </div>

            {/* Reset Button */}
            <div className="border-t border-gray-100">
                <button
                    onClick={() => onFilterChange({minPrice: 0, maxPrice: 100000000, bedrooms: 0, propertyType: "all"})}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                >
                    Reset Filters
                </button>
            </div>

            {/* The Property Listings  */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                    {properties.length} Results Found
                </h3>

                <div className="flex flex-col gap-4">
                    {properties.length === 0 ? (
                        <div className="etxt-sm text-gray-500 text-center py-8">
                            No properties match your current filters.
                        </div>
                    ) : (
                        properties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}