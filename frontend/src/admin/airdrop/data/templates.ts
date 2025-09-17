export interface NoticeTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'welcome' | 'reward' | 'reminder' | 'announcement' | 'warning' | 'custom';
  description: string;
  variables?: string[];
}

export const mockNoticeTemplates: NoticeTemplate[] = [
  {
    id: 'welcome-new-user',
    name: 'Welcome New User',
    title: 'Welcome to iTonzi Airdrop! 🎉',
    message: 'Welcome to the iTonzi airdrop program! We\'re excited to have you join our community. Complete your profile and start earning points by participating in our tasks and activities.',
    type: 'success',
    priority: 'medium',
    category: 'welcome',
    description: 'Send to new users when they join the airdrop program',
    variables: ['username', 'referralCode']
  },
  {
    id: 'points-earned',
    name: 'Points Earned',
    title: 'Congratulations! You earned {points} points! 🎯',
    message: 'Great job! You have successfully earned {points} points by completing {taskName}. Keep up the good work and continue participating to earn more rewards.',
    type: 'success',
    priority: 'medium',
    category: 'reward',
    description: 'Notify users when they earn points from tasks',
    variables: ['points', 'taskName', 'totalPoints']
  },
  {
    id: 'profile-reminder',
    name: 'Complete Profile Reminder',
    title: 'Complete Your Profile 📝',
    message: 'Don\'t forget to complete your profile! A complete profile helps us verify your account and ensures you receive all your rewards. Missing information may delay your withdrawals.',
    type: 'warning',
    priority: 'high',
    category: 'reminder',
    description: 'Remind users to complete their profile information',
    variables: ['missingFields']
  },
  {
    id: 'kyc-required',
    name: 'KYC Verification Required',
    title: 'KYC Verification Required 🔐',
    message: 'To continue earning rewards and make withdrawals, please complete your KYC (Know Your Customer) verification. This is required for compliance and security purposes.',
    type: 'warning',
    priority: 'high',
    category: 'reminder',
    description: 'Notify users that KYC verification is required',
    variables: ['deadline']
  },
  {
    id: 'withdrawal-success',
    name: 'Withdrawal Successful',
    title: 'Withdrawal Successful! 💰',
    message: 'Your withdrawal of {amount} {currency} has been processed successfully. The funds should appear in your wallet within 24-48 hours. Transaction ID: {txId}',
    type: 'success',
    priority: 'medium',
    category: 'reward',
    description: 'Confirm successful withdrawal to users',
    variables: ['amount', 'currency', 'txId', 'walletAddress']
  },
  {
    id: 'withdrawal-failed',
    name: 'Withdrawal Failed',
    title: 'Withdrawal Failed ❌',
    message: 'Your withdrawal of {amount} {currency} has failed. Reason: {reason}. Please check your wallet address and try again. If the problem persists, contact support.',
    type: 'error',
    priority: 'urgent',
    category: 'warning',
    description: 'Notify users of failed withdrawal attempts',
    variables: ['amount', 'currency', 'reason', 'supportTicket']
  },
  {
    id: 'referral-bonus',
    name: 'Referral Bonus Earned',
    title: 'Referral Bonus Earned! 🎁',
    message: 'Congratulations! You earned a referral bonus of {bonusAmount} points because {referredUser} joined using your referral code. Keep inviting friends to earn more bonuses!',
    type: 'success',
    priority: 'medium',
    category: 'reward',
    description: 'Notify users when they earn referral bonuses',
    variables: ['bonusAmount', 'referredUser', 'totalReferrals']
  },
  {
    id: 'task-available',
    name: 'New Task Available',
    title: 'New Task Available! 📋',
    message: 'A new task "{taskName}" is now available! Complete it to earn {points} points. Task expires in {expiryTime}. Don\'t miss out on this opportunity!',
    type: 'info',
    priority: 'medium',
    category: 'announcement',
    description: 'Notify users about new available tasks',
    variables: ['taskName', 'points', 'expiryTime', 'taskUrl']
  },
  {
    id: 'maintenance-notice',
    name: 'System Maintenance',
    title: 'Scheduled Maintenance Notice 🔧',
    message: 'We will be performing scheduled maintenance on {date} from {startTime} to {endTime}. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.',
    type: 'warning',
    priority: 'high',
    category: 'announcement',
    description: 'Notify users about scheduled maintenance',
    variables: ['date', 'startTime', 'endTime', 'affectedFeatures']
  },
  {
    id: 'security-alert',
    name: 'Security Alert',
    title: 'Security Alert - Account Verification Required 🔒',
    message: 'We detected unusual activity on your account. For your security, please verify your identity by completing additional verification steps. This is a precautionary measure.',
    type: 'error',
    priority: 'urgent',
    category: 'warning',
    description: 'Alert users about security concerns',
    variables: ['verificationSteps', 'supportContact']
  },
  {
    id: 'airdrop-launch',
    name: 'Airdrop Launch Announcement',
    title: 'iTonzi Airdrop is Now Live! 🚀',
    message: 'The iTonzi airdrop program is officially launched! Join thousands of users earning rewards. Complete tasks, invite friends, and build your points balance. Start earning today!',
    type: 'announcement',
    priority: 'high',
    category: 'announcement',
    description: 'Announce the launch of the airdrop program',
    variables: ['launchDate', 'totalRewards', 'participantCount']
  },
  {
    id: 'custom-notice',
    name: 'Custom Notice',
    title: '{customTitle}',
    message: '{customMessage}',
    type: 'info',
    priority: 'medium',
    category: 'custom',
    description: 'Template for custom notices',
    variables: ['customTitle', 'customMessage']
  }
];

// Utility functions for templates
export const getTemplateById = (id: string): NoticeTemplate | undefined => {
  return mockNoticeTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): NoticeTemplate[] => {
  return mockNoticeTemplates.filter(template => template.category === category);
};

export const getTemplatesByType = (type: string): NoticeTemplate[] => {
  return mockNoticeTemplates.filter(template => template.type === type);
};

export const searchTemplates = (query: string): NoticeTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return mockNoticeTemplates.filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.title.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.category.toLowerCase().includes(lowerQuery)
  );
}; 