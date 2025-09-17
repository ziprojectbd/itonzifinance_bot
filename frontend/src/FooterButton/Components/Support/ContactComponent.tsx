import React, { useState } from 'react';
import { MessageCircle, Mail, Headphones, Phone, Send } from 'lucide-react';

interface ContactComponentProps {
  onSubmitTicket: (ticket: TicketForm) => void;
}

interface ContactMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  responseTime: string;
  available: boolean;
  action: string;
}

interface TicketForm {
  subject: string;
  category: string;
  priority: string;
  message: string;
}

const ContactComponent: React.FC<ContactComponentProps> = ({ onSubmitTicket }) => {
  const [ticketForm, setTicketForm] = useState<TicketForm>({
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const contactMethods: ContactMethod[] = [
    {
      id: 'telegram',
      name: 'Telegram Support',
      icon: <MessageCircle className="w-6 h-6" />,
      description: 'Chat with our support team on Telegram',
      responseTime: 'Usually within 1 hour',
      available: true,
      action: 'Open Telegram'
    },
    {
      id: 'email',
      name: 'Email Support',
      icon: <Mail className="w-6 h-6" />,
      description: 'Send us an email for detailed inquiries',
      responseTime: 'Usually within 24 hours',
      available: true,
      action: 'Send Email'
    },
    {
      id: 'live-chat',
      name: 'Live Chat',
      icon: <Headphones className="w-6 h-6" />,
      description: 'Real-time chat support',
      responseTime: 'Available 9 AM - 6 PM UTC',
      available: false,
      action: 'Start Chat'
    },
    {
      id: 'phone',
      name: 'Phone Support',
      icon: <Phone className="w-6 h-6" />,
      description: 'Call our support hotline',
      responseTime: 'Available 9 AM - 5 PM UTC',
      available: false,
      action: 'Call Now'
    }
  ];

  const handleSubmitTicket = async () => {
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.message || sending) return;
    try {
      setSending(true);
      setStatus(null);
      const { subject, category, message } = ticketForm;
      const resp = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, category, message })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data?.ok === false) {
        console.error('Failed to send telegram message', data);
        setStatus({ type: 'error', text: data?.error || 'Failed to send message. Please try again.' });
      } else {
        onSubmitTicket(ticketForm);
        setTicketForm({ subject: '', category: '', priority: 'medium', message: '' });
        setStatus({ type: 'success', text: 'Message sent successfully!' });
      }
    } catch (e) {
      console.error('Error sending telegram message', e);
      setStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Support</span>
        </div>
        <h3 className="mt-3 text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Get in Touch
        </h3>
        <p className="mt-1 text-gray-400 text-sm">Choose your preferred way to contact us</p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="space-y-3">
        {contactMethods.map((method) => (
          <div
            key={method.id}
            className={`bg-gray-800/50 rounded-lg p-4 border border-gray-700 ${
              method.available ? 'hover:border-cyan-400/50 cursor-pointer' : 'opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-cyan-400">{method.icon}</div>
                <div>
                  <div className="text-white font-bold">{method.name}</div>
                  <div className="text-gray-400 text-sm">{method.description}</div>
                </div>
              </div>
              {!method.available && (
                <span className="text-red-400 text-xs font-bold">OFFLINE</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">{method.responseTime}</span>
              <button
                disabled={!method.available}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  method.available
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                onClick={
                  method.id === 'telegram' && method.available
                    ? () => window.open('https://t.me/zikrulislam84', '_blank', 'noopener,noreferrer')
                    : method.id === 'email' && method.available
                      ? () => window.open('mailto:itonzi.finance@gmail.com')
                      : undefined
                }
              >
                {method.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Contact Form */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mt-6">
        <h4 className="text-white font-bold mb-3">Quick Message</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Subject"
            value={ticketForm.subject}
            onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
          <select
            value={ticketForm.category}
            onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Select Category</option>
            <option value="technical">Technical Issue</option>
            <option value="payment">Payment Problem</option>
            <option value="account">Account Issue</option>
            <option value="general">General Question</option>
          </select>
          <textarea
            placeholder="Describe your issue..."
            value={ticketForm.message}
            onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
          />
          <button
            onClick={handleSubmitTicket}
            disabled={sending}
            className={`w-full py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
              sending ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {status && (
            <div className={`text-sm mt-2 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {status.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactComponent; 