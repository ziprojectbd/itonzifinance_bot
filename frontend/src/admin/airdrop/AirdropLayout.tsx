import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'users', label: 'Users' },
  { id: 'notices', label: 'Notices' },
];

const AirdropLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <div className="mb-4 flex gap-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={`/admin/airdrop/${item.id}`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname.endsWith(item.id) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AirdropLayout; 