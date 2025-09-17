import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Save, X, Search, Copy, Star, Zap, Crown, Award, Calendar, Users as UsersIcon, MessageCircle, Heart, Target as TargetIcon, CheckCircle, AlertTriangle, ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'social' | 'referral' | 'daily' | 'special' | 'community';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  category: string;
  timeLimit?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  completionCount: number;
  maxCompletions?: number;
  requirements?: string[];
  externalUrl?: string;
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultReward: number;
  type: string;
  difficulty: string;
  category: string;
}

const taskTemplates: TaskTemplate[] = [
  {
    id: '1',
    name: 'Social Media Follow',
    description: 'Follow our social media accounts',
    defaultReward: 50,
    type: 'social',
    difficulty: 'easy',
    category: 'Social Media'
  },
  {
    id: '2',
    name: 'Daily Check-in',
    description: 'Complete daily check-in',
    defaultReward: 25,
    type: 'daily',
    difficulty: 'easy',
    category: 'Daily Tasks'
  },
  {
    id: '3',
    name: 'Referral Program',
    description: 'Invite friends to join',
    defaultReward: 200,
    type: 'referral',
    difficulty: 'medium',
    category: 'Referral Program'
  },
  {
    id: '4',
    name: 'Community Engagement',
    description: 'Participate in community activities',
    defaultReward: 100,
    type: 'community',
    difficulty: 'medium',
    category: 'Community'
  }
];

