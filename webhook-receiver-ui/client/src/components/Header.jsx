import React from 'react';

function Header({ onClear, onExport, webhookCount }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg className="h-10 w-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Webhook Receiver Dashboard</h1>
                <p className="text-sm text-blue-100">Real-time webhook monitoring</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right mr-4">
              <p className="text-sm text-blue-100">Total Webhooks</p>
              <p className="text-2xl font-bold">{webhookCount}</p>
            </div>
            
            <button
              onClick={onExport}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors duration-200 flex items-center space-x-2"
              title="Export webhooks as JSON"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>
            
            <button
              onClick={onClear}
              className="px-4 py-2 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-md transition-colors duration-200 flex items-center space-x-2"
              title="Clear all webhooks"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;