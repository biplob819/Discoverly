"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@stackframe/stack";
import { Rocket, Search, Plus } from "lucide-react";

export default function Navbar() {
  const user = useUser();
  const [userRole, setUserRole] = useState<"user" | "builder" | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Discoverly</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/discover"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Discover
            </Link>
            <Link
              href="/beta-test"
              className="text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              Beta Test
            </Link>
            <Link
              href="/newsletter"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Newsletter
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </Link>

            {user ? (
              <>
                {/* Launch Product Button - Only show for builders */}
                {userRole === "builder" && (
                  <Link
                    href="/launch"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Launch Product
                  </Link>
                )}

                {/* User Menu */}
                <UserButton />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/handler/sign-in"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/handler/sign-up"
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

