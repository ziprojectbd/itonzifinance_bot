export interface AirdropUser {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'banned';
  points: number;
  claimed: number;
  joinedAt: string;
  lastActive: string;
  walletAddress?: string;
  referralCode?: string;
  referredBy?: string;
  totalReferrals: number;
  kycStatus: 'pending' | 'verified' | 'rejected';
  country?: string;
  timezone?: string;
}

export const mockAirdropUsers: AirdropUser[] = [
  {
    id: 'U001',
    username: 'CryptoKing',
    email: 'cryptoking@example.com',
    status: 'active',
    points: 3200,
    claimed: 5,
    joinedAt: '2024-01-15',
    lastActive: '2024-06-01 14:30',
    walletAddress: 'EQD...abc123',
    referralCode: 'CRYPTOKING',
    totalReferrals: 12,
    kycStatus: 'verified',
    country: 'United States',
    timezone: 'UTC-5'
  },
  {
    id: 'U002',
    username: 'TonMaster',
    email: 'tonmaster@example.com',
    status: 'active',
    points: 2950,
    claimed: 4,
    joinedAt: '2024-01-20',
    lastActive: '2024-06-01 13:45',
    walletAddress: 'EQD...def456',
    referralCode: 'TONMASTER',
    totalReferrals: 8,
    kycStatus: 'verified',
    country: 'Germany',
    timezone: 'UTC+1'
  },
  {
    id: 'U003',
    username: 'AirdropHunter',
    email: 'airdrop@example.com',
    status: 'banned',
    points: 2780,
    claimed: 6,
    joinedAt: '2024-02-01',
    lastActive: '2024-05-28 09:15',
    walletAddress: 'EQD...ghi789',
    referralCode: 'AIRDROP',
    totalReferrals: 15,
    kycStatus: 'rejected',
    country: 'Russia',
    timezone: 'UTC+3'
  },
  {
    id: 'U004',
    username: 'DiamondHands',
    email: 'diamond@example.com',
    status: 'active',
    points: 2500,
    claimed: 3,
    joinedAt: '2024-02-10',
    lastActive: '2024-06-01 16:20',
    walletAddress: 'EQD...jkl012',
    referralCode: 'DIAMOND',
    totalReferrals: 5,
    kycStatus: 'verified',
    country: 'Canada',
    timezone: 'UTC-4'
  },
  {
    id: 'U005',
    username: 'MoonWalker',
    email: 'moon@example.com',
    status: 'active',
    points: 2300,
    claimed: 2,
    joinedAt: '2024-02-15',
    lastActive: '2024-06-01 11:30',
    walletAddress: 'EQD...mno345',
    referralCode: 'MOON',
    totalReferrals: 3,
    kycStatus: 'pending',
    country: 'Australia',
    timezone: 'UTC+10'
  },
  {
    id: 'U006',
    username: 'TestUser',
    email: 'test@example.com',
    status: 'banned',
    points: 1200,
    claimed: 1,
    joinedAt: '2024-03-01',
    lastActive: '2024-05-25 18:45',
    walletAddress: 'EQD...pqr678',
    referralCode: 'TEST',
    totalReferrals: 0,
    kycStatus: 'rejected',
    country: 'Unknown',
    timezone: 'UTC+0'
  },
  {
    id: 'U007',
    username: 'CryptoWhale',
    email: 'whale@example.com',
    status: 'active',
    points: 4500,
    claimed: 8,
    joinedAt: '2024-01-05',
    lastActive: '2024-06-01 15:10',
    walletAddress: 'EQD...stu901',
    referralCode: 'WHALE',
    totalReferrals: 25,
    kycStatus: 'verified',
    country: 'Singapore',
    timezone: 'UTC+8'
  },
  {
    id: 'U008',
    username: 'BlockchainDev',
    email: 'dev@example.com',
    status: 'active',
    points: 3800,
    claimed: 6,
    joinedAt: '2024-01-12',
    lastActive: '2024-06-01 12:00',
    walletAddress: 'EQD...vwx234',
    referralCode: 'DEV',
    totalReferrals: 18,
    kycStatus: 'verified',
    country: 'Netherlands',
    timezone: 'UTC+1'
  },
  {
    id: 'U009',
    username: 'TokenTrader',
    email: 'trader@example.com',
    status: 'active',
    points: 2100,
    claimed: 4,
    joinedAt: '2024-02-20',
    lastActive: '2024-06-01 10:15',
    walletAddress: 'EQD...yza567',
    referralCode: 'TRADER',
    totalReferrals: 7,
    kycStatus: 'verified',
    country: 'United Kingdom',
    timezone: 'UTC+0'
  },
  {
    id: 'U010',
    username: 'DeFiExplorer',
    email: 'defi@example.com',
    status: 'active',
    points: 1800,
    claimed: 2,
    joinedAt: '2024-03-05',
    lastActive: '2024-06-01 09:30',
    walletAddress: 'EQD...bcd890',
    referralCode: 'DEFI',
    totalReferrals: 4,
    kycStatus: 'pending',
    country: 'France',
    timezone: 'UTC+1'
  }
];

// Utility functions for user data
export const getUserById = (id: string): AirdropUser | undefined => {
  return mockAirdropUsers.find(user => user.id === id);
};

export const getActiveUsers = (): AirdropUser[] => {
  return mockAirdropUsers.filter(user => user.status === 'active');
};

export const getBannedUsers = (): AirdropUser[] => {
  return mockAirdropUsers.filter(user => user.status === 'banned');
};

export const getUsersByPoints = (minPoints: number, maxPoints?: number): AirdropUser[] => {
  return mockAirdropUsers.filter(user => {
    if (maxPoints) {
      return user.points >= minPoints && user.points <= maxPoints;
    }
    return user.points >= minPoints;
  });
};

export const getUsersByKYCStatus = (status: 'pending' | 'verified' | 'rejected'): AirdropUser[] => {
  return mockAirdropUsers.filter(user => user.kycStatus === status);
};

export const searchUsers = (query: string): AirdropUser[] => {
  const lowerQuery = query.toLowerCase();
  return mockAirdropUsers.filter(user =>
    user.id.toLowerCase().includes(lowerQuery) ||
    user.username.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery) ||
    user.walletAddress?.toLowerCase().includes(lowerQuery) ||
    user.referralCode?.toLowerCase().includes(lowerQuery)
  );
}; 