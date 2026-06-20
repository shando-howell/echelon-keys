import ListingsGrid from "../components/ListingsGrid";

export default function ListingsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    // Extract the URL paramters safely, providing fallbacks if they are empty
    const location = searchParams.location || "";
    const bedrooms = searchParams.bedrooms ? parseInt(searchParams.bedrooms, 10) : 0;

    return (
        <main className="min-h-screen bg-gray-50 pt-8 pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {location 
                            ? `Properties in ${location.charAt(0).toUpperCase() + location.slice(1)}`
                            : "All Properties"
                        }
                    </h1>
                    <p className="text-gray-500 mt-2">Showing results based on your criteria.</p>
                </div>

                {/* Pass the extracted params down to our interactive client grid */}
                <ListingsGrid location={location} bedrooms={bedrooms} />
            </div>
        </main>
    );
}