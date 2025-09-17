import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface QueryResult {
  query: string;
  executionTime: string;
  rowsAffected: number;
  success: boolean;
}

interface QueriesTabProps {
  onExecute: (query: string) => void;
  queryResult: QueryResult | null;
}

export const QueriesTab: React.FC<QueriesTabProps> = ({ onExecute, queryResult }) => {
  const [customQuery, setCustomQuery] = useState('');

  const handleExecute = () => {
    if (!customQuery.trim()) return;
    onExecute(customQuery);
  };

  const commonQueries = [
    'User.countDocuments({})',
    'User.find().sort({ createdAt: -1 }).limit(10)',
    'Transaction.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])',
    'Task.find({ isActive: true })',
    'User.findById("user_id").populate("posts")',
    'Post.find().populate("author", "name email")',
    'User.updateOne({ _id: id }, { $set: { status: "active" } })',
    'Order.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Query Console</h3>
        <div className="text-yellow-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Use with caution - queries can affect live data
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-lg p-4">
        <label className="block text-white font-medium mb-2">SQL Query</label>
        <textarea
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          rows={6}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-orange-400 focus:outline-none resize-none"
          placeholder="SELECT * FROM users LIMIT 10;"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="text-gray-400 text-sm">
            Tip: Use LIMIT to restrict results for large queries
          </div>
          <button
            onClick={handleExecute}
            disabled={!customQuery.trim()}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Execute Query
          </button>
        </div>
      </div>

      {queryResult && (
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-bold">Query Result</h4>
            <div className="text-gray-400 text-sm">
              Execution time: {queryResult.executionTime}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm">
            <div className="text-green-400 mb-2">
              ✓ Query executed successfully
            </div>
            <div className="text-gray-300">
              Rows affected: {queryResult.rowsAffected}
            </div>
          </div>
        </div>
      )}

      {/* Common Queries */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-white font-bold mb-3">Common Queries</h4>
        <div className="space-y-2">
          {commonQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => setCustomQuery(query)}
              className="w-full text-left bg-gray-800 hover:bg-gray-600 p-2 rounded font-mono text-sm text-gray-300 transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
