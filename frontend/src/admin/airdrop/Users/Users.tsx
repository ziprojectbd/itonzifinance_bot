import React, { useState } from 'react';
import { Search, Ban, RefreshCw, Gift, Mail, UserCheck, UserX } from 'lucide-react';
import { mockAirdropUsers, AirdropUser } from '../data/users';

const Users: React.FC = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AirdropUser[]>(mockAirdropUsers);

  // Derived counts
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;

  // Filtered users
  const filtered = users.filter(u =>
    u.id.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.walletAddress?.toLowerCase().includes(search.toLowerCase()) ||
    u.referralCode?.toLowerCase().includes(search.toLowerCase())
  );

  // Action handlers
  const toggleBan = (id: string) => {
    setUsers(users => users.map(u =>
      u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u
    ));
  };
  
  const resetStats = (id: string) => {
    setUsers(users => users.map(u =>
      u.id === id ? { ...u, points: 0, claimed: 0 } : u
    ));
  };
  
  const manualReward = (id: string) => {
    setUsers(users => users.map(u =>
      u.id === id ? { ...u, points: u.points + 100 } : u
    ));
  };
  
  const sendNotice = (id: string) => {
    alert(`Send notice to ${id}`);
  };

  // Leaderboard sorted by points
  const leaderboard = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-gray-900 min-h-screen p-3 sm:p-4 md:p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Airdrop Users</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by ID, Username, Email, Wallet, or Referral Code"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm w-full sm:w-64"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Users</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{totalUsers}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Active Users</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{activeUsers}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Banned Users</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400">{bannedUsers}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Points</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">
            {users.reduce((sum, user) => sum + user.points, 0).toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Users Table - Desktop */}
      <div className="hidden md:block overflow-x-auto mb-6 sm:mb-8">
        <table className="min-w-full bg-gray-800 rounded-xl border border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">UserID</th>
              <th className="px-4 py-2 text-left text-gray-400">Username</th>
              <th className="px-4 py-2 text-left text-gray-400">Email</th>
              <th className="px-4 py-2 text-left text-gray-400">Points</th>
              <th className="px-4 py-2 text-left text-gray-400">Claimed</th>
              <th className="px-4 py-2 text-left text-gray-400">Referrals</th>
              <th className="px-4 py-2 text-left text-gray-400">KYC Status</th>
              <th className="px-4 py-2 text-left text-gray-400">Status</th>
              <th className="px-4 py-2 text-left text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="px-4 py-2 text-white font-mono">{user.id}</td>
                <td className="px-4 py-2 text-white">{user.username}</td>
                <td className="px-4 py-2 text-white text-sm">{user.email}</td>
                <td className="px-4 py-2 text-white">{user.points.toLocaleString()}</td>
                <td className="px-4 py-2 text-white">{user.claimed}</td>
                <td className="px-4 py-2 text-white">{user.totalReferrals}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.kycStatus === 'verified' ? 'bg-green-600 text-green-200' :
                    user.kycStatus === 'pending' ? 'bg-yellow-600 text-yellow-200' :
                    'bg-red-600 text-red-200'
                  }`}>
                    {user.kycStatus}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {user.status === 'active' ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <UserCheck className="w-4 h-4" />Active
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <UserX className="w-4 h-4" />Banned
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => toggleBan(user.id)}
                    className={`p-2 rounded-lg ${user.status === 'banned' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} text-white`}
                    title={user.status === 'banned' ? 'Unban' : 'Ban'}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetStats(user.id)}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                    title="Reset Stats"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => manualReward(user.id)}
                    className="p-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white"
                    title="Manual Reward"
                  >
                    <Gift className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sendNotice(user.id)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                    title="Send Notice"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-3 mb-6 sm:mb-8">
        {filtered.map(user => (
          <div key={user.id} className="bg-gray-800 rounded-xl border border-gray-700 p-3 sm:p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium text-sm sm:text-base">{user.username}</h3>
                  <span className="text-gray-400 text-xs font-mono">{user.id}</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-1">
                {user.status === 'active' ? (
                  <span className="text-green-400 flex items-center gap-1 text-xs">
                    <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1 text-xs">
                    <UserX className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-xs sm:text-sm">
                <span className="text-gray-400">Points:</span>
                <span className="text-white ml-1">{user.points.toLocaleString()}</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-400">Claimed:</span>
                <span className="text-white ml-1">{user.claimed}</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-400">Referrals:</span>
                <span className="text-white ml-1">{user.totalReferrals}</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-400">KYC:</span>
                <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                  user.kycStatus === 'verified' ? 'bg-green-600 text-green-200' :
                  user.kycStatus === 'pending' ? 'bg-yellow-600 text-yellow-200' :
                  'bg-red-600 text-red-200'
                }`}>
                  {user.kycStatus}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleBan(user.id)}
                className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-white text-xs sm:text-sm ${
                  user.status === 'banned' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                <Ban className="w-3 h-3 sm:w-4 sm:h-4" />
                {user.status === 'banned' ? 'Unban' : 'Ban'}
              </button>
              <button
                onClick={() => resetStats(user.id)}
                className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                Reset
              </button>
              <button
                onClick={() => manualReward(user.id)}
                className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white text-xs sm:text-sm"
              >
                <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                Reward
              </button>
              <button
                onClick={() => sendNotice(user.id)}
                className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                Notice
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Leaderboard */}
      <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
        <div className="text-gray-400 text-xs sm:text-sm mb-3">🏆 Leaderboard (by Points)</div>
        <div className="space-y-2">
          {leaderboard.slice(0, 10).map((user, idx) => (
            <div key={user.id} className="flex items-center gap-2 sm:gap-3">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg ${
                idx === 0 ? 'bg-yellow-600' :
                idx === 1 ? 'bg-gray-500' :
                idx === 2 ? 'bg-orange-600' :
                'bg-blue-700'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm sm:text-base truncate">{user.username}</div>
                <div className="text-xs text-gray-400">
                  {user.points.toLocaleString()} pts • {user.claimed} claimed • {user.totalReferrals} referrals
                </div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">
                {user.country}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users; 