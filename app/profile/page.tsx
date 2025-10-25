"use client";

import { useEffect, useState } from "react";
import { useUser, useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User,
  Settings,
  Rocket,
  Calendar,
  Bookmark,
  Eye,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Save,
  X,
  Lock,
  Mail,
  LogOut,
  Shield,
  FlaskConical,
  Trophy,
  DollarSign,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TAGS } from "@/lib/constants";

type UserProfile = {
  id: string;
  username: string;
  display_name: string | null;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  role: "user" | "builder";
  interests: string[];
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  tagline: string;
  logo_url: string | null;
  status: string;
  launch_date: string | null;
  created_at: string;
  view_count: number;
  bookmark_count: number;
  comment_count: number;
  click_count: number;
};

type BookmarkedProduct = {
  id: string;
  name: string;
  tagline: string;
  logo_url: string | null;
  category: string;
  bookmarked_at: string;
};

export default function ProfilePage() {
  const user = useUser({ or: "redirect" });
  const stackApp = useStackApp();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [betaPrograms, setBetaPrograms] = useState<any[]>([]);
  const [userBetaPrograms, setUserBetaPrograms] = useState<any[]>([]);
  const [betaSummary, setBetaSummary] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkedProduct[]>([]);
  const [activeTab, setActiveTab] = useState<"settings" | "launches" | "bookmarks" | "beta-tests">("settings");
  const [launchesFilter, setLaunchesFilter] = useState<"all" | "live" | "scheduled" | "draft">("all");
  const [betaFilter, setBetaFilter] = useState<"all" | "active" | "completed" | "draft">("all");
  const [loading, setLoading] = useState(true);
  const [isTogglingRole, setIsTogglingRole] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    username: "",
    display_name: "",
    bio: "",
    interests: [] as string[],
  });

  useEffect(() => {
    fetchProfile();
    fetchProducts();
    fetchBookmarks();
    fetchBetaPrograms();
    fetchUserBetaPrograms();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({
          username: data.username,
          display_name: data.display_name || "",
          bio: data.bio || "",
          interests: data.interests || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
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
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/user/bookmarks");
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const fetchBetaPrograms = async () => {
    try {
      const response = await fetch("/api/dashboard/beta-programs");
      if (response.ok) {
        const data = await response.json();
        setBetaPrograms(data);
      }
    } catch (error) {
      console.error("Error fetching beta programs:", error);
    }
  };

  const fetchUserBetaPrograms = async () => {
    try {
      const response = await fetch("/api/user/beta-programs");
      if (response.ok) {
        const data = await response.json();
        setUserBetaPrograms(data.participations || []);
        setBetaSummary(data.summary || null);
      }
    } catch (error) {
      console.error("Error fetching user beta programs:", error);
    }
  };

  const handleRoleToggle = async () => {
    if (!profile) return;

    setIsTogglingRole(true);
    setError(null);
    setSuccess(null);

    try {
      const newRole = profile.role === "builder" ? "user" : "builder";
      console.log("Toggling role from", profile.role, "to", newRole);
      
      const response = await fetch("/api/user/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      console.log("Role toggle response:", data);

      if (response.ok) {
        setProfile({ ...profile, role: newRole });
        setSuccess(`Successfully switched to ${newRole === "builder" ? "Builder" : "User"} mode`);
        
        // If switching to user, go to settings tab
        if (newRole === "user" && activeTab === "launches") {
          setActiveTab("settings");
        }
        
        // Refresh products if switching to builder
        if (newRole === "builder") {
          fetchProducts();
          fetchBetaPrograms();
        }
      } else {
        setError(data.error || "Failed to toggle role");
      }
    } catch (error) {
      console.error("Error toggling role:", error);
      setError("Failed to toggle role. Please try again.");
    } finally {
      setIsTogglingRole(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.username.trim()) {
      setError("Username is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editForm.username,
          display_name: editForm.display_name,
          bio: editForm.bio,
          role: profile?.role || "user",
          interests: editForm.interests,
        }),
      });

      if (response.ok) {
        await fetchProfile();
        setIsEditing(false);
        setSuccess("Profile updated successfully");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        username: profile.username,
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const toggleInterest = (interest: string) => {
    setEditForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setSuccess("Product deleted successfully");
      } else {
        setError("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    }
  };

  const handleSignOut = async () => {
    await stackApp.signOut();
    router.push("/");
  };

  const filteredProducts = products.filter((product) => {
    if (launchesFilter === "all") return true;
    return product.status === launchesFilter;
  });

  const filteredBetaPrograms = betaPrograms.filter((program) => {
    if (betaFilter === "all") return true;
    return program.status === betaFilter;
  });

  const filteredUserBetaPrograms = userBetaPrograms.filter((program) => {
    if (betaFilter === "all") return true;
    if (betaFilter === "active") return program.beta_status === "active";
    if (betaFilter === "completed") return program.status === "completed";
    return true;
  });

  if (loading) {
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

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
            <p className="text-gray-600 mb-6">Please complete your onboarding first.</p>
            <Link
              href="/onboarding"
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
            >
              Complete Onboarding
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-gray-600 mb-2">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-700 mt-3 max-w-2xl">{profile.bio}</p>
              )}
              <div className="mt-4 flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                    profile.role === "builder"
                      ? "bg-cyan-100 text-cyan-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {profile.role === "builder" ? (
                    <>
                      <Rocket className="w-4 h-4" />
                      Builder
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      User
                    </>
                  )}
                </span>
                <span className="text-sm text-gray-500">
                  Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "settings"
                  ? "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
            {profile.role === "builder" && (
              <button
                onClick={() => setActiveTab("launches")}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === "launches"
                    ? "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Rocket className="w-5 h-5" />
                My Launches
              </button>
            )}
            <button
              onClick={() => setActiveTab("beta-tests")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "beta-tests"
                  ? "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FlaskConical className="w-5 h-5" />
              Beta Tests
              {betaSummary && betaSummary.active_programs > 0 && (
                <span className="ml-1 px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full">
                  {betaSummary.active_programs}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "bookmarks"
                  ? "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Bookmark className="w-5 h-5" />
              Bookmarks
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                  
                  {/* Role Toggle */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Account Type
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {profile.role === "builder"
                            ? "As a Builder, you can launch and manage products. Switch to User mode to focus on discovering products."
                            : "As a User, you can discover and bookmark products. Switch to Builder mode to launch your own products."}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700">User</span>
                          <button
                            onClick={handleRoleToggle}
                            disabled={isTogglingRole}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                              profile.role === "builder" ? "bg-cyan-500" : "bg-gray-300"
                            } ${isTogglingRole ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                profile.role === "builder" ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span className="text-sm font-medium text-gray-700">Builder</span>
                          {isTogglingRole && (
                            <span className="text-sm text-gray-500">Updating...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Profile Information
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg font-medium transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {isSaving ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{profile.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <p className="text-gray-900">@{profile.username}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                          </label>
                          <p className="text-gray-900">{profile.display_name || "Not set"}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <p className="text-gray-900">{profile.bio || "No bio yet"}</p>
                        </div>
                        {profile.interests && profile.interests.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Interests
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest) => (
                                <span
                                  key={interest}
                                  className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email (managed by Stack Auth)
                          </label>
                          <p className="text-gray-500 text-sm">{profile.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Username *
                          </label>
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) =>
                              setEditForm({ ...editForm, username: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="johndoe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            value={editForm.display_name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, display_name: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Bio
                          </label>
                          <textarea
                            rows={3}
                            value={editForm.bio}
                            onChange={(e) =>
                              setEditForm({ ...editForm, bio: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Interests
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {TAGS.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleInterest(tag)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  editForm.interests.includes(tag)
                                    ? "bg-cyan-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Security */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Account Security
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Password</p>
                            <p className="text-sm text-gray-500">Manage your password</p>
                          </div>
                        </div>
                        <Link
                          href="/handler/account-settings"
                          className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg font-medium transition-colors"
                        >
                          Change
                        </Link>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Email Address</p>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/handler/account-settings"
                          className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg font-medium transition-colors"
                        >
                          Manage
                        </Link>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add extra security to your account</p>
                          </div>
                        </div>
                        <Link
                          href="/handler/account-settings"
                          className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg font-medium transition-colors"
                        >
                          Setup
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Sign Out
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sign out of your account on this device
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Launches Tab */}
            {activeTab === "launches" && profile.role === "builder" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">My Launches</h2>
                    <p className="text-gray-600">
                      Manage your product launches and view analytics
                    </p>
                  </div>
                  <Link
                    href="/launch"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    New Launch
                  </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                  {[
                    { value: "all", label: "All" },
                    { value: "live", label: "Live" },
                    { value: "scheduled", label: "Scheduled" },
                    { value: "draft", label: "Draft" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setLaunchesFilter(filter.value as any)}
                      className={`px-4 py-2 font-medium transition-colors ${
                        launchesFilter === filter.value
                          ? "text-cyan-600 border-b-2 border-cyan-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {filter.label}
                      <span className="ml-2 text-sm">
                        ({filter.value === "all" ? products.length : products.filter(p => p.status === filter.value).length})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Beta Programs Section - Show for builders */}
                {betaPrograms.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Beta Programs</h3>
                    <div className="space-y-4">
                      {filteredBetaPrograms.map((program) => (
                        <div
                          key={program.id}
                          className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6"
                        >
                          <div className="flex gap-4">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-xl flex items-center justify-center overflow-hidden">
                                {program.product_logo ? (
                                  <img
                                    src={program.product_logo}
                                    alt={program.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-2xl font-bold text-cyan-600">
                                    {program.product_name.charAt(0)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/beta/${program.id}`}
                                    className="text-xl font-semibold text-gray-900 hover:text-cyan-600 truncate block"
                                  >
                                    {program.title}
                                  </Link>
                                  <p className="text-cyan-600 font-medium mt-1">{program.product_name}</p>
                                  <p className="text-gray-600 mt-1 line-clamp-2">{program.description}</p>

                                  {/* Beta Stats */}
                                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <FlaskConical className="w-4 h-4 text-cyan-600" />
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {program.tester_count || 0}
                                        </div>
                                        <div className="text-gray-500 text-xs">Testers</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <MessageCircle className="w-4 h-4 text-cyan-600" />
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {program.feedback_count || 0}
                                        </div>
                                        <div className="text-gray-500 text-xs">Feedback</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Trophy className="w-4 h-4 text-yellow-600" />
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {program.avg_rating ? Number(program.avg_rating).toFixed(1) : 'N/A'}
                                        </div>
                                        <div className="text-gray-500 text-xs">Rating</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {program.completed_testers || 0}
                                        </div>
                                        <div className="text-gray-500 text-xs">Completed</div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        program.status === "active"
                                          ? "bg-green-100 text-green-700"
                                          : program.status === "scheduled"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {program.status}
                                    </span>
                                    {program.end_date && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          Ends {new Date(program.end_date).toLocaleDateString()}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/beta/${program.id}`}
                                    className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                    title="View Beta Program"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products List */}
                {filteredProducts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
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

                                {/* Analytics */}
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {product.view_count}
                                      </div>
                                      <div className="text-gray-500 text-xs">Views</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Bookmark className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {product.bookmark_count}
                                      </div>
                                      <div className="text-gray-500 text-xs">Bookmarks</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <MessageCircle className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {product.comment_count}
                                      </div>
                                      <div className="text-gray-500 text-xs">Comments</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <BarChart3 className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {product.click_count}
                                      </div>
                                      <div className="text-gray-500 text-xs">Clicks</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
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
                                  {product.launch_date && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(product.launch_date).toLocaleDateString()}
                                      </span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>
                                    Created{" "}
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
                                  onClick={() => handleDeleteProduct(product.id)}
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
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Rocket className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {launchesFilter === "all"
                        ? "No launches yet"
                        : `No ${launchesFilter} launches`}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {launchesFilter === "all"
                        ? "Launch your first product to get started"
                        : `You don't have any ${launchesFilter} launches`}
                    </p>
                    <Link
                      href="/launch"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Launch Product
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Beta Tests Tab */}
            {activeTab === "beta-tests" && (
              <div className="space-y-6">
                {/* Beta Testing Summary for all users */}
                {betaSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <FlaskConical className="w-8 h-8 text-cyan-600" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{betaSummary.total_programs}</div>
                          <div className="text-sm text-gray-600">Beta Programs</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{betaSummary.total_points}</div>
                          <div className="text-sm text-gray-600">Points Earned</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-yellow-600" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">${betaSummary.total_cash_earned}</div>
                          <div className="text-sm text-gray-600">Cash Earned</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{betaSummary.completed_programs}</div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">My Beta Testing</h2>
                    <p className="text-gray-600">
                      Beta programs you're participating in and your earnings
                    </p>
                  </div>
                </div>

                {/* Filter Tabs for Beta Tests */}
                <div className="flex gap-2 border-b border-gray-200">
                  {[
                    { value: "all", label: "All" },
                    { value: "active", label: "Active" },
                    { value: "completed", label: "Completed" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setBetaFilter(filter.value as any)}
                      className={`px-4 py-2 font-medium transition-colors ${
                        betaFilter === filter.value
                          ? "text-cyan-600 border-b-2 border-cyan-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {filter.label}
                      <span className="ml-2 text-sm">
                        ({filter.value === "all" ? userBetaPrograms.length : filteredUserBetaPrograms.length})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Beta Programs List */}
                {filteredUserBetaPrograms.length > 0 ? (
                  <div className="space-y-4">
                    {filteredUserBetaPrograms.map((program) => (
                      <div
                        key={program.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:border-cyan-500 transition-colors"
                      >
                        <div className="flex gap-4">
                          {/* Logo */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                              {program.product_logo ? (
                                <img
                                  src={program.product_logo}
                                  alt={program.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl font-bold text-gray-400">
                                  {program.product_name.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/beta/${program.beta_program_id}`}
                                  className="text-xl font-semibold text-gray-900 hover:text-cyan-600 truncate block"
                                >
                                  {program.beta_title}
                                </Link>
                                <p className="text-cyan-600 font-medium mt-1">{program.product_name}</p>
                                <p className="text-gray-600 mt-1 line-clamp-2">
                                  {program.beta_description}
                                </p>

                                {/* Participation Stats */}
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <MessageCircle className="w-4 h-4 text-cyan-600" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {program.feedback_submitted || 0}
                                      </div>
                                      <div className="text-gray-500 text-xs">Feedback</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Trophy className="w-4 h-4 text-yellow-600" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {program.total_points || 0}
                                      </div>
                                      <div className="text-gray-500 text-xs">Points</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        ${program.cash_earned || 0}
                                      </div>
                                      <div className="text-gray-500 text-xs">Earned</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {program.status === 'completed' ? 'Done' : 'Active'}
                                      </div>
                                      <div className="text-gray-500 text-xs">Status</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      program.status === "approved"
                                        ? "bg-green-100 text-green-700"
                                        : program.status === "completed"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {program.status}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Joined{" "}
                                    {formatDistanceToNow(new Date(program.created_at), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                  {program.end_date && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Ends {new Date(program.end_date).toLocaleDateString()}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/beta/${program.beta_program_id}`}
                                  className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg font-medium transition-colors"
                                >
                                  View Program
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <FlaskConical className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {betaFilter === "all"
                        ? "No beta tests yet"
                        : `No ${betaFilter} beta tests`}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start participating in beta programs to earn rewards
                    </p>
                    <Link
                      href="/beta-test"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
                    >
                      <FlaskConical className="w-5 h-5" />
                      Browse Beta Programs
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === "bookmarks" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">My Bookmarks</h2>
                  <p className="text-gray-600">
                    Products you've saved for later
                  </p>
                </div>

                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarks.map((bookmark) => (
                      <Link
                        key={bookmark.id}
                        href={`/product/${bookmark.id}`}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:border-cyan-500 transition-colors"
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                              {bookmark.logo_url ? (
                                <img
                                  src={bookmark.logo_url}
                                  alt={bookmark.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl font-bold text-gray-400">
                                  {bookmark.name.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {bookmark.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {bookmark.tagline}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                {bookmark.category}
                              </span>
                              <span>•</span>
                              <span>
                                Saved{" "}
                                {formatDistanceToNow(new Date(bookmark.bookmarked_at), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Bookmark className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No bookmarks yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start exploring and bookmark products you like
                    </p>
                    <Link
                      href="/discover"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
                    >
                      Discover Products
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
