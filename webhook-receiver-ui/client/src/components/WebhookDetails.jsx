import React, { useState } from 'react';
import { format } from 'date-fns';

function WebhookDetails({ webhook }) {
  const [activeTab, setActiveTab] = useState('payload');

  if (!webhook) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No webhook selected</h3>
          <p className="mt-1 text-sm text-gray-500">Select a webhook to view details</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="bg-white rounded-lg shadow sticky top-8">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Webhook Details</h3>
        <p className="mt-1 text-sm text-gray-500">ID: {webhook.id}</p>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</label>
            <p className="mt-1 text-sm font-medium text-gray-900">{webhook.eventType}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</label>
            <p className="mt-1 text-sm text-gray-900">
              {format(new Date(webhook.timestamp), 'PPpp')}
            </p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source IP</label>
            <p className="mt-1 text-sm text-gray-900">{webhook.sourceIp}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('payload')}
            className={`flex-1 py-2 px-4 text-center border-b-2 text-sm font-medium ${
              activeTab === 'payload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payload
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`flex-1 py-2 px-4 text-center border-b-2 text-sm font-medium ${
              activeTab === 'headers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Headers
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`flex-1 py-2 px-4 text-center border-b-2 text-sm font-medium ${
              activeTab === 'raw'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Raw
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {activeTab === 'payload' && (
          <div>
            {webhook.data && (
              <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-x-auto">
                {JSON.stringify(webhook.data, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        {activeTab === 'headers' && (
          <div className="space-y-2">
            {Object.entries(webhook.headers || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-medium text-gray-500">{key}:</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'raw' && (
          <div>
            <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-x-auto">
              {JSON.stringify(webhook.fullPayload, null, 2)}
            </pre>
            <button
              onClick={() => copyToClipboard(JSON.stringify(webhook.fullPayload, null, 2))}
              className="mt-3 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebhookDetails;