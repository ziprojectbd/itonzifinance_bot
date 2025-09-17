import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Globe, 
  Bell, 
  Database, 
  Key, 
  Mail,
  Smartphone,
  DollarSign,
  Users,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Download
} from 'lucide-react';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxUsersPerDay: number;
  };
  security: {
    passwordMinLength: number;
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    ipWhitelist: string[];
  };
  payments: {
    minWithdrawal: number;
    maxWithdrawal: number;
    withdrawalFee: number;
    processingTime: number;
    enabledMethods: string[];
    autoApprovalLimit: number;
  };
  tasks: {
    maxTasksPerUser: number;
    defaultReward: number;
    taskCooldown: number;
    enableTaskTemplates: boolean;
    autoActivateNewTasks: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    webhookUrl: string;
    notificationRetries: number;
  };
  api: {
    rateLimit: number;
    enableCors: boolean;
    allowedOrigins: string[];
    apiVersion: string;
    enableLogging: boolean;
  };
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'payments' | 'tasks' | 'notifications' | 'api'>('general');
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: 'iTonzi',
      siteDescription: 'Earn cryptocurrency by watching ads and completing tasks',
      supportEmail: 'support@itonzi.com',
      maintenanceMode: false,
      registrationEnabled: true,
      maxUsersPerDay: 1000
    },
    security: {
      passwordMinLength: 8,
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      ipWhitelist: []
    },
    payments: {
      minWithdrawal: 0.1,
      maxWithdrawal: 1000,
      withdrawalFee: 0.01,
      processingTime: 24,
      enabledMethods: ['TON Wallet', 'USDT (TRC20)'],
      autoApprovalLimit: 100
    },
    tasks: {
      maxTasksPerUser: 50,
      defaultReward: 10,
      taskCooldown: 24,
      enableTaskTemplates: true,
      autoActivateNewTasks: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      webhookUrl: '',
      notificationRetries: 3
    },
    api: {
      rateLimit: 100,
      enableCors: true,
      allowedOrigins: ['https://itonzi.com'],
      apiVersion: 'v1',
      enableLogging: true
    }
  });

  const [showApiKeys, setShowApiKeys] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const saveConfig = () => {
    // Save configuration to backend
    console.log('Saving configuration:', config);
    setUnsavedChanges(false);
    // Show success message
  };

  const resetConfig = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default configuration
      setUnsavedChanges(false);
    }
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'itonzi-config.json';
    link.click();
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setConfig(importedConfig);
          setUnsavedChanges(true);
        } catch (error) {
          alert('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'tasks', label: 'Tasks', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">System Settings</h2>
            <p className="text-gray-200">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {unsavedChanges && (
              <div className="flex items-center gap-2 text-yellow-300">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
              id="import-config"
            />
            <label
              htmlFor="import-config"
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              title="Import Config"
            >
              <Upload className="w-5 h-5" />
            </label>
            <button
              onClick={exportConfig}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              title="Export Config"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={resetConfig}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              title="Reset to Defaults"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Settings Categories</h3>
          </div>
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-white font-bold text-lg capitalize">{activeTab} Settings</h3>
          </div>

          <div className="p-2 sm:p-4 md:p-6 w-full max-w-full flex-1 overflow-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Site Name</label>
                    <input
                      type="text"
                      value={config.general.siteName}
                      onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Support Email</label>
                    <input
                      type="email"
                      value={config.general.supportEmail}
                      onChange={(e) => updateConfig('general', 'supportEmail', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Site Description</label>
                  <textarea
                    value={config.general.siteDescription}
                    onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Max Users Per Day</label>
                  <input
                    type="number"
                    value={config.general.maxUsersPerDay}
                    onChange={(e) => updateConfig('general', 'maxUsersPerDay', parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={config.general.maintenanceMode}
                      onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="maintenanceMode" className="text-white font-medium">
                      Maintenance Mode
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="registrationEnabled"
                      checked={config.general.registrationEnabled}
                      onChange={(e) => updateConfig('general', 'registrationEnabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="registrationEnabled" className="text-white font-medium">
                      Enable User Registration
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Password Min Length</label>
                    <input
                      type="number"
                      value={config.security.passwordMinLength}
                      onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Session Timeout (hours)</label>
                    <input
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="requireEmailVerification"
                      checked={config.security.requireEmailVerification}
                      onChange={(e) => updateConfig('security', 'requireEmailVerification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="requireEmailVerification" className="text-white font-medium">
                      Require Email Verification
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableTwoFactor"
                      checked={config.security.enableTwoFactor}
                      onChange={(e) => updateConfig('security', 'enableTwoFactor', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="enableTwoFactor" className="text-white font-medium">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Min Withdrawal ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.payments.minWithdrawal}
                      onChange={(e) => updateConfig('payments', 'minWithdrawal', parseFloat(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Max Withdrawal ($)</label>
                    <input
                      type="number"
                      value={config.payments.maxWithdrawal}
                      onChange={(e) => updateConfig('payments', 'maxWithdrawal', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Withdrawal Fee ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.payments.withdrawalFee}
                      onChange={(e) => updateConfig('payments', 'withdrawalFee', parseFloat(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Processing Time (hours)</label>
                    <input
                      type="number"
                      value={config.payments.processingTime}
                      onChange={(e) => updateConfig('payments', 'processingTime', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Auto Approval Limit ($)</label>
                    <input
                      type="number"
                      value={config.payments.autoApprovalLimit}
                      onChange={(e) => updateConfig('payments', 'autoApprovalLimit', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Enabled Payment Methods</label>
                  <div className="space-y-2">
                    {['TON Wallet', 'USDT (TRC20)', 'PayPal', 'Bank Transfer'].map((method) => (
                      <div key={method} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={method}
                          checked={config.payments.enabledMethods.includes(method)}
                          onChange={(e) => {
                            const methods = e.target.checked
                              ? [...config.payments.enabledMethods, method]
                              : config.payments.enabledMethods.filter(m => m !== method);
                            updateConfig('payments', 'enabledMethods', methods);
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={method} className="text-white font-medium">
                          {method}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Max Tasks Per User</label>
                    <input
                      type="number"
                      value={config.tasks.maxTasksPerUser}
                      onChange={(e) => updateConfig('tasks', 'maxTasksPerUser', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Default Reward (coins)</label>
                    <input
                      type="number"
                      value={config.tasks.defaultReward}
                      onChange={(e) => updateConfig('tasks', 'defaultReward', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Task Cooldown (hours)</label>
                    <input
                      type="number"
                      value={config.tasks.taskCooldown}
                      onChange={(e) => updateConfig('tasks', 'taskCooldown', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableTaskTemplates"
                      checked={config.tasks.enableTaskTemplates}
                      onChange={(e) => updateConfig('tasks', 'enableTaskTemplates', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="enableTaskTemplates" className="text-white font-medium">
                      Enable Task Templates
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="autoActivateNewTasks"
                      checked={config.tasks.autoActivateNewTasks}
                      onChange={(e) => updateConfig('tasks', 'autoActivateNewTasks', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="autoActivateNewTasks" className="text-white font-medium">
                      Auto-activate New Tasks
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={config.notifications.emailNotifications}
                      onChange={(e) => updateConfig('notifications', 'emailNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="emailNotifications" className="text-white font-medium">
                      Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="pushNotifications"
                      checked={config.notifications.pushNotifications}
                      onChange={(e) => updateConfig('notifications', 'pushNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="pushNotifications" className="text-white font-medium">
                      Push Notifications
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={config.notifications.smsNotifications}
                      onChange={(e) => updateConfig('notifications', 'smsNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="smsNotifications" className="text-white font-medium">
                      SMS Notifications
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Webhook URL</label>
                  <input
                    type="url"
                    value={config.notifications.webhookUrl}
                    onChange={(e) => updateConfig('notifications', 'webhookUrl', e.target.value)}
                    placeholder="https://your-webhook-url.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Notification Retries</label>
                  <input
                    type="number"
                    value={config.notifications.notificationRetries}
                    onChange={(e) => updateConfig('notifications', 'notificationRetries', parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Rate Limit (requests/minute)</label>
                    <input
                      type="number"
                      value={config.api.rateLimit}
                      onChange={(e) => updateConfig('api', 'rateLimit', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">API Version</label>
                    <input
                      type="text"
                      value={config.api.apiVersion}
                      onChange={(e) => updateConfig('api', 'apiVersion', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Allowed Origins (one per line)</label>
                  <textarea
                    value={config.api.allowedOrigins.join('\n')}
                    onChange={(e) => updateConfig('api', 'allowedOrigins', e.target.value.split('\n').filter(o => o.trim()))}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none resize-none"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableCors"
                      checked={config.api.enableCors}
                      onChange={(e) => updateConfig('api', 'enableCors', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="enableCors" className="text-white font-medium">
                      Enable CORS
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableLogging"
                      checked={config.api.enableLogging}
                      onChange={(e) => updateConfig('api', 'enableLogging', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="enableLogging" className="text-white font-medium">
                      Enable API Logging
                    </label>
                  </div>
                </div>

                {/* API Keys Section */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-bold">API Keys</h4>
                    <button
                      onClick={() => setShowApiKeys(!showApiKeys)}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                    >
                      {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showApiKeys ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Public Key</label>
                      <div className="bg-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-300">
                        {showApiKeys ? 'pk_live_1234567890abcdef' : '••••••••••••••••••••••••'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Secret Key</label>
                      <div className="bg-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-300">
                        {showApiKeys ? 'sk_live_abcdef1234567890' : '••••••••••••••••••••••••'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="p-6 border-t border-gray-700 flex gap-3">
            <button
              onClick={saveConfig}
              disabled={!unsavedChanges}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            {unsavedChanges && (
              <button
                onClick={() => setUnsavedChanges(false)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;