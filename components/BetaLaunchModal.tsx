"use client";

import { useState } from "react";
import { useUser } from "@stackframe/stack";
import { 
  X, 
  Rocket, 
  Gift, 
  Users, 
  DollarSign, 
  Trophy, 
  Camera,
  FileText,
  Calendar,
  Clock,
  Percent,
  Star,
  Zap
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

type BetaLaunchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLaunchProduct: () => void;
};

export default function BetaLaunchModal({ isOpen, onClose, onLaunchProduct }: BetaLaunchModalProps) {
  const user = useUser();
  const [activeTab, setActiveTab] = useState<'requirements' | 'timeline' | 'details'>('requirements');
  const [formData, setFormData] = useState({
    // Basic Product Info
    product_name: "",
    product_tagline: "",
    product_description: "",
    product_website: "",
    product_category: "",
    
    // Beta Program Details
    beta_title: "",
    beta_description: "",
    max_testers: 10,
    
    // Rewards & Incentives
    reward_type: "discount",
    discount_percentage: 20,
    cash_prize: 100,
    gift_voucher_value: 50,
    lifetime_deal: false,
    early_mover_credits: 0,
    
    // Requirements
    screenshots_required: false,
    documentation_required: false,
    video_feedback_required: false,
    detailed_report_required: false,
    
    // Evaluation Criteria
    usability_testing: true,
    feature_testing: true,
    performance_testing: false,
    security_testing: false,
    accessibility_testing: false,
    
    // Timeline
    start_date: "",
    end_date: "",
    feedback_deadline: "",
    
    // Access
    access_type: "open" as "open" | "approval",
    target_audience: "",
    experience_level: "all" as "all" | "beginner" | "intermediate" | "expert"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please sign in to launch a beta program");
      return;
    }

    try {
      // Create product first
      const productResponse = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.product_name,
          tagline: formData.product_tagline,
          description: formData.product_description,
          website_url: formData.product_website,
          category: formData.product_category,
          status: "live"
        }),
      });

      if (!productResponse.ok) {
        throw new Error("Failed to create product");
      }

      const productData = await productResponse.json();

      // Create beta program
      const betaResponse = await fetch("/api/beta/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productData.id,
          title: formData.beta_title,
          description: formData.beta_description,
          max_testers: formData.max_testers,
          reward_type: formData.reward_type,
          reward_value: {
            discount_percentage: formData.discount_percentage,
            cash_prize: formData.cash_prize,
            gift_voucher_value: formData.gift_voucher_value,
            lifetime_deal: formData.lifetime_deal,
            early_mover_credits: formData.early_mover_credits
          },
          requirements: {
            screenshots_required: formData.screenshots_required,
            documentation_required: formData.documentation_required,
            video_feedback_required: formData.video_feedback_required,
            detailed_report_required: formData.detailed_report_required
          },
          evaluation_criteria: {
            usability_testing: formData.usability_testing,
            feature_testing: formData.feature_testing,
            performance_testing: formData.performance_testing,
            security_testing: formData.security_testing,
            accessibility_testing: formData.accessibility_testing
          },
          start_date: formData.start_date,
          end_date: formData.end_date,
          access_type: formData.access_type,
          target_audience: formData.target_audience,
          experience_level: formData.experience_level
        }),
      });

      if (!betaResponse.ok) {
        throw new Error("Failed to create beta program");
      }

      alert("🎉 Beta program launched successfully!");
      onClose();
      onLaunchProduct();
    } catch (error) {
      console.error("Error launching beta program:", error);
      alert("Failed to launch beta program. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Launch Beta Program</h2>
              <p className="text-gray-600">Get early feedback and build community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'requirements', label: 'Requirements & Rewards', icon: Gift },
            { id: 'timeline', label: 'Timeline & Access', icon: Calendar },
            { id: 'details', label: 'Product Details', icon: FileText }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === id
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Requirements & Rewards Tab */}
            {activeTab === 'requirements' && (
              <div className="space-y-8">
                {/* Beta Program Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Beta Program Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Beta Program Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.beta_title}
                        onChange={(e) => setFormData({...formData, beta_title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., Early Access to MyApp 2.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Beta Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.beta_description}
                        onChange={(e) => setFormData({...formData, beta_description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Describe what testers will be testing and what you expect from them..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Maximum Testers
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={formData.max_testers}
                        onChange={(e) => setFormData({...formData, max_testers: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Rewards Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Rewards & Incentives</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Primary Reward Type
                      </label>
                      <select
                        value={formData.reward_type}
                        onChange={(e) => setFormData({...formData, reward_type: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="discount">Discount</option>
                        <option value="cash">Cash Prize</option>
                        <option value="gift_voucher">Gift Voucher</option>
                        <option value="lifetime_deal">Lifetime Deal</option>
                        <option value="credits">Early Mover Credits</option>
                      </select>
                    </div>

                    {/* Dynamic Reward Configuration */}
                    {formData.reward_type === 'discount' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Percent className="w-4 h-4 inline mr-1" />
                          Discount Percentage
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={100}
                          value={formData.discount_percentage}
                          onChange={(e) => setFormData({...formData, discount_percentage: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    )}

                    {formData.reward_type === 'cash' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Cash Prize per Verified Feedback ($)
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={1000}
                          value={formData.cash_prize}
                          onChange={(e) => setFormData({...formData, cash_prize: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    )}

                    {formData.reward_type === 'gift_voucher' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Gift className="w-4 h-4 inline mr-1" />
                          Gift Voucher Value ($)
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={500}
                          value={formData.gift_voucher_value}
                          onChange={(e) => setFormData({...formData, gift_voucher_value: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    )}

                    {formData.reward_type === 'credits' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Zap className="w-4 h-4 inline mr-1" />
                          Early Mover Credits
                        </label>
                        <input
                          type="number"
                          min={100}
                          max={10000}
                          value={formData.early_mover_credits}
                          onChange={(e) => setFormData({...formData, early_mover_credits: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    )}

                    {/* Lifetime Deal Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Lifetime Deal</p>
                          <p className="text-sm text-gray-600">Offer lifetime access for top contributors</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.lifetime_deal}
                          onChange={(e) => setFormData({...formData, lifetime_deal: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Testing Requirements */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Testing Requirements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'screenshots_required', label: 'Screenshots Required', icon: Camera },
                      { key: 'documentation_required', label: 'Documentation Required', icon: FileText },
                      { key: 'video_feedback_required', label: 'Video Feedback Required', icon: Camera },
                      { key: 'detailed_report_required', label: 'Detailed Report Required', icon: FileText }
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[key as keyof typeof formData] as boolean}
                            onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evaluation Criteria */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Evaluation Criteria</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'usability_testing', label: 'Usability Testing', icon: Users },
                      { key: 'feature_testing', label: 'Feature Testing', icon: Zap },
                      { key: 'performance_testing', label: 'Performance Testing', icon: Clock },
                      { key: 'security_testing', label: 'Security Testing', icon: Star },
                      { key: 'accessibility_testing', label: 'Accessibility Testing', icon: Users }
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[key as keyof typeof formData] as boolean}
                            onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline & Access Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Access & Targeting</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Access Type
                      </label>
                      <select
                        value={formData.access_type}
                        onChange={(e) => setFormData({...formData, access_type: e.target.value as 'open' | 'approval'})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="open">Open Access - Anyone can join</option>
                        <option value="approval">Approval Required - You review applications</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Experience Level
                      </label>
                      <select
                        value={formData.experience_level}
                        onChange={(e) => setFormData({...formData, experience_level: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Audience (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.target_audience}
                        onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., Developers familiar with React, Design professionals, Small business owners..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Product Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.product_name}
                        onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., MyApp"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Tagline *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.product_tagline}
                        onChange={(e) => setFormData({...formData, product_tagline: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="A short, catchy description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Description *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.product_description}
                        onChange={(e) => setFormData({...formData, product_description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Describe your product, its features, and what problem it solves..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Website URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.product_website}
                        onChange={(e) => setFormData({...formData, product_website: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="https://yourproduct.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.product_category}
                        onChange={(e) => setFormData({...formData, product_category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-600">
              {activeTab === 'requirements' && "Configure rewards and testing requirements"}
              {activeTab === 'timeline' && "Set up campaign timeline and access settings"}
              {activeTab === 'details' && "Provide basic product information"}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.product_name || !formData.beta_title || !formData.start_date || !formData.end_date}
                className="px-8 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🚀 Launch Beta Program
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
