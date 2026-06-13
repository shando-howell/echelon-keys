"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UploadProps {
    propertyId: Id<"properties">;
}

export default function PropertyImageUpload({ propertyId }: UploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    // Hook into Convex mutations
    const generateUploadUrl = useMutation(api.properties.generateUploadUrl);
    const attachImages = useMutation(api.properties.attachImagesToProperty);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);

        try {
            // Step 1 & 2: Process all files in parallel
            const uploadPromises = files.map(async (file) => {
                // 1. Get a secure, short-lived URL for this specific file
                const postUrl = await generateUploadUrl();

                // 2. POST the file directly to Convex storage via standard HTTP
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: {"Content-Type": file.type},
                    body: file,
                });

                if (!result.ok) throw new Error(`Failed to upload ${file.name}`);

                const {storageId} = await result.json();
                return storageId as Id<"_storage">;
            });

            // Wait for all HTTP uploads to finish and collect their new IDs
            const storageIds = await Promise.all(uploadPromises);

            // Step 3: Commit the batch of IDs to the property record via WebSocket
            await attachImages({
                propertyId,
                storageIds,
            });

            // Reset the file input
            event.target.value = "";
            alert("Images uploaded successfully!")
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload images. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Property Gallery
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Upload high-resolution images for this listing.
            </p>

            <label className={`
                px-4 py-2 rounded-md text-white font-medium cursor-pointer transition-colors
                ${isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
            `}>
                {isUploading ? "Uploading Batch..." : "Select Images"}
                <input
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
}