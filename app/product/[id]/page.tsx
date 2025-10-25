"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@stackframe/stack";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ExternalLink,
  Bookmark,
  MessageCircle,
  Eye,
  Calendar,
  Globe,
  Twitter,
  Send,
  Beaker,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  website_url: string;
  category: string;
  tags: string[];
  created_at: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  builder_website: string | null;
  twitter_handle: string | null;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

export default function ProductPage() {
  const params = useParams();
  const user = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [betaTestStatus, setBetaTestStatus] = useState<{
    signedUp: boolean;
    status: string | null;
  }>({ signedUp: false, status: null });
  const [betaTestLoading, setBetaTestLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchComments();
    if (user) {
      checkBookmark();
      checkBetaTestStatus();
    }
  }, [params.id, user]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const checkBookmark = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}/bookmark`);
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      window.location.href = "/handler/sign-in";
      return;
    }

    try {
      const response = await fetch(`/api/products/${params.id}/bookmark`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/handler/sign-in";
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      if (response.ok) {
        setCommentText("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkBetaTestStatus = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}/beta-test`);
      if (response.ok) {
        const data = await response.json();
        setBetaTestStatus(data);
      }
    } catch (error) {
      console.error("Error checking beta test status:", error);
    }
  };

  const handleBetaTestSignup = async () => {
    if (!user) {
      window.location.href = "/handler/sign-in";
      return;
    }

    setBetaTestLoading(true);
    try {
      const response = await fetch(`/api/products/${params.id}/beta-test`, {
        method: "POST",
      });

      if (response.ok) {
        checkBetaTestStatus();
        alert("Successfully signed up for beta testing! The builder will review your application.");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to sign up for beta testing");
      }
    } catch (error) {
      console.error("Error signing up for beta test:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setBetaTestLoading(false);
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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Product not found
            </h2>
            <Link href="/" className="text-cyan-600 hover:text-cyan-700">
              Go back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-cyan-50 via-white to-cyan-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                  {product.logo_url ? (
                    <img
                      src={product.logo_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-400">
                      {product.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600 mb-4">{product.tagline}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-cyan-100 text-cyan-700 border border-cyan-200">
                    {product.category}
                  </span>
                  {product.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={product.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visit Website
                  </a>
                  <button
                    onClick={toggleBookmark}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isBookmarked
                        ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-500"
                    }`}
                  >
                    <Bookmark
                      className="w-5 h-5"
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                  </button>
                  
                  {/* Beta Test Button */}
                  {betaTestStatus.signedUp ? (
                    <button
                      disabled
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                        betaTestStatus.status === "accepted"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : betaTestStatus.status === "completed"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {betaTestStatus.status === "accepted" ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Beta Access Granted
                        </>
                      ) : betaTestStatus.status === "completed" ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Beta Completed
                        </>
                      ) : (
                        <>
                          <ClockIcon className="w-5 h-5" />
                          Beta Pending
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleBetaTestSignup}
                      disabled={betaTestLoading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium disabled:opacity-50"
                    >
                      <Beaker className="w-5 h-5" />
                      {betaTestLoading ? "Signing up..." : "Join Beta Testing"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video */}
              {product.video_url && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={product.video_url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {product.name}
                </h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>

              {/* Comments - Modern Chat Interface */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-cyan-600" />
                    Discussion
                    <span className="ml-2 px-2.5 py-0.5 bg-cyan-100 text-cyan-700 text-sm font-semibold rounded-full">
                      {comments.length}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Share your thoughts and connect with the community
                  </p>
                </div>

                <div className="p-6">
                  {/* Comment Form */}
                  {user ? (
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.displayName?.charAt(0).toUpperCase() || "U"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="What do you think about this product?"
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none bg-gray-50 hover:bg-white transition-colors"
                          />
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {commentText.length > 0 && `${commentText.length} characters`}
                            </span>
                            <button
                              type="submit"
                              disabled={isSubmitting || !commentText.trim()}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Posting...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Post Comment
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="mb-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-xl text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-full mb-3">
                        <MessageCircle className="w-6 h-6 text-cyan-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Join the conversation
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Sign in to share your thoughts and connect with the community
                      </p>
                      <Link
                        href="/handler/sign-in"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 font-medium shadow-sm transition-all"
                      >
                        Sign In to Comment
                      </Link>
                    </div>
                  )}

                  {/* Comments List */}
                  {comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment, index) => (
                        <div
                          key={comment.id}
                          className="group hover:bg-gray-50 rounded-xl p-4 transition-colors"
                        >
                          <div className="flex gap-3">
                            <Link
                              href={`/@${comment.username}`}
                              className="flex-shrink-0"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden ring-2 ring-white group-hover:ring-cyan-100 transition-all">
                                {comment.avatar_url ? (
                                  <img
                                    src={comment.avatar_url}
                                    alt={comment.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600">
                                    {comment.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Link
                                  href={`/@${comment.username}`}
                                  className="font-semibold text-gray-900 hover:text-cyan-600 transition-colors"
                                >
                                  {comment.display_name || comment.username}
                                </Link>
                                <span className="text-sm text-gray-500">
                                  @{comment.username}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">
                                  {formatDistanceToNow(new Date(comment.created_at), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No comments yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to share your thoughts about this product!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Builder Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Built by</h3>
                <Link
                  href={`/@${product.username}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    {product.avatar_url ? (
                      <img
                        src={product.avatar_url}
                        alt={product.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-medium text-gray-600">
                        {product.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-cyan-600">
                      {product.display_name || product.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{product.username}
                    </div>
                  </div>
                </Link>
                {product.bio && (
                  <p className="text-sm text-gray-600 mt-3">{product.bio}</p>
                )}
                <div className="flex gap-2 mt-4">
                  {product.builder_website && (
                    <a
                      href={product.builder_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {product.twitter_handle && (
                    <a
                      href={`https://twitter.com/${product.twitter_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Launch Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Launch Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Launched{" "}
                    {formatDistanceToNow(new Date(product.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

