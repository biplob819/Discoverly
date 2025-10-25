"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Check } from "lucide-react";
import { TAGS } from "@/lib/constants";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          interests: selectedInterests,
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You're Subscribed!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for subscribing to our newsletter. You'll receive weekly
              updates on the best new products.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
            >
              Back to Home
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-6">
            <Mail className="w-8 h-8 text-cyan-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter
          </h1>
          <p className="text-xl text-gray-600">
            Get weekly updates on the best new products, curated just for you
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Interests */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Select Your Interests (Optional)
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Choose topics you're interested in to receive personalized content
            </p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedInterests.includes(tag)
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
          </button>

          <p className="text-sm text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>

        {/* Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">📬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Weekly Digest</h3>
            <p className="text-sm text-gray-600">
              Receive curated products every week
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized</h3>
            <p className="text-sm text-gray-600">
              Content tailored to your interests
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">Early Access</h3>
            <p className="text-sm text-gray-600">
              Be first to discover new launches
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

