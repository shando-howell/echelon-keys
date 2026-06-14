"use client";

import Link from "next/link";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  // Retrieve the raw authentication state directly
  const { isLoaded, userId } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Echelon Keys
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Manage your listings and streamline your property workflow.
        </p>

        {!isLoaded ? (
          <div className="w-32 h-12 bg-gray-200 rounded-lg mx-auto">
            <h2 className="animate-pulse text-gray-800">Loading...</h2>
          </div>
        ) : userId ? (
          /* What users see when they are logged in (userId exists) */
          <div className="flex flex-col items-center gap-4">
            <UserButton />
            <Link
              href="/agent-dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Agent Dashboard
            </Link>
          </div>
        ) : (
          /* What users see when they ARE NOT logged in (userId is null) */
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 
            rounded-lg transition-colors shadow-sm">
              Agent Login
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}