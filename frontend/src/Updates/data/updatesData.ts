export interface Update {
  id: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'announcement' | 'event';
  title: string;
  description: string;
  date: string;
  version?: string;
  status: 'new' | 'active' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  date: string;
  urgent: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export interface RoadmapItem {
  quarter: string;
  items: {
    title: string;
    status: 'in-progress' | 'planned' | 'research';
    description: string;
  }[];
}

export const updates: Update[] = [
  {
    id: '1',
    type: 'feature',
    title: 'New Airdrop System',
    description: 'Introducing a comprehensive airdrop system with tasks, referrals, and leaderboards. Earn more coins through various activities!',
    date: '2024-01-15',
    version: 'v2.1.0',
    status: 'new',
    priority: 'high',
    tags: ['airdrop', 'earning', 'tasks']
  },
  {
    id: '2',
    type: 'improvement',
    title: 'Enhanced Payment System',
    description: 'Improved withdrawal processing with faster TON wallet transactions and better security measures.',
    date: '2024-01-14',
    version: 'v2.0.5',
    status: 'active',
    priority: 'medium',
    tags: ['payments', 'security', 'performance']
  },
  {
    id: '3',
    type: 'event',
    title: 'Weekly Competition Launch',
    description: 'Join our weekly leaderboard competition! Top performers win exclusive rewards and badges.',
    date: '2024-01-13',
    status: 'active',
    priority: 'high',
    tags: ['competition', 'rewards', 'leaderboard']
  },
  {
    id: '4',
    type: 'bugfix',
    title: 'Auto Ads Stability Fix',
    description: 'Fixed issues with auto ads not counting properly and improved overall stability.',
    date: '2024-01-12',
    version: 'v2.0.4',
    status: 'completed',
    priority: 'medium',
    tags: ['bugfix', 'ads', 'stability']
  },
  {
    id: '5',
    type: 'feature',
    title: 'Referral System Upgrade',
    description: 'Enhanced referral tracking with real-time statistics and bonus multipliers for active referrals.',
    date: '2024-01-11',
    version: 'v2.0.3',
    status: 'completed',
    priority: 'medium',
    tags: ['referral', 'tracking', 'bonuses']
  },
  {
    id: '6',
    type: 'announcement',
    title: 'Maintenance Schedule',
    description: 'Scheduled maintenance on January 20th from 2-4 AM UTC for system upgrades.',
    date: '2024-01-10',
    status: 'active',
    priority: 'low',
    tags: ['maintenance', 'schedule']
  }
];

export const announcements: Announcement[] = [
  {
    id: '1',
    title: '🎉 New Year Bonus Event!',
    message: 'Celebrate the new year with us! Double earnings on all activities until January 31st. Plus, complete special New Year tasks for exclusive rewards!',
    type: 'promotion',
    date: '2024-01-01',
    urgent: true,
    action: {
      label: 'Join Event',
      url: '#'
    }
  },
  {
    id: '2',
    title: '⚠️ Important Security Update',
    message: 'We\'ve implemented additional security measures to protect your account. Please review your account settings and enable two-factor authentication if you haven\'t already.',
    type: 'warning',
    date: '2024-01-14',
    urgent: false,
    action: {
      label: 'Update Settings',
      url: '#'
    }
  },
  {
    id: '3',
    title: '💰 Increased Withdrawal Limits',
    message: 'Good news! We\'ve increased daily withdrawal limits for verified users. Check your account to see your new limits.',
    type: 'success',
    date: '2024-01-13',
    urgent: false
  },
  {
    id: '4',
    title: '📱 Mobile App Coming Soon',
    message: 'We\'re working on a dedicated mobile app for iOS and Android. Stay tuned for updates and be among the first to try it!',
    type: 'info',
    date: '2024-01-12',
    urgent: false
  }
];

export const roadmapItems: RoadmapItem[] = [
  {
    quarter: 'Q1 2024',
    items: [
      { title: 'Mobile App Release', status: 'in-progress', description: 'Native iOS and Android applications' },
      { title: 'Advanced Analytics', status: 'planned', description: 'Detailed earning statistics and insights' },
      { title: 'Social Features', status: 'planned', description: 'Friend system and social interactions' }
    ]
  },
  {
    quarter: 'Q2 2024',
    items: [
      { title: 'NFT Integration', status: 'planned', description: 'Earn and trade exclusive NFTs' },
      { title: 'Staking System', status: 'planned', description: 'Stake coins for passive income' },
      { title: 'Premium Membership', status: 'planned', description: 'Exclusive benefits for premium users' }
    ]
  },
  {
    quarter: 'Q3 2024',
    items: [
      { title: 'DeFi Integration', status: 'research', description: 'Connect with DeFi protocols' },
      { title: 'Governance Token', status: 'research', description: 'Community governance system' },
      { title: 'Cross-chain Support', status: 'research', description: 'Support for multiple blockchains' }
    ]
  }
]; 