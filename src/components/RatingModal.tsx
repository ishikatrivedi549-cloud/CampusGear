"use client";

import React, { useState } from "react";
import { Star, X, Check, Award } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number, comment: string) => Promise<void>;
  targetUserName: string;
  itemTitle: string;
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  targetUserName,
  itemTitle,
}: RatingModalProps) {
  const [score, setScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(score, comment);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (s: number) => {
    switch (s) {
      case 5:
        return "Exceptional peer! Highly reliable & punctual.";
      case 4:
        return "Very good exchange, smooth campus meetup.";
      case 3:
        return "Average exchange, gear received as described.";
      case 2:
        return "Minor delays or wear issues.";
      case 1:
        return "Unreliable or poor condition.";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 mx-auto flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Rate Your Campus Peer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How was your exchange with <strong className="text-slate-800">{targetUserName}</strong> for &ldquo;{itemTitle}&rdquo;?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Selector */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setScore(star)}
                    onMouseEnter={() => setHoverScore(star)}
                    onMouseLeave={() => setHoverScore(0)}
                    className="p-1 hover:scale-115 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverScore || score)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-amber-700 mt-2 text-center h-4">
                {getScoreLabel(hoverScore || score)}
              </p>
            </div>

            {/* Quick Comment Chips */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                "Punctual meetup ⏰",
                "Gear in pristine condition ✨",
                "Helpful senior 🎓",
                "Super friendly 😊",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setComment((prev) => (prev ? `${prev} ${chip}` : chip))}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors font-medium border border-slate-200"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Feedback for Campus Trust Score
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience (condition of gear, punctuality at pickup point)..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Submit Rating</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