const defaultTasks: Task[] = [
  {
    id: 1,
    title: 'Join iTonzi Community',
    description: 'Join our Telegram channel and become part of our growing community',
    reward: 100,
    completed: false,
    type: 'social',
    difficulty: 'easy',
    category: 'Social Media',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 1250,
    requirements: ['Join Telegram channel', 'Verify membership'],
    externalUrl: 'https://t.me/iTonziCommunity'
  },
  {
    id: 2,
    title: 'Daily Check-in Streak',
    description: 'Check in daily for 7 consecutive days to earn bonus rewards',
    reward: 50,
    completed: false,
    type: 'daily',
    difficulty: 'easy',
    category: 'Daily Tasks',
    timeLimit: '24h',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 890,
    maxCompletions: 1000
  },
  {
    id: 3,
    title: 'Invite 5 Friends',
    description: 'Share iTonzi with friends and earn massive rewards for each referral',
    reward: 500,
    completed: false,
    type: 'referral',
    difficulty: 'hard',
    category: 'Referral Program',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 420,
    requirements: ['Invite 5 friends', 'Friends must register'],
    externalUrl: ''
  },
  {
    id: 4,
    title: 'Watch 10 Ads Today',
    description: 'Watch 10 advertisement videos to earn daily rewards',
    reward: 25,
    completed: false,
    type: 'daily',
    difficulty: 'medium',
    category: 'Daily Tasks',
    timeLimit: '24h',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 1560,
    maxCompletions: 2000
  },
  {
    id: 5,
    title: 'Share on Social Media',
    description: 'Share iTonzi on your social media accounts',
    reward: 75,
    completed: false,
    type: 'social',
    difficulty: 'medium',
    category: 'Social Media',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 780,
    requirements: ['Share on Twitter', 'Share on Facebook', 'Share on Instagram']
  },
  {
    id: 6,
    title: 'Complete Profile',
    description: 'Fill out your complete profile information',
    reward: 30,
    completed: false,
    type: 'daily',
    difficulty: 'easy',
    category: 'Profile Setup',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 2340,
    requirements: ['Add profile picture', 'Add bio', 'Add social links']
  },
  {
    id: 7,
    title: 'Connect Wallet',
    description: 'Connect your cryptocurrency wallet to start earning',
    reward: 200,
    completed: false,
    type: 'special',
    difficulty: 'medium',
    category: 'Wallet Integration',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 650,
    requirements: ['Connect MetaMask', 'Verify wallet address']
  }
];

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive' | 'completed'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'legendary'>('all');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    reward: 0,
    type: 'daily',
    difficulty: 'easy',
    category: '',
    timeLimit: '',
    isActive: true,
    requirements: [],
    externalUrl: ''
  });

  useEffect(() => {
    // Load tasks from localStorage or set default tasks
    const savedTasks = localStorage.getItem('airdropTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Check if saved tasks have the new tasks, if not, use default tasks
        if (parsedTasks.length < 7) {
          setTasks(defaultTasks);
          localStorage.setItem('airdropTasks', JSON.stringify(defaultTasks));
        } else {
          setTasks(parsedTasks);
        }
      } catch (error) {
        setTasks(defaultTasks);
        localStorage.setItem('airdropTasks', JSON.stringify(defaultTasks));
      }
    } else {
      setTasks(defaultTasks);
      localStorage.setItem('airdropTasks', JSON.stringify(defaultTasks));
    }
  }, []);

  useEffect(() => {
    // Filter tasks based on search and filters
    let filtered = tasks;
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(task => {
        switch (filterType) {
          case 'active': return task.isActive;
          case 'inactive': return !task.isActive;
          case 'completed': return task.completed;
          default: return true;
        }
      });
    }
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(task => task.difficulty === filterDifficulty);
    }
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterType, filterDifficulty]);

  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('airdropTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) return;
    const task: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      title: newTask.title!,
      description: newTask.description!,
      reward: newTask.reward || 0,
      completed: false,
      type: newTask.type as Task['type'],
      difficulty: newTask.difficulty as Task['difficulty'],
      category: newTask.category || '',
      timeLimit: newTask.timeLimit,
      isActive: newTask.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionCount: 0,
      requirements: newTask.requirements || [],
      externalUrl: newTask.externalUrl || ''
    };
    setTasks([...tasks, task]);
    setShowCreateModal(false);
    setNewTask({
      title: '',
      description: '',
      reward: 0,
      type: 'daily',
      difficulty: 'easy',
      category: '',
      timeLimit: '',
      isActive: true,
      requirements: [],
      externalUrl: ''
    });
  };

  const handleEditTask = () => {
    if (!selectedTask) return;
    setTasks(tasks => tasks.map(t => t.id === selectedTask.id ? selectedTask : t));
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks => tasks.filter(t => t.id !== taskId));
  };

  const handleToggleActive = (taskId: number) => {
    setTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, isActive: !t.isActive } : t));
  };

  const handleDuplicateTask = (task: Task) => {
    const newTask = { ...task, id: Math.max(0, ...tasks.map(t => t.id)) + 1, title: task.title + ' (Copy)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTasks([...tasks, newTask]);
  };

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      reward: 0,
      type: 'daily',
      difficulty: 'easy',
      category: '',
      timeLimit: '',
      isActive: true,
      requirements: [],
      externalUrl: ''
    });
  };

  const applyTemplate = (template: TaskTemplate) => {
    setNewTask({
      title: template.name,
      description: template.description,
      reward: template.defaultReward,
      type: template.type as Task['type'],
      difficulty: template.difficulty as Task['difficulty'],
      category: template.category,
      isActive: true,
      requirements: [],
      externalUrl: ''
    });
    setShowCreateModal(true);
  };

  // Stats
  const totalTasks = tasks.length;
  const totalCompleted = tasks.reduce((sum, t) => sum + t.completionCount, 0);
  const totalActive = tasks.filter(t => t.isActive).length;

  return (
    <div className="bg-gray-900 min-h-screen p-3 sm:p-4 md:p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Airdrop Tasks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setTasks(defaultTasks);
              localStorage.setItem('airdropTasks', JSON.stringify(defaultTasks));
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base"
            title="Reset to default tasks"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" /> Reset Tasks
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Create New Task
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Tasks</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{totalTasks}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Completed</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{totalCompleted}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Active Tasks</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">{totalActive}</div>
        </div>
      </div>

      {/* Task List Section Header */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Task List</h2>
            <p className="text-gray-400 text-sm">Manage and organize your airdrop tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
              {filteredTasks.length} of {totalTasks} tasks
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm w-full sm:w-48"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterDifficulty}
            onChange={e => setFilterDifficulty(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg text-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
      </div>
      {/* Tasks Table - Desktop */}
      <div className="hidden md:block overflow-x-auto mb-6 sm:mb-8">
        <table className="min-w-full bg-gray-800 rounded-xl border border-gray-700">
          <thead>
            <tr className="bg-gray-700/50">
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Task Details</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type & Category</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Difficulty</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Reward & Stats</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <div className="text-white font-medium mb-1">{task.title}</div>
                    <div className="text-gray-400 text-sm line-clamp-2">{task.description}</div>
                    {task.requirements && task.requirements.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Requirements: {task.requirements.join(', ')}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.type === 'social' ? 'bg-blue-500/20 text-blue-300' :
                        task.type === 'referral' ? 'bg-green-500/20 text-green-300' :
                        task.type === 'daily' ? 'bg-yellow-500/20 text-yellow-300' :
                        task.type === 'special' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {task.type}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">{task.category}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                      task.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      task.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {task.difficulty}
                    </span>
                    {task.timeLimit && (
                      <span className="text-xs text-gray-500">({task.timeLimit})</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-white font-medium">{task.reward} points</div>
                    <div className="text-gray-400 text-sm">
                      {task.completionCount} completions
                      {task.maxCompletions && ` / ${task.maxCompletions} max`}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleActive(task.id)} title="Toggle Status" className="hover:scale-110 transition-transform">
                    {task.isActive ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <ToggleRight className="w-5 h-5 text-green-400" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedTask(task); setShowEditModal(true); }}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateTask(task)}
                      className="p-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white transition-colors"
                      title="Duplicate Task"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tasks Cards - Mobile */}
      <div className="md:hidden space-y-3 mb-6 sm:mb-8">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-gray-800 rounded-xl border border-gray-700 p-3 sm:p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm sm:text-base truncate mb-1">{task.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{task.description}</p>
                {task.requirements && task.requirements.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Requirements: {task.requirements.join(', ')}
                  </div>
                )}
              </div>
              <button onClick={() => handleToggleActive(task.id)} title="Toggle Status" className="ml-2 flex-shrink-0 hover:scale-110 transition-transform">
                {task.isActive ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <ToggleRight className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <ToggleLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </div>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.type === 'social' ? 'bg-blue-500/20 text-blue-300' :
                    task.type === 'referral' ? 'bg-green-500/20 text-green-300' :
                    task.type === 'daily' ? 'bg-yellow-500/20 text-yellow-300' :
                    task.type === 'special' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {task.type}
                  </span>
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-1">{task.category}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                    task.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    task.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {task.difficulty}
                  </span>
                  {task.timeLimit && (
                    <span className="text-xs text-gray-500">({task.timeLimit})</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="text-gray-400">Reward:</span>
                  <span className="text-white ml-1 font-medium">{task.reward} points</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-3">
              {task.completionCount} completions
              {task.maxCompletions && ` / ${task.maxCompletions} max`}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setSelectedTask(task); setShowEditModal(true); }}
                className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm transition-colors"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm transition-colors"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Delete
              </button>
              <button
                onClick={() => handleDuplicateTask(task)}
                className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white text-xs sm:text-sm transition-colors"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Task Templates */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-2">Task Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {taskTemplates.map(template => (
            <div key={template.id} className="bg-gray-800 p-3 sm:p-4 rounded-xl border border-gray-700">
              <div className="font-bold text-white mb-1 text-sm sm:text-base">{template.name}</div>
              <div className="text-gray-400 text-xs sm:text-sm mb-2">{template.description}</div>
              <div className="text-xs text-gray-500 mb-2">Type: {template.type}, Difficulty: {template.difficulty}</div>
              <button
                onClick={() => applyTemplate(template)}
                className="w-full px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs sm:text-sm font-medium"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Create New Task</h2>
            <form onSubmit={e => { e.preventDefault(); handleCreateTask(); }} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Reward</label>
                  <input
                    type="number"
                    value={newTask.reward}
                    onChange={e => setNewTask({ ...newTask, reward: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Category</label>
                  <input
                    type="text"
                    value={newTask.category}
                    onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Type</label>
                  <select
                    value={newTask.type}
                    onChange={e => setNewTask({ ...newTask, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="social">Social</option>
                    <option value="referral">Referral</option>
                    <option value="daily">Daily</option>
                    <option value="special">Special</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Difficulty</label>
                  <select
                    value={newTask.difficulty}
                    onChange={e => setNewTask({ ...newTask, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Time Limit</label>
                <input
                  type="text"
                  value={newTask.timeLimit}
                  onChange={e => setNewTask({ ...newTask, timeLimit: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="e.g. 24h, 7d"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Requirements (comma separated)</label>
                <input
                  type="text"
                  value={newTask.requirements?.join(', ') || ''}
                  onChange={e => setNewTask({ ...newTask, requirements: e.target.value.split(',').map(r => r.trim()) })}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="e.g. Join Telegram, Verify Email"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">External URL</label>
                <input
                  type="text"
                  value={newTask.externalUrl}
                  onChange={e => setNewTask({ ...newTask, externalUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetNewTask(); }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Edit Task</h2>
            <form onSubmit={e => { e.preventDefault(); handleEditTask(); }} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={e => setSelectedTask({ ...selectedTask, title: e.target.value } as Task)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                  value={selectedTask.description}
                  onChange={e => setSelectedTask({ ...selectedTask, description: e.target.value } as Task)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-gray-400 mb-1">Reward</label>
                  <input
                    type="number"
                    value={selectedTask.reward}
                    onChange={e => setSelectedTask({ ...selectedTask, reward: Number(e.target.value) } as Task)}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                    min={1}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={selectedTask.category}
                    onChange={e => setSelectedTask({ ...selectedTask, category: e.target.value } as Task)}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-gray-400 mb-1">Type</label>
                  <select
                    value={selectedTask.type}
                    onChange={e => setSelectedTask({ ...selectedTask, type: e.target.value as any } as Task)}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="social">Social</option>
                    <option value="referral">Referral</option>
                    <option value="daily">Daily</option>
                    <option value="special">Special</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={selectedTask.difficulty}
                    onChange={e => setSelectedTask({ ...selectedTask, difficulty: e.target.value as any } as Task)}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Time Limit</label>
                <input
                  type="text"
                  value={selectedTask.timeLimit}
                  onChange={e => setSelectedTask({ ...selectedTask, timeLimit: e.target.value } as Task)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 24h, 7d"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Requirements (comma separated)</label>
                <input
                  type="text"
                  value={selectedTask.requirements?.join(', ') || ''}
                  onChange={e => setSelectedTask({ ...selectedTask, requirements: e.target.value.split(',').map(r => r.trim()) } as Task)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Join Telegram, Verify Email"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">External URL</label>
                <input
                  type="text"
                  value={selectedTask.externalUrl}
                  onChange={e => setSelectedTask({ ...selectedTask, externalUrl: e.target.value } as Task)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedTask(null); }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks; 