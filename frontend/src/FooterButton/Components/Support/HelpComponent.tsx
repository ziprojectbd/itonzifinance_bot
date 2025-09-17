import React from 'react';
import { Book, ExternalLink, User, Star, CheckCircle, Bug, HelpCircle } from 'lucide-react';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: number;
}

interface HelpComponentProps {
  topics?: HelpTopic[];
}

const HelpComponent: React.FC<HelpComponentProps> = ({ 
  topics = [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Learn how to use iTonzi and start earning',
      icon: <User className="w-5 h-5" />,
      articles: 12
    },
    {
      id: '2',
      title: 'Earning & Tasks',
      description: 'How to maximize your earnings',
      icon: <Star className="w-5 h-5" />,
      articles: 8
    },
    {
      id: '3',
      title: 'Payments & Withdrawals',
      description: 'Everything about payments and withdrawals',
      icon: <CheckCircle className="w-5 h-5" />,
      articles: 15
    },
    {
      id: '4',
      title: 'Technical Issues',
      description: 'Troubleshooting common problems',
      icon: <Bug className="w-5 h-5" />,
      articles: 6
    },
    {
      id: '5',
      title: 'Account & Security',
      description: 'Account management and security',
      icon: <HelpCircle className="w-5 h-5" />,
      articles: 10
    }
  ]
}) => {
  const handleTopicClick = (topicId: string) => {
    // Handle topic click - could open help articles or navigate to help section
    console.log('Opening help topic:', topicId);
  };

  const handleSearch = () => {
    // Handle help search functionality
    console.log('Searching help articles...');
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-white font-bold text-lg mb-2">Help Center</h3>
        <p className="text-gray-400 text-sm">
          Find answers to common questions
        </p>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-cyan-400/50 cursor-pointer transition-colors"
            onClick={() => handleTopicClick(topic.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-cyan-400">{topic.icon}</div>
                <div>
                  <div className="text-white font-bold">{topic.title}</div>
                  <div className="text-gray-400 text-sm">{topic.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">{topic.articles} articles</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Help */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mt-6">
        <h4 className="text-white font-bold mb-3">Search Help Articles</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for help..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpComponent; 