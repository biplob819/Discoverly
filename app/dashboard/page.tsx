"use client";

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, BarChart3, Edit, Trash2, Eye, Bookmark, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Product = {
  id: string;
  name: string;
  tagline: string;
  logo_url: string | null;
  status: string;
  created_at: string;
  view_count: number;
  bookmark_count: number;
  comment_count: number;
};

export default function DashboardPage() {
  const user = useUser({ or: "redirect" });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"user" | "builder" | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchUserRole();
  }, []);

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

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/dashboard/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Products
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your product launches
            </p>
          </div>
          {userRole === "builder" && (
            <Link
              href="/launch"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
            >
              <Plus className="w-5 h-5" />
              Launch Product
            </Link>
          )}
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-cyan-500 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                      {product.logo_url ? (
                        <img
                          src={product.logo_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {product.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${product.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-cyan-600 truncate block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {product.tagline}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {product.view_count} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-4 h-4" />
                            {product.bookmark_count} bookmarks
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {product.comment_count} comments
                          </span>
                          <span>•</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              product.status === "live"
                                ? "bg-green-100 text-green-700"
                                : product.status === "scheduled"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {product.status}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(product.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/analytics/${product.id}`}
                          className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="Analytics"
                        >
                          <BarChart3 className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/dashboard/edit/${product.id}`}
                          className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 mb-6">
              {userRole === "builder" 
                ? "Launch your first product to get started" 
                : "Switch to Builder mode in your profile to launch products"}
            </p>
            {userRole === "builder" && (
              <Link
                href="/launch"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
              >
                <Plus className="w-5 h-5" />
                Launch Product
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

