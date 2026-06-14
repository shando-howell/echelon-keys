"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import PropertyImageUpload from "./PropertyImageUpload";

export default function CreateListingForm() {
    const router = useRouter();

    // Phase Management State
    const [createdPropertyId, setCreatedPropertyId] = useState<Id<"properties"> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        propertyType: "apartment",
        status: "active",
        bedrooms: 0,
        bathrooms: 0,
        squareFeet: 0,
        // Defaulting to a central Kingston coordinate for quick testing
        latitude: 18.0128,
        longitude: -76.7984,
    });

    const createProperty = useMutation(api.properties.createProperty);

    const handleTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Execute Phase 1: Create the secure database record
            const newId = await createProperty(formData);

            // Setting this ID automatically triggers the UI swap to Phase 2
            setCreatedPropertyId(newId);
        } catch (error) {
            console.error("Failed to create listing:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    };

    // ==================================
    // PHASE 2: THE MEDIA UPLOAD VIEW
    // ==================================
    if (createdPropertyId) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Listing Created!</h2>
                    <p className="text-gray-500">Now let&apos;s add some high-quality photos.</p>
                </div>

                <PropertyImageUpload propertyId={createdPropertyId} />

                <div className="mt-8 pt-6 border-t flex justify-end">
                    <button
                        onClick={() => router.push("/agent-dashboard")}
                        className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium 
                        rounded-lg transition-colors"
                    >
                        Finish and Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // =================================
    // PHASE 1: THE TEXT INPUT VIEW
    // =================================
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
                <p className="text-gray-500 text-sm">Enter the property details to initialize the listing.</p>
            </div>

            <form onSubmit={handleTextSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border text-gray-700 rounded-md"
                            placeholder="e.g. Modern Apartment in New Kingston"
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border text-gray-700 rounded-md h-24"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (JMD)
                        </label>
                        <input
                            required
                            type="number"
                            name="price"
                            value={formData.price || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border text-gray-700 rounded-md bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type
                        </label>
                        <select 
                            name="propertyType" 
                            value={formData.propertyType}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md text-gray-700 bg-white"
                        >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="commercial">Commercial</option>
                            <option value="land">Land</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bedrooms
                        </label>
                        <input
                            required
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border text-gray-700 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bathrooms
                        </label>
                        <input
                            required
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border text-gray-700 rounded-md"
                        />
                    </div>

                    <div className="mt-6 pt-6 border-t flex items-center justify-between">
                        <span className="text-xs text-gray-400 mr-4">Photos will be added in the next step.</span>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isSubmitting ? "Initializing..." : "Create & Continue"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
