import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye, MessageCircle, Loader } from 'lucide-react';
import { TemplateApiService } from '../api/templateApi';

interface TemplateEditorProps {
  onTemplateChange?: (template: string) => void;
}

const DEFAULT_TEMPLATE = `🚗 *Paint Protection Film Quote Request*

Thank you for your interest in our premium PPF services!

Your phone number: {whatsapp_number}

Our team of certified PPF specialists will contact you within 5 minutes with:
• Professional vehicle assessment
• Custom PPF package options
• Competitive pricing
• Flexible scheduling

We look forward to protecting your vehicle! 🛡️

---
*EasyAuto Dubai - PPF Specialists*`;

export function TemplateEditor({ onTemplateChange }: TemplateEditorProps) {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState({
    whatsapp_number: '+971501234567'
  });

  // Load template from Supabase on mount
  useEffect(() => {
    loadTemplateFromSupabase();
  }, []);

  const loadTemplateFromSupabase = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TemplateApiService.getActiveTemplate();
      
      if (response.success && response.data) {
        setTemplate(response.data as string);
      } else {
        // If no template found, initialize with default
        await TemplateApiService.initializeDefaultTemplate();
        const retryResponse = await TemplateApiService.getActiveTemplate();
        if (retryResponse.success && retryResponse.data) {
          setTemplate(retryResponse.data as string);
        }
      }
    } catch (err) {
      console.error('Error loading template:', err);
      setError('Failed to load template from database');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await TemplateApiService.saveTemplate(template);
      
      if (response.success) {
        setIsSaved(true);
        onTemplateChange?.(template);
        
        // Reset saved indicator after 2 seconds
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        setError(response.error || 'Failed to save template');
      }
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template to database');
    } finally {
      setIsSaving(false);
    }
  };

  const resetTemplate = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await TemplateApiService.saveTemplate(DEFAULT_TEMPLATE);
      
      if (response.success) {
        setTemplate(DEFAULT_TEMPLATE);
        setIsSaved(true);
        onTemplateChange?.(DEFAULT_TEMPLATE);
        
        // Reset saved indicator after 2 seconds
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        setError(response.error || 'Failed to reset template');
      }
    } catch (err) {
      console.error('Error resetting template:', err);
      setError('Failed to reset template');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePreview = () => {
    return template
      .replace(/{whatsapp_number}/g, previewData.whatsapp_number);
  };

  const updatePreviewData = (field: string, value: string) => {
    setPreviewData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading template...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">PPF Message Template Editor</h2>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-medium">Error:</span>
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Edit Template</h3>
            <div className="flex gap-2">
              <button
                onClick={resetTemplate}
                disabled={isSaving}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={saveTemplate}
                disabled={isSaving}
                className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
                  isSaved 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Template Variables:
            </label>
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <p>Available variables: {'{whatsapp_number}'}</p>
            </div>
          </div>

          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            disabled={isSaving}
            className="w-full h-96 p-3 border border-gray-300 rounded-md font-mono text-sm text-gray-900 bg-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="Enter your message template..."
          />
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
          </div>

          {/* Preview Data Controls */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Preview Data:
            </label>
            <input
              type="text"
              value={previewData.whatsapp_number}
              onChange={(e) => updatePreviewData('whatsapp_number', e.target.value)}
              placeholder="WhatsApp Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>

          {/* Preview Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {generatePreview()}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Edit the template using the variable: {'{whatsapp_number}'}</li>
          <li>• Use WhatsApp formatting: *bold*, _italic_, ~strikethrough~</li>
          <li>• Add emojis and line breaks as needed</li>
          <li>• Click "Save" to update the template used in the form (saves to database)</li>
          <li>• Use the preview data to test how your template looks</li>
          <li>• Template is now stored globally and works across all devices</li>
        </ul>
      </div>
    </div>
  );
} 