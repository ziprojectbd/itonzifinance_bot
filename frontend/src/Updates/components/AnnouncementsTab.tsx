import React from 'react';
import { Gift, CheckCircle, Bell, AlertCircle } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  date: string;
  urgent: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface AnnouncementsTabProps {
  announcements: Announcement[];
}

const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ announcements }) => {
  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <Gift className="w-5 h-5 text-pink-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'promotion': return 'border-pink-500 bg-pink-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'success': return 'border-green-500 bg-green-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`border-l-4 p-4 rounded-r-lg backdrop-blur-sm ${
            announcement.urgent ? 'animate-pulse' : ''
          } ${getAnnouncementColor(announcement.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {getAnnouncementIcon(announcement.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-white">{announcement.title}</h3>
                {announcement.urgent && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full animate-pulse">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm mb-3">{announcement.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{announcement.date}</span>
                {announcement.action && (
                  <button className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full hover:bg-purple-400/30 transition-colors">
                    {announcement.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsTab; 