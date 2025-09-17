import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Filter,
  Search,
  Download,
  Upload,
  Mail,
  MessageCircle,
  Smartphone,
  Globe
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  target: 'all' | 'active' | 'premium' | 'new' | 'custom';
  channels: ('email' | 'push' | 'sms' | 'in-app')[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  createdBy: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: string;
  category: string;
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Airdrop Tasks Available!',
      message: 'Complete new tasks and earn up to 500 coins. Limited time offer!',
      type: 'promotion',
      target: 'all',
      channels: ['email', 'push', 'in-app'],
      status: 'sent',
      sentAt: '2024-01-15T10:00:00Z',
      recipients: 15420,
      openRate: 68.5,
      clickRate: 12.3,
      createdAt: '2024-01-15T09:30:00Z',
      createdBy: 'admin'
    },
    {
      id: '2',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance on January 20th from 2-4 AM UTC.',
      type: 'warning',
      target: 'active',
      channels: ['email', 'in-app'],
      status: 'scheduled',
      scheduledAt: '2024-01-18T12:00:00Z',
      recipients: 8930,
      createdAt: '2024-01-15T14:20:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      title: 'Welcome to iTonzi!',
      message: 'Start earning cryptocurrency by completing simple tasks.',
      type: 'info',
      target: 'new',
      channels: ['email', 'push'],
      status: 'draft',
      recipients: 0,
      createdAt: '2024-01-15T16:45:00Z',
      createdBy: 'admin'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error' | 'promotion'>('all');

  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'info',
    target: 'all',
    channels: ['in-app'],
    status: 'draft'
  });

  const templates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Welcome Message',
      title: 'Welcome to iTonzi!',
      message: 'Start earning cryptocurrency by completing simple tasks.',
      type: 'info',
      category: 'Onboarding'
    },
    {
      id: '2',
      name: 'Task Reminder',
      title: 'Complete Your Daily Tasks',
      message: 'You have pending tasks that expire in 24 hours.',
      type: 'warning',
      category: 'Engagement'
    },
    {
      id: '3',
      name: 'Withdrawal Confirmation',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal request has been successfully processed.',
      type: 'success',
      category: 'Transactions'
    },
    {
      id: '4',
      name: 'Promotion Alert',
      title: 'Limited Time Offer!',
      message: 'Double rewards on all tasks for the next 48 hours.',
      type: 'promotion',
      category: 'Marketing'
    }
  ];

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      alert('Please fill in all required fields');
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title!,
      message: newNotification.message!,
      type: newNotification.type as any,
      target: newNotification.target as any,
      channels: newNotification.channels!,
      status: newNotification.status as any,
      scheduledAt: newNotification.scheduledAt,
      recipients: getTargetUserCount(newNotification.target!),
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    };

    setNotifications(prev => [notification, ...prev]);
    setShowCreateModal(false);
    resetNewNotification();
  };

  const handleSendNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'sent', sentAt: new Date().toISOString() }
          : notif
      )
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    }
  };

  const resetNewNotification = () => {
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      target: 'all',
      channels: ['in-app'],
      status: 'draft'
    });
  };

  const applyTemplate = (template: NotificationTemplate) => {
    setNewNotification({
      ...newNotification,
      title: template.title,
      message: template.message,
      type: template.type as any
    });
  };

  const getTargetUserCount = (target: string) => {
    switch (target) {
      case 'all': return 15420;
      case 'active': return 8930;
      case 'premium': return 890;
      case 'new': return 156;
      default: return 0;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-400 bg-blue-400/20';
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      case 'promotion': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-400 bg-green-400/20';
      case 'scheduled': return 'text-blue-400 bg-blue-400/20';
      case 'draft': return 'text-gray-400 bg-gray-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'in-app': return <MessageCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || notif.status === statusFilter;
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Notification Manager</h2>
        <p className="text-pink-100">Create and manage user notifications across all channels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{notifications.length}</div>
          <div className="text-gray-400 text-sm">Total Notifications</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{notifications.filter(n => n.status === 'sent').length}</div>
          <div className="text-gray-400 text-sm">Sent</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{notifications.filter(n => n.status === 'scheduled').length}</div>
          <div className="text-gray-400 text-sm">Scheduled</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-gray-400">{notifications.filter(n => n.status === 'draft').length}</div>
          <div className="text-gray-400 text-sm">Drafts</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notifications..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Notification
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-white font-bold text-lg break-words whitespace-normal">Notifications ({filteredNotifications.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-700">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="p-6 hover:bg-gray-700/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg break-words whitespace-normal">{notification.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3 break-words whitespace-normal">{notification.message}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>Target: {notification.target}</span>
                    <span>Recipients: {notification.recipients.toLocaleString()}</span>
                    <div className="flex items-center gap-1">
                      <span>Channels:</span>
                      {notification.channels.map((channel, index) => (
                        <span key={index} className="text-blue-400">
                          {getChannelIcon(channel)}
                        </span>
                      ))}
                    </div>
                    {notification.openRate && (
                      <span>Open Rate: {notification.openRate}%</span>
                    )}
                    {notification.clickRate && (
                      <span>Click Rate: {notification.clickRate}%</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {notification.status === 'draft' && (
                    <button
                      onClick={() => handleSendNotification(notification.id)}
                      className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                      title="Send Now"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedNotification(notification);
                      setShowEditModal(true);
                    }}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="w-8 h-8 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Created: {new Date(notification.createdAt).toLocaleString()}</span>
                {notification.sentAt && (
                  <span>Sent: {new Date(notification.sentAt).toLocaleString()}</span>
                )}
                {notification.scheduledAt && (
                  <span>Scheduled: {new Date(notification.scheduledAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-white font-bold mb-2">No Notifications Found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first notification to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-pink-600 hover:bg-pink-500 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create First Notification
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-w-[90vw] max-h-[90vh] overflow-auto border border-gray-700">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Create Notification</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Templates */}
              <div className="mb-6">
                <h4 className="text-white font-bold mb-3">Quick Templates</h4>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                    >
                      <div className="text-white font-medium text-sm">{template.name}</div>
                      <div className="text-gray-400 text-xs">{template.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Message *</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-400 focus:outline-none resize-none"
                    placeholder="Enter notification message"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="promotion">Promotion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Target Audience</label>
                    <select
                      value={newNotification.target}
                      onChange={(e) => setNewNotification({...newNotification, target: e.target.value as any})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
                    >
                      <option value="all">All Users ({getTargetUserCount('all').toLocaleString()})</option>
                      <option value="active">Active Users ({getTargetUserCount('active').toLocaleString()})</option>
                      <option value="premium">Premium Users ({getTargetUserCount('premium').toLocaleString()})</option>
                      <option value="new">New Users ({getTargetUserCount('new').toLocaleString()})</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Delivery Channels</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'email', label: 'Email', icon: Mail },
                      { id: 'push', label: 'Push', icon: Bell },
                      { id: 'sms', label: 'SMS', icon: Smartphone },
                      { id: 'in-app', label: 'In-App', icon: MessageCircle }
                    ].map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <div key={channel.id} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={channel.id}
                            checked={newNotification.channels?.includes(channel.id as any) || false}
                            onChange={(e) => {
                              const channels = e.target.checked
                                ? [...(newNotification.channels || []), channel.id]
                                : (newNotification.channels || []).filter(c => c !== channel.id);
                              setNewNotification({...newNotification, channels: channels as any});
                            }}
                            className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                          />
                          <label htmlFor={channel.id} className="text-white font-medium flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {channel.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledAt}
                    onChange={(e) => setNewNotification({...newNotification, scheduledAt: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
                  />
                  <div className="text-gray-400 text-xs mt-1">Leave empty to save as draft</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotification}
                className="flex-1 bg-pink-600 hover:bg-pink-500 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Create Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;