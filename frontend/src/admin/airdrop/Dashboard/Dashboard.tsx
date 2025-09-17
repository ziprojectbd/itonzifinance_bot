import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

const mockStats = {
  totalParticipants: 1245,
  totalClaimPoints: 98230,
  totalTasksCompleted: 5432,
  activeUsers: 312,
  requiredPoints: 1000,
  totalSupply: 1000000,
  startDate: '2024-06-01',
  endDate: '2024-07-01',
};

const mockTopUsers = [
  { name: 'CryptoKing', points: 3200 },
  { name: 'TonMaster', points: 2950 },
  { name: 'AirdropHunter', points: 2780 },
  { name: 'DiamondHands', points: 2500 },
  { name: 'MoonWalker', points: 2300 },
];

const mockSparkPoints = [200, 400, 600, 800, 1200, 1500, 1800, 2100, 2500, 3000, 3200];

const Dashboard: React.FC = () => {
  const [airdropOn, setAirdropOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('airdrop_enabled');
      return saved ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [totalSupply, setTotalSupply] = useState(mockStats.totalSupply);

  const handleUpdateSupply = () => {
    // Here you would typically make an API call to update the total supply
    console.log('Updated total supply to:', totalSupply);
    setShowSupplyModal(false);
  };

  // Persist toggle and notify app
  useEffect(() => {
    try {
      localStorage.setItem('airdrop_enabled', String(airdropOn));
    } catch {}
    // Notify within same tab/app
    window.dispatchEvent(new CustomEvent('airdrop_toggle', { detail: { enabled: airdropOn } }));
  }, [airdropOn]);

  return (
    <div className="bg-gray-900 min-h-screen p-3 sm:p-4 md:p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Airdrop Dashboard</h1>
        <div className="flex items-center justify-end gap-3">
          <span className={`font-semibold text-sm sm:text-base ${airdropOn ? 'text-green-400' : 'text-red-400'}`}>
            {airdropOn ? 'ON' : 'OFF'}
          </span>
          <button
            onClick={() => setAirdropOn((on) => !on)}
            className={`w-12 h-6 sm:w-14 sm:h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${airdropOn ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <div
              className={`w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${airdropOn ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Participants</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{mockStats.totalParticipants.toLocaleString()}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Claim Points</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{mockStats.totalClaimPoints.toLocaleString()}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Task Completed</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{mockStats.totalTasksCompleted.toLocaleString()}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Active Users</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{mockStats.activeUsers.toLocaleString()}</div>
        </div>
      </div>

      {/* Total Supply Section */}
      <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">💰 Total Supply</h2>
          <button
            onClick={() => setShowSupplyModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors"
          >
            <Settings className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 text-center">
          {totalSupply.toLocaleString()}
        </div>
        <div className="text-center text-gray-400 text-sm sm:text-base mt-2">
          Available for distribution
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-xs sm:text-sm">Required Points</div>
            <div className="text-white font-bold text-sm sm:text-base">{mockStats.requiredPoints}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-xs sm:text-sm">Start Date</div>
            <div className="text-white font-bold text-sm sm:text-base">{mockStats.startDate}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-xs sm:text-sm">End Date</div>
            <div className="text-white font-bold text-sm sm:text-base">{mockStats.endDate}</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="text-gray-400 text-xs sm:text-sm mb-2">📈 Points SparkChart</div>
          <div className="flex items-end h-12 sm:h-16 gap-1">
            {mockSparkPoints.map((pt, idx) => (
              <div
                key={idx}
                className="bg-blue-500 rounded w-1 sm:w-2"
                style={{ height: `${(pt / Math.max(...mockSparkPoints)) * 48}px` }}
                title={pt.toString()}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
        <div className="text-gray-400 text-xs sm:text-sm mb-3">🏆 Top 5 Users Preview</div>
        <div className="space-y-2">
          {mockTopUsers.map((user, idx) => (
            <div key={user.name} className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm sm:text-base truncate">{user.name}</div>
                <div className="text-xs text-gray-400">{user.points} pts</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Supply Edit Modal */}
      {showSupplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">Edit Total Supply</h2>
              <button
                onClick={() => setShowSupplyModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Current Total Supply</label>
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {totalSupply.toLocaleString()}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm">New Total Supply</label>
                <input
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  min="0"
                  step="1000"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Enter the new total supply amount
                </div>
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Supply Distribution</div>
                <div className="text-sm text-white">
                  <div className="flex justify-between">
                    <span>Claimed:</span>
                    <span>{mockStats.totalClaimPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span>{(totalSupply - mockStats.totalClaimPoints).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSupplyModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSupply}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm"
              >
                Update Supply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 