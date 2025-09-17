import React from 'react';

interface RoadmapItem {
  quarter: string;
  items: {
    title: string;
    status: 'in-progress' | 'planned' | 'research';
    description: string;
  }[];
}

interface RoadmapTabProps {
  roadmapItems: RoadmapItem[];
}

const RoadmapTab: React.FC<RoadmapTabProps> = ({ roadmapItems }) => {
  const getRoadmapStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'text-blue-400 bg-blue-400/20';
      case 'planned': return 'text-yellow-400 bg-yellow-400/20';
      case 'research': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-8">
      {roadmapItems.map((quarter) => (
        <div key={quarter.quarter} className="space-y-4">
          <h3 className="text-xl font-bold text-white border-b border-gray-600 pb-2">
            {quarter.quarter}
          </h3>
          <div className="grid gap-4">
            {quarter.items.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoadmapStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapTab; 