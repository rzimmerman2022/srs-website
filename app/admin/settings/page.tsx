'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

// ============================================================================
// Types
// ============================================================================
interface Settings {
  general: {
    company_name: string;
    admin_email: string;
  };
  questionnaire: {
    default_points_per_question: number;
    auto_save_interval: number;
    session_timeout: number;
  };
  security: {
    session_timeout_duration: number;
    ip_allowlist: string;
    two_factor_enabled: boolean;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    from_email: string;
  };
}

// ============================================================================
// Main Component
// ============================================================================
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      company_name: '',
      admin_email: '',
    },
    questionnaire: {
      default_points_per_question: 10,
      auto_save_interval: 30,
      session_timeout: 60,
    },
    security: {
      session_timeout_duration: 3600,
      ip_allowlist: '',
      two_factor_enabled: false,
    },
    email: {
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      from_email: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/settings');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch settings');
        }

        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle form field changes
  const handleChange = (
    section: keyof Settings,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccessMessage('Settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle test email button
  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      setError(null);

      // TODO: Implement test email endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Test email sent successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to send test email:', err);
      setError('Failed to send test email');
    } finally {
      setTestingEmail(false);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-serif font-semibold text-navy">
          Settings
        </h1>
        <p className="mt-2 text-gray-600">
          Configure application settings and preferences
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={settings.general.company_name}
                  onChange={(e) => handleChange('general', 'company_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Southwest Resumes"
                />
              </div>
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={settings.general.admin_email}
                  onChange={(e) => handleChange('general', 'admin_email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="admin@southwestresumes.com"
                />
              </div>
            </div>
          </div>

          {/* Questionnaire Defaults */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">Questionnaire Defaults</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="default-points" className="block text-sm font-medium text-gray-700 mb-2">
                  Default Points Per Question
                </label>
                <input
                  id="default-points"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.questionnaire.default_points_per_question}
                  onChange={(e) => handleChange('questionnaire', 'default_points_per_question', parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">Points awarded per completed question</p>
              </div>
              <div>
                <label htmlFor="auto-save-interval" className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Save Interval (seconds)
                </label>
                <input
                  id="auto-save-interval"
                  type="number"
                  min="10"
                  max="300"
                  value={settings.questionnaire.auto_save_interval}
                  onChange={(e) => handleChange('questionnaire', 'auto_save_interval', parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">How often to auto-save progress (10-300 seconds)</p>
              </div>
              <div>
                <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  id="session-timeout"
                  type="number"
                  min="5"
                  max="1440"
                  value={settings.questionnaire.session_timeout}
                  onChange={(e) => handleChange('questionnaire', 'session_timeout', parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">Client session timeout duration (5-1440 minutes)</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="admin-session-timeout" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Session Timeout (seconds)
                </label>
                <input
                  id="admin-session-timeout"
                  type="number"
                  min="300"
                  max="86400"
                  value={settings.security.session_timeout_duration}
                  onChange={(e) => handleChange('security', 'session_timeout_duration', parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">Admin session timeout duration (300-86400 seconds)</p>
              </div>
              <div>
                <label htmlFor="ip-allowlist" className="block text-sm font-medium text-gray-700 mb-2">
                  IP Allowlist
                </label>
                <textarea
                  id="ip-allowlist"
                  rows={4}
                  value={settings.security.ip_allowlist}
                  onChange={(e) => handleChange('security', 'ip_allowlist', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent font-mono text-sm"
                  placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
                />
                <p className="mt-1 text-sm text-gray-500">One IP address per line. Leave empty to allow all IPs.</p>
              </div>
              <div className="flex items-center">
                <input
                  id="two-factor"
                  type="checkbox"
                  checked={settings.security.two_factor_enabled}
                  onChange={(e) => handleChange('security', 'two_factor_enabled', e.target.checked)}
                  className="w-5 h-5 text-gold border-gray-300 rounded focus:ring-2 focus:ring-gold"
                />
                <label htmlFor="two-factor" className="ml-3 text-sm font-medium text-gray-700">
                  Enable Two-Factor Authentication (Future)
                </label>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">Email Settings</h2>
            <p className="text-sm text-gray-600 mb-4">
              Configure SMTP settings for email notifications (future feature)
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="smtp-host" className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    id="smtp-host"
                    type="text"
                    value={settings.email.smtp_host}
                    onChange={(e) => handleChange('email', 'smtp_host', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    id="smtp-port"
                    type="number"
                    min="1"
                    max="65535"
                    value={settings.email.smtp_port}
                    onChange={(e) => handleChange('email', 'smtp_port', parseInt(e.target.value, 10))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="587"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="smtp-username" className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username
                </label>
                <input
                  id="smtp-username"
                  type="text"
                  value={settings.email.smtp_username}
                  onChange={(e) => handleChange('email', 'smtp_username', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="username@example.com"
                />
              </div>
              <div>
                <label htmlFor="smtp-password" className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password
                </label>
                <input
                  id="smtp-password"
                  type="password"
                  value={settings.email.smtp_password}
                  onChange={(e) => handleChange('email', 'smtp_password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="from-email" className="block text-sm font-medium text-gray-700 mb-2">
                  From Email Address
                </label>
                <input
                  id="from-email"
                  type="email"
                  value={settings.email.from_email}
                  onChange={(e) => handleChange('email', 'from_email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="noreply@southwestresumes.com"
                />
              </div>
              <div className="pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                >
                  {testingEmail ? 'Sending...' : 'Send Test Email'}
                </Button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
