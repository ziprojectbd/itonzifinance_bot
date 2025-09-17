import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { useSearch } from '../AdminPanel';
// @ts-expect-error: No types for react-sparklines
import { Sparklines, SparklinesLine } from 'react-sparklines';
import API_BASE_URL from '../../services/api/config';

interface UserStats {
  userId: string;
  totalAds: number;
  totalEarned: number;
  dailyAds: number;
  dailyEarnings: number;
  payable: number;
  siteVisits: number;
  updatedAt: string;
}

// Sparkline history type
interface UserHistoryPoint {
  value: number;
  timestamp: number;
}

const SPARKLINE_PERIODS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

type SparklinePeriod = 'day' | 'week' | 'month' | 'year';

const UserManager: React.FC = () => {
  const [userStatsList, setUserStatsList] = useState<UserStats[]>([]);
  const [filteredUserStats, setFilteredUserStats] = useState<UserStats[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserStats>>({});
  
  const { searchQuery } = useSearch();

  // Persistent sparkline history state
  const [userHistory, setUserHistory] = useState<UserHistoryPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<SparklinePeriod>('day');

  // Fetch persistent user count history from backend
  const fetchUserHistory = async (period: SparklinePeriod) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/user-count-history?period=${period}`);
      console.log('API Response:', res.data); // Debug log
      setUserHistory(res.data.map((point: any) => ({
        value: point.count,
        timestamp: new Date(point.timestamp).getTime()
      })));
    } catch (err) {
      console.error('Error fetching user count history:', err);
    }
  };

  // Fetch on mount and when selectedPeriod changes
  useEffect(() => {
    fetchUserHistory(selectedPeriod);
  }, [selectedPeriod]);

  // Sparkline data for the selected period
  const filteredSparkline = userHistory.map(point => point.value);

  // Debug log for sparkline data
  useEffect(() => {
    console.log('userHistory:', userHistory);
    console.log('filteredSparkline:', filteredSparkline);
  }, [userHistory, filteredSparkline]);

  // Fetch user stats (for table and stat cards)
  const fetchStats = async () => {
    try {
      const res = await axios.get<UserStats[]>(`${API_BASE_URL}/api/user/admin/all-stats`);
      setUserStatsList(res.data);
      setFilteredUserStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Auto refresh every 30 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
      fetchUserHistory(selectedPeriod);
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  // Filter users based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUserStats(userStatsList);
    } else {
      const filtered = userStatsList.filter(user => 
        user.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUserStats(filtered);
    }
  }, [searchQuery, userStatsList]);

  // Calculate statistics
  const totalUsers = userStatsList.length;
  const totalEarnings = userStatsList.reduce((sum, user) => sum + user.totalEarned, 0);
  const totalAds = userStatsList.reduce((sum, user) => sum + user.totalAds, 0);
  const totalSiteVisits = userStatsList.reduce((sum, user) => sum + user.siteVisits, 0);

  const handleEdit = (user: UserStats) => {
    setEditUserId(user.userId);
    setEditData({ ...user });
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editData.userId) return;

    try {
      await axios.post(`${API_BASE_URL}/api/user/stats`, {
        userId: editData.userId,
        stats: {
          totalAds: Number(editData.totalAds),
          totalEarned: Number(editData.totalEarned),
          dailyAds: Number(editData.dailyAds),
          dailyEarnings: Number(editData.dailyEarnings),
          payable: Number(editData.payable),
          siteVisits: Number(editData.siteVisits),
        }
      });
      await fetchStats();
      handleCancel();
    } catch (err) {
      console.error('Error saving stats:', err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user stats?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/user/stats/${userId}`);
      await fetchStats();
    } catch (err) {
      console.error('Error deleting stats:', err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Enhanced Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col gap-4">
          {/* Title Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">User Stats Manager</h1>
              <p className="text-blue-100 text-sm">Manage and monitor user statistics</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-purple-600/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-blue-400/30 transition-all duration-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-white/80 text-xs sm:text-sm">Total Users</span>
              </div>
              <div className="text-white font-bold text-lg sm:text-xl mt-1">{totalUsers.toLocaleString()}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 via-green-600/30 to-emerald-600/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-green-400/30 transition-all duration-300">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-white/80 text-xs sm:text-sm">Total Earnings</span>
              </div>
              <div className="text-white font-bold text-lg sm:text-xl mt-1">${totalEarnings.toLocaleString()}</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/20 via-yellow-600/30 to-orange-600/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-yellow-400/30 transition-all duration-300">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className="text-white/80 text-xs sm:text-sm">Total Ads</span>
              </div>
              <div className="text-white font-bold text-lg sm:text-xl mt-1">{totalAds.toLocaleString()}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 via-purple-600/30 to-pink-600/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-purple-400/30 transition-all duration-300">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-fuchsia-500" />
                <span className="text-white/80 text-xs sm:text-sm">Site Visits</span>
              </div>
              <div className="text-white font-bold text-lg sm:text-xl mt-1">{totalSiteVisits.toLocaleString()}</div>
            </div>
          </div>

          {/* Sparkline below all statistics */}
          <div className="mt-4 bg-black/40 rounded-lg p-3 sm:p-4 flex flex-col items-center border border-blue-900/30 w-full">
            {/* Sparkline Title Bar with Period Selector */}
            <div className="flex items-center justify-between w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mb-2">
              <span className="text-xs sm:text-sm text-blue-200 font-semibold">Live Total Users</span>
              <div className="flex gap-1 sm:gap-2">
                {SPARKLINE_PERIODS.map(period => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value as SparklinePeriod)}
                    className={`px-2 py-1 rounded text-xs sm:text-sm font-medium transition-colors
                      ${selectedPeriod === period.value ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-200 hover:bg-blue-800'}`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
              {filteredSparkline.length > 1 ? (
                <Sparklines data={filteredSparkline} width={240} height={40} margin={4}>
                  <SparklinesLine color="#3b82f6" style={{ fill: 'none' }} />
                </Sparklines>
              ) : (
                <div className="text-blue-300 text-center py-4 border border-blue-300/30 rounded">
                  {filteredSparkline.length === 0 
                    ? 'No data available for sparkline' 
                    : 'Need at least 2 data points to show sparkline (current: 1)'
                  }
                </div>
              )}
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-white/80 text-xs sm:text-sm">
              <span className="bg-white/10 px-2 py-1 rounded">Auto-refresh every 30 seconds</span>
            </div>
            <div className="text-white/60 text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full overflow-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-600 rounded-lg">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">User ID</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Total Ads</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Total Earned</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Daily Ads</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Daily Earnings</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Payable</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Site Visits</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Updated At</th>
                    <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {filteredUserStats.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                        {searchQuery ? 'No users found matching your search.' : 'No user stats available.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUserStats.map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-700 text-gray-300">
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium">{user.userId}</td>

                        {editUserId === user.userId ? (
                          <>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                              <input type="number" name="totalAds" value={editData.totalAds || 0} onChange={handleChange} className="border border-gray-500 p-1 w-16 sm:w-20 bg-gray-700 text-white rounded text-xs" />
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                              <input type="number" name="totalEarned" value={editData.totalEarned || 0} onChange={handleChange} className="border border-gray-500 p-1 w-20 sm:w-24 bg-gray-700 text-white rounded text-xs" />
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                              <input type="number" name="dailyAds" value={editData.dailyAds || 0} onChange={handleChange} className="border border-gray-500 p-1 w-16 sm:w-20 bg-gray-700 text-white rounded text-xs" />
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                              <input type="number" name="dailyEarnings" value={editData.dailyEarnings || 0} onChange={handleChange} className="border border-gray-500 p-1 w-20 sm:w-24 bg-gray-700 text-white rounded text-xs" />
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                              <input type="number" name="payable" value={editData.payable || 0} onChange={handleChange} className="border border-gray-500 p-1 w-16 sm:w-20 bg-gray-700 text-white rounded text-xs" />
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                              <input type="number" name="siteVisits" value={editData.siteVisits || 0} onChange={handleChange} className="border border-gray-500 p-1 w-16 sm:w-20 bg-gray-700 text-white rounded text-xs" />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">{user.totalAds}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">${user.totalEarned}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">{user.dailyAds}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">${user.dailyEarnings}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">${user.payable}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">{user.siteVisits}</td>
                          </>
                        )}

                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">{new Date(user.updatedAt).toLocaleString()}</td>

                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            {editUserId === user.userId ? (
                              <>
                                <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors text-xs" onClick={handleSave}>Save</button>
                                <button className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors text-xs" onClick={handleCancel}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <button className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors text-xs" onClick={() => handleEdit(user)}>Edit</button>
                                <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors text-xs" onClick={() => handleDelete(user.userId)}>Delete</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
