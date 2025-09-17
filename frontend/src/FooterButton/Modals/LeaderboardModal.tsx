import React, { useState } from 'react';
import { X, Trophy, Users, Calendar, Gift, Zap } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardUser {
  id: number;
  username: string;
  coins: number;
  rank: number;
  avatar: string;
  level: number;
  country: string;
  weeklyEarnings: number;
  streak: number;
  badges: string[];
}

interface LeaderboardPrize {
  rank: string;
  prize: string;
  coins: number;
  badge?: string;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'friends' | 'prizes'>('global');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');

  const globalLeaderboard: LeaderboardUser[] = [
    { 
      id: 1, 
      username: 'CryptoKing', 
      coins: 15420, 
      rank: 1, 
      avatar: '👑', 
      level: 8, 
      country: '🇺🇸',
      weeklyEarnings: 2340,
      streak: 45,
      badges: ['🏆', '💎', '🔥']
    },
    { 
      id: 2, 
      username: 'TonMaster', 
      coins: 12890, 
      rank: 2, 
      avatar: '🚀', 
      level: 7, 
      country: '🇬🇧',
      weeklyEarnings: 1890,
      streak: 32,
      badges: ['🥈', '⚡', '🎯']
    },
    { 
      id: 3, 
      username: 'AirdropHunter', 
      coins: 11250, 
      rank: 3, 
      avatar: '🎯', 
      level: 6, 
      country: '🇩🇪',
      weeklyEarnings: 1650,
      streak: 28,
      badges: ['🥉', '🎪', '🌟']
    },
    { 
      id: 4, 
      username: 'DiamondHands', 
      coins: 9870, 
      rank: 4, 
      avatar: '💎', 
      level: 6, 
      country: '🇫🇷',
      weeklyEarnings: 1420,
      streak: 21,
      badges: ['💎', '🔥']
    },
    { 
      id: 5, 
      username: 'MoonWalker', 
      coins: 8640, 
      rank: 5, 
      avatar: '🌙', 
      level: 5, 
      country: '🇯🇵',
      weeklyEarnings: 1280,
      streak: 19,
      badges: ['🌙', '⭐']
    },
    { 
      id: 6, 
      username: 'TokenCollector', 
      coins: 7520, 
      rank: 6, 
      avatar: '🪙', 
      level: 5, 
      country: '🇰🇷',
      weeklyEarnings: 1150,
      streak: 15,
      badges: ['🪙', '🎨']
    },
    { 
      id: 7, 
      username: 'Web3Pioneer', 
      coins: 6890, 
      rank: 7, 
      avatar: '🌐', 
      level: 4, 
      country: '🇨🇦',
      weeklyEarnings: 980,
      streak: 12,
      badges: ['🌐', '🚀']
    },
    { 
      id: 8, 
      username: 'BlockchainBoss', 
      coins: 6120, 
      rank: 8, 
      avatar: '⛓️', 
      level: 4, 
      country: '🇦🇺',
      weeklyEarnings: 890,
      streak: 10,
      badges: ['⛓️', '💪']
    },
    { 
      id: 9, 
      username: 'DeFiDegen', 
      coins: 5780, 
      rank: 9, 
      avatar: '🔥', 
      level: 4, 
      country: '🇧🇷',
      weeklyEarnings: 820,
      streak: 8,
      badges: ['🔥', '⚡']
    },
    { 
      id: 10, 
      username: 'NFTCollector', 
      coins: 5340, 
      rank: 10, 
      avatar: '🎨', 
      level: 3, 
      country: '🇮🇳',
      weeklyEarnings: 750,
      streak: 7,
      badges: ['🎨', '🌟']
    }
  ];

