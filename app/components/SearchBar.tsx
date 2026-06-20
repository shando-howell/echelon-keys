"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();

    // Local state just to control the form inputs before submission
    const [location, setLocation] = useState("");
    const [bedrooms, setBedrooms] = useState("Any");
    const [price, setPrice] = useState("Any");

    const handleSearch = (e: React.FormEvent) => {
        // Stop the page from refreshing
        e.preventDefault();

        // Build the URL parameters
        const params = new URLSearchParams();
        if (location.trim() !== "") params.append("location", location.trim().toLowerCase());
        if (bedrooms !== "Any") params.append("bedrooms", bedrooms);
        if (price !== "Any") params.append("price", price);

        // Route the user to the Listings page with the params attached
        router.push(`/listings?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-md
            border border-white/20 p-2 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto gap-2"
        >
            {/* Location Input */}
            <div className="flex-1 w-full bg-white rounded-xl overflow-hidden">
                <input 
                    type="text"
                    placeholder="Where do you want to live? (e.g., Kingston)"
                    className="w-full px-4 py-3 text-gray-800 focus:outline-none placeholder-gray-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            {/* Bedrooms Dropdown */}
            <div className="w-full md:w-32 bg-white rounded-xl overflow-hidden flex items-center px-3">
                <select
                    className="w-full py-3 text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                >
                    <option value="Any">Bed Rooms</option>
                    <option value="1">1 Bed Room</option>
                    <option value="2">2 Bed Rooms</option>
                    <option value="3">3 Bed Rooms</option>
                    <option value="4">4 Bed Rooms</option>
                </select>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 transition-colors
              text-white font-semibold rounded-xl"
            >
                Search
            </button>
        </form>
    )
}