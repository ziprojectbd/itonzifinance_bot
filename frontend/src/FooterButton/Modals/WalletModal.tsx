import React, { useState, useEffect } from 'react';
import { X, Wallet, TrendingUp, TrendingDown, RefreshCw, BarChart3, ArrowUpDown, Coins } from 'lucide-react';
import { COINGECKO_CONFIG } from '../../services/api/config';

interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  change24h: number;
  icon: string;
  image?: string;
}

interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  image: string;
}

interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  description: { en: string };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: { usd: number };
    market_cap_rank: number;
    total_volume: { usd: number };
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    atl: { usd: number };
    atl_change_percentage: { usd: number };
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    telegram_channel_identifier: string;
    sub_reddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  community_data: {
    twitter_followers: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
    telegram_channel_user_count: number;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number;
      deletions: number;
    };
    commit_count_4_weeks: number;
  };
}

interface TradingPair {
  base: string;
  quote: string;
  price: number;
  change24h: number;
}

interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  pair: string;
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: Date;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, balance }) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'trading'>('assets');
  const [tradingSubTab, setTradingSubTab] = useState<'market' | 'trade' | 'orders'>('market');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      balance: 0.0025,
      price: 45000,
      change24h: 2.5,
      icon: '₿',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: 0.15,
      price: 3200,
      change24h: -1.2,
      icon: 'Ξ',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      balance: 1250,
      price: 0.85,
      change24h: 5.8,
      icon: '₳',
      image: 'https://assets.coingecko.com/coins/images/975/large/Cardano.png'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      balance: 8.5,
      price: 95,
      change24h: -3.1,
      icon: '◎',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    },
    {
      id: 'polkadot',
      name: 'Polkadot',
      symbol: 'DOT',
      balance: 45,
      price: 7.20,
      change24h: 1.7,
      icon: '●',
      image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png'
    }
  ]);

  const [marketData, setMarketData] = useState<CryptoMarketData[]>([
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 45000,
      change24h: 2.5,
      volume24h: 25000000000,
      marketCap: 850000000000,
      circulatingSupply: 19500000,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3200,
      change24h: -1.2,
      volume24h: 15000000000,
      marketCap: 380000000000,
      circulatingSupply: 120000000,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'BNB',
      price: 320,
      change24h: 1.8,
      volume24h: 800000000,
      marketCap: 50000000000,
      circulatingSupply: 155000000,
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 95,
      change24h: -3.1,
      volume24h: 1200000000,
      marketCap: 40000000000,
      circulatingSupply: 420000000,
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.85,
      change24h: 5.8,
      volume24h: 800000000,
      marketCap: 30000000000,
      circulatingSupply: 35000000000,
      image: 'https://assets.coingecko.com/coins/images/975/large/Cardano.png'
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'XRP',
      price: 0.65,
      change24h: 2.1,
      volume24h: 1200000000,
      marketCap: 35000000000,
      circulatingSupply: 54000000000,
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
    },
    {
      id: 'polkadot',
      symbol: 'DOT',
      name: 'Polkadot',
      price: 7.2,
      change24h: 1.7,
      volume24h: 300000000,
      marketCap: 9000000000,
      circulatingSupply: 1250000000,
      image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png'
    },
    {
      id: 'dogecoin',
      symbol: 'DOGE',
      name: 'Dogecoin',
      price: 0.08,
      change24h: -1.5,
      volume24h: 400000000,
      marketCap: 12000000000,
      circulatingSupply: 150000000000,
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png'
    },
    {
      id: 'avalanche-2',
      symbol: 'AVAX',
      name: 'Avalanche',
      price: 35,
      change24h: 4.2,
      volume24h: 600000000,
      marketCap: 12000000000,
      circulatingSupply: 350000000,
      image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png'
    },
    {
      id: 'chainlink',
      symbol: 'LINK',
      name: 'Chainlink',
      price: 15,
      change24h: 3.1,
      volume24h: 500000000,
      marketCap: 8000000000,
      circulatingSupply: 550000000,
      image: 'https://assets.coingecko.com/coins/images/877/large/chainlink.png'
    }
  ]);
  const [selectedPair, setSelectedPair] = useState<TradingPair>({
    base: 'BTC',
    quote: 'USDT',
    price: 45000,
    change24h: 2.5
  });
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradePrice, setTradePrice] = useState('');
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUsingLiveData, setIsUsingLiveData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoinDetails, setSelectedCoinDetails] = useState<CoinDetails | null>(null);
  const [showCoinDetails, setShowCoinDetails] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isPortfolioLive, setIsPortfolioLive] = useState(false);

  // Connect EVM Wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsRefreshing(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setWalletAddress(account);
        setIsConnected(true);
        console.log('Wallet connected:', account);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please make sure MetaMask is installed.');
      } finally {
        setIsRefreshing(false);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to trade.');
    }
  };


  // Fetch live market data from CoinGecko API (Free, no API key required)
  const fetchMarketData = async () => {
    try {
      setIsRefreshing(true);
      console.log('Fetching live market data from CoinGecko...');
      
      // CoinGecko API endpoint
      const apiUrl = `${COINGECKO_CONFIG.BASE_URL}${COINGECKO_CONFIG.ENDPOINTS.COINS_MARKET}`;
      const params = new URLSearchParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '100',
        page: '1',
        sparkline: 'false',
        locale: 'en'
      });

      console.log('API URL:', `${apiUrl}?${params}`);

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data.slice(0, 2)); // Log first 2 items
      
      // Transform CoinGecko API data to our format
      const liveData: CryptoMarketData[] = data.map((crypto: any) => ({
        id: crypto.id,
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        price: crypto.current_price,
        change24h: crypto.price_change_percentage_24h,
        volume24h: crypto.total_volume,
        marketCap: crypto.market_cap,
        circulatingSupply: crypto.circulating_supply,
        image: crypto.image
      }));

      console.log('Transformed data sample:', liveData.slice(0, 2));

      setMarketData(liveData);
      setIsUsingLiveData(true);
      setLastUpdateTime(new Date());
      
      // Update selected pair price (default to BTC)
      const btcData = liveData.find(crypto => crypto.symbol === 'BTC');
      if (btcData) {
        setSelectedPair(prev => ({ ...prev, price: btcData.price, change24h: btcData.change24h }));
      }

      console.log('✅ Live market data fetched successfully from CoinGecko:', liveData.length, 'cryptocurrencies');
      console.log('✅ Sample BTC price:', btcData?.price);
    } catch (error) {
      console.error('❌ Failed to fetch market data from CoinGecko:', error);
      
      // Fallback to simulated data if API fails
      setIsUsingLiveData(false);
      setMarketData(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.05),
        change24h: crypto.change24h + (Math.random() - 0.5) * 2
      })));
      console.log('⚠️ Using simulated data due to API error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch detailed coin information from CoinGecko
  const fetchCoinDetails = async (coinId: string) => {
    try {
      setIsLoadingDetails(true);
      setShowCoinDetails(true);
      
      const apiUrl = `${COINGECKO_CONFIG.BASE_URL}${COINGECKO_CONFIG.ENDPOINTS.COIN_DETAILS}/${coinId}`;
      const params = new URLSearchParams({
        localization: 'false',
        tickers: 'false',
        market_data: 'true',
        community_data: 'true',
        developer_data: 'true',
        sparkline: 'false'
      });

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setSelectedCoinDetails(data);
      console.log('Coin details fetched successfully:', data.name);
    } catch (error) {
      console.error('Failed to fetch coin details:', error);
      alert('Failed to load coin details. Please try again.');
      setShowCoinDetails(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Execute trade
  const executeTrade = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!tradeAmount || !tradePrice) {
      alert('Please enter amount and price');
      return;
    }

    const amount = parseFloat(tradeAmount);
    const price = parseFloat(tradePrice);
    const total = amount * price;

    if (tradeType === 'buy' && total > balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      setIsRefreshing(true);
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder: TradeOrder = {
        id: Date.now().toString(),
        type: tradeType,
        pair: `${selectedPair.base}/${selectedPair.quote}`,
        amount,
        price,
        total,
        status: 'completed',
        timestamp: new Date()
      };

      setOrders(prev => [newOrder, ...prev]);
      
      // Clear form
      setTradeAmount('');
      setTradePrice('');
      
      alert(`${tradeType.toUpperCase()} order executed successfully!`);
    } catch (error) {
      console.error('Trade failed:', error);
      alert('Trade failed. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Force refresh function to ensure live data
  const forceRefreshMarketData = async () => {
    console.log('🔄 Force refreshing market data...');
    setIsRefreshing(true);
    setIsUsingLiveData(false); // Reset to show we're fetching fresh data
    
    try {
      // Clear any cached data
      setMarketData([]);
      
      // Fetch fresh data
      await fetchMarketData();
    } catch (error) {
      console.error('Force refresh failed:', error);
    }
  };

  // Fetch live prices for portfolio assets
  const updatePortfolioPrices = async () => {
    try {
      // Get unique coin IDs from portfolio
      const coinIds = cryptoAssets.map(asset => asset.id).join(',');
      
      if (!coinIds) return;

      const apiUrl = `${COINGECKO_CONFIG.BASE_URL}/simple/price`;
      const params = new URLSearchParams({
        ids: coinIds,
        vs_currencies: 'usd',
        include_24hr_change: 'true'
      });

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Update portfolio assets with live prices
      setCryptoAssets(prev => prev.map(asset => {
        const liveData = data[asset.id];
        if (liveData) {
          return {
            ...asset,
            price: liveData.usd,
            change24h: liveData.usd_24h_change || asset.change24h
          };
        }
        return asset;
      }));

      setIsPortfolioLive(true);
      console.log('✅ Portfolio prices updated from CoinGecko');
    } catch (error) {
      console.error('❌ Failed to update portfolio prices:', error);
    }
  };

  // Auto-refresh market data and portfolio prices
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Auto-refresh triggered');
      fetchMarketData();
      updatePortfolioPrices();
      
      const interval = setInterval(() => {
        fetchMarketData();
        updatePortfolioPrices();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getTotalPortfolioValue = () => {
    return cryptoAssets.reduce((total, asset) => {
      return total + (asset.balance * asset.price);
    }, 0);
  };

  const getPortfolioChange = () => {
    return cryptoAssets.reduce((total, asset) => {
      return total + (asset.balance * asset.price * (asset.change24h / 100));
    }, 0);
  };

  // Format currency with thousands separators
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // Compact currency for large numbers (e.g., $1.2M, $3.4B)
  const formatCurrencyCompact = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Full Screen */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Wallet</h2>
              <p className="text-xs sm:text-sm text-gray-400">Manage your crypto assets</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isRefreshing}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-green-400 hover:to-blue-400 transition-all duration-200 disabled:opacity-50"
              >
                {isRefreshing ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-semibold">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Balance Section */}
          <div className="p-4 sm:p-6 bg-black border-b border-gray-700 flex-shrink-0">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 items-stretch">
              {/* Available Balance */}
              <div className="bg-gray-800 rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700 h-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Available Balance</p>
                    <p className="text-base sm:text-xl md:text-2xl font-bold text-white text-right truncate">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio Value */}
              <div className="bg-gray-800 rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700 h-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                    <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Portfolio Value</p>
                    <p className="text-base sm:text-xl md:text-2xl font-bold text-white text-right truncate">
                      {formatCurrency(getTotalPortfolioValue())}
                    </p>
                  </div>
                </div>
              </div>

              {/* 24h Change */}
              <div className="bg-gray-800 rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700 h-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                    {getPortfolioChange() >= 0 ? (
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                    ) : (
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">24h Change</p>
                    <div className="flex items-center justify-end gap-2">
                      <p className={`text-sm sm:text-lg md:text-xl font-bold ${getPortfolioChange() >= 0 ? 'text-green-400' : 'text-red-400'}`}> 
                        {getPortfolioChange() >= 0 ? '+' : ''}{getPortfolioChange().toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 flex-shrink-0">
            {activeTab !== 'trading' && (
              <button
                onClick={() => setActiveTab('assets')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                  activeTab === 'assets' 
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4 inline mr-2" />
                Assets
              </button>
            )}
            <button
              onClick={() => setActiveTab('trading')}
              className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                activeTab === 'trading' 
                  ? 'text-green-400 border-b-2 border-green-400 bg-green-400/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Trading
            </button>
          </div>



                    {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'assets' && (
              <div className="h-full flex flex-col">
                <div className="p-4 sm:p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">Your Assets</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        isPortfolioLive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {isPortfolioLive ? '🟢 Live Prices' : '🟡 Static Prices'}
                      </div>
                    </div>
                    <button
                      onClick={updatePortfolioPrices}
                      disabled={isRefreshing}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Refresh portfolio prices"
                    >
                      <RefreshCw className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-3">
                    {cryptoAssets.map((asset) => {
                      console.log('Rendering asset:', asset.name, 'Price:', asset.price);
                      return (
                        <div key={asset.id} className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-700">
                                {asset.image ? (
                                  <img 
                                    src={asset.image} 
                                    alt={asset.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to icon if image fails to load
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${asset.image ? 'hidden' : ''}`}>
                                  {asset.icon}
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold text-white text-sm sm:text-base">{asset.name}</p>
                                <p className="text-xs sm:text-sm text-gray-400">{asset.symbol}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-semibold text-white text-sm sm:text-base">
                                {formatCurrency(asset.balance * asset.price)}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <p className="text-xs sm:text-sm text-gray-400">
                                  {asset.balance} {asset.symbol}
                                </p>
                                <div className={`flex items-center gap-1 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {asset.change24h >= 0 ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  <span className="text-xs font-semibold">
                                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-700">
                            <p className="text-xs sm:text-sm text-gray-400">
                              Price: <span className="text-white">{formatCurrency(asset.price)}</span>
                            </p>
                          </div>
                        </div>
                      );
                      })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="h-full flex flex-col">
                {/* Trading Header */}
                <div className="p-4 sm:p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-white">Trading Platform</h3>
                    <div className="flex items-center gap-2">
                      {!isConnected ? (
                        <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs sm:text-sm">
                          Wallet not connected
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm">
                          Ready to trade
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trading Tabs */}
                <div className="flex border-b border-gray-700 flex-shrink-0">
                  <button
                    onClick={() => setTradingSubTab('market')}
                    className={`flex-1 py-2 px-4 text-sm font-semibold transition-colors ${
                      tradingSubTab === 'market' 
                        ? 'text-green-400 border-b-2 border-green-400 bg-green-400/10' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Coins className="w-4 h-4 inline mr-2" />
                    Market
                  </button>
                  <button
                    onClick={() => setTradingSubTab('trade')}
                    className={`flex-1 py-2 px-4 text-sm font-semibold transition-colors ${
                      tradingSubTab === 'trade' 
                        ? 'text-green-400 border-b-2 border-green-400 bg-green-400/10' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <ArrowUpDown className="w-4 h-4 inline mr-2" />
                    Trade
                  </button>
                  <button
                    onClick={() => setTradingSubTab('orders')}
                    className={`flex-1 py-2 px-4 text-sm font-semibold transition-colors ${
                      tradingSubTab === 'orders' 
                        ? 'text-green-400 border-b-2 border-green-400 bg-green-400/10' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Orders
                  </button>
                </div>

                {/* Trading Sub-Tab Content */}
                <div className="flex-1 overflow-hidden">
                  {tradingSubTab === 'market' && (
                    <div className="h-full flex flex-col">
                      <div className="p-2 sm:p-3 pb-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white">Live Market Data</h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isUsingLiveData 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {isUsingLiveData ? '🟢 Live API' : '🟡 Simulated'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs text-gray-400">
                              {isRefreshing ? 'Refreshing...' : lastUpdateTime ? `Last updated: ${lastUpdateTime.toLocaleTimeString()}` : 'Not updated yet'}
                            </span>
                            <button
                              onClick={forceRefreshMarketData}
                              disabled={isRefreshing}
                              className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                              title="Force refresh market data"
                            >
                              <RefreshCw className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
                        {/* Search Input */}
                        <div className="mb-4">
                          <input
                            type="text"
                            placeholder="Search cryptocurrencies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          {marketData
                            .filter(crypto => 
                              crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((crypto) => (
                            <div 
                              key={crypto.id} 
                              className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                              onClick={() => fetchCoinDetails(crypto.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-700">
                                    {crypto.image ? (
                                      <img 
                                        src={crypto.image} 
                                        alt={crypto.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          // Fallback to symbol if image fails to load
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                    ) : null}
                                    <div className={`w-full h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${crypto.image ? 'hidden' : ''}`}>
                                      {crypto.symbol}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white text-sm sm:text-base">{crypto.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-400">{crypto.symbol}</p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="font-semibold text-white text-sm sm:text-base">
                                    {formatCurrency(crypto.price)}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1 ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {crypto.change24h >= 0 ? (
                                        <TrendingUp className="w-3 h-3" />
                                      ) : (
                                        <TrendingDown className="w-3 h-3" />
                                      )}
                                      <span className="text-xs font-semibold">
                                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-700">
                                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                                  <div>
                                    <span className="text-gray-400">Volume: </span>
                                    <span className="text-white">{formatCurrencyCompact(crypto.volume24h)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Market Cap: </span>
                                    <span className="text-white">{formatCurrencyCompact(crypto.marketCap)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {tradingSubTab === 'trade' && (
                    <div className="h-full flex flex-col">
                      <div className="p-2 sm:p-3 pb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">Trade {selectedPair.base}/{selectedPair.quote}</h4>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="space-y-4">
                          {/* Trade Type Selection */}
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setTradeType('buy')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                                  tradeType === 'buy' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                BUY
                              </button>
                              <button
                                onClick={() => setTradeType('sell')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                                  tradeType === 'sell' 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                SELL
                              </button>
                            </div>
                          </div>

                          {/* Trade Form */}
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-2">Amount ({selectedPair.base})</label>
                              <input
                                type="number"
                                value={tradeAmount}
                                onChange={(e) => setTradeAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-2">Price ({selectedPair.quote})</label>
                              <input
                                type="number"
                                value={tradePrice}
                                onChange={(e) => setTradePrice(e.target.value)}
                                placeholder={selectedPair.price.toFixed(2)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                              />
                            </div>
                            
                            <div className="bg-gray-700/50 rounded-lg p-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Total:</span>
                                <span className="text-white font-semibold">
                                  {tradeAmount && tradePrice 
                                    ? formatCurrency(parseFloat(tradeAmount) * parseFloat(tradePrice)) 
                                    : formatCurrency(0)}
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={executeTrade}
                              disabled={!isConnected || isRefreshing || !tradeAmount || !tradePrice}
                              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-400 hover:to-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isRefreshing ? 'Processing...' : `${tradeType.toUpperCase()} ${selectedPair.base}`}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tradingSubTab === 'orders' && (
                    <div className="h-full flex flex-col">
                      <div className="p-4 sm:p-6 pb-2">
                        <h4 className="text-sm sm:text-base font-bold text-white">Trade History</h4>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
                        {orders.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-400">No trades yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {orders.map((order) => (
                              <div key={order.id} className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        order.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                      }`}>
                                        {order.type.toUpperCase()}
                                      </span>
                                      <span className="text-white font-semibold">{order.pair}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {order.timestamp.toLocaleString()}
                                    </p>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-white font-semibold">
                                      {order.amount} {order.pair.split('/')[0]}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      @ ${order.price.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-green-400 font-semibold">
                                      Total: ${order.total.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coin Details Modal */}
      {showCoinDetails && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {selectedCoinDetails?.image?.large && (
                  <img 
                    src={selectedCoinDetails.image.large} 
                    alt={selectedCoinDetails?.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{selectedCoinDetails?.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-400">{selectedCoinDetails?.symbol?.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCoinDetails(false)}
                className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-full sm:max-h-[calc(90vh-80px)]">
              {isLoadingDetails ? (
                <div className="p-4 sm:p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2 sm:mt-4 text-sm sm:text-base">Loading coin details...</p>
                </div>
              ) : selectedCoinDetails ? (
                <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Price and Market Data */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700">
                      <p className="text-gray-400 text-xs sm:text-sm">Current Price</p>
                      <p className="text-lg sm:text-2xl font-bold text-white">
                        ${selectedCoinDetails.market_data?.current_price?.usd?.toFixed(2)}
                      </p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        selectedCoinDetails.market_data?.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedCoinDetails.market_data?.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="text-xs sm:text-sm font-semibold">
                          {selectedCoinDetails.market_data?.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700">
                      <p className="text-gray-400 text-xs sm:text-sm">Market Cap</p>
                      <p className="text-base sm:text-xl font-bold text-white">
                        ${(selectedCoinDetails.market_data?.market_cap?.usd / 1000000000).toFixed(2)}B
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">Rank #{selectedCoinDetails.market_data?.market_cap_rank}</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700">
                      <p className="text-gray-400 text-xs sm:text-sm">24h Volume</p>
                      <p className="text-base sm:text-xl font-bold text-white">
                        ${(selectedCoinDetails.market_data?.total_volume?.usd / 1000000).toFixed(1)}M
                      </p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700">
                      <p className="text-gray-400 text-xs sm:text-sm">Circulating Supply</p>
                      <p className="text-base sm:text-xl font-bold text-white">
                        {selectedCoinDetails.market_data?.circulating_supply?.toLocaleString()}
                      </p>
                      {selectedCoinDetails.market_data?.max_supply && (
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Max: {selectedCoinDetails.market_data.max_supply.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price Performance */}
                  <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Price Performance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">7 Days</p>
                        <p className={`text-sm sm:text-lg font-semibold ${
                          selectedCoinDetails.market_data?.price_change_percentage_7d >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {selectedCoinDetails.market_data?.price_change_percentage_7d?.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">30 Days</p>
                        <p className={`text-sm sm:text-lg font-semibold ${
                          selectedCoinDetails.market_data?.price_change_percentage_30d >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {selectedCoinDetails.market_data?.price_change_percentage_30d?.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">All Time High</p>
                        <p className="text-sm sm:text-lg font-semibold text-white">
                          ${selectedCoinDetails.market_data?.ath?.usd?.toFixed(2)}
                        </p>
                        <p className={`text-xs sm:text-sm ${
                          selectedCoinDetails.market_data?.ath_change_percentage?.usd >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {selectedCoinDetails.market_data?.ath_change_percentage?.usd?.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">All Time Low</p>
                        <p className="text-sm sm:text-lg font-semibold text-white">
                          ${selectedCoinDetails.market_data?.atl?.usd?.toFixed(2)}
                        </p>
                        <p className={`text-xs sm:text-sm ${
                          selectedCoinDetails.market_data?.atl_change_percentage?.usd >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {selectedCoinDetails.market_data?.atl_change_percentage?.usd?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedCoinDetails.description?.en && (
                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">About {selectedCoinDetails.name}</h3>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {selectedCoinDetails.description.en.length > 500 
                          ? `${selectedCoinDetails.description.en.substring(0, 500)}...` 
                          : selectedCoinDetails.description.en
                        }
                      </p>
                    </div>
                  )}

                  {/* Community Data */}
                  {selectedCoinDetails.community_data && (
                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Community</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {selectedCoinDetails.community_data.twitter_followers > 0 && (
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm">Twitter Followers</p>
                            <p className="text-sm sm:text-lg font-semibold text-white">
                              {(selectedCoinDetails.community_data.twitter_followers / 1000).toFixed(1)}K
                            </p>
                          </div>
                        )}
                        {selectedCoinDetails.community_data.reddit_subscribers > 0 && (
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm">Reddit Subscribers</p>
                            <p className="text-sm sm:text-lg font-semibold text-white">
                              {(selectedCoinDetails.community_data.reddit_subscribers / 1000).toFixed(1)}K
                            </p>
                          </div>
                        )}
                        {selectedCoinDetails.community_data.telegram_channel_user_count > 0 && (
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm">Telegram Users</p>
                            <p className="text-sm sm:text-lg font-semibold text-white">
                              {(selectedCoinDetails.community_data.telegram_channel_user_count / 1000).toFixed(1)}K
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Developer Data */}
                  {selectedCoinDetails.developer_data && (
                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Developer Activity</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {selectedCoinDetails.developer_data.stars > 0 && (
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm">GitHub Stars</p>
                            <p className="text-sm sm:text-lg font-semibold text-white">
                              {selectedCoinDetails.developer_data.stars.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {selectedCoinDetails.developer_data.forks > 0 && (
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm">GitHub Forks</p>
                            <p className="text-sm sm:text-lg font-semibold text-white">
                              {selectedCoinDetails.developer_data.forks.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {selectedCoinDetails.developer_data.commit_count_4_weeks > 0 && (
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm">Commits (4 weeks)</p>
                            <p className="text-sm sm:text-lg font-semibold text-white">
                              {selectedCoinDetails.developer_data.commit_count_4_weeks}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {selectedCoinDetails.links && (
                    <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Links</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCoinDetails.links.homepage?.[0] && (
                          <a 
                            href={selectedCoinDetails.links.homepage[0]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs sm:text-sm hover:bg-blue-500/30 transition-colors"
                          >
                            Website
                          </a>
                        )}
                        {selectedCoinDetails.links.repos_url?.github?.[0] && (
                          <a 
                            href={selectedCoinDetails.links.repos_url.github[0]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-500/20 text-gray-400 rounded-lg text-xs sm:text-sm hover:bg-gray-500/30 transition-colors"
                          >
                            GitHub
                          </a>
                        )}
                        {selectedCoinDetails.links.twitter_screen_name && (
                          <a 
                            href={`https://twitter.com/${selectedCoinDetails.links.twitter_screen_name}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-400/20 text-blue-400 rounded-lg text-xs sm:text-sm hover:bg-blue-400/30 transition-colors"
                          >
                            Twitter
                          </a>
                        )}
                        {selectedCoinDetails.links.sub_reddit_url && (
                          <a 
                            href={selectedCoinDetails.links.sub_reddit_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs sm:text-sm hover:bg-orange-500/30 transition-colors"
                          >
                            Reddit
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletModal; 