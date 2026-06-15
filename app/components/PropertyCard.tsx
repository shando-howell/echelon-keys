"use client";

import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

export interface Property {
    _id: Id<"properties">;
    title: string;
    description: string;
    price: number;
    propertyType: string;
    imageUrl?: string;
    status: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
}

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    // Format price into standard currency layout
    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(property.price);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
        hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row h-auto sm:h-40 w-full">
            {/* Property Thumbnail */}
            <div className="relative w-full sm:w-40 h-40 bg-gray-200 shrink-0">
                {property.imageUrl ? (
                    <Image
                        src={property.imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        No Image
                    </div>
                )}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold
                uppercase tracking-wide shadow-sm text-white ${
                    property.status === "active" ? "bg-green-650" : "bg-amber-600"
                }`}>
                    {property.status}
                </span>
            </div>

            {/* Property Details */}
            <div className="p-4 flex-flex-col justify-between flex-1 min-w-0">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-bold text-gray-950 truncate">
                            {formattedPrice}
                        </h2>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium capitalize">
                            {property.propertyType}
                        </span>
                    </div>

                    <h3 className="text-xs font-semibold text-gray-700 truncate mt-0.5">
                        {property.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp2 mt-1">
                        {property.description}
                    </p>
                </div>

                {/* Specs Row */}
                <div className="flex items-center gap-4 text-xs font-medium text-gray-600 border-t pt-2 mt-2 sm:mt-0">
                    <div className="flex items-center gap-1">
                        <span>🛏️</span>
                        <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>🛁</span>
                        <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>📐</span>
                        <span>{property.squareFeet.toLocaleString()} sq ft</span>
                    </div>
                </div>
            </div>
        </div>
    );
}