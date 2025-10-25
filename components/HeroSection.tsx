"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { Rocket, Zap, ArrowRight, TrendingUp, Users } from "lucide-react";

export default function HeroSection() {
  const user = useUser();
  const [userRole, setUserRole] = useState<"user" | "builder" | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRole();
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

  const showLaunchButton = !user || userRole === "builder";

  return (
    <section className="bg-gradient-to-br from-cyan-50 via-white to-cyan-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Discover products that matter
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Launch Your Product.
            <br />
            <span className="text-cyan-600">Get Discovered.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-balance">
            A modern platform for builders, founders, and early-stage startups to
            launch products and connect with the right audience through
            relevance-based discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showLaunchButton && (
              <Link
                href="/launch"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Rocket className="w-5 h-5" />
                Launch Your Product
              </Link>
            )}
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl hover:border-cyan-500 font-semibold text-lg transition-all"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl mb-3">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900">500+</div>
            <div className="text-gray-600 mt-1">Products Launched</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900">10K+</div>
            <div className="text-gray-600 mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900">50K+</div>
            <div className="text-gray-600 mt-1">Monthly Visits</div>
          </div>
        </div>
      </div>
    </section>
  );
}

