import React, { useState, useEffect, useRef } from 'react';
import { Target, Users, Trophy, Wallet, ExternalLink } from 'lucide-react';
import { AirdropTask, LeaderboardUser, ReferralData } from '../types';
import TaskList from './TaskList';
import ReferralTab from './ReferralTab';
import LeaderboardTab from './LeaderboardTab';

interface AirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  airdropTasks: AirdropTask[];
  setAirdropTasks: React.Dispatch<React.SetStateAction<AirdropTask[]>>;
  airdropBalance: number;
  setAirdropBalance: React.Dispatch<React.SetStateAction<number>>;
  walletConnected: boolean;
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletAddress: React.Dispatch<React.SetStateAction<string>>;
}

// Lightweight marquee component (no global CSS required)
const Marquee: React.FC<{ text: string; speed?: number }> = ({ text, speed = 40 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(0);
  const posRef = useRef<number>(0);

  useEffect(() => {
    const step = (now: number) => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      if (!lastRef.current) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000; // seconds
      lastRef.current = now;

      posRef.current -= speed * dt; // px per second
      const contentW = content.offsetWidth || 0;
      const containerW = container.offsetWidth || 0;
      if (posRef.current <= -contentW) {
        posRef.current = containerW;
      }
      content.style.transform = `translateX(${posRef.current}px)`;

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
    };
  }, [speed]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        ref={contentRef}
        className="whitespace-nowrap text-[10px] sm:text-xs text-yellow-300"
        style={{ willChange: 'transform' }}
      >
        {text}
      </div>
    </div>
  );
};

