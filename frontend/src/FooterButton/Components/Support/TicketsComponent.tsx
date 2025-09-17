import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  date: string;
  lastUpdate: string;
}

interface TicketsComponentProps {
  tickets?: SupportTicket[];
}

const TicketsComponent: React.FC<TicketsComponentProps> = ({ 
  tickets = [
    {
      id: 'TKT-001',
      subject: 'Withdrawal not processed',
      status: 'pending',
      priority: 'high',
      date: '2024-01-15',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'TKT-002',
      subject: 'Ad viewing issues',
      status: 'resolved',
      priority: 'medium',
      date: '2024-01-14',
      lastUpdate: '1 day ago'
    },
    {
      id: 'TKT-003',
      subject: 'Account verification',
      status: 'open',
      priority: 'low',
      date: '2024-01-13',
      lastUpdate: '3 days ago'
    }
  ]
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'open': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleViewDetails = (ticketId: string) => {
    // Handle viewing ticket details
    console.log('Viewing ticket details for:', ticketId);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-white font-bold text-lg mb-2">Support Tickets</h3>
        <p className="text-gray-400 text-sm">
          Track your support requests
        </p>
      </div>

      {tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <span className="text-white font-medium">{ticket.subject}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">
                  <div>ID: {ticket.id}</div>
                  <div>Created: {ticket.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400">Last update:</div>
                  <div className="text-cyan-400">{ticket.lastUpdate}</div>
                </div>
              </div>
              
              <button 
                onClick={() => handleViewDetails(ticket.id)}
                className="w-full mt-3 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-medium transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-white font-bold mb-2">No Support Tickets</h3>
          <p className="text-gray-400 text-sm">
            You haven't submitted any support tickets yet
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketsComponent; 