  const leaderboardPrizes: LeaderboardPrize[] = [
    { rank: '1st Place', prize: 'Golden Crown + Premium Features', coins: 1000, badge: '👑' },
    { rank: '2nd Place', prize: 'Silver Medal + Bonus Multiplier', coins: 500, badge: '🥈' },
    { rank: '3rd Place', prize: 'Bronze Trophy + Special Badge', coins: 250, badge: '🥉' },
    { rank: 'Top 10', prize: 'Elite Badge + Coin Bonus', coins: 100, badge: '🏆' },
    { rank: 'Top 50', prize: 'Rising Star Badge', coins: 50, badge: '⭐' },
    { rank: 'Top 100', prize: 'Participant Badge', coins: 25, badge: '🎖️' }
  ];

  const userRank = 42;
  const userCoins = 205;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🏆';
    if (rank <= 50) return '⭐';
    return '🎖️';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-orange-500';
    if (rank === 2) return 'from-gray-400 to-gray-600';
    if (rank === 3) return 'from-orange-400 to-yellow-600';
    if (rank <= 10) return 'from-purple-500 to-blue-500';
    return 'from-gray-600 to-gray-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 m-0">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full min-h-screen flex flex-col overflow-hidden border border-gray-700 rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
            
            {/* Your Rank */}
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-4xl mb-2">{getRankIcon(userRank)}</div>
              <div className="text-2xl font-bold text-white">Rank #{userRank}</div>
              <div className="text-yellow-100 text-sm mb-2">Your Position</div>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-300 font-bold">{userCoins} coins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="flex">
            {[
              { id: 'global', label: 'Global', icon: Trophy },
              { id: 'weekly', label: 'Weekly', icon: Calendar },
              { id: 'friends', label: 'Friends', icon: Users },
              { id: 'prizes', label: 'Prizes', icon: Gift }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all ${
                    activeTab === tab.id
                      ? 'text-yellow-400 bg-yellow-400/10 border-b-2 border-yellow-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {(activeTab === 'global' || activeTab === 'weekly' || activeTab === 'friends') && (
            <div className="space-y-4">
              {/* Time Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'daily', label: 'Daily' },
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'all-time', label: 'All Time' }
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setTimeframe(period.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      timeframe === period.id
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* Leaderboard List */}
              <div className="space-y-3">
                {globalLeaderboard.map((user) => (
                  <div
                    key={user.id}
                    className={`rounded-lg p-4 border-2 transition-all hover:scale-[1.02] ${
                      user.rank <= 3
                        ? `bg-gradient-to-r ${getRankColor(user.rank)} border-yellow-400/50`
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getRankIcon(user.rank)}</div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{user.username}</span>
                            <span className="text-lg">{user.country}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>Level {user.level}</span>
                            <span>•</span>
                            <span>{user.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-lg">
                          {user.coins.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-xs">
                          +{user.weeklyEarnings} this week
                        </div>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {user.badges.map((badge, index) => (
                          <span key={index} className="text-lg">{badge}</span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Rank #{user.rank}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeTab === 'friends' && (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-white font-bold mb-2">No Friends Yet</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Invite friends to see them on your leaderboard
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold transition-colors">
                    Invite Friends
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-lg mb-2">Weekly Rewards</h3>
                <p className="text-gray-400 text-sm">
                  Compete for amazing prizes every week!
                </p>
              </div>

              <div className="space-y-3">
                {leaderboardPrizes.map((prize, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{prize.badge}</div>
                        <div>
                          <div className="text-white font-bold">{prize.rank}</div>
                          <div className="text-gray-400 text-sm">{prize.prize}</div>
                        </div>
                      </div>
                      <div className="text-yellow-400 font-bold">
                        +{prize.coins} coins
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Competition Info */}
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/50 rounded-lg p-4 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-bold">Competition Rules</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• Rankings reset every Monday</div>
                  <div>• Earn coins through ads, tasks, and referrals</div>
                  <div>• Prizes distributed automatically</div>
                  <div>• Fair play policy enforced</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Competition ends in: <span className="text-white font-bold">3d 14h 25m</span>
            </div>
            <button className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg font-bold transition-colors">
              Boost Rank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;