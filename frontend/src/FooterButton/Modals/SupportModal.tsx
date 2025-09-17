import React, { useState } from 'react';
import { X, MessageCircle, Clock, Book, Star } from 'lucide-react';
import ContactComponent from '../Components/Support/ContactComponent';
import TicketsComponent from '../Components/Support/TicketsComponent';
import HelpComponent from '../Components/Support/HelpComponent';
import FeedbackComponent from '../Components/Support/FeedbackComponent';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TicketForm {
  subject: string;
  category: string;
  priority: string;
  message: string;
}

interface FeedbackForm {
  rating: number;
  category: string;
  message: string;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'tickets' | 'help' | 'feedback'>('contact');

  const handleSubmitTicket = (ticket: TicketForm) => {
    // Handle ticket submission
    console.log('Ticket submitted:', ticket);
  };

  const handleSubmitFeedback = (feedback: FeedbackForm) => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedback);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 m-0">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full min-h-screen flex flex-col overflow-hidden border border-gray-700 rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Support Center</h2>
            <p className="text-cyan-100 text-sm">
              We're here to help you 24/7
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="flex">
            {[
              { id: 'contact', label: 'Contact', icon: MessageCircle },
              { id: 'tickets', label: 'Tickets', icon: Clock },
              { id: 'help', label: 'Help', icon: Book },
              { id: 'feedback', label: 'Feedback', icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all ${
                    activeTab === tab.id
                      ? 'text-cyan-400 bg-cyan-400/10 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {activeTab === 'contact' && (
            <ContactComponent onSubmitTicket={handleSubmitTicket} />
          )}

          {activeTab === 'tickets' && (
            <TicketsComponent />
          )}

          {activeTab === 'help' && (
            <HelpComponent />
          )}

          {activeTab === 'feedback' && (
            <FeedbackComponent onSubmitFeedback={handleSubmitFeedback} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;