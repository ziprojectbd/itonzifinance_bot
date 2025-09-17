import React from 'react';
import { Calendar } from 'lucide-react';

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

interface ChangelogTabProps {
  updates: Update[];
}

const ChangelogTab: React.FC<ChangelogTabProps> = ({ updates }) => {
  const versionedUpdates = updates
    .filter(update => update.version)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Detailed Changelog</h3>
        <p className="text-gray-400">Comprehensive version history and technical details</p>
      </div>
      
      <div className="space-y-4">
        {versionedUpdates.map((update) => (
          <div
            key={update.id}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-purple-400">{update.version}</span>
              <span className="text-gray-400 text-sm">{update.date}</span>
            </div>
            <h4 className="font-semibold text-white mb-2">{update.title}</h4>
            <p className="text-gray-300 text-sm">{update.description}</p>
            <div className="flex gap-1 mt-3">
              {update.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangelogTab; 