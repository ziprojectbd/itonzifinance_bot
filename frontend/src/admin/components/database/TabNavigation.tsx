import React from 'react';
import { Tab } from './types';

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => (
  <div className="flex border-b border-gray-700 overflow-x-auto w-full flex-nowrap">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors min-w-max ${
            activeTab === tab.id
              ? 'text-orange-400 bg-orange-400/10 border-b-2 border-orange-400'
              : 'text-gray-400 hover:text-white'
          } break-words whitespace-normal truncate`}
        >
          <Icon className="w-5 h-5" />
          {tab.label}
        </button>
      );
    })}
  </div>
);
