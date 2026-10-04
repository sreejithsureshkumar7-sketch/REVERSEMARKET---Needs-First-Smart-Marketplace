import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Requirement, Offer } from '../types';
import { X, Star, Sparkles, Award } from 'lucide-react';

interface ReviewModalProps {
  requirement: Requirement | null;
  offer: Offer | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  requirement,
  offer,
  onClose,
}) => {
  const { submitReview } = useMarket();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!requirement || !offer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitReview(requirement.id, offer.providerId, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-white text-base">Rate & Review Provider</h3>
              <p className="text-xs text-slate-400">Updates {offer.providerName}'s Trust Score</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Star className="w-8 h-8 fill-emerald-400 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Review Submitted!</h4>
            <p className="text-xs text-slate-400">
              Provider Trust Score and public rating updated immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-300">How was your experience working with {offer.providerName}?</p>
              <div className="flex items-center justify-center space-x-2 py-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-600 transition hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-400">
                {rating === 5 ? 'Exceptional (5/5)' : rating === 4 ? 'Great (4/5)' : rating === 3 ? 'Average (3/5)' : 'Needs Improvement'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Client Review & Feedback
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Describe turnaround quality, communication, and technical outcome..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
