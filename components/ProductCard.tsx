"use client";

import Link from "next/link";
import { Bookmark, MessageCircle, ExternalLink, TrendingUp, Eye, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ProductCardProps = {
  id: string;
  name: string;
  tagline: string;
  logo_url: string | null;
  category: string;
  tags: string[];
  builder: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  stats: {
    views: number;
    comments: number;
    bookmarks: number;
  };
  is_featured?: boolean;
  is_sponsored?: boolean;
  created_at: Date;
  isBookmarked?: boolean;
  onBookmark?: () => void;
};

export default function ProductCard({
  id,
  name,
  tagline,
  logo_url,
  category,
  tags,
  builder,
  stats,
  is_featured,
  is_sponsored,
  created_at,
  isBookmarked,
  onBookmark,
}: ProductCardProps) {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-cyan-500 hover:shadow-xl transition-all duration-300">
      {/* Featured/Sponsored Banner */}
      {(is_featured || is_sponsored) && (
        <div className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
          is_featured 
            ? "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border-b border-yellow-100" 
            : "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 border-b border-purple-100"
        }`}>
          {is_featured && (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              FEATURED PRODUCT
            </>
          )}
          {is_sponsored && !is_featured && (
            <>
              <TrendingUp className="w-3.5 h-3.5" />
              SPONSORED
            </>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex gap-5">
          {/* Logo */}
          <Link href={`/product/${id}`} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              {logo_url ? (
                <img src={logo_url} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-400">
                  {name.charAt(0)}
                </span>
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <Link href={`/product/${id}`}>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
                    {name}
                  </h3>
                </Link>
                <p className="mt-1.5 text-gray-600 line-clamp-2 leading-relaxed">{tagline}</p>
              </div>

              {/* Bookmark */}
              <button
                onClick={onBookmark}
                className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 ${
                  isBookmarked
                    ? "bg-cyan-100 text-cyan-600 shadow-sm"
                    : "hover:bg-gray-100 text-gray-400 hover:text-cyan-600 hover:scale-110"
                }`}
                aria-label="Bookmark"
              >
                <Bookmark
                  className="w-5 h-5"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200">
                {category}
              </span>
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 bg-gray-50">
                  +{tags.length - 4}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href={`/@${builder.username}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors group/builder"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden ring-2 ring-white group-hover/builder:ring-cyan-100 transition-all">
                    {builder.avatar_url ? (
                      <img
                        src={builder.avatar_url}
                        alt={builder.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-600">
                        {builder.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">
                    {builder.display_name || `@${builder.username}`}
                  </span>
                </Link>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">{formatDistanceToNow(new Date(created_at), { addSuffix: true })}</span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-gray-500 hover:text-cyan-600 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{stats.views}</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-500 hover:text-cyan-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">{stats.comments}</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-500 hover:text-cyan-600 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span className="font-medium">{stats.bookmarks}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

