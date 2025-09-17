import React from 'react';
import { Copy, Users, TrendingUp, Gift, Share2 } from 'lucide-react';
import { ReferralData } from '../types';

interface ReferralTabProps {
  referralData: ReferralData;
}

const ReferralTab: React.FC<ReferralTabProps> = ({ referralData }) => {
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    // You could add a toast notification here
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Total Referrals</span>
          </div>
          <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <div className="text-2xl font-bold">{referralData.activeReferrals}</div>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6" />
          <span className="text-lg font-medium">Total Earned</span>
        </div>
        <div className="text-3xl font-bold">{referralData.totalEarned} coins</div>
        <p className="text-purple-100 text-sm mt-2">From referral bonuses</p>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
        <h3 className="text-lg font-bold text-white mb-4">Your Referral Code</h3>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-mono text-lg">{referralData.referralCode}</span>
            <button
              onClick={copyReferralLink}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
        <h3 className="text-lg font-bold text-white mb-4">Referral Link</h3>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm truncate flex-1 mr-2">{referralData.referralLink}</span>
            <button
              onClick={copyReferralLink}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
        <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-medium text-white">Share Your Code</h4>
              <p className="text-gray-300 text-sm">Share your referral code with friends and family</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-medium text-white">They Join</h4>
              <p className="text-gray-300 text-sm">When they sign up using your code, you both get rewards</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-medium text-white">Earn Together</h4>
              <p className="text-gray-300 text-sm">Earn bonus coins for every task they complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
        <h3 className="text-lg font-bold text-yellow-400 mb-3">Referral Rewards</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Direct Referral Bonus</span>
            <span className="text-yellow-400 font-bold">+200 coins</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Task Completion Bonus</span>
            <span className="text-yellow-400 font-bold">+50 coins</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Weekly Active Bonus</span>
            <span className="text-yellow-400 font-bold">+100 coins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralTab; 