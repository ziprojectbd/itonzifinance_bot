import React from 'react';

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-white font-bold text-lg">Database Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700/50 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Backup Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Automatic Backups</span>
              <button className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition-colors">
                Enabled
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Backup Frequency</span>
              <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Retention Period</span>
              <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Performance Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Query Cache</span>
              <button className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition-colors">
                Enabled
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Connection Pool Size</span>
              <input
                type="number"
                defaultValue="100"
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm w-20"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Query Timeout</span>
              <input
                type="number"
                defaultValue="30"
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm w-20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-lg p-6">
        <h4 className="text-white font-bold mb-4">Security Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">SSL Encryption</span>
            <button className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition-colors">
              Enabled
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">IP Whitelist</span>
            <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition-colors">
              Configure
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Audit Logging</span>
            <button className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition-colors">
              Enabled
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition-colors">
          Save Settings
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};
