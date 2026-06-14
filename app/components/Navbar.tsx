"use client";

import Link from "next/link";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
    // Retrieve the authentication state directly from Clerk's core engine
    const { isLoaded, userId } = useAuth();

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo */}
                    <div className="flex-shrink-0 flex flex-1 items-center">
                        <Link 
                            href="/" 
                            className="text-xl font-bold text-gray-900 tracking-tight transition-transform hover:scale-105"
                        >
                            Echelon<span className="text-gray-500">Keys</span>
                        </Link>
                    </div>

                    <div className="flex">
                        {/* Desktop Navigation Links */}
                        <div className="hidden sm:ml-6 sm:flex">
                            <Link
                                href="/search"
                                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md
                                text-sm font-medium transition-colors"
                            >
                                Property Map
                            </Link>

                            {/* Conditional Rendering: Only show if a user exists */}
                            {userId && (
                                <Link
                                    href="/agent-dashboard"
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 
                                    rounded-md text-sm font-medium transition-colors"
                                >
                                    Agent Dashboard
                                </Link>
                            )}
                        </div>

                        {/* Auth Controls */}
                        <div className="flex items-center space-x-4">
                            {/* Wait for Clerk to initialize before showing auth buttons to
                            prevent UI flickering */}
                            {isLoaded && (
                                userId ? (
                                    <UserButton />
                                ) : (
                                    <SignInButton mode="modal">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4
                                        py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}