"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { Users, MessageCircle, Star, Clock, Gift, FlaskConical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { REWARD_TYPES } from "@/lib/constants";

type BetaProductCardProps = {
  id: string;
  product_name: string;
  product_tagline: string;
  product_logo: string | null;
  product_category: string;
  title: string;
  description: string;
  reward_type: string;
  reward_value: any;
  max_testers: number | null;
  tester_count: number;
  feedback_count: number;
  avg_rating: number | null;
  builder_username: string;
  builder_name: string | null;
  builder_avatar: string | null;
  status: string;
  end_date: Date | null;
  created_at: Date;
};

export default function BetaProductCard({
  id,
  product_name,
  product_tagline,
  product_logo,
  product_category,
  title,
  description,
  reward_type,
  reward_value,
  max_testers,
  tester_count,
  feedback_count,
  avg_rating,
  builder_username,
  builder_name,
  builder_avatar,
  status,
  end_date,
  created_at,
}: BetaProductCardProps) {
  const user = useUser();
  const rewardInfo = REWARD_TYPES.find(r => r.id === reward_type);
  const isFull = max_testers ? tester_count >= max_testers : false;
  const isEndingSoon = end_date ? new Date(end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 : false;
  
  const handleJoinClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      // Redirect to sign in with return URL
      window.location.href = `/handler/sign-in?returnUrl=${encodeURIComponent(`/beta/${id}`)}`;
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-cyan-500 hover:shadow-xl transition-all duration-300">
      {/* Beta Status Banner */}
      <div className="px-4 py-2 text-xs font-semibold flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
        <div className="flex items-center gap-2 text-cyan-700">
          <FlaskConical className="w-3.5 h-3.5" />
          BETA TESTING
          {isEndingSoon && (
            <>
              <span className="text-cyan-300">•</span>
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-orange-600">ENDING SOON</span>
            </>
          )}
        </div>
        {reward_type !== 'none' && rewardInfo && (
          <div className="flex items-center gap-1.5 text-cyan-700">
            <span className="text-base">{rewardInfo.icon}</span>
            <span>{rewardInfo.name}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex gap-5">
          {/* Logo */}
          <Link href={`/beta/${id}`} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              {product_logo ? (
                <img src={product_logo} alt={product_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-cyan-600">
                  {product_name.charAt(0)}
                </span>
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <Link href={`/beta/${id}`}>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
                    {product_name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-cyan-600 font-medium line-clamp-1">{title}</p>
                <p className="mt-1.5 text-gray-600 line-clamp-2 leading-relaxed">{product_tagline}</p>
              </div>

              {/* Join Beta Button */}
              <Link
                href={`/beta/${id}`}
                onClick={handleJoinClick}
                className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isFull
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg hover:shadow-xl hover:scale-105"
                }`}
              >
                {isFull ? 'Full' : (user ? 'Join Beta' : 'Sign In to Join')}
              </Link>
            </div>

            {/* Beta Program Info */}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-4 h-4 text-cyan-600" />
                <span className="font-medium">
                  {tester_count}
                  {max_testers && ` / ${max_testers}`} testers
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5 text-gray-600">
                <MessageCircle className="w-4 h-4 text-cyan-600" />
                <span className="font-medium">{feedback_count} feedback</span>
              </div>
              {avg_rating && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{avg_rating}/5</span>
                  </div>
                </>
              )}
            </div>

            {/* Category */}
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200">
                {product_category}
              </span>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href={`/@${builder_username}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors group/builder"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-full overflow-hidden ring-2 ring-white group-hover/builder:ring-cyan-100 transition-all">
                    {builder_avatar ? (
                      <img
                        src={builder_avatar}
                        alt={builder_username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-cyan-700">
                        {builder_username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">
                    {builder_name || `@${builder_username}`}
                  </span>
                </Link>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">
                  {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
                </span>
              </div>

              {end_date && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    Ends {formatDistanceToNow(new Date(end_date), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

