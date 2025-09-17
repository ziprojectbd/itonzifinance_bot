import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { AirdropTask } from '../types';

interface TaskListProps {
  tasks: AirdropTask[];
  onTaskComplete: (taskId: number) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyIcon: (difficulty: string) => string;
  connectWallet: () => void;
  walletConnected: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  getDifficultyColor,
  getDifficultyIcon,
  connectWallet,
  walletConnected
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Task Categories */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Available Tasks</h3>
        <div className="flex justify-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-green-400">Easy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-yellow-400">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-red-400">Hard</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="text-purple-400">Legendary</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-white">Progress Overview</h4>
          <span className="text-cyan-400 font-bold">
            {tasks.filter(task => task.completed).length}/{tasks.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(tasks.filter(task => task.completed).length / tasks.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const difficultyIcon = getDifficultyIcon(task.difficulty);
          return (
            <div
              key={task.id}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 transition-all duration-300 hover:scale-[1.02] ${
                task.completed
                  ? 'border-green-400/50 bg-green-400/10 shadow-lg shadow-green-400/20'
                  : 'border-gray-600/50 hover:border-cyan-400/50 hover:bg-white/15'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white">{task.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getDifficultyColor(task.difficulty)}`}>
                      <span>{difficultyIcon}</span>
                      {task.difficulty}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="bg-gray-700/50 px-2 py-1 rounded">{task.category}</span>
                    {task.timeLimit && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.timeLimit}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-400 mb-1">
                    +{task.reward}
                  </div>
                  <div className="text-xs text-gray-400">coins</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {task.completed ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                      <span className="text-sm">Not completed</span>
                    </div>
                  )}
                </div>

                {!task.completed && (
                  <button
                    onClick={() => {
                      if (task.id === 7 && !walletConnected) {
                        connectWallet();
                      } else {
                        onTaskComplete(task.id);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      task.completed
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white hover:scale-105'
                    }`}
                    disabled={task.completed}
                  >
                    {task.id === 7 && !walletConnected ? 'Connect Wallet' : 'Complete'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList; 