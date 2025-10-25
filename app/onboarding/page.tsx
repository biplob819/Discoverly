"use client";

import { useState } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { TAGS } from "@/lib/constants";
import { Check } from "lucide-react";

export default function OnboardingPage() {
  const user = useUser({ or: "redirect" });
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    bio: "",
    role: "user" as "user" | "builder" | "early_adopter" | "investor" | "influencer",
    interests: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/");
      } else {
        alert("Failed to complete onboarding. Please try again.");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-cyan-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {step} of 3
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Discoverly! 👋
              </h2>
              <p className="text-gray-600 mb-8">
                Let's set up your profile to get started
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
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
                    value={formData.display_name}
                    onChange={(e) =>
                      setFormData({ ...formData, display_name: e.target.value })
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
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What brings you here?
              </h2>
              <p className="text-gray-600 mb-8">
                Select your primary role to personalize your experience
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    value: "user",
                    label: "Early Adopter",
                    desc: "Discover and try new products",
                    icon: "🔍",
                  },
                  {
                    value: "builder",
                    label: "Builder / Founder",
                    desc: "Launch and promote products",
                    icon: "🚀",
                  },
                  {
                    value: "investor",
                    label: "Investor",
                    desc: "Find promising startups",
                    icon: "💰",
                  },
                  {
                    value: "influencer",
                    label: "Influencer / Blogger",
                    desc: "Discover content to share",
                    icon: "📢",
                  },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        role: role.value as any,
                      })
                    }
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      formData.role === role.value
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-3xl mb-3">{role.icon}</div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {role.label}
                    </div>
                    <div className="text-sm text-gray-600">{role.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What are you interested in?
              </h2>
              <p className="text-gray-600 mb-8">
                Select topics to personalize your feed (select at least 3)
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.interests.includes(tag)
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {formData.interests.length} selected (minimum 3)
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !formData.username}
                className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || formData.interests.length < 3}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Completing..."
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

