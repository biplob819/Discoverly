"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Users, 
  MessageCircle, 
  Star, 
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowLeft,
  Settings,
  Award,
  Target
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type Analytics = any;
type Feedback = any;
type Tester = any;

export default function BetaAnalyticsDashboard() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [program, setProgram] = useState<any>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'testers' | 'feedback'>('overview');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch program details
      const programRes = await fetch(`/api/beta/programs/${id}`);
      const programData = await programRes.json();
      if (programData.success) {
        setProgram(programData.program);
      }

      // Fetch analytics
      const analyticsRes = await fetch(`/api/beta/programs/${id}/analytics`);
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        if (analyticsData.success) {
          setAnalytics(analyticsData.analytics);
        }
      }

      // Fetch feedback
      const feedbackRes = await fetch(`/api/beta/feedback?beta_program_id=${id}`);
      const feedbackData = await feedbackRes.json();
      if (feedbackData.success) {
        setFeedback(feedbackData.feedback);
      }

      // Fetch testers
      const testersRes = await fetch(`/api/beta/programs/${id}/testers`);
      if (testersRes.ok) {
        const testersData = await testersRes.json();
        if (testersData.success) {
          setTesters(testersData.testers);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTester = async (testerId: string) => {
    try {
      const response = await fetch(`/api/beta/testers/${testerId}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error approving tester:', error);
    }
  };

  const handleRespondToFeedback = async (feedbackId: string, response: string) => {
    try {
      const res = await fetch(`/api/beta/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ builder_response: response })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error responding to feedback:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Beta Program Not Found</h2>
          <Link href="/dashboard" className="text-purple-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const avgRating = feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length || 0;
  const criticalIssues = feedback.filter(f => f.is_critical).length;
  const resolvedFeedback = feedback.filter(f => f.is_resolved).length;
  const pendingTesters = testers.filter(t => t.status === 'pending').length;
  
  // Feedback by category
  const feedbackByCategory: Record<string, number> = {};
  feedback.forEach(f => {
    feedbackByCategory[f.category] = (feedbackByCategory[f.category] || 0) + 1;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  {program.product_logo ? (
                    <img src={program.product_logo} alt={program.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-purple-600">
                      {program.product_name?.charAt(0)}
                    </span>
                  )}
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{program.product_name} - Beta Analytics</h1>
                  <p className="text-gray-600">{program.title}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/beta/${id}`}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                View Public Page
              </Link>
              <Link
                href={`/dashboard/beta/${id}/settings`}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                pendingTesters > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {pendingTesters > 0 ? `${pendingTesters} pending` : 'All approved'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{program.tester_count}</div>
            <div className="text-gray-600">Total Testers</div>
            {program.max_testers && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((program.tester_count / program.max_testers) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {resolvedFeedback} resolved
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{program.feedback_count}</div>
            <div className="text-gray-600">Feedback Received</div>
            {criticalIssues > 0 && (
              <div className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {criticalIssues} critical issues
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-500" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{avgRating.toFixed(1)}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{program.feature_request_count || 0}</div>
            <div className="text-gray-600">Feature Requests</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border mb-8">
          <div className="border-b px-6">
            <div className="flex gap-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'testers', label: 'Testers', icon: Users, count: pendingTesters },
                { id: 'feedback', label: 'Feedback', icon: MessageCircle, count: criticalIssues }
              ].map(({ id: tabId, label, icon: Icon, count }) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId as any)}
                  className={`flex items-center gap-2 px-4 py-4 font-semibold border-b-2 transition-colors ${
                    activeTab === tabId
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  {count !== undefined && count > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Feedback by Category */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Feedback by Category
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(feedbackByCategory).map(([category, count]) => (
                      <div key={category} className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{count}</div>
                        <div className="text-sm text-gray-700">{category}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Recent Feedback
                  </h3>
                  <div className="space-y-3">
                    {feedback.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full overflow-hidden flex-shrink-0">
                          {item.avatar_url ? (
                            <img src={item.avatar_url} alt={item.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-purple-700">
                              {item.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{item.display_name || item.username}</span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                              {item.category}
                            </span>
                            {item.is_critical && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">
                                Critical
                              </span>
                            )}
                            <span className="text-sm text-gray-500 ml-auto">
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm line-clamp-2">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'testers' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Beta Testers</h3>
                  {pendingTesters > 0 && (
                    <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold">
                      {pendingTesters} awaiting approval
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {testers.map((tester) => (
                    <div key={tester.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full overflow-hidden">
                        {tester.avatar_url ? (
                          <img src={tester.avatar_url} alt={tester.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-purple-700">
                            {tester.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{tester.display_name || tester.username}</div>
                        <div className="text-sm text-gray-600">
                          {tester.skillset?.join(', ')} • {tester.device_type} • {tester.experience_level}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Applied {formatDistanceToNow(new Date(tester.applied_at), { addSuffix: true })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{tester.points_earned || 0}</div>
                          <div className="text-xs text-gray-600">Points</div>
                        </div>

                        {tester.status === 'pending' ? (
                          <button
                            onClick={() => handleApproveTester(tester.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                        ) : (
                          <span
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                              tester.status === 'approved' ? 'bg-green-100 text-green-700' :
                              tester.status === 'active' ? 'bg-blue-100 text-blue-700' :
                              tester.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {tester.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {testers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No testers yet</h3>
                      <p className="text-gray-600">Share your beta test link to get testers!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">All Feedback</h3>
                
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="border rounded-lg p-6 bg-white">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full overflow-hidden">
                          {item.avatar_url ? (
                            <img src={item.avatar_url} alt={item.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-purple-700">
                              {item.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">{item.display_name || item.username}</span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                              {item.category}
                            </span>
                            {item.is_critical && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Critical
                              </span>
                            )}
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            <span className="text-sm text-gray-500 ml-auto">
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </span>
                          </div>

                          {item.title && (
                            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                          )}
                          <p className="text-gray-700 whitespace-pre-wrap mb-4">{item.content}</p>

                          {item.is_resolved ? (
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-sm font-semibold">Resolved</span>
                            </div>
                          ) : !item.builder_response ? (
                            <button
                              onClick={() => {
                                const response = prompt('Enter your response:');
                                if (response) {
                                  handleRespondToFeedback(item.id, response);
                                }
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
                            >
                              Respond
                            </button>
                          ) : (
                            <div className="mt-4 pl-4 border-l-4 border-purple-200 bg-purple-50 p-4 rounded">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-purple-700">Your Response</span>
                                <span className="text-sm text-gray-500">
                                  {formatDistanceToNow(new Date(item.responded_at), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-gray-700">{item.builder_response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {feedback.length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No feedback yet</h3>
                      <p className="text-gray-600">Feedback will appear here as testers submit it.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

