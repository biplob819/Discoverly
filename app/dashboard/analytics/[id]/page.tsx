"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@stackframe/stack";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Eye, MousePointerClick, Bookmark, MessageCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

type Analytics = {
  views: number;
  clicks: number;
  bookmarks: number;
  comments: number;
  viewsByDay: Array<{ date: string; count: string }>;
  topCountries: Array<{ country: string; count: string }>;
};

export default function AnalyticsPage() {
  const params = useParams();
  const user = useUser({ or: "redirect" });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [params.id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analytics not available
            </h2>
            <Link href="/dashboard" className="text-cyan-600 hover:text-cyan-700">
              Go back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const chartData = analytics.viewsByDay.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    views: parseInt(item.count),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600 text-lg">
            Track your product's performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Views</span>
              <Eye className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {analytics.views.toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Clicks</span>
              <MousePointerClick className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {analytics.clicks.toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Bookmarks</span>
              <Bookmark className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {analytics.bookmarks.toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Comments</span>
              <MessageCircle className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {analytics.comments.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Views Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Views Over Time (Last 30 Days)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="views" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries */}
        {analytics.topCountries.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Top Countries
            </h2>
            <div className="space-y-4">
              {analytics.topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center gap-4">
                  <div className="w-8 text-center font-semibold text-gray-400">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {country.country}
                      </span>
                      <span className="text-gray-600">
                        {parseInt(country.count).toLocaleString()} views
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width: `${
                            (parseInt(country.count) / analytics.views) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

