import React from 'react';
import { TableInfo } from '../types';
import { RefreshCw, Download, Eye } from 'lucide-react';

interface TablesTabProps {
  tables: TableInfo[];
  selectedTable: TableInfo | null;
  onTableSelect: (table: TableInfo | null) => void;
  searchQuery: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-400 bg-green-400/20';
    case 'warning': return 'text-yellow-400 bg-yellow-400/20';
    case 'error': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const TablesTab: React.FC<TablesTabProps> = ({ tables }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Database Tables</h3>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors">
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Refresh
          </button>
          <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4 inline mr-2" />
            Export Schema
          </button>
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-600">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">Table Name</th>
              <th className="text-left p-4 text-gray-300 font-medium">Records</th>
              <th className="text-left p-4 text-gray-300 font-medium">Size</th>
              <th className="text-left p-4 text-gray-300 font-medium">Last Modified</th>
              <th className="text-left p-4 text-gray-300 font-medium">Status</th>
              <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {tables.map((table) => (
              <tr key={table.name} className="hover:bg-gray-600/50 transition-colors">
                <td className="p-4">
                  <div className="text-white font-medium">{table.name}</div>
                </td>
                <td className="p-4 text-gray-300">{table.records.toLocaleString()}</td>
                <td className="p-4 text-gray-300">{table.size}</td>
                <td className="p-4 text-gray-300">{formatDate(table.lastModified)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(table.status)}`}>
                    {table.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
