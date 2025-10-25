"use client";

import { useState, useEffect } from "react";
import BetaProductCard from "@/components/BetaProductCard";
import BetaLaunchModal from "@/components/BetaLaunchModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  FlaskConical, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Filter,
  Search,
  Trophy,
  Gift,
  Target,
  Zap,
  Award,
  Rocket
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BetaProgram = {
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

type LeaderboardEntry = {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  beta_tests_joined: number;
  feedback_submissions: number;
  completed_tests: number;
};

export default function BetaTestPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<BetaProgram[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'ending_soon'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  useEffect(() => {
    fetchBetaPrograms();
    fetchLeaderboard();
  }, [selectedCategory, sortBy]);

  const fetchBetaPrograms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: 'active',
        sort: sortBy
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/beta/programs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPrograms(data.programs);
      }
    } catch (error) {
      console.error('Error fetching beta programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/beta/leaderboard?limit=10');
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const filteredPrograms = programs.filter(program =>
    searchQuery === '' ||
    program.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 via-white to-cyan-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-6">
              <FlaskConical className="w-4 h-4" />
              Beta Testing Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Test the Next Big Product
              <br />
              <span className="text-cyan-600">
                Before the World Does
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Discover upcoming tools, test them, influence product decisions,
              <br />
              and earn exclusive rewards for your feedback.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#programs"
                className="px-8 py-4 bg-cyan-500 text-white rounded-xl font-semibold text-lg hover:bg-cyan-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Become a Tester
              </Link>
              <button
                onClick={() => setShowLaunchModal(true)}
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold text-lg hover:border-cyan-500 transition-all duration-200 flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Submit Your Product
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl mb-3">
                <FlaskConical className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{programs.length}+</div>
              <div className="text-gray-600">Active Beta Programs</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl mb-3">
                <Trophy className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-gray-600">Active Testers</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl mb-3">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-gray-600">Feedback Submitted</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl mb-3">
                <Gift className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">$100K+</div>
              <div className="text-gray-600">Rewards Distributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Join as a Beta Tester?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Early Access</h3>
              <p className="text-gray-600">
                Get exclusive access to cutting-edge products before they launch to the public.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Influence Products</h3>
              <p className="text-gray-600">
                Your feedback directly shapes product features and roadmaps.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <Gift className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Rewards</h3>
              <p className="text-gray-600">
                Receive discounts, gift cards, lifetime deals, and exclusive perks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Testers Leaderboard - Redesigned */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/70 text-gray-700 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Trophy className="w-4 h-4" />
              Top Contributors
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Leaderboard
            </h2>
            <p className="text-gray-600">
              Most active beta testers this month
            </p>
          </div>

          {leaderboard.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {leaderboard.map((tester, index) => (
                  <div key={tester.user_id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 text-center">
                        {index < 3 ? (
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            <Trophy className={`w-4 h-4 ${
                              index === 0 ? 'text-yellow-600' :
                              index === 1 ? 'text-gray-600' :
                              'text-orange-600'
                            }`} />
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                        )}
                      </div>

                      {/* Avatar & Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-full overflow-hidden flex-shrink-0">
                          {tester.avatar_url ? (
                            <img src={tester.avatar_url} alt={tester.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-cyan-700">
                              {tester.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {tester.display_name || tester.username}
                          </h4>
                          <p className="text-sm text-gray-600">@{tester.username}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden sm:flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{tester.total_points}</div>
                          <div className="text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{tester.beta_tests_joined}</div>
                          <div className="text-gray-500">Tests</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{tester.feedback_submissions}</div>
                          <div className="text-gray-500">Feedback</div>
                        </div>
                      </div>

                      {/* Mobile Stats */}
                      <div className="sm:hidden flex flex-col items-end text-right">
                        <div className="font-bold text-cyan-600">{tester.total_points} pts</div>
                        <div className="text-xs text-gray-500">
                          {tester.beta_tests_joined} tests • {tester.feedback_submissions} feedback
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {leaderboard.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing top {leaderboard.length} contributors
                    </p>
                    <Link
                      href="#programs"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                    >
                      Join the ranks
                      <Sparkles className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No rankings yet</h3>
              <p className="text-gray-600 mb-6">Be the first to join beta tests and earn points!</p>
              <Link
                href="#programs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Start Testing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Beta Programs Section */}
      <section id="programs" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-cyan-600" />
                  Filters
                </h3>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'recent', label: 'Most Recent', icon: Clock },
                      { value: 'popular', label: 'Most Popular', icon: TrendingUp },
                      { value: 'ending_soon', label: 'Ending Soon', icon: Clock }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setSortBy(value as any)}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          sortBy === value
                            ? 'bg-cyan-100 text-cyan-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === 'all'
                          ? 'bg-cyan-100 text-cyan-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                          selectedCategory === category.id
                            ? 'bg-cyan-100 text-cyan-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search beta programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Programs Grid */}
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
                      <div className="flex gap-5">
                        <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 rounded w-2/3" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-20">
                  <FlaskConical className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No beta programs found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? 'Try adjusting your search or filters'
                      : 'Check back soon for new beta testing opportunities'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPrograms.map((program) => (
                    <BetaProductCard key={program.id} {...program} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Launch Your Product for Beta Testing?
          </h2>
          <p className="text-xl text-cyan-50 mb-8">
            Get authentic feedback, validate your product, and build a community of early adopters.
          </p>
          <button
            onClick={() => setShowLaunchModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-600 rounded-xl font-semibold text-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Rocket className="w-5 h-5" />
            Submit Your Product for Beta
          </button>
        </div>
      </section>
      </main>
      <Footer />
      
      {/* Beta Launch Modal */}
      <BetaLaunchModal 
        isOpen={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        onLaunchProduct={() => {
          setShowLaunchModal(false);
          router.refresh(); // Refresh to show new programs
        }}
      />
    </div>
  );
}

