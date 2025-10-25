"use client";

import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Filter, TrendingUp, Clock, Sparkles, Search, Mail, Check, ArrowUpDown, Calendar } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

type FilterType = "all" | "trending" | "recent" | "featured";
type SortType = "recent" | "relevance" | "date";

type Product = {
  id: string;
  name: string;
  tagline: string;
  logo_url: string | null;
  category: string;
  tags: string[];
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  comment_count: number;
  bookmark_count: number;
  view_count: number;
  is_featured: boolean;
  is_sponsored: boolean;
  created_at: string;
};

export default function DiscoverPage() {
  // Require authentication
  const user = useUser({ or: "redirect" });
  
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortType>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Set<string>>(new Set());
  
  // Newsletter signup state
  const [showNewsletterSignup, setShowNewsletterSignup] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [activeFilter, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (activeFilter !== "all") {
        params.append("filter", activeFilter);
      }
      params.append("sortBy", sortBy);

      const response = await fetch(`/api/products?${params.toString()}`);
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

  // Fetch user's bookmarks
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/user/bookmarks");
      if (response.ok) {
        const data = await response.json();
        setBookmarkedProducts(new Set(data.map((b: any) => b.product_id)));
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleBookmark = async (productId: string) => {
    try {
      const isBookmarked = bookmarkedProducts.has(productId);
      const response = await fetch(`/api/products/${productId}/bookmark`, {
        method: isBookmarked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setBookmarkedProducts((prev) => {
          const newSet = new Set(prev);
          if (isBookmarked) {
            newSet.delete(productId);
          } else {
            newSet.add(productId);
          }
          return newSet;
        });
        
        // Update the bookmark count in the products list
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  bookmark_count: isBookmarked
                    ? p.bookmark_count - 1
                    : p.bookmark_count + 1,
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
        }),
      });

      if (response.ok) {
        setNewsletterSubscribed(true);
        setTimeout(() => {
          setShowNewsletterSignup(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.tagline.toLowerCase().includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Products
          </h1>
          <p className="text-gray-600 text-lg">
            Explore trending products built by amazing builders
          </p>
        </div>

        {/* Newsletter Signup Banner */}
        {showNewsletterSignup && (
          <div className="mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6 text-white relative overflow-hidden">
            <button
              onClick={() => setShowNewsletterSignup(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              ✕
            </button>
            
            {newsletterSubscribed ? (
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-semibold">You're subscribed!</h3>
                  <p className="text-white/90">
                    Thank you for subscribing to our weekly digest.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">
                      Subscribe to Weekly Digest
                    </h3>
                  </div>
                  <p className="text-white/90">
                    Get the best new products delivered to your inbox every week
                  </p>
                </div>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 flex-1 md:w-64"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="px-6 py-2 bg-white text-cyan-600 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 whitespace-nowrap"
                  >
                    {newsletterLoading ? "..." : "Subscribe"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, tags, or categories..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Filter Tabs and Sort */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-cyan-500 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-cyan-500"
              }`}
            >
              <Filter className="w-4 h-4" />
              All Products
            </button>
            <button
              onClick={() => setActiveFilter("trending")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFilter === "trending"
                  ? "bg-cyan-500 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-cyan-500"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
            <button
              onClick={() => setActiveFilter("recent")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFilter === "recent"
                  ? "bg-cyan-500 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-cyan-500"
              }`}
            >
              <Clock className="w-4 h-4" />
              Recent
            </button>
            <button
              onClick={() => setActiveFilter("featured")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFilter === "featured"
                  ? "bg-cyan-500 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-cyan-500"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Featured
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="relevance">Most Relevant</option>
              <option value="date">Launch Date</option>
            </select>
          </div>
        </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-600">Loading amazing products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                tagline={product.tagline}
                logo_url={product.logo_url}
                category={product.category}
                tags={product.tags}
                builder={{
                  username: product.username,
                  display_name: product.display_name,
                  avatar_url: product.avatar_url,
                }}
                stats={{
                  views: product.view_count,
                  comments: product.comment_count,
                  bookmarks: product.bookmark_count,
                }}
                is_featured={product.is_featured}
                is_sponsored={product.is_sponsored}
                created_at={new Date(product.created_at)}
                isBookmarked={bookmarkedProducts.has(product.id)}
                onBookmark={() => handleBookmark(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search query"
                : "Try adjusting your filters or check back later for new launches"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
