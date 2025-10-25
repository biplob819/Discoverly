"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  FlaskConical, 
  Users, 
  MessageCircle, 
  Star, 
  Clock,
  Gift,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Key,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Plus
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FEEDBACK_CATEGORIES, REWARD_TYPES, SKILLSETS, DEVICE_TYPES } from "@/lib/constants";
import Link from "next/link";

type BetaProgram = any;
type Feedback = any;
type FeatureRequest = any;

export default function BetaProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [program, setProgram] = useState<BetaProgram | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'features'>('overview');
  
  // Join Beta State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({
    skillset: [] as string[],
    device_type: 'All Devices',
    experience_level: 'intermediate'
  });
  
  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'UX',
    rating: 5,
    title: '',
    content: '',
    is_critical: false
  });
  
  // Feature Request State
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureForm, setFeatureForm] = useState({
    title: '',
    description: '',
    category: 'Feature'
  });

  useEffect(() => {
    fetchProgramDetails();
    fetchFeedback();
    fetchFeatures();
  }, [id]);

  const fetchProgramDetails = async () => {
    try {
      const response = await fetch(`/api/beta/programs/${id}`);
      const data = await response.json();
      if (data.success) {
        setProgram(data.program);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`/api/beta/feedback?beta_program_id=${id}`);
      const data = await response.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await fetch(`/api/beta/features?beta_program_id=${id}`);
      const data = await response.json();
      if (data.success) {
        setFeatures(data.features);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const handleJoinBeta = async () => {
    try {
      const response = await fetch('/api/beta/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beta_program_id: id,
          product_id: program.product_id,
          ...joinForm
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setShowJoinModal(false);
        fetchProgramDetails();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error joining beta:', error);
      alert('Failed to join beta test');
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await fetch('/api/beta/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beta_program_id: id,
          product_id: program.product_id,
          ...feedbackForm
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Feedback submitted! You earned ${data.points_earned} points! 🎉`);
        setShowFeedbackModal(false);
        setFeedbackForm({
          category: 'UX',
          rating: 5,
          title: '',
          content: '',
          is_critical: false
        });
        fetchFeedback();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const handleSubmitFeature = async () => {
    try {
      const response = await fetch('/api/beta/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beta_program_id: id,
          product_id: program.product_id,
          ...featureForm
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Feature request submitted!');
        setShowFeatureModal(false);
        setFeatureForm({ title: '', description: '', category: 'Feature' });
        fetchFeatures();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error submitting feature:', error);
      alert('Failed to submit feature request');
    }
  };

  const handleVote = async (featureId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const response = await fetch(`/api/beta/features/${featureId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_type: voteType })
      });
      const data = await response.json();
      if (data.success) {
        fetchFeatures();
      }
    } catch (error) {
      console.error('Error voting:', error);
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
          <Link href="/beta-test" className="text-purple-600 hover:underline">
            Back to Beta Programs
          </Link>
        </div>
      </div>
    );
  }

  const rewardInfo = REWARD_TYPES.find(r => r.id === program.reward_type);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Product Logo */}
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl flex-shrink-0">
              {program.product_logo ? (
                <img src={program.product_logo} alt={program.product_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-purple-600">
                  {program.product_name.charAt(0)}
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                <FlaskConical className="w-4 h-4" />
                BETA TESTING
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{program.product_name}</h1>
              <p className="text-xl text-purple-100 mb-6">{program.product_tagline}</p>
              
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {program.tester_count}
                    {program.max_testers && ` / ${program.max_testers}`} testers
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">{program.feedback_count} feedback</span>
                </div>
                {program.avg_rating && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span className="font-medium">{program.avg_rating}/5</span>
                  </div>
                )}
                {rewardInfo && program.reward_type !== 'none' && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-4 py-2 rounded-lg font-semibold">
                    <span>{rewardInfo.icon}</span>
                    {rewardInfo.name}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 hover:shadow-xl transition-all duration-200"
                >
                  Join Beta Test
                </button>
                {program.test_url && (
                  <a
                    href={program.test_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-purple-700/50 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-purple-700 border-2 border-white/30 transition-all duration-200 flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Open Product
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'feedback', label: 'Feedback', icon: MessageCircle, count: program.feedback_count },
              { id: 'features', label: 'Feature Board', icon: TrendingUp, count: program.feature_request_count }
            ].map(({ id: tabId, label, icon: Icon, count }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === tabId
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-purple-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
                {count !== undefined && count > 0 && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Beta Test</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{program.description}</p>
              </div>

              {/* Test Instructions */}
              {program.test_instructions && (
                <div className="bg-purple-50 rounded-xl border border-purple-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-600" />
                    Testing Instructions
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{program.test_instructions}</p>
                </div>
              )}

              {/* Access Credentials */}
              {program.test_credentials && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Key className="w-6 h-6 text-yellow-600" />
                    Access Credentials
                  </h2>
                  <div className="bg-white rounded-lg p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(program.test_credentials, null, 2)}</pre>
                  </div>
                  <p className="text-yellow-800 text-sm mt-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Keep these credentials confidential
                  </p>
                </div>
              )}

              {/* Feedback Categories */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback Areas</h2>
                <div className="flex flex-wrap gap-3">
                  {program.feedback_categories?.map((category: string) => (
                    <span
                      key={category}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Builder Info */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Builder</h3>
                <Link href={`/@${program.builder_username}`} className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full overflow-hidden">
                    {program.builder_avatar ? (
                      <img src={program.builder_avatar} alt={program.builder_username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-purple-700">
                        {program.builder_username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{program.builder_name || program.builder_username}</div>
                    <div className="text-sm text-gray-600">@{program.builder_username}</div>
                  </div>
                </Link>
                {program.builder_bio && (
                  <p className="mt-4 text-sm text-gray-600">{program.builder_bio}</p>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Timeline
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-600">Started</div>
                    <div className="font-semibold text-gray-900">
                      {formatDistanceToNow(new Date(program.start_date || program.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  {program.end_date && (
                    <div>
                      <div className="text-gray-600">Ends</div>
                      <div className="font-semibold text-gray-900">
                        {formatDistanceToNow(new Date(program.end_date), { addSuffix: true })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Submit Feedback
                  </button>
                  <button
                    onClick={() => setShowFeatureModal(true)}
                    className="w-full px-4 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Request Feature
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Community Feedback</h2>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Feedback
              </button>
            </div>

            {feedback.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No feedback yet</h3>
                <p className="text-gray-600 mb-6">Be the first to share your thoughts!</p>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Submit First Feedback
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full overflow-hidden flex-shrink-0">
                        {item.avatar_url ? (
                          <img src={item.avatar_url} alt={item.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-purple-700">
                            {item.username.charAt(0).toUpperCase()}
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
                        <p className="text-gray-700 whitespace-pre-wrap">{item.content}</p>
                        
                        {item.builder_response && (
                          <div className="mt-4 pl-4 border-l-4 border-purple-200 bg-purple-50 p-4 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-purple-700">Builder Response</span>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(item.responded_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-700">{item.builder_response}</p>
                          </div>
                        )}
                        
                        {item.is_resolved && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            Resolved
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Feature Board</h2>
              <button
                onClick={() => setShowFeatureModal(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Request Feature
              </button>
            </div>

            {features.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No feature requests yet</h3>
                <p className="text-gray-600 mb-6">Suggest features you'd like to see!</p>
                <button
                  onClick={() => setShowFeatureModal(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Request First Feature
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {features.map((feature: any) => (
                  <div key={feature.id} className="bg-white rounded-xl border p-6">
                    <div className="flex gap-4">
                      {/* Voting */}
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleVote(feature.id, 'upvote')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ThumbsUp className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="font-bold text-lg text-gray-900">
                          {feature.upvotes - feature.downvotes}
                        </div>
                        <button
                          onClick={() => handleVote(feature.id, 'downvote')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ThumbsDown className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-900">{feature.title}</h4>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              feature.status === 'proposed' ? 'bg-gray-100 text-gray-700' :
                              feature.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                              feature.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                              feature.status === 'shipped' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            {feature.status}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                            {feature.category}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{feature.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>by {feature.creator_name || feature.creator_username}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(feature.created_at), { addSuffix: true })}</span>
                        </div>
                        
                        {feature.builder_notes && (
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                            <div className="text-sm font-semibold text-purple-700 mb-1">Builder Notes</div>
                            <p className="text-gray-700 text-sm">{feature.builder_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Join Beta Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Beta Test</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Skillset (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {SKILLSETS.map((skill) => (
                    <label key={skill} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={joinForm.skillset.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setJoinForm({ ...joinForm, skillset: [...joinForm.skillset, skill] });
                          } else {
                            setJoinForm({ ...joinForm, skillset: joinForm.skillset.filter(s => s !== skill) });
                          }
                        }}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm font-medium text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Device Type
                </label>
                <select
                  value={joinForm.device_type}
                  onChange={(e) => setJoinForm({ ...joinForm, device_type: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {DEVICE_TYPES.map((device) => (
                    <option key={device} value={device}>{device}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Experience Level
                </label>
                <div className="flex gap-3">
                  {['beginner', 'intermediate', 'expert'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setJoinForm({ ...joinForm, experience_level: level })}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold capitalize transition-all ${
                        joinForm.experience_level === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinBeta}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Join Beta Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Submit Feedback</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={feedbackForm.category}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating })}
                      className="p-2"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= feedbackForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={feedbackForm.title}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief summary of your feedback"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Feedback
                </label>
                <textarea
                  value={feedbackForm.content}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, content: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  placeholder="Share your detailed feedback..."
                  required
                />
              </div>

              <label className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={feedbackForm.is_critical}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, is_critical: e.target.checked })}
                  className="w-5 h-5 text-red-600"
                />
                <div>
                  <div className="font-semibold text-red-900">Mark as Critical Issue</div>
                  <div className="text-sm text-red-700">Earn bonus points for critical bug reports!</div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!feedbackForm.content}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Request Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Request a Feature</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Title
                </label>
                <input
                  type="text"
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief title for your feature request"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  placeholder="Describe the feature you'd like to see..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={featureForm.category}
                  onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {['Feature', 'Bug Fix', 'Improvement', 'Design Change'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowFeatureModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeature}
                disabled={!featureForm.title || !featureForm.description}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

