import { useAuth } from '../hooks/useAuth';
import { AdminLogin } from '../components/AdminLogin';
import { WassenderApiManager } from '../components/WassenderApiManager';
import { TemplateEditor } from '../components/TemplateEditor';
import { PPFLeadTable } from '../components/PPFLeadTable';
import { TemplateApiService } from '../api/templateApi';
import { PPFLeadApiService } from '../api/ppfLeadApi';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, MessageSquare, Database } from 'lucide-react';

export function AdminPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [dbStatus, setDbStatus] = useState<string>('');
  const [leadTestStatus, setLeadTestStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState('leads');

  const checkDatabaseStatus = async () => {
    try {
      setDbStatus('Checking database...');
      const response = await TemplateApiService.getActiveTemplate();
      if (response.success && response.data) {
        setDbStatus(`✅ Database connected! Active template found (${(response.data as string).length} characters)`);
      } else {
        setDbStatus('⚠️ Database connected but no active template found');
      }
    } catch (error) {
      setDbStatus('❌ Database connection failed');
      console.error('Database check error:', error);
    }
  };

  const testLeadPolicies = async () => {
    try {
      setLeadTestStatus('Testing lead policies...');
      const result = await PPFLeadApiService.testPolicies();
      
      if (result.success) {
        setLeadTestStatus(`✅ ${result.data?.message || 'All policies working correctly'}`);
        console.log('Test data:', result.data);
      } else {
        setLeadTestStatus(`❌ ${result.error || 'Policy test failed'}`);
      }
    } catch (error) {
      setLeadTestStatus('❌ Policy test failed');
      console.error('Policy test error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">PPF Admin Panel</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                API Settings
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database
              </TabsTrigger>
            </TabsList>

            {/* Leads Tab */}
            <TabsContent value="leads" className="space-y-6">
              <PPFLeadTable />
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <TemplateEditor />
            </TabsContent>

            {/* API Settings Tab */}
            <TabsContent value="api" className="space-y-6">
              <WassenderApiManager />
            </TabsContent>

            {/* Database Tab */}
            <TabsContent value="database" className="space-y-6">
              {/* Database Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Database Status</h2>
                  <button
                    onClick={checkDatabaseStatus}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Check Database
                  </button>
                </div>
                {dbStatus && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">{dbStatus}</span>
                  </div>
                )}
              </div>

              {/* Lead Policies Test */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Lead Policies Test</h2>
                  <button
                    onClick={testLeadPolicies}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Test Policies
                  </button>
                </div>
                {leadTestStatus && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">{leadTestStatus}</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
} 