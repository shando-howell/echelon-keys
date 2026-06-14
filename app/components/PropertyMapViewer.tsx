"use client";

import { useRef, useCallback } from "react";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

interface Property {
    _id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
}

interface MapViewerProps {
    currentBounds: MapBounds;
    onBoundsChange: (bounds: MapBounds) => void;
    properties: Property[];
}

export default function PropertyMapViewer({
    onBoundsChange,
    properties,
}: MapViewerProps) {
    const mapRef = useRef<MapRef>(null);

    // When the user stops dragging the map, we extract the new GPS box
    // and pass it up to trigger our debounced Convex query.
    const handleMoveEnd = useCallback(() => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getMap().getBounds();

        if (!bounds) return;

        onBoundsChange({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
        });
    }, [onBoundsChange]);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                    longitude: -76.7984, // Centered right over Kingston
                    latitude: 18.0128,
                    zoom: 11
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onMoveEnd={handleMoveEnd}
                reuseMaps
            >
                {/* Render active database rows as visual pins */}
                {properties.map((prop) => (
                    <Marker
                        key={prop._id}
                        longitude={prop.longitude}
                        latitude={prop.latitude}
                        anchor="bottom"
                        onClick={(e) => {
                            // Prevents the map from panning when a user clicks a pin
                            e.originalEvent.stopPropagation();
                        }}
                    >
                        <div
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold 
                            text-xs px-2 py-1 rounded-full shadow-md cursor-pointer tansition-transform transform hover:scale-105
                            flex items-center gap-1 border-2 border-white"
                        >
                            <span>📍</span>
                            <span>{(prop.price / 1000000).toFixed(1)}M</span>
                        </div>
                    </Marker>
                ))}
            </Map>    
        </div>
    );
}