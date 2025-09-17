import React, { useState } from 'react';
import { Zap, Star, Gift, TrendingUp, CheckCircle, Sparkles, Clock } from 'lucide-react';

interface Update {
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

interface UpdatesTabProps {
  updates: Update[];
}

const UpdatesTab: React.FC<UpdatesTabProps> = ({ updates }) => {
  const [filter, setFilter] = useState<'all' | 'feature' | 'improvement' | 'bugfix' | 'announcement' | 'event'>('all');

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />;
      case 'improvement': return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />;
      case 'bugfix': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />;
      case 'announcement': return <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />;
      case 'event': return <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />;
      default: return <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />;
      case 'active': return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />;
      case 'completed': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />;
      default: return null;
    }
  };

  const filteredUpdates = filter === 'all' ? updates : updates.filter(update => update.type === filter);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter */}
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {[
          { value: 'all', label: 'All', color: 'bg-gray-500/20 text-gray-300' },
          { value: 'feature', label: 'Features', color: 'bg-yellow-500/20 text-yellow-300' },
          { value: 'improvement', label: 'Improvements', color: 'bg-blue-500/20 text-blue-300' },
          { value: 'bugfix', label: 'Bug Fixes', color: 'bg-green-500/20 text-green-300' },
          { value: 'announcement', label: 'Announcements', color: 'bg-purple-500/20 text-purple-300' },
          { value: 'event', label: 'Events', color: 'bg-pink-500/20 text-pink-300' }
        ].map((filterOption) => (
          <button
            key={filterOption.value}
            onClick={() => setFilter(filterOption.value as any)}
            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              filter === filterOption.value
                ? filterOption.color + ' ring-2 ring-offset-2 ring-offset-gray-900 ring-current'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Updates List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredUpdates.map((update) => (
          <div
            key={update.id}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-600/50 hover:border-purple-400/50 transition-all"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getUpdateIcon(update.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm sm:text-base break-words">{update.title}</h3>
                  {getStatusIcon(update.status)}
                  {update.version && (
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full whitespace-nowrap">
                      {update.version}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 break-words leading-relaxed">{update.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="text-gray-400 text-xs whitespace-nowrap">{update.date}</span>
                    <div className="flex flex-wrap gap-1">
                      {update.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full break-words"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    update.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                    update.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {update.priority}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdatesTab; 