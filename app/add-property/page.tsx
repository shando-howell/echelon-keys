import Link from "next/link";
import CreateListingForm from "../components/CreateListingForm";

const AddPropertyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/agent-dashboard"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors
                    flex items-center gap-2"
                >
                    Back to Dashboard
                </Link>
            </div>

            <CreateListingForm />
        </div>
    </div>
  )
}

export default AddPropertyPage