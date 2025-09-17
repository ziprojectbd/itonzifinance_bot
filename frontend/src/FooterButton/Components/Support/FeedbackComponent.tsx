import React, { useState } from 'react';
import { Send, MessageCircle, ExternalLink, Star } from 'lucide-react';

interface FeedbackForm {
  rating: number;
  category: string;
  message: string;
}

interface FeedbackComponentProps {
  onSubmitFeedback: (feedback: FeedbackForm) => void;
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({ onSubmitFeedback }) => {
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    rating: 0,
    category: '',
    message: ''
  });

  const handleSubmitFeedback = () => {
    if (feedbackForm.rating > 0 && feedbackForm.category && feedbackForm.message) {
      onSubmitFeedback(feedbackForm);
      setFeedbackForm({ rating: 0, category: '', message: '' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-white font-bold text-lg mb-2">Share Your Feedback</h3>
        <p className="text-gray-400 text-sm">
          Help us improve iTonzi with your suggestions
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-white font-bold mb-2">Rate your experience</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                  className={`text-2xl transition-colors ${
                    star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-white font-bold mb-2">Feedback Category</label>
            <select
              value={feedbackForm.category}
              onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="ui">User Interface</option>
              <option value="features">Features</option>
              <option value="performance">Performance</option>
              <option value="bugs">Bug Report</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-white font-bold mb-2">Your Feedback</label>
            <textarea
              placeholder="Tell us what you think..."
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleSubmitFeedback}
            className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>
      </div>

      {/* Community Links */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-bold mb-3">Join Our Community</h4>
        <div className="space-y-2">
          <button 
            onClick={() => window.open('https://t.me/iTonziFinanceChannel', '_blank', 'noopener,noreferrer')}
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Telegram Community
          </button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Discord Server
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackComponent; 