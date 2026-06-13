"use client";

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
    currentBounds,
    onBoundsChange,
    properties,
}: MapViewerProps) {
    // A helper function simulating a map pan action to a different neighborhood area
    const simulateMapShift = (direction: string) => {
        const step = 0.02; // Coordinate offset shift size
        let { north, south, east, west } = currentBounds;

        switch (direction) {
            case "north":
                north += step; south += step; break;
            case "south":
                north -= step; south -= step; break;
            case "east":
                east += step; west += step; break;
            case "west":
                east -= step; west -= step; break;
        }
        
        onBoundsChange({ north, south, east, west });
    };

    return (
            <div className="w-full h-full relative bg-slate-100 
            flex flex-col justify-between p-4 bg-[radial-gradient(#e2e8f0_1px, transparent_1px)]
            bg-size:16px_16px">
                {/* Map Interactive Directional Controls */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-white p-2 
                rounded-xl shadow-md border">
                    <span className="text-[10px] font-bold text-gray-400 uppercase text-center mb-1">
                        Pan Map
                    </span>
                    <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                        <div></div>
                        <button 
                            onClick={() => simulateMapShift("north")} 
                            className="p-1 bg-gray-50 hover:bg-gray-100 border rounded text-xs 
                            text-center font-bold"
                        >
                                ▲
                        </button>
                        <div></div>
                        <button 
                            onClick={() => simulateMapShift("west")} 
                            className="p-1 bg-gray-50 hover:bg-gray-100 border rounded text-xs 
                            text-center font-bold">
                                ◀
                        </button>
                        <div className="bg-gray-200 rounded-sm"></div>
                        <button onClick={() => simulateMapShift("east")} className="p-1 bg-gray-50 hover:bg-gray-100 border rounded text-xs text-center font-bold">▶</button>
                        <div></div>
                        <button onClick={() => simulateMapShift("south")} className="p-1 bg-gray-50 hover:bg-gray-100 border rounded text-xs text-center font-bold">▼</button>
                    </div>
                </div>

                {/* Floating Coordinate Status HUD */}
                <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 text-white font-mono 
                text-[10px] p-3 rounded-lg shadow-xl backdrop-blur-sm border border-slate-700 flex 
                flex-col gap-1">
                    <div className="text-cyan-400 font-bold border-b border-slate-700 pb-1 mb-1 
                    uppercase tracking-wider">Viewport Engine HUD</div>
                    <div>N: {currentBounds.north.toFixed(4)}</div>
                    <div>S: {currentBounds.south.toFixed(4)}</div>
                    <div>E: {currentBounds.east.toFixed(4)}</div>
                    <div>W: {currentBounds.west.toFixed(4)}</div>
                </div>

                {/* Canvas Layer for Simulated Property Pins */}
                <div className="flex-1 w-full relative flex items-center justify-center">
                    {properties.length === 0 ? (
                        <div className="text-xs font-medium text-gray-400 bg-white/80 border px-4 py-2 
                        rounded-full shadow-sm select-none">
                            No listings visible on canvas
                        </div>
                    ) : (
                        <div className="absolute inset-0 pointer-events-none flex items-center
                        justify-center">
                            {properties.map((prop, idx) => {
                                // Distribute pins dynamically across the mock canvas view area safely
                                const topPercent = 20 + (idx * 25) % 60;
                                const leftPercent = 30 + (idx * 25) % 50;

                                return (
                                    <div 
                                        key={prop._id}
                                        className="absolute pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white font-bold 
                                        text-xs px-2 py-1 rounded-full shadow-md cursor-pointer tansition-transform transform hover:scale-105
                                        flex items-center gap-1 border-2 border-white"
                                        style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                                    >
                                        <span>📍</span>
                                        <span>{(prop.price / 1000000).toFixed(1)}M</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
}