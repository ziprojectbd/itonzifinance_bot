import React, { useState } from 'react';
import { X, FileText, Shield, AlertTriangle, CheckCircle, Info, Book, Scale, Users, Zap, Crown, Star } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Rule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'general' | 'earning' | 'referral' | 'security' | 'community';
  severity: 'info' | 'warning' | 'critical';
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'faq' | 'terms' | 'privacy'>('rules');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'earning' | 'referral' | 'security' | 'community'>('all');

  const rules: Rule[] = [
    {
      id: '1',
      title: 'Fair Play Policy',
      description: 'Use of bots, scripts, or automated tools is strictly prohibited. All activities must be performed manually by real users.',
      icon: <Shield className="w-5 h-5" />,
      category: 'general',
      severity: 'critical'
    },
    {
      id: '2',
      title: 'One Account Per User',
      description: 'Each user is allowed only one account. Multiple accounts will result in permanent suspension of all associated accounts.',
      icon: <Users className="w-5 h-5" />,
      category: 'general',
      severity: 'critical'
    },
    {
      id: '3',
      title: 'Ad Viewing Requirements',
      description: 'Ads must be watched completely without skipping. Closing ads early or using ad blockers may result in reduced earnings.',
      icon: <Zap className="w-5 h-5" />,
      category: 'earning',
      severity: 'warning'
    },
    {
      id: '4',
      title: 'Minimum Withdrawal Amount',
      description: 'Minimum withdrawal is $0.10 for TON wallet and $5.00 for other payment methods. Withdrawal fees may apply.',
      icon: <Star className="w-5 h-5" />,
      category: 'earning',
      severity: 'info'
    },
    {
      id: '5',
      title: 'Referral Guidelines',
      description: 'Referrals must be genuine users. Self-referrals, fake accounts, or incentivized signups are not allowed.',
      icon: <Users className="w-5 h-5" />,
      category: 'referral',
      severity: 'critical'
    },
    {
      id: '6',
      title: 'Account Security',
      description: 'Keep your account credentials secure. iTonzi will never ask for your password via email or social media.',
      icon: <Shield className="w-5 h-5" />,
      category: 'security',
      severity: 'warning'
    },
    {
      id: '7',
      title: 'Daily Limits',
      description: 'Maximum 500 ads per day. Exceeding limits may result in temporary restrictions on your account.',
      icon: <Crown className="w-5 h-5" />,
      category: 'earning',
      severity: 'info'
    },
    {
      id: '8',
      title: 'Community Standards',
      description: 'Maintain respectful communication. Harassment, spam, or inappropriate content will result in account suspension.',
      icon: <Users className="w-5 h-5" />,
      category: 'community',
      severity: 'warning'
    },
    {
      id: '9',
      title: 'Task Completion',
      description: 'Complete tasks honestly and follow all instructions. Fake completions will be detected and penalized.',
      icon: <CheckCircle className="w-5 h-5" />,
      category: 'earning',
      severity: 'warning'
    },
    {
      id: '10',
      title: 'Payment Processing',
      description: 'Withdrawals are processed within 24-72 hours. Delays may occur during high volume periods or security reviews.',
      icon: <Info className="w-5 h-5" />,
      category: 'earning',
      severity: 'info'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I earn coins on iTonzi?',
      answer: 'You can earn coins by watching ads, completing daily tasks, referring friends, participating in airdrop activities, and maintaining login streaks.',
      category: 'Earning'
    },
    {
      id: '2',
      question: 'What is the minimum withdrawal amount?',
      answer: 'The minimum withdrawal is $0.10 for TON wallet, $5.00 for USDT, and $10.00 for PayPal. Different payment methods have different fees.',
      category: 'Payments'
    },
    {
      id: '3',
      question: 'How long does it take to process withdrawals?',
      answer: 'Most withdrawals are processed within 24-72 hours. TON wallet withdrawals are typically faster, while traditional payment methods may take longer.',
      category: 'Payments'
    },
    {
      id: '4',
      question: 'Can I use multiple accounts?',
      answer: 'No, each user is allowed only one account. Creating multiple accounts will result in permanent suspension of all associated accounts.',
      category: 'Account'
    },
    {
      id: '5',
      question: 'How does the referral system work?',
      answer: 'Share your referral code with friends. You earn 100 coins for each friend who joins and 50 coins monthly for active referrals.',
      category: 'Referrals'
    },
    {
      id: '6',
      question: 'What happens if I miss daily check-ins?',
      answer: 'Missing a daily check-in will reset your streak bonus. However, you can still earn coins through other activities.',
      category: 'Tasks'
    },
    {
      id: '7',
      question: 'Is iTonzi available worldwide?',
      answer: 'iTonzi is available in most countries. Some features may be restricted in certain regions due to local regulations.',
      category: 'General'
    },
    {
      id: '8',
      question: 'How can I increase my earning potential?',
      answer: 'Complete daily tasks, maintain login streaks, refer active friends, participate in competitions, and watch the maximum daily ads.',
      category: 'Earning'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredRules = selectedCategory === 'all' 
    ? rules 
    : rules.filter(rule => rule.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 m-0">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full min-h-screen flex flex-col overflow-hidden border border-gray-700 rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Rules & Guidelines</h2>
            <p className="text-indigo-100 text-sm">
              Please read and follow our community guidelines
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="flex">
            {[
              { id: 'rules', label: 'Rules', icon: Scale },
              { id: 'faq', label: 'FAQ', icon: Book },
              { id: 'terms', label: 'Terms', icon: FileText },
              { id: 'privacy', label: 'Privacy', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all ${
                    activeTab === tab.id
                      ? 'text-indigo-400 bg-indigo-400/10 border-b-2 border-indigo-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'general', label: 'General' },
                  { id: 'earning', label: 'Earning' },
                  { id: 'referral', label: 'Referral' },
                  { id: 'security', label: 'Security' },
                  { id: 'community', label: 'Community' }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Rules List */}
              <div className="space-y-3">
                {filteredRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`rounded-lg p-4 border-l-4 ${getSeverityColor(rule.severity)}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-indigo-400 mt-1">{rule.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{rule.title}</h3>
                          {getSeverityIcon(rule.severity)}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 capitalize">{rule.category}</span>
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        rule.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        rule.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {rule.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-lg mb-2">Frequently Asked Questions</h3>
                <p className="text-gray-400 text-sm">
                  Find answers to common questions about iTonzi
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.id} className="bg-gray-800/50 rounded-lg border border-gray-700">
                    <summary className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{faq.question}</span>
                        <span className="text-xs bg-indigo-600 px-2 py-1 rounded-full text-white">
                          {faq.category}
                        </span>
                      </div>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-lg mb-2">Terms of Service</h3>
                <p className="text-gray-400 text-sm">Last updated: January 2024</p>
              </div>

              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                <section>
                  <h4 className="text-white font-bold mb-2">1. Acceptance of Terms</h4>
                  <p>By accessing and using iTonzi, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">2. Service Description</h4>
                  <p>iTonzi is a platform that allows users to earn cryptocurrency by watching advertisements, completing tasks, and participating in various activities.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">3. User Obligations</h4>
                  <p>Users must provide accurate information, maintain account security, and comply with all platform rules and guidelines.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">4. Prohibited Activities</h4>
                  <p>Users are prohibited from using automated tools, creating multiple accounts, or engaging in fraudulent activities.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">5. Payment Terms</h4>
                  <p>Earnings are subject to verification and may be withheld if suspicious activity is detected. Minimum withdrawal amounts apply.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-lg mb-2">Privacy Policy</h3>
                <p className="text-gray-400 text-sm">How we protect your data</p>
              </div>

              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                <section>
                  <h4 className="text-white font-bold mb-2">Data Collection</h4>
                  <p>We collect minimal personal information necessary for account operation and payment processing.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">Data Usage</h4>
                  <p>Your data is used solely for platform functionality, security, and improving user experience.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">Data Protection</h4>
                  <p>We implement industry-standard security measures to protect your personal information.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">Third Parties</h4>
                  <p>We do not sell or share your personal data with third parties except as required for payment processing.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">Your Rights</h4>
                  <p>You have the right to access, modify, or delete your personal data at any time.</p>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-2">
              By using iTonzi, you agree to our terms and conditions
            </p>
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;