import React, { useState, useEffect } from 'react';
import { 
  Plus, Mail, CheckCircle, AlertCircle, User, Users as UsersIcon, 
  X, FileText, Download, Upload, Bell, Info
} from 'lucide-react';
import UserSelector from '../components/UserSelector';
import { mockAirdropUsers } from '../data/users';
import { mockNoticeTemplates, NoticeTemplate } from '../data/templates';
import { 
  Notice, CreateNoticeRequest, NoticeFilters, NoticeStats,
  getNotices, createNotice, getNoticeStats, exportNotices, importNotices
} from '../../../services/api/endpoints/notices';

interface NoticeForm {
  title: string;
  message: string;
  recipientType: 'all' | 'specific' | 'bulk' | 'criteria';
  selectedUsers: string[];
  bulkUserIds: string;
  criteria: {
    status: 'all' | 'active' | 'banned';
    minPoints: number;
    maxPoints: number;
    kycStatus: 'all' | 'pending' | 'verified' | 'rejected';
    countries: string[];
  };
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledAt?: string;
  templateId?: string;
}

const AdvancedNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [stats, setStats] = useState<NoticeStats | null>(null);
  const [templates, setTemplates] = useState<NoticeTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [filters, setFilters] = useState<NoticeFilters>({});
  const [form, setForm] = useState<NoticeForm>({
    title: '',
    message: '',
    recipientType: 'all',
    selectedUsers: [],
    bulkUserIds: '',
    criteria: {
      status: 'all',
      minPoints: 0,
      maxPoints: 10000,
      kycStatus: 'all',
      countries: []
    },
    type: 'info',
    priority: 'medium'
  });

  // Load initial data
  useEffect(() => {
    loadNotices();
    loadStats();
    loadTemplates();
  }, [filters]);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const response = await getNotices({ ...filters, limit: 50 });
      setNotices(response.data);
    } catch (error) {
      console.error('Failed to load notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getNoticeStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      // Use mock templates instead of API call
      setTemplates(mockNoticeTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let recipients: string[] | 'all';
      if (form.recipientType === 'all') {
        recipients = 'all';
      } else if (form.recipientType === 'specific') {
        recipients = form.selectedUsers;
      } else if (form.recipientType === 'bulk') {
        recipients = form.bulkUserIds
          .split(/[,\s\n]+/)
          .map(id => id.trim())
          .filter(id => id.length > 0);
      } else {
        // Criteria-based - this would need a separate API call
        recipients = [];
      }

      const noticeData: CreateNoticeRequest = {
        title: form.title,
        message: form.message,
        recipients,
        type: form.type,
        priority: form.priority,
        scheduledAt: form.scheduledAt
      };

      const newNotice = await createNotice(noticeData);
      setNotices(prev => [newNotice, ...prev]);
      
      // Reset form
      setForm({
        title: '',
        message: '',
        recipientType: 'all',
        selectedUsers: [],
        bulkUserIds: '',
        criteria: {
          status: 'all',
          minPoints: 0,
          maxPoints: 10000,
          kycStatus: 'all',
          countries: []
        },
        type: 'info',
        priority: 'medium'
      });

      await loadStats();
    } catch (error) {
      console.error('Failed to create notice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelectionChange = (userIds: string[]) => {
    setForm(prev => ({ ...prev, selectedUsers: userIds }));
  };

  const handleTemplateSelect = (template: NoticeTemplate) => {
    setForm(prev => ({
      ...prev,
      title: template.title,
      message: template.message,
      type: template.type,
      priority: template.priority,
      templateId: template.id
    }));
    setShowTemplateSelector(false);
  };

  const clearTemplate = () => {
    setForm(prev => ({
      ...prev,
      templateId: undefined
    }));
  };

  const handleExport = async () => {
    try {
      const blob = await exportNotices(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notices-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export notices:', error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await importNotices(file);
      alert(`Imported ${result.imported} notices. ${result.failed} failed.`);
      await loadNotices();
      await loadStats();
    } catch (error) {
      console.error('Failed to import notices:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <X className="w-4 h-4" />;
      case 'announcement': return <Bell className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-red-200';
      case 'high': return 'bg-orange-600 text-orange-200';
      case 'medium': return 'bg-yellow-600 text-yellow-200';
      case 'low': return 'bg-green-600 text-green-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-600 text-green-200';
      case 'sent': return 'bg-blue-600 text-blue-200';
      case 'draft': return 'bg-gray-600 text-gray-200';
      case 'failed': return 'bg-red-600 text-red-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-3 sm:p-4 md:p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Airdrop Notices</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-xs sm:text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">Total</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">Sent</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">{stats.sent}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">Delivered</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{stats.delivered}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">Read</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">{stats.read}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">Failed</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400">{stats.failed}</div>
          </div>
        </div>
      )}

      {/* Create Notice Form */}
      <form onSubmit={handleCreate} className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl border border-gray-700 mb-6 sm:mb-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">
              Title
              {form.templateId && (
                <span className="ml-2 text-xs bg-purple-600 text-purple-200 px-2 py-0.5 rounded">
                  Using Template
                </span>
              )}
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg"
            >
              <FileText className="w-4 h-4" />
              Templates
            </button>
            {form.templateId && (
              <button
                type="button"
                onClick={clearTemplate}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                <X className="w-4 h-4" />
                Clear Template
              </button>
            )}
          </div>
        </div>

        {/* Template Selector */}
        {showTemplateSelector && (
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">Select a template:</div>
              <div className="flex gap-2">
                <select
                  onChange={e => {
                    const category = e.target.value;
                    if (category === 'all') {
                      setTemplates(mockNoticeTemplates);
                    } else {
                      setTemplates(mockNoticeTemplates.filter(t => t.category === category));
                    }
                  }}
                  className="px-2 py-1 bg-gray-600 text-white border border-gray-500 rounded text-xs"
                >
                  <option value="all">All Categories</option>
                  <option value="welcome">Welcome</option>
                  <option value="reward">Reward</option>
                  <option value="reminder">Reminder</option>
                  <option value="announcement">Announcement</option>
                  <option value="warning">Warning</option>
                  <option value="custom">Custom</option>
                </select>
                <input
                  type="text"
                  placeholder="Search templates..."
                  onChange={e => {
                    const query = e.target.value;
                    if (query) {
                      const filtered = mockNoticeTemplates.filter(template =>
                        template.name.toLowerCase().includes(query.toLowerCase()) ||
                        template.description.toLowerCase().includes(query.toLowerCase())
                      );
                      setTemplates(filtered);
                    } else {
                      setTemplates(mockNoticeTemplates);
                    }
                  }}
                  className="px-2 py-1 bg-gray-600 text-white border border-gray-500 rounded text-xs w-32"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="bg-gray-600 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-colors border border-gray-500"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-white font-medium text-sm">{template.name}</div>
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(template.priority)}`}>
                      {template.priority}
                    </span>
                  </div>
                  <div className="text-gray-300 text-xs mb-1">{template.title}</div>
                  <div className="text-gray-400 text-xs">{template.description}</div>
                  {template.variables && template.variables.length > 0 && (
                    <div className="mt-2">
                      <div className="text-gray-500 text-xs mb-1">Variables: {template.variables.join(', ')}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {templates.length === 0 && (
              <div className="text-gray-400 text-center py-4">No templates found</div>
            )}
          </div>
        )}

        {/* Notice Type and Priority */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">Type</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">Priority</label>
            <select
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">Schedule (Optional)</label>
            <input
              type="datetime-local"
              value={form.scheduledAt || ''}
              onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
            />
          </div>
        </div>

        {/* Recipient Selection */}
        <div className="space-y-4">
          <label className="block text-gray-400 mb-2">Recipient Selection</label>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="all"
                checked={form.recipientType === 'all'}
                onChange={e => setForm(f => ({ ...f, recipientType: e.target.value as 'all' }))}
                className="text-blue-500"
              />
              <span className="text-white">All Users</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="specific"
                checked={form.recipientType === 'specific'}
                onChange={e => setForm(f => ({ ...f, recipientType: e.target.value as 'specific' }))}
                className="text-blue-500"
              />
              <span className="text-white">Specific Users</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="bulk"
                checked={form.recipientType === 'bulk'}
                onChange={e => setForm(f => ({ ...f, recipientType: e.target.value as 'bulk' }))}
                className="text-blue-500"
              />
              <span className="text-white">Bulk User IDs</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="criteria"
                checked={form.recipientType === 'criteria'}
                onChange={e => setForm(f => ({ ...f, recipientType: e.target.value as 'criteria' }))}
                className="text-blue-500"
              />
              <span className="text-white">By Criteria</span>
            </label>
          </div>

          {/* Specific User Selection */}
          {form.recipientType === 'specific' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserSelector(!showUserSelector)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  {showUserSelector ? 'Hide User Selector' : 'Select Users'}
                </button>
                <span className="text-gray-400 text-sm">
                  {form.selectedUsers.length} user(s) selected
                </span>
              </div>

              {showUserSelector && (
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <UserSelector
                    selectedUsers={form.selectedUsers}
                    onSelectionChange={handleUserSelectionChange}
                    users={mockAirdropUsers}
                    showStatus={true}
                    showPoints={true}
                    placeholder="Search users by ID, username, email, or wallet address..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Bulk User IDs Input */}
          {form.recipientType === 'bulk' && (
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm">
                Enter User IDs (comma, space, or newline separated)
              </label>
              <textarea
                value={form.bulkUserIds}
                onChange={e => setForm(f => ({ ...f, bulkUserIds: e.target.value }))}
                placeholder="U001, U002, U003&#10;U004 U005&#10;U006"
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
              />
            </div>
          )}

          {/* Criteria-based Selection */}
          {form.recipientType === 'criteria' && (
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Status</label>
                  <select
                    value={form.criteria.status}
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      criteria: { ...f.criteria, status: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="banned">Banned Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">KYC Status</label>
                  <select
                    value={form.criteria.kycStatus}
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      criteria: { ...f.criteria, kycStatus: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg"
                  >
                    <option value="all">All KYC Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Min Points</label>
                  <input
                    type="number"
                    value={form.criteria.minPoints}
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      criteria: { ...f.criteria, minPoints: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Max Points</label>
                  <input
                    type="number"
                    value={form.criteria.maxPoints}
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      criteria: { ...f.criteria, maxPoints: parseInt(e.target.value) || 10000 }
                    }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Message</label>
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" /> 
                {form.scheduledAt ? 'Schedule Notice' : 'Send Notice'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Filter notices by title, message, or recipient..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status || ''}
            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filters.type || ''}
            onChange={e => setFilters(prev => ({ ...prev, type: e.target.value as any || undefined }))}
            className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          >
            <option value="">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
      </div>

      {/* Notice List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-xl border border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Type</th>
              <th className="px-4 py-2 text-left text-gray-400">Title</th>
              <th className="px-4 py-2 text-left text-gray-400">Recipients</th>
              <th className="px-4 py-2 text-left text-gray-400">Priority</th>
              <th className="px-4 py-2 text-left text-gray-400">Status</th>
              <th className="px-4 py-2 text-left text-gray-400">Delivered/Read</th>
              <th className="px-4 py-2 text-left text-gray-400">Created</th>
              <th className="px-4 py-2 text-left text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices
              .filter(notice => 
                !filter || 
                notice.title.toLowerCase().includes(filter.toLowerCase()) ||
                notice.message.toLowerCase().includes(filter.toLowerCase()) ||
                (Array.isArray(notice.recipients) ? notice.recipients.join(', ') : notice.recipients).toLowerCase().includes(filter.toLowerCase())
              )
              .map(notice => (
                <tr key={notice.id} className="border-t border-gray-700">
                  <td className="px-4 py-2 text-white">
                    {getTypeIcon(notice.type)}
                  </td>
                  <td className="px-4 py-2 text-white">{notice.title}</td>
                  <td className="px-4 py-2 text-white flex items-center gap-1">
                    {notice.recipients === 'all' ? (
                      <UsersIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <User className="w-4 h-4 text-blue-400" />
                    )}
                    {notice.recipients === 'all' ? 'All Users' : (notice.recipients as string[]).length}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(notice.status)}`}>
                      {notice.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-white text-sm">
                    {notice.deliveredCount}/{notice.readCount}
                  </td>
                  <td className="px-4 py-2 text-white text-sm">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <button className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white">
                        <Mail className="w-3 h-3" />
                      </button>
                      <button className="p-1 rounded bg-gray-600 hover:bg-gray-500 text-white">
                        <FileText className="w-3 h-3" />
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

export default AdvancedNotices;