const AirdropModal: React.FC<AirdropModalProps> = ({
  isOpen,
  onClose,
  airdropTasks,
  setAirdropTasks,
  airdropBalance,
  setAirdropBalance,
  walletConnected,
  setWalletConnected,
  setWalletAddress
}) => {
  const [airdropTab, setAirdropTab] = useState('tasks');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const walletDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setShowWalletDropdown(false);
      }
    };

    if (showWalletDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWalletDropdown]);

  const referralData: ReferralData = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 2400,
    referralCode: 'iTONZI2025',
    referralLink: 'https://t.me/iTonziFinance_bot'
  };

  const leaderboardUsers: LeaderboardUser[] = [
    { id: 1, username: 'CryptoKing', coins: 15680, rank: 1, avatar: '👑', level: 8 },
    { id: 2, username: 'TONMaster', coins: 13450, rank: 2, avatar: '⚡', level: 7 },
    { id: 3, username: 'AirdropHunter', coins: 11250, rank: 3, avatar: '🎯', level: 6 },
    { id: 4, username: 'CoinCollector', coins: 9870, rank: 4, avatar: '💰', level: 5 },
    { id: 5, username: 'TaskMaster', coins: 8230, rank: 5, avatar: '🏆', level: 5 }
  ];

  const walletOptions = [
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      logoUrl: 'https://www.google.com/s2/favicons?domain=tonkeeper.com&sz=64',
      description: 'Official TON wallet',
      url: 'https://tonkeeper.com',
      deepLink: 'tonkeeper://connect'
    },
    {
      id: 'tonhub',
      name: 'Tonhub',
      logoUrl: 'https://www.google.com/s2/favicons?domain=tonhub.com&sz=64',
      description: 'Mobile TON wallet',
      url: 'https://tonhub.com',
      // deep link support may vary by context; fallback to URL if not available
      deepLink: 'tonhub://connect'
    },
    {
      id: 'mytonwallet',
      name: 'MyTonWallet',
      logoUrl: 'https://www.google.com/s2/favicons?domain=mytonwallet.io&sz=64',
      description: 'Browser extension wallet',
      url: 'https://mytonwallet.io'
      // no deepLink; will open site
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      logoUrl: 'https://www.google.com/s2/favicons?domain=okx.com&sz=64',
      description: 'Multi-chain wallet with TON',
      url: 'https://www.okx.com/web3'
      // no deepLink; will open site
    },
    {
      id: 'rabby',
      name: 'Rabby Wallet',
      logoUrl: 'https://www.google.com/s2/favicons?domain=rabby.io&sz=64',
      description: 'EVM browser wallet by DeBank',
      url: 'https://rabby.io'
      // no deepLink; will open site
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      logoUrl: 'https://www.google.com/s2/favicons?domain=metamask.io&sz=64',
      description: 'Popular EVM wallet',
      url: 'https://metamask.io/download/'
      // no deepLink; will open site
    },
    {
      id: 'bitget',
      name: 'Bitget Wallet',
      logoUrl: 'https://www.google.com/s2/favicons?domain=bitget.com&sz=64',
      description: 'Multi-chain wallet (formerly BitKeep)',
      url: 'https://web3.bitget.com/en/wallet'
      // no deepLink; will open site
    }
  ];

  const handleTaskComplete = (taskId: number) => {
    setAirdropTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, completed: true }
          : task
      )
    );
    const task = airdropTasks.find(t => t.id === taskId);
    if (task) {
      setAirdropBalance(prev => prev + task.reward);
    }
  };

  const connectWallet = () => {
    setWalletConnected(true);
    setWalletAddress('UQBx...7k9m');
    setAirdropTasks(prev =>
      prev.map(task =>
        task.id === 7
          ? { ...task, completed: true }
          : task
      )
    );
  };

  const handleWalletSelect = (wallet: typeof walletOptions[0]) => {
    setShowWalletDropdown(false);
    setConnectingWallet(true);
    
    // Try to open the wallet using deep link if available, else open site
    try {
      if (wallet.deepLink) {
        window.location.href = wallet.deepLink;
        // Fallback: open website after a short delay in case deep link fails silently
        setTimeout(() => {
          window.open(wallet.url, '_blank');
        }, 1000);
      } else if (wallet.url) {
        window.open(wallet.url, '_blank');
      }
    } catch (error) {
      if (wallet.url) {
        window.open(wallet.url, '_blank');
      }
    }
    
    // Simulate wallet connection after a delay
    setTimeout(() => {
      connectWallet();
      setConnectingWallet(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'legendary': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⚡';
      case 'hard': return '👑';
      case 'legendary': return '🏆';
      default: return '⭐';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black w-full h-full sm:max-w-2xl sm:h-[90vh] sm:rounded-2xl flex flex-col overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-6 pt-6 pb-3 sm:pb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 py-4 shadow-md">
              <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
                {/* Back button on the left inside header */}
                <button
                  onClick={onClose}
                  className="absolute left-2 top-2 h-6 px-2 rounded-md flex items-center justify-center border border-cyan-300/60 text-cyan-200 text-[10px] hover:bg-cyan-500/10 hover:border-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  aria-label="Back"
                >
                  Back
                </button>

                <div className="flex items-center gap-2 justify-center">
                  <h1 className="flex items-center bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                    <span className="text-3xl sm:text-4xl font-bold">iTonzi</span>
                  </h1>
                  <span
                    className="inline-block w-9 h-9 sm:w-10 sm:h-10 rounded-full"
                    style={{
                      backgroundImage: 'url(https://i.ibb.co/60Jzx0KX/complete-0-EB4-EAC6-8-F81-4-A4-B-BA22-D1-CAE9933-FF6.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></span>
                  <h1 className="flex items-center bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                    <span className="text-3xl sm:text-4xl font-bold">Airdrop</span>
                  </h1>
                </div>
                <p className="text-cyan-100 text-xs sm:text-sm mt-1">Earn • Collect • Prosper</p>
              </div>
            </header>

          </div>

          {/* Spacer to account for fixed header height */}
          <div className="pt-16 sm:pt-20"></div>
          {/* Stats Grid with Wallet Card */}
          <div className="-mx-5 mt-0 sm:mt-0.5 mb-0 sm:mb-0.5 grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-center">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 backdrop-blur-sm rounded-lg p-1 border border-yellow-400/50 hover:border-yellow-300 transition-colors shadow-sm hover:shadow-yellow-400/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400 leading-tight">
                {airdropBalance}
              </div>
              <div className="text-[10px] sm:text-xs text-cyan-100 leading-tight">Balance</div>
            </div>
            {/* Rank Card */}
            <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 backdrop-blur-sm rounded-lg p-1 border border-purple-400/50 hover:border-purple-300 transition-colors shadow-sm hover:shadow-purple-400/20">
              <div className="text-xl sm:text-2xl font-bold text-purple-400 leading-tight">42</div>
              <div className="text-[10px] sm:text-xs text-cyan-100 leading-tight">Rank</div>
            </div>
            {/* Completed Card */}
            <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 backdrop-blur-sm rounded-lg p-1 border border-green-400/50 hover:border-green-300 transition-colors shadow-sm hover:shadow-green-400/20">
              <div className="text-xl sm:text-2xl font-bold text-green-400 leading-tight">
                {airdropTasks.filter(task => task.completed).length}
              </div>
              <div className="text-[10px] sm:text-xs text-cyan-100 leading-tight">Completed</div>
            </div>
            {/* Wallet Card (moved last) */}
            <div className={`bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 backdrop-blur-sm rounded-lg p-1 border border-cyan-400/50 hover:border-cyan-300 transition-colors shadow-sm hover:shadow-cyan-400/20 relative ${showWalletDropdown ? 'z-40' : 'z-10'}`}>
              <button
                onClick={() => { setShowWalletDropdown(true); setConnectingWallet(true); }}
                disabled={connectingWallet}
                className={`w-full flex items-center justify-center gap-1.5 py-0.5 rounded-md transition-all ${
                  walletConnected
                    ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                    : connectingWallet
                    ? 'bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {!connectingWallet && (
                  <Wallet className={`w-4 h-4 ${walletConnected ? 'text-green-300' : 'text-white'}`} />
                )}
                <span className="text-sm font-medium leading-tight">
                  {connectingWallet ? 'Connecting to wallet' : walletConnected ? 'Connected' : 'Connect Wallet'}
                </span>
              </button>

              {/* Removed tooltip to prevent duplicate messaging while connecting */}
  
              {/* Wallet Dropdown handled via global overlay below */}
              {/* Wallet helper marquee */}
              <div className="mt-1">
                <Marquee text="Tip: Connect your TON wallet to start earning rewards • Use TON Keeper or Tonhub for faster connection • Stay secure, never share your seed phrase" speed={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Global Wallet Overlay - appears above all content */}
        {showWalletDropdown && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 sm:pt-32 px-3">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => { setShowWalletDropdown(false); setConnectingWallet(false); }}
            ></div>
            {/* Panel */}
            <div
              ref={walletDropdownRef}
              className="relative w-full max-w-sm bg-gray-800/95 backdrop-blur-md rounded-lg border border-gray-600 shadow-2xl max-h-[70vh] overflow-auto"
            >
              <div className="p-3 border-b border-gray-600">
                <h3 className="text-white font-bold text-sm">Connect Wallet</h3>
                <p className="text-gray-400 text-xs">Choose your TON wallet</p>
              </div>
              <div className="p-2 space-y-1">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet)}
                    className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <img
                      src={(wallet as any).logoUrl}
                      alt={`${wallet.name} logo`}
                      className="w-6 h-6 rounded"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{wallet.name}</div>
                      <div className="text-gray-400 text-xs">{wallet.description}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-gray-600">
                <p className="text-gray-400 text-xs">
                  Don't have a wallet?
                  <a
                    href="https://ton.org/wallets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 ml-1"
                  >
                    Get one here
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex">
            {[
              { id: 'tasks', label: 'Tasks', icon: Target },
              { id: 'referral', label: 'Referral', icon: Users },
              { id: 'leaderboard', label: 'Ranking', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAirdropTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 transition-all ${
                    airdropTab === tab.id
                      ? 'text-cyan-400 bg-cyan-400/10 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-6">
          {airdropTab === 'tasks' && (
            <TaskList 
              tasks={airdropTasks}
              onTaskComplete={handleTaskComplete}
              getDifficultyColor={getDifficultyColor}
              getDifficultyIcon={getDifficultyIcon}
              connectWallet={connectWallet}
              walletConnected={walletConnected}
            />
          )}
          
          {airdropTab === 'referral' && (
            <ReferralTab referralData={referralData} />
          )}
          
          {airdropTab === 'leaderboard' && (
            <LeaderboardTab 
              users={leaderboardUsers}
              currentBalance={airdropBalance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AirdropModal; 