export interface AirdropTask {
  id: number;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'social' | 'referral' | 'daily' | 'special' | 'community';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  category: string;
  timeLimit?: string;
  isActive?: boolean;
  requirements?: string[];
  externalUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  completionCount?: number;
  maxCompletions?: number;
}

export interface LeaderboardUser {
  id: number;
  username: string;
  coins: number;
  rank: number;
  avatar: string;
  level: number;
}

export interface ReferralData {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  referralCode: string;
  referralLink: string;
}

export interface AirdropStats {
  totalTasks: number;
  completedTasks: number;
  totalEarned: number;
  currentBalance: number;
  rank: number;
  level: number;
} 