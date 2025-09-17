import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Coins, 
  Target, 
  Calendar, 
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  UserPlus,
  UserMinus,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

interface AnalyticsData {
  userGrowth: {
    labels: string[];
    data: number[];
  };
  taskCompletion: {
    labels: string[];
    data: number[];
  };
  earnings: {
    labels: string[];
    data: number[];
  };
  withdrawals: {
    labels: string[];
    data: number[];
  };
  demographics: {
    countries: { name: string; users: number; percentage: number }[];
    devices: { name: string; users: number; percentage: number }[];
    ages: { range: string; users: number; percentage: number }[];
  };
  realTimeStats: {
    activeUsers: number;
    tasksCompleted: number;
    earningsToday: number;
    withdrawalsToday: number;
  };
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('7d');
  const [activeChart, setActiveChart] = useState<'users' | 'tasks' | 'earnings' | 'withdrawals'>('users');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData: AnalyticsData = {
        userGrowth: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [120, 150, 180, 220, 190, 250, 280]
        },
        taskCompletion: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [450, 520, 480, 600, 580, 720, 650]
        },
        earnings: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [1200, 1450, 1380, 1600, 1520, 1800, 1650]
        },
        withdrawals: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [800, 950, 920, 1100, 1050, 1200, 1150]
        },
        demographics: {
          countries: [
            { name: '🇺🇸 United States', users: 4520, percentage: 29.3 },
            { name: '🇬🇧 United Kingdom', users: 2340, percentage: 15.2 },
            { name: '🇩🇪 Germany', users: 1890, percentage: 12.3 },
            { name: '🇫🇷 France', users: 1560, percentage: 10.1 },
            { name: '🇯🇵 Japan', users: 1230, percentage: 8.0 },
            { name: '🇰🇷 South Korea', users: 980, percentage: 6.4 },
            { name: '🇨🇦 Canada', users: 890, percentage: 5.8 },
            { name: '🇦🇺 Australia', users: 720, percentage: 4.7 },
            { name: '🇧🇷 Brazil', users: 650, percentage: 4.2 },
            { name: '🇮🇳 India', users: 630, percentage: 4.1 }
          ],
          devices: [
            { name: 'Mobile', users: 9840, percentage: 63.8 },
            { name: 'Desktop', users: 4320, percentage: 28.0 },
            { name: 'Tablet', users: 1260, percentage: 8.2 }
          ],
          ages: [
            { range: '18-24', users: 4680, percentage: 30.4 },
            { range: '25-34', users: 5850, percentage: 38.0 },
            { range: '35-44', users: 3120, percentage: 20.3 },
            { range: '45-54', users: 1170, percentage: 7.6 },
            { range: '55+', users: 600, percentage: 3.9 }
          ]
        },
        realTimeStats: {
          activeUsers: 1247,
          tasksCompleted: 89,
          earningsToday: 2340.50,
          withdrawalsToday: 1890.25
        }
      };

      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const metricCards: MetricCard[] = [
    {
      title: 'Total Users',
      value: '15,420',
      change: '+12.5%',
      changeType: 'positive',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-400'
    },
    {
      title: 'Active Users',
      value: '8,930',
      change: '+8.3%',
      changeType: 'positive',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-green-400'
    },
    {
      title: 'Total Earnings',
      value: '$125,430',
      change: '+15.7%',
      changeType: 'positive',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-yellow-400'
    },
    {
      title: 'Tasks Completed',
      value: '89,340',
      change: '+22.1%',
      changeType: 'positive',
      icon: <Target className="w-6 h-6" />,
      color: 'text-purple-400'
    },
    {
      title: 'Avg. Session Time',
      value: '12m 34s',
      change: '+5.2%',
      changeType: 'positive',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-cyan-400'
    },
    {
      title: 'Conversion Rate',
      value: '68.5%',
      change: '-2.1%',
      changeType: 'negative',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-400'
    },
    {
      title: 'New Users Today',
      value: '156',
      change: '+18.9%',
      changeType: 'positive',
      icon: <UserPlus className="w-6 h-6" />,
      color: 'text-pink-400'
    },
    {
      title: 'Churn Rate',
      value: '3.2%',
      change: '-0.8%',
      changeType: 'positive',
      icon: <UserMinus className="w-6 h-6" />,
      color: 'text-red-400'
    }
  ];

  const chartData = analyticsData ? {
    users: analyticsData.userGrowth,
    tasks: analyticsData.taskCompletion,
    earnings: analyticsData.earnings,
    withdrawals: analyticsData.withdrawals
  }[activeChart] : null;

  const exportData = () => {
    if (!analyticsData) return;
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `itonzi-analytics-${timeRange}.json`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
            <p className="text-cyan-100">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button
              onClick={loadAnalyticsData}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={exportData}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      {analyticsData && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Real-time Activity
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{analyticsData.realTimeStats.activeUsers}</div>
              <div className="text-gray-400 text-sm">Users Online</div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mt-2"></div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{analyticsData.realTimeStats.tasksCompleted}</div>
              <div className="text-gray-400 text-sm">Tasks Today</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">${analyticsData.realTimeStats.earningsToday}</div>
              <div className="text-gray-400 text-sm">Earnings Today</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">${analyticsData.realTimeStats.withdrawalsToday}</div>
              <div className="text-gray-400 text-sm">Withdrawals Today</div>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={metric.color}>
                {metric.icon}
              </div>
              <div className={`text-sm font-bold ${
                metric.changeType === 'positive' ? 'text-green-400' :
                metric.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {metric.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-gray-400 text-sm">{metric.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 break-words whitespace-normal lg:col-span-2 overflow-x-auto min-w-[400px] sm:min-w-0">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h3 className="text-white font-bold text-lg break-words whitespace-normal">Trends Overview</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'users', label: 'Users', color: 'bg-blue-600' },
                { id: 'tasks', label: 'Tasks', color: 'bg-green-600' },
                { id: 'earnings', label: 'Earnings', color: 'bg-yellow-600' },
                { id: 'withdrawals', label: 'Withdrawals', color: 'bg-red-600' }
              ].map((chart) => (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeChart === chart.id
                      ? `${chart.color} text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {chart.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Simple Chart Visualization */}
          {chartData && (
            <div className="h-64 flex items-end justify-between gap-2 min-w-[350px] sm:min-w-0">
              {chartData.data.map((value, index) => {
                const maxValue = Math.max(...chartData.data);
                const height = (value / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center min-w-0">
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        activeChart === 'users' ? 'bg-blue-600' :
                        activeChart === 'tasks' ? 'bg-green-600' :
                        activeChart === 'earnings' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-gray-400 text-xs mt-2 truncate w-full text-center">{chartData.labels[index]}</div>
                    <div className="text-white text-sm font-bold truncate w-full text-center">{value}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Demographics */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Countries */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {analyticsData.demographics.countries.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-400 h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">{country.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-400" />
              Device Types
            </h3>
            <div className="space-y-4">
              {analyticsData.demographics.devices.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {device.name === 'Mobile' && <Smartphone className="w-4 h-4 text-green-400" />}
                      {device.name === 'Desktop' && <Monitor className="w-4 h-4 text-blue-400" />}
                      {device.name === 'Tablet' && <Smartphone className="w-4 h-4 text-purple-400" />}
                      <span className="text-white text-sm">{device.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{device.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        device.name === 'Mobile' ? 'bg-green-400' :
                        device.name === 'Desktop' ? 'bg-blue-400' : 'bg-purple-400'
                      }`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Age Groups
            </h3>
            <div className="space-y-3">
              {analyticsData.demographics.ages.map((age, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white text-sm">{age.range}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-400 h-2 rounded-full"
                        style={{ width: `${age.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">{age.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Insights */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-white font-bold text-lg mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-1">✓ Strong Performance</div>
            <div className="text-white text-sm">User engagement is 23% above average</div>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-sm mb-1">⚠ Needs Attention</div>
            <div className="text-white text-sm">Task completion rate declined 5%</div>
          </div>
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
            <div className="text-blue-400 font-bold text-sm mb-1">📈 Growing</div>
            <div className="text-white text-sm">New user registrations up 18%</div>
          </div>
          <div className="bg-purple-600/20 border border-purple-600/50 rounded-lg p-4">
            <div className="text-purple-400 font-bold text-sm mb-1">🎯 Opportunity</div>
            <div className="text-white text-sm">Mobile usage can be optimized</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;