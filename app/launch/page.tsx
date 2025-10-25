"use client";

import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, X, Plus, Calendar } from "lucide-react";
import { CATEGORIES, TAGS } from "@/lib/constants";

export default function LaunchPage() {
  const user = useUser({ or: "redirect" });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [userRole, setUserRole] = useState<"user" | "builder" | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    website_url: "",
    video_url: "",
    category: "",
    tags: [] as string[],
    launch_date: "",
    status: "draft" as "draft" | "scheduled" | "live",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
        
        // Redirect if user is not a builder
        if (data.role !== "builder") {
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    } finally {
      setIsCheckingRole(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: selectedTags,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/product/${data.id}`);
      } else {
        alert("Failed to create product. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Show loading while checking role
  if (isCheckingRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render the form if user is not a builder (they will be redirected)
  if (userRole !== "builder") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Launch Your Product
          </h1>
          <p className="text-gray-600 text-lg">
            Share your product with the Discoverly community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Discoverly"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tagline *
                </label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="A short, catchy description (max 300 characters)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.tagline.length}/300 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Tell us about your product. What problem does it solve? Who is it for?"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="https://yourproduct.com"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="YouTube or Vimeo URL"
                />
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Category & Tags
            </h2>

            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tags * (Select at least 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedTags.length} tags selected (minimum 3)
                </p>
              </div>
            </div>
          </div>

          {/* Launch Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Launch Settings
            </h2>

            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "draft" | "scheduled" | "live",
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="scheduled">Schedule Launch</option>
                  <option value="live">Launch Now</option>
                </select>
              </div>

              {/* Launch Date */}
              {formData.status === "scheduled" && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Launch Date *
                  </label>
                  <input
                    type="datetime-local"
                    required={formData.status === "scheduled"}
                    value={formData.launch_date}
                    onChange={(e) =>
                      setFormData({ ...formData, launch_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedTags.length < 3}
              className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Creating..."
                : formData.status === "live"
                ? "Launch Product"
                : formData.status === "scheduled"
                ? "Schedule Launch"
                : "Save Draft"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

