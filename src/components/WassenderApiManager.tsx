import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, XCircle, Loader } from 'lucide-react';
import { checkApiStatus, sendMessage, createTextMessage } from '../api/wassender';
import { getApiKeyFromSupabase, setApiKeyToSupabase } from '../lib/config';

export function WassenderApiManager() {
  const [apiKey, setApiKeyState] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [testMessage, setTestMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');

  useEffect(() => {
    const loadApiKey = async () => {
      const storedKey = await getApiKeyFromSupabase() || '';
      setApiKeyState(storedKey);
    };
    loadApiKey();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your Wassender API key');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await setApiKeyToSupabase(apiKey.trim());
      if (success) {
        alert('API key saved successfully to Supabase!');
      } else {
        alert('Failed to save API key to Supabase. Check console for details.');
      }
    } catch (error) {
      alert('Error saving API key: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setStatus('checking');
    setStatusMsg('');
    try {
      const result = await checkApiStatus();
      setStatus('success');
      setStatusMsg('API Connected: ' + (result?.status || JSON.stringify(result)));
    } catch (error: any) {
      setStatus('error');
      setStatusMsg(error?.response?.data?.message || error?.message || 'Unknown error');
    }
  };

  const handleTestMessage = async () => {
    if (!testPhone.trim() || !testMessage.trim()) {
      alert('Please enter both phone number and message');
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = createTextMessage(testPhone.trim(), testMessage.trim());
      const result = await sendMessage(payload);
      alert('Test message sent successfully!');
      setTestMessage('');
    } catch (error: any) {
      alert('Failed to send test message: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
          <Key className="h-6 w-6" />
          Wassender API Configuration
        </h2>
        
        {/* API Key Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900">API Key Management</h3>
          <div className="flex items-center gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="Enter your Wassender API key"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={handleSaveApiKey}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : null}
              Save
            </button>
          </div>
        </div>

        {/* Status Check Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
          <button
            onClick={handleCheckStatus}
            disabled={status === 'checking'}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {status === 'checking' ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Checking...
              </span>
            ) : (
              'Check Status'
            )}
          </button>
          
          {status !== 'idle' && (
            <div className={`p-3 rounded-md ${
              status === 'success' ? 'bg-green-100 text-green-800' : 
              status === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              <div className="flex items-center gap-2">
                {status === 'success' ? <CheckCircle className="h-4 w-4" /> : 
                 status === 'error' ? <XCircle className="h-4 w-4" /> : null}
                {statusMsg}
              </div>
            </div>
          )}
        </div>

        {/* Test Message Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Message</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Phone Number (with country code)
              </label>
              <input
                type="text"
                placeholder="+971501234567"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Test Message
              </label>
              <input
                type="text"
                placeholder="Hello from PPF Lander!"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
          </div>
          <button
            onClick={handleTestMessage}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Test Message'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 