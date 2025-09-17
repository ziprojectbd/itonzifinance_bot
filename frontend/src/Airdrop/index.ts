// Types
export * from './types';

// Components
export { default as AirdropModal } from './components/AirdropModal';
export { default as TaskList } from './components/TaskList';
export { default as ReferralTab } from './components/ReferralTab';
export { default as LeaderboardTab } from './components/LeaderboardTab';

// Utilities
export const getDefaultTasks = (): import('./types').AirdropTask[] => [
  {
    id: 1,
    title: 'Join iTonzi Community',
    description: 'Join our Telegram channel and become part of our growing community',
    reward: 100,
    completed: false,
    type: 'social',
    difficulty: 'easy',
    category: 'Social Media',
    isActive: true
  },
  {
    id: 2,
    title: 'Daily Check-in Streak',
    description: 'Check in daily for 7 consecutive days to earn bonus rewards',
    reward: 50,
    completed: true,
    type: 'daily',
    difficulty: 'easy',
    category: 'Daily Tasks',
    timeLimit: '24h',
    isActive: true
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
    isActive: true
  },
  {
    id: 4,
    title: 'Watch 10 Ads Today',
    description: 'Complete your daily ad viewing goal to unlock bonus coins',
    reward: 25,
    completed: false,
    type: 'daily',
    difficulty: 'medium',
    category: 'Daily Tasks',
    timeLimit: '24h',
    isActive: true
  },
  {
    id: 5,
    title: 'Share on Social Media',
    description: 'Post about iTonzi on your social media accounts',
    reward: 75,
    completed: false,
    type: 'social',
    difficulty: 'medium',
    category: 'Social Media',
    isActive: true
  },
  {
    id: 6,
    title: 'Complete Profile',
    description: 'Fill out your complete profile information',
    reward: 30,
    completed: true,
    type: 'daily',
    difficulty: 'easy',
    category: 'Profile Setup',
    isActive: true
  },
  {
    id: 7,
    title: 'Connect Wallet',
    description: 'Connect your TON wallet to secure your earnings',
    reward: 200,
    completed: false,
    type: 'special',
    difficulty: 'medium',
    category: 'Wallet Integration',
    isActive: true
  }
];

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500/20 text-green-400 border-green-400/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
    case 'hard': return 'bg-red-500/20 text-red-400 border-red-400/30';
    case 'legendary': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
  }
};

export const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '⭐';
    case 'medium': return '⚡';
    case 'hard': return '👑';
    case 'legendary': return '🏆';
    default: return '⭐';
  }
}; 