import React, { useState } from 'react';
import { X, Zap, Bell, Target, Calendar } from 'lucide-react';
import UpdatesTab from '../components/UpdatesTab';
import AnnouncementsTab from '../components/AnnouncementsTab';
import RoadmapTab from '../components/RoadmapTab';
import ChangelogTab from '../components/ChangelogTab';
import { updates, announcements, roadmapItems } from '../data/updatesData';

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatesModal: React.FC<UpdatesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'updates' | 'announcements' | 'roadmap' | 'changelog'>('updates');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black w-full h-full sm:max-w-4xl sm:h-[90vh] sm:rounded-2xl flex flex-col overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Updates & News</h1>
                <p className="text-purple-100 text-xs sm:text-sm">Stay informed about the latest changes</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex">
            {[
              { id: 'updates', label: 'Updates', icon: Zap },
              { id: 'announcements', label: 'Announcements', icon: Bell },
              { id: 'roadmap', label: 'Roadmap', icon: Target },
              { id: 'changelog', label: 'Changelog', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 transition-all text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'text-purple-400 bg-purple-400/10 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'updates' && (
            <UpdatesTab updates={updates} />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsTab announcements={announcements} />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapTab roadmapItems={roadmapItems} />
          )}

          {activeTab === 'changelog' && (
            <ChangelogTab updates={updates} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatesModal;