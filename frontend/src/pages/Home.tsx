import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CreditCard,
  History,
  Trophy,
  FileText,
  Headphones,
  Loader2,
  Bell,
  Globe,
  Wallet,
  Rocket
} from 'lucide-react';
import PaymentModal from '../FooterButton/Modals/PaymentModal';
import HistoryModal from '../FooterButton/Modals/HistoryModal';
import LeaderboardModal from '../FooterButton/Modals/LeaderboardModal';
import RulesModal from '../FooterButton/Modals/RulesModal';
import SupportModal from '../FooterButton/Modals/SupportModal';
import UpdatesModal from '../Updates/Modals/UpdatesModal';
import WalletModal from '../FooterButton/Modals/WalletModal';

// Import new airdrop components
import {
  AirdropModal,
  AirdropTask,
  getDefaultTasks
} from '../Airdrop';
import { translations, getCurrentLanguage, setLanguage, type LanguageCode, languageConfigs } from '../lang';
import ReactCountryFlag from 'react-country-flag';
import API_BASE_URL from '../services/api/config';

declare global {
  interface Window {
    show_9486612?: () => Promise<void>;
    Telegram?: any;
    ethereum?: any;
  }
}
 

function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [autoAdsRunning, setAutoAdsRunning] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [, setWalletAddress] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(getCurrentLanguage);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  // Admin-controlled Airdrop availability
  const [isAirdropEnabled, setIsAirdropEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('airdrop_enabled');
      return saved ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Initialize stats with default values
  const [stats, setStats] = useState ({
    ads: 0,
    totalEarned : 0,
    dailyAds: 0,
    dailyEarnings: 0,
    payable: 0,
    siteVisits: 0
  });

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [offerCountdowns, setOfferCountdowns] = useState([0, 0, 0, 0]);
  const [isRewardsLoading, setIsRewardsLoading] = useState(false);
  const [isAutoAdsLoading, setIsAutoAdsLoading] = useState(false);
  // Cooldowns for action buttons [WatchAd, AutoAdsToggle, Rewards]
  const [actionCountdowns, setActionCountdowns] = useState<[number, number, number]>([0, 0, 0]);
  // Dedicated countdown for Watch Ad (15s watch, reward after 16s)
  const [watchCountdown, setWatchCountdown] = useState(0);

  // Add animation style
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'borderGlowAnimation';
    style.textContent = `
      @keyframes borderGlow {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes rotate-colors {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .animate-rotate-colors {
        animation: rotate-colors 4s linear infinite;
      }
    `;
    if (!document.getElementById('borderGlowAnimation')) {
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById('borderGlowAnimation');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Listen for admin toggle updates (same-tab custom event + cross-tab storage event)
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.enabled === 'boolean') {
        setIsAirdropEnabled(Boolean(detail.enabled));
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'airdrop_enabled' && e.newValue !== null) {
        setIsAirdropEnabled(e.newValue === 'true');
      }
    };
    window.addEventListener('airdrop_toggle', handleToggle as EventListener);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('airdrop_toggle', handleToggle as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Telegram user state
  const [telegramUser, setTelegramUser] = useState<{
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  } | null>(null);

  // On mount, extract Telegram user info
  useEffect(() => {
    // Check if running inside Telegram WebApp
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initDataUnsafe &&
      window.Telegram.WebApp.initDataUnsafe.user
    ) {
      setTelegramUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  // 🔁 Fetch stats from MongoDB on load and every 10s
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = telegramUser?.id ||  6789527271 ; // fallback for dev
        const res = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
        const resp = await axios.get('http://localhost:5000/api/history/6789527271')
        
        const  { totalEarned }   =  resp.data.result.dailyEarnings[0]
        
          setStats({ ...res.data , dailyEarnings  : totalEarned , payable : res.data.earn , totalEarned : resp.data.result.payable });
        
      } catch (err) {
        console.error('❌ Error fetching stats:', err);
      }
    };

  
 
    fetchStats(); // initial
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [telegramUser]);



  // 📺 Single Ad Watch with 15s timer and reward after 16s
  const watchAd = async () => {
    if (isWatchingAd || watchCountdown > 0) return;
    setIsWatchingAd(true);
    setWatchCountdown(15);
    try {
      await window.show_9486612?.(); // simulate SDK start
    } catch {
      // no-op if SDK not present
    }
  };

  // 🔁 Auto Ads loop
  useEffect(() => {
    let stopped = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const runAutoAds = async () => {
      while (!stopped && autoAdsRunning) {
        try {
          await window.show_9486612?.();
          const updated = {
            ...stats,
            totalAds: stats.ads + 1,
            dailyAds: stats.dailyAds + 1,
            totalEarned: +(stats.totalEarned + 0.001).toFixed(3),
            dailyEarnings: +(stats.dailyEarnings + 0.001).toFixed(3),
            payable: +(stats.payable + 0.001).toFixed(3),
          };
          setStats(updated);
          //await updateStatsOnServer(updated);
        } catch (err) {
          console.warn('Ad failed');
        }
        await new Promise(res => { timeout = setTimeout(res, 5000); });
      }
    };

    if (autoAdsRunning) runAutoAds();
    return () => {
      stopped = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [autoAdsRunning]);

  // 💰 Offer Visit Handler
  const handleSmartOfferClick = (idx: number, url: string) => {
    if (offerCountdowns[idx] > 0) return;

    window.open(url, '_blank');
    const updated = {
      ...stats,
      siteVisits: stats.siteVisits + 1,
      totalAds: stats.ads + 1,
      totalEarned: +(stats.totalEarned + 0.001).toFixed(3),
      dailyEarnings: +(stats.dailyEarnings + 0.001).toFixed(3),
      payable: +(stats.payable + 0.001).toFixed(3),
    };
    setStats(updated);
    //updateStatsOnServer(updated);

    // ⏳ 30s cooldown
    setOfferCountdowns(prev => {
      const updatedCountdowns = [...prev];
      updatedCountdowns[idx] = 30;
      return updatedCountdowns;
    });
  };

  // ⏱️ Countdown Timer Effect (offers + action buttons + watch timer)
  useEffect(() => {
    const interval = setInterval(() => {
      setOfferCountdowns(prev => prev.map(t => (t > 0 ? t - 1 : 0)));
      setActionCountdowns(prev => prev.map(t => (t > 0 ? t - 1 : 0)) as [number, number, number]);
      setWatchCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🎯 When watchCountdown hits 0 while watching, credit after 1s (16s total)
  useEffect(() => {
    if (isWatchingAd && watchCountdown === 0) {
      const timer = setTimeout(() => {
        const updated = {
          ...stats,
          totalAds: stats.ads + 1,
          dailyAds: stats.dailyAds + 1,
          totalEarned: +(stats.totalEarned + 0.001).toFixed(3),
          dailyEarnings: +(stats.dailyEarnings + 0.001).toFixed(3),
          payable: +(stats.payable + 0.001).toFixed(3),
        };
        setStats(updated);
        setIsWatchingAd(false);
      }, 1000); // 1s after countdown completes
      return () => clearTimeout(timer);
    }
  }, [isWatchingAd, watchCountdown, stats]);

  // Rewards Ads button handler
  const handleRewardsAds = async () => {
    if (isRewardsLoading) return;
    setIsRewardsLoading(true);
    try {
      // Persist reward to backend
      try {
        const resposnt = await axios.post('http://localhost:5000/api/history', {
          uid: '6789527271',
          amount: 0.01,
          symbol: 'USDT'
        });
        console.log(resposnt.data);
      } catch (apiErr) {
        console.warn('Reward API call failed:', apiErr);
      }

      // Update local stats
      const updated = {
        ...stats,
        siteVisits: stats.siteVisits + 1,
        totalAds: stats.ads + 1,
        totalEarned: +(stats.totalEarned + 0.01).toFixed(3),
        dailyEarnings: +(stats.dailyEarnings + 0.01).toFixed(3),
        payable: +(stats.payable + 0.01).toFixed(3),
      };
      setStats(updated);
      //await updateStatsOnServer(updated);
    } catch (e) {
      console.error('Rewards handler error:', e);
    } finally {
      setIsRewardsLoading(false);
    }
  };

  // Get current translations
  const t = translations[currentLanguage as keyof typeof translations];

  // Load default tasks
  const [airdropTasks, setAirdropTasks] = useState<AirdropTask[]>([]);
  const [airdropBalance, setAirdropBalance] = useState(205);

  useEffect(() => {
    console.log('Loading default tasks');
    setAirdropTasks(getDefaultTasks());
  }, []);

  const handleNavClick = (itemId: string) => {
    setActiveTab(itemId);
    switch (itemId) {
      case 'wallet':
        setShowWalletModal(true);
        break;
      case 'payment':
        setShowPaymentModal(true);
        break;
      case 'history':
        setShowHistoryModal(true);
        break;
      case 'leaderboard':
        setShowLeaderboardModal(true);
        break;
      case 'rules':
        setShowRulesModal(true);
        break;
      case 'support':
        setShowSupportModal(true);
        break;
    }
  };

  const navItems = [
    { id: 'wallet', label: t.wallet, icon: Wallet },
    { id: 'payment', label: t.payment, icon: CreditCard },
    { id: 'history', label: t.history, icon: History },
    { id: 'leaderboard', label: t.leaderboard, icon: Trophy },
    { id: 'rules', label: t.rules, icon: FileText },
    { id: 'support', label: t.support, icon: Headphones }
  ];

  if (showAirdrop) {
    return (
      <AirdropModal
        isOpen={showAirdrop}
        onClose={() => setShowAirdrop(false)}
        airdropTasks={airdropTasks}
        setAirdropTasks={setAirdropTasks}
        airdropBalance={airdropBalance}
        setAirdropBalance={setAirdropBalance}
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
        setWalletAddress={setWalletAddress}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden bg-white">
      {/* Enhanced Notice Bar with Marquee - absolutely fixed at top, above all */}
      <div className="w-full py-3 text-sm flex items-center fixed top-0 left-0 right-0 z-50 border-2 border-yellow-400 animate-notice-border animate-notice-pulse animate-notice-slide-in notice-hover backdrop-blur-sm" 
           style={{ 
             background: 'linear-gradient(90deg, #000080 0%, #1e3a8a 50%, #000080 100%)',
             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
           }}>
        {/* Notice Icon */}
        <div className="flex items-center mr-3 ml-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-2 animate-icon-pulse">
            <span className="text-black text-xs font-bold">!</span>
          </div>
          <span className="font-bold z-10 animate-notice-glow text-yellow-400 animate-text-bounce">{t.notice}</span>
        </div>
        
        {/* Enhanced Marquee Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee-enhanced whitespace-nowrap min-w-max cursor-pointer group">
            <span className="inline-block text-white font-bold group-hover:text-yellow-300 transition-colors duration-300">
              {t.noticeText}
            </span>
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
          </div>
        </div>
        
        {/* Language Selector - Integrated into Notice Bar */}
        <div className="relative mr-2">
          <button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-full p-2 text-white hover:bg-gray-700/90 transition-all duration-200 hover:scale-105 shadow-lg"
            title={t.language}
          >
            <Globe className="w-4 h-4" />
          </button>
          
          {showLanguageSelector && (
            <div className="absolute top-full right-0 mt-1 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-xl shadow-2xl z-50 min-w-[140px] overflow-hidden">
              {languageConfigs.map((config) => (
                <button
                  key={config.code}
                  onClick={() => {
                    setCurrentLanguage(config.code);
                    setLanguage(config.code);
                    setShowLanguageSelector(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-700/50 transition-all duration-200 ${
                    currentLanguage === config.code ? 'text-cyan-400 bg-cyan-400/10 font-semibold' : 'text-white'
                  } ${config.code === 'ar' ? 'text-right' : ''}`}
                >
                  <ReactCountryFlag countryCode={config.countryCode} svg style={{width: '1.5em', height: '1.5em', marginRight: 8}} />
                  {config.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 space-y-6 pb-32 mt-[60px] overflow-y-auto z-10">
        {/* Logo Section */}
        <div className="space-y-4">
          <div className="flex flex-col items-start gap-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-rotate-colors blur-sm opacity-75"></div>
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'url(https://i.ibb.co/60Jzx0KX/complete-0-EB4-EAC6-8-F81-4-A4-B-BA22-D1-CAE9933-FF6.png)', backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid rgba(255, 255, 255, 0.1)' }}>
                  {/* Logo image only, no icon overlay */}
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-green-400">iTonzi</h2>
                <p className="text-yellow-400 text-lg font-semibold leading-tight">{t.supportedBy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-4 rounded-lg border-2 border-blue-400 relative overflow-hidden group"
          style={{}}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-border-move opacity-100"
            aria-hidden="true"
          >
            <span className="block w-full h-full rounded-lg bg-black/80"></span>
          </span>
          <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 border border-yellow-400/30 shadow-lg text-white p-3 rounded text-center relative z-10">
            <div className="font-bold text-sm uppercase">{t.totalAds}</div>
            <div className="text-xl font-bold">
              {stats.ads}
            </div>
          </div>
          <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 border border-yellow-400/30 shadow-lg text-white p-3 rounded text-center relative z-10">
            <div className="font-bold text-sm uppercase">{t.totalEarned}</div>
            <div className="text-xl font-bold">
              ${stats.totalEarned?.toFixed(3)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 border border-yellow-400/30 shadow-lg text-white p-3 rounded text-center relative z-10">
            <div className="font-bold text-sm uppercase">{t.dailyAds}</div>
            <div className="text-xl font-bold">
              {stats.dailyAds}/500
            </div>
          </div>
          <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 border border-yellow-400/30 shadow-lg text-white p-3 rounded text-center relative z-10">
            <div className="font-bold text-sm uppercase">{t.dailyEarnings}</div>
            <div className="text-xl font-bold">
              ${stats.dailyEarnings?.toFixed(3)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 border border-yellow-400/30 shadow-lg text-white p-3 rounded text-center relative z-10">
            <div className="font-bold text-sm uppercase">{t.payable}</div>
            <div className="text-xl font-bold">
              ${stats.payable?.toFixed(3)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 border border-yellow-400/30 shadow-lg text-white p-3 rounded text-center relative z-10">
            <div className="font-bold text-sm uppercase">{t.siteVisits}</div>
            <div className="text-xl font-bold">
              {stats.siteVisits}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-green-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(stats.dailyAds / 500) * 100}%` }}
          ></div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* Watch Ad Button */}
            <button 
              onClick={() => {
                if (isWatchingAd || watchCountdown > 0) return;
                watchAd();
              }}
              disabled={isWatchingAd || watchCountdown > 0}
              className={`relative w-full py-6 sm:py-7 px-4 rounded-2xl text-white font-extrabold text-base sm:text-xl transition-all duration-300 col-span-1
                overflow-hidden group border border-cyan-300/40 shadow-xl shadow-cyan-500/30 backdrop-blur-[1px]
                ${(isWatchingAd || watchCountdown > 0) ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-cyan-400/40 active:translate-y-0'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.95) 0%, rgba(59,130,246,0.95) 100%)'
              }}
            >
              {/* smart-offer-like animated gradient border */}
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-border-move opacity-100"
                aria-hidden="true"
              >
                <span className="block w-full h-full rounded-2xl bg-black/30"></span>
              </span>
              {/* animated gradient ring */}
              <span className="pointer-events-none absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-40 blur-[10px] group-hover:opacity-60 transition duration-500"></span>
              {/* glossy shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isWatchingAd ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm sm:text-base tracking-wide">{`WATCHING... ${watchCountdown}s`}</span>
                  </>
                ) : (
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] tracking-wide">{t.watchAds.toUpperCase()}</span>
                )}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-300/20">
                {isWatchingAd && (
                  <div className="h-full bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 animate-progress"></div>
                )}
              </div>
              {/* shimmer sweep */}
              <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-white/20 rotate-12 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            </button>

            {/* Auto Ads Toggle Button */}
            <button
              onClick={async () => {
                setIsAutoAdsLoading(true);
                setTimeout(() => {
                  setAutoAdsRunning(!autoAdsRunning);
                  setIsAutoAdsLoading(false);
                }, 500);
              }}
              disabled={isAutoAdsLoading}
              className={`relative w-full py-6 sm:py-7 px-4 rounded-2xl font-extrabold text-base sm:text-xl transition-all duration-300
                overflow-hidden group border shadow-xl backdrop-blur-[1px]
                ${isAutoAdsLoading ? 'opacity-60' : 'hover:-translate-y-0.5 active:translate-y-0'}
                ${autoAdsRunning
                  ? 'text-white border-cyan-300/40 shadow-cyan-500/30 bg-gradient-to-br from-cyan-700/95 via-blue-700/95 to-indigo-700/90'
                  : 'text-white border-emerald-300/40 shadow-emerald-500/30 bg-gradient-to-br from-emerald-500/95 via-teal-500/95 to-green-500/90'
                }`}
            >
              {/* smart-offer-like animated gradient border */}
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-border-move opacity-100"
                aria-hidden="true"
              >
                <span className="block w-full h-full rounded-2xl bg-black/20"></span>
              </span>
              {/* animated aura */}
              <span className={`pointer-events-none absolute -inset-[2px] rounded-2xl blur-[10px] opacity-40 transition duration-500 ${
                autoAdsRunning ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500' : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500'
              } group-hover:opacity-60`}></span>
              {/* glossy shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {isAutoAdsLoading ? (
                  <span className="text-sm sm:text-base">
                    {autoAdsRunning ? t.stopping.toUpperCase() : t.starting.toUpperCase()}
                  </span>
                ) : (
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] tracking-wide">
                    {autoAdsRunning ? t.stopAutoAds.toUpperCase() : t.showAutoAds.toUpperCase()}
                  </span>
                )}
              </span>
              {autoAdsRunning && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                  <div className="h-full bg-white/70 animate-pulse"></div>
                </div>
              )}
              {/* shimmer sweep */}
              <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-white/20 rotate-12 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            </button>

            {/* Rewards Button */}
            <button
              onClick={() => {
                if (actionCountdowns[2] > 0) return;
                handleRewardsAds();
                setActionCountdowns(prev => {
                  const next = [...prev] as [number, number, number];
                  next[2] = 30;
                  return next;
                });
              }}
              disabled={isRewardsLoading || actionCountdowns[2] > 0}
              className={`relative w-full py-6 sm:py-7 px-4 rounded-2xl font-extrabold text-base sm:text-xl text-white
                transition-all duration-300 group overflow-hidden border border-amber-300/40 shadow-xl shadow-amber-500/30 backdrop-blur-[1px]
                ${(isRewardsLoading || actionCountdowns[2] > 0) ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.95) 0%, rgba(245,158,11,0.95) 60%, rgba(234,88,12,0.95) 100%)'
              }}
            >
              {/* smart-offer-like animated gradient border */}
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-border-move opacity-100"
                aria-hidden="true"
              >
                <span className="block w-full h-full rounded-2xl bg-black/20"></span>
              </span>
              {/* animated aura */}
              <span className="pointer-events-none absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 opacity-40 blur-[10px] group-hover:opacity-60 transition duration-500"></span>
              {/* glossy shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-1">
                {isRewardsLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : actionCountdowns[2] > 0 ? (
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] tracking-wide">{`${t.wait} ${actionCountdowns[2]}${t.seconds}`}</span>
                ) : (
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] tracking-wide">
                    {t.rewardsAds.toUpperCase()}
                  </span>
                )}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-200/30">
                <div className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 animate-pulse"></div>
              </div>
              {/* shimmer sweep */}
              <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-white/20 rotate-12 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            </button>
          </div>
        </div>

        {/* Scrolling Banner Below Action Buttons */}
        <div className="overflow-hidden w-full my-4 rounded-lg border-2 border-yellow-400 bg-black/70 flex items-center justify-between">
          <div className="animate-marquee-enhanced-reverse flex items-center gap-4 py-2 w-max">
            {[1, 2].flatMap((_, idx) => ([
              <div key={`img1-${idx}`} className="inline-block">
                <img src="https://i.ibb.co/pBz4m4SB/Green-Passive-Income-Ideas-You-Tube-Thumbnail-2.png" alt="Green-Passive-Income-Ideas-You-Tube-Thumbnail-2" className="h-24 sm:h-32 rounded shadow-lg border-2 border-white" />
              </div>
            ]))}
          </div>
          <span className="ml-6 mr-4 px-3 py-1 bg-yellow-400 text-black font-bold rounded-full text-sm shadow-md whitespace-nowrap border-2 animate-sponsored-border">Sponsored</span>
        </div>

        {/* Enhanced Marquee above Monetag Direct Link Grid */}
        <div className="overflow-hidden bg-gradient-to-r from-black/90 via-gray-800/90 to-black/90 rounded-lg my-2 border border-yellow-400/30 shadow-lg">
          <div className="animate-marquee-enhanced whitespace-nowrap py-3 px-4 text-yellow-400 font-semibold text-sm cursor-pointer group relative">
            <span className="group-hover:text-yellow-300 transition-colors duration-300">
              {t.monetagMarquee}
            </span>
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-shimmer pointer-events-none"></div>
          </div>
        </div>

        {/* Monetag Direct Link Grid */}
        <div className="grid grid-cols-2 gap-4 my-6">
          {[
            'https://otieu.com/4/9133535',
            'https://otieu.com/4/9133536',
            'https://otieu.com/4/9133537',
            'https://otieu.com/4/9133532',
          ].map((url, i) => (
            <button
              key={i}
              className={`group relative w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition-all duration-300 transform overflow-hidden
                ${offerCountdowns[i] > 0 ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
              onClick={() => offerCountdowns[i] === 0 && handleSmartOfferClick(i, url)}
              disabled={offerCountdowns[i] > 0}
            >
              <span className="relative z-10">{offerCountdowns[i] > 0 ? `${t.wait} ${offerCountdowns[i]}${t.seconds}` : t.smartOffer}</span>
              <span
                className="pointer-events-none absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-border-move opacity-100"
                aria-hidden="true"
              >
                <span className="block w-full h-full rounded-lg bg-black"></span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Updates and Airdrop Buttons - Right Side */}
      <div className="fixed right-4 z-20 flex flex-col items-end gap-3" style={{ bottom: 'calc(3.5rem + 1rem)' }}>
        <button
          onClick={() => setShowUpdatesModal(true)}
          className="relative w-12 h-12 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        >
          <Bell className="w-6 h-6 text-white" />
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            3
          </div>
        </button>
        <button
          onClick={() => {
            if (!isAirdropEnabled) return;
            setShowAirdrop(true);
          }}
          disabled={!isAirdropEnabled}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
            ${isAirdropEnabled 
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:scale-110 animate-pulse' 
              : 'bg-gray-600 cursor-not-allowed opacity-60'}`}
        >
          <Rocket className={`w-6 h-6 ${isAirdropEnabled ? 'text-white' : 'text-gray-300'}`} />
          {isAirdropEnabled && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              {airdropTasks.filter((task: AirdropTask) => !task.completed).length}
            </div>
          )}
          {isAirdropEnabled && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/50 to-blue-500/50 animate-ping"></div>
          )}
        </button>
      </div>

      {/* Compact Bottom Navigation with Animated Border */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-30 h-14 overflow-hidden">
        {/* Animated Border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 animation: 'borderGlow 3s linear infinite',
                 background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.8), rgba(34, 211, 238, 1))',
                 backgroundSize: '200% 100%'
               }} />
        </div>
        <div className="grid grid-cols-6 h-full gap-0.5 px-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            // Gradient colors for active state
            const activeGradients = [
              'from-cyan-400 to-blue-500',   // Wallet
              'from-amber-400 to-yellow-500', // Payment
              'from-blue-400 to-cyan-500',   // History
              'from-purple-400 to-pink-500', // Leaderboard
              'from-emerald-400 to-green-500', // Rules
              'from-pink-400 to-rose-500'    // Support
            ];
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-white transform -translate-y-0.5'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <div className={`relative z-10 p-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br ' + activeGradients[idx] + ' shadow-md shadow-cyan-500/20' 
                    : 'group hover:bg-gray-700/50'
                }`}>
                  <div className={`relative w-4 h-4 flex items-center justify-center ${
                    isActive 
                      ? 'text-white' 
                      : `text-${['cyan', 'yellow', 'blue', 'purple', 'green', 'pink'][idx]}-400 group-hover:scale-110 transition-transform`
                  }`}>
                    <Icon className={`w-full h-full ${!isActive ? 'drop-shadow-[0_0_6px_rgba(var(--tw-text-opacity),0.3)]' : ''}`} />
                  </div>
                </div>
                <span className={`text-[10px] font-medium mt-0.5 transition-all duration-300 ${
                  isActive ? 'text-cyan-300 font-semibold' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 w-1/2 h-0.5 bg-cyan-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        balance={stats.payable}
      />
      <HistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => setShowHistoryModal(false)} 
      />
      <LeaderboardModal
        isOpen={showLeaderboardModal} 
        onClose={() => setShowLeaderboardModal(false)} 
      />
      <RulesModal
        isOpen={showRulesModal} 
        onClose={() => setShowRulesModal(false)} 
      />
      <SupportModal 
        isOpen={showSupportModal} 
        onClose={() => setShowSupportModal(false)} 
      />
      <UpdatesModal
        isOpen={showUpdatesModal} 
        onClose={() => setShowUpdatesModal(false)} 
      />
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        balance={stats.payable}
      />

      
    </div>
  );
}

export default Home;
