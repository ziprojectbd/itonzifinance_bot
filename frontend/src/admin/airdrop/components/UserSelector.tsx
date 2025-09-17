import React, { useState, useEffect } from 'react';
import { Search, X, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'banned';
  points?: number;
  claimed?: number;
}

interface UserSelectorProps {
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  users: User[];
  maxHeight?: string;
  showStatus?: boolean;
  showPoints?: boolean;
  placeholder?: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUsers,
  onSelectionChange,
  users,
  maxHeight = 'max-h-60',
  showStatus = true,
  showPoints = false,
  placeholder = 'Search users by ID, username, or email...'
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = !search || 
      user.id.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const toggleUserSelection = (userId: string) => {
    const newSelection = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId];
    onSelectionChange(newSelection);
  };

  const selectAllFiltered = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    const newSelection = [...new Set([...selectedUsers, ...filteredUserIds])];
    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const getSelectedUsersInfo = () => {
    return selectedUsers.map(id => {
      const user = users.find(u => u.id === id);
      return user ? { id: user.id, username: user.username } : { id, username: 'Unknown' };
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        {showStatus && (
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'banned')}
              className="px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="banned">Banned Only</option>
            </select>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAllFiltered}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          <UsersIcon className="w-3 h-3" />
          Select All Filtered ({filteredUsers.length})
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          <X className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* User List */}
      <div className={`${maxHeight} overflow-y-auto space-y-2 border border-gray-600 rounded-lg p-2`}>
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No users found matching your criteria
          </div>
        ) : (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                selectedUsers.includes(user.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              onClick={() => toggleUserSelection(user.id)}
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => {}}
                className="text-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium">{user.username}</div>
                <div className="text-xs opacity-75">{user.id} • {user.email}</div>
                {showPoints && user.points !== undefined && (
                  <div className="text-xs opacity-75">
                    {user.points} pts • {user.claimed || 0} claimed
                  </div>
                )}
              </div>
              {showStatus && (
                <span className={`text-xs px-2 py-1 rounded ${
                  user.status === 'active' ? 'bg-green-600 text-green-200' : 'bg-red-600 text-red-200'
                }`}>
                  {user.status}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">
            Selected Users ({selectedUsers.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {getSelectedUsersInfo().map(user => (
              <span
                key={user.id}
                className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-sm"
              >
                {user.username} ({user.id})
                <button
                  type="button"
                  onClick={() => toggleUserSelection(user.id)}
                  className="ml-1 hover:text-red-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelector; 