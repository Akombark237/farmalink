'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Globe,
  Clock,
  Users,
  Database
} from 'lucide-react';
import SecurityDashboard from '@/components/SecurityDashboard';
import ClientOnly from '@/components/ClientOnly';

interface SecuritySettings {
  rateLimiting: {
    enabled: boolean;
    authLimit: number;
    apiLimit: number;
    strictLimit: number;
    windowMinutes: number;
  };
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number;
    preventReuse: number;
  };
  accountSecurity: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    requireEmailVerification: boolean;
    enable2FA: boolean;
  };
  dataEncryption: {
    encryptPII: boolean;
    encryptMedicalRecords: boolean;
    encryptPaymentData: boolean;
    keyRotationDays: number;
  };
  httpsEnforcement: {
    enabled: boolean;
    hstsEnabled: boolean;
    hstsMaxAge: number;
    redirectHttp: boolean;
  };
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'logs'>('dashboard');
  const [settings, setSettings] = useState<SecuritySettings>({
    rateLimiting: {
      enabled: true,
      authLimit: 5,
      apiLimit: 100,
      strictLimit: 10,
      windowMinutes: 15
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      preventReuse: 5
    },
    accountSecurity: {
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      sessionTimeout: 24,
      requireEmailVerification: true,
      enable2FA: false
    },
    dataEncryption: {
      encryptPII: true,
      encryptMedicalRecords: true,
      encryptPaymentData: true,
      keyRotationDays: 30
    },
    httpsEnforcement: {
      enabled: true,
      hstsEnabled: true,
      hstsMaxAge: 31536000,
      redirectHttp: true
    }
  });
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // In production, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof SecuritySettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Security Center</h1>
                  <p className="text-sm text-gray-600">Manage security settings and monitor threats</p>
                </div>
              </div>
              
              {activeTab === 'settings' && (
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    saved 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : saved ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Security Dashboard', icon: Shield },
                { id: 'settings', label: 'Security Settings', icon: Settings },
                { id: 'logs', label: 'Security Logs', icon: Eye }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && <SecurityDashboard />}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Rate Limiting Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Rate Limiting</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Prevent API abuse and DDoS attacks</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Enable Rate Limiting</label>
                    <input
                      type="checkbox"
                      checked={settings.rateLimiting.enabled}
                      onChange={(e) => updateSettings('rateLimiting', 'enabled', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auth Endpoint Limit (per 15 min)
                      </label>
                      <input
                        type="number"
                        value={settings.rateLimiting.authLimit}
                        onChange={(e) => updateSettings('rateLimiting', 'authLimit', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Endpoint Limit (per 15 min)
                      </label>
                      <input
                        type="number"
                        value={settings.rateLimiting.apiLimit}
                        onChange={(e) => updateSettings('rateLimiting', 'apiLimit', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Key className="h-5 w-5 text-blue-600" />
                    <span>Password Policy</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Enforce strong password requirements</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      value={settings.passwordPolicy.minLength}
                      onChange={(e) => updateSettings('passwordPolicy', 'minLength', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="6"
                      max="32"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.passwordPolicy.requireUppercase}
                        onChange={(e) => updateSettings('passwordPolicy', 'requireUppercase', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Require Uppercase</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.passwordPolicy.requireLowercase}
                        onChange={(e) => updateSettings('passwordPolicy', 'requireLowercase', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Require Lowercase</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.passwordPolicy.requireNumbers}
                        onChange={(e) => updateSettings('passwordPolicy', 'requireNumbers', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Require Numbers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.passwordPolicy.requireSpecialChars}
                        onChange={(e) => updateSettings('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Require Special Characters</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Account Security</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Protect user accounts from unauthorized access</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.accountSecurity.maxLoginAttempts}
                        onChange={(e) => updateSettings('accountSecurity', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.accountSecurity.lockoutDuration}
                        onChange={(e) => updateSettings('accountSecurity', 'lockoutDuration', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.accountSecurity.requireEmailVerification}
                        onChange={(e) => updateSettings('accountSecurity', 'requireEmailVerification', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Require Email Verification</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.accountSecurity.enable2FA}
                        onChange={(e) => updateSettings('accountSecurity', 'enable2FA', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Encryption */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>Data Encryption</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Encrypt sensitive data at rest and in transit</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.dataEncryption.encryptPII}
                        onChange={(e) => updateSettings('dataEncryption', 'encryptPII', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Encrypt Personal Information (PII)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.dataEncryption.encryptMedicalRecords}
                        onChange={(e) => updateSettings('dataEncryption', 'encryptMedicalRecords', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Encrypt Medical Records</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.dataEncryption.encryptPaymentData}
                        onChange={(e) => updateSettings('dataEncryption', 'encryptPaymentData', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Encrypt Payment Data</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Rotation Period (days)
                    </label>
                    <input
                      type="number"
                      value={settings.dataEncryption.keyRotationDays}
                      onChange={(e) => updateSettings('dataEncryption', 'keyRotationDays', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* HTTPS Enforcement */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span>HTTPS Enforcement</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Secure data transmission with SSL/TLS</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.httpsEnforcement.enabled}
                        onChange={(e) => updateSettings('httpsEnforcement', 'enabled', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Force HTTPS</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.httpsEnforcement.hstsEnabled}
                        onChange={(e) => updateSettings('httpsEnforcement', 'hstsEnabled', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Enable HSTS (HTTP Strict Transport Security)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.httpsEnforcement.redirectHttp}
                        onChange={(e) => updateSettings('httpsEnforcement', 'redirectHttp', e.target.checked)}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-700">Redirect HTTP to HTTPS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Security Logs</h3>
                <p className="text-gray-600 mb-4">Detailed security event logs and audit trails</p>
                <div className="flex justify-center space-x-4">
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Export Logs</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
