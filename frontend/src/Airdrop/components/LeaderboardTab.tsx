import React from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Coins } from 'lucide-react';
import { LeaderboardUser } from '../types';

interface LeaderboardTabProps {
  users: LeaderboardUser[];
  currentBalance: number;
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ users, currentBalance }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gray-800/90 border-yellow-400/60 shadow-lg shadow-yellow-400/10';
      case 2: return 'bg-gray-800/90 border-gray-400/60 shadow-md shadow-gray-400/10';
      case 3: return 'bg-gray-800/90 border-amber-500/60 shadow-md shadow-amber-500/10';
      default: return 'bg-gray-800/70 border-gray-700/70';
    }
  };

  // Find current user's rank (assuming they're not in the top 5)
  const currentUserRank = 42; // This would be calculated based on currentBalance
  // For progress visualization relative to top performer
  const maxCoins = Math.max(1, ...users.map(u => u.coins));

  return (
    <div className="p-2 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
      {/* Current User Stats */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-3 sm:p-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
          <div>
            <h3 className="text-base font-bold">Your Ranking</h3>
            <p className="text-cyan-100 text-xs">Keep earning to climb the leaderboard!</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">#{currentUserRank}</div>
            <div className="text-xs text-cyan-100">Rank</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <div>
            <div className="text-2xl font-bold">{currentBalance}</div>
            <div className="text-xs text-cyan-100">Total Coins</div>
          </div>
          <TrendingUp className="w-6 h-6 text-cyan-200" />
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-base font-bold text-white">Top Performers</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`group grid grid-cols-[auto_auto_1fr] sm:grid-cols-[auto_auto_1fr_auto] items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.01] ${getRankColor(user.rank)}`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/30 flex-shrink-0 ring-1 ring-white/30">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div className="text-2xl flex-shrink-0">{user.avatar}</div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h4 className="font-bold text-white truncate text-base">{user.username}</h4>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs text-white/90 bg-white/10 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3" />
                    Level {user.level}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-100">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    {user.coins.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-gray-300/80 hidden sm:inline">coins</span>
                </div>
                {/* Progress bar relative to top */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((user.coins / maxCoins) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Rewards */}
              {user.rank <= 3 && (
                <div className="text-right flex-shrink-0 self-stretch flex flex-col justify-between">
                  <div className="text-xs text-yellow-300 font-bold">
                    {user.rank === 1 && '🏆'}
                    {user.rank === 2 && '🥈'}
                    {user.rank === 3 && '🥉'}
                  </div>
                  <div className="text-xs text-gray-100 font-semibold">
                    +{user.rank === 1 ? '1000' : user.rank === 2 ? '500' : '250'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Info */}
      <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-gray-700">
        <h3 className="text-base font-bold text-white mb-3">Leaderboard Rewards</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-md border border-yellow-500/30">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium text-sm">1st Place</span>
            </div>
            <span className="text-yellow-400 font-bold text-sm">+1000 coins</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-md border border-gray-400/30">
            <div className="flex items-center gap-2">
              <Medal className="w-4 h-4 text-gray-400" />
              <span className="text-white font-medium text-sm">2nd Place</span>
            </div>
            <span className="text-gray-400 font-bold text-sm">+500 coins</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-md border border-amber-600/30">
            <div className="flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-600" />
              <span className="text-white font-medium text-sm">3rd Place</span>
            </div>
            <span className="text-amber-400 font-bold text-sm">+250 coins</span>
          </div>
        </div>
      </div>

      {/* How to Climb */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 sm:p-4 border border-purple-500/40">
        <h3 className="text-base font-bold text-purple-400 mb-3">How to Climb the Leaderboard</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <span className="text-white font-medium">Complete Daily Tasks</span>
              <p className="text-purple-100">Earn coins by completing all available tasks</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <span className="text-white font-medium">Watch Ads Regularly</span>
              <p className="text-purple-100">Consistent ad watching adds up quickly</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <span className="text-white font-medium">Invite Friends</span>
              <p className="text-purple-100">Referral bonuses can boost your ranking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab; 