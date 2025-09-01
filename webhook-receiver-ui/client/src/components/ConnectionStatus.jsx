import React from 'react';

function ConnectionStatus({ isConnected }) {
  return (
    <div className={`${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-white' : 'bg-white opacity-50'} live-indicator`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Connected to Webhook Server' : 'Disconnected - Waiting for connection...'}
          </span>
        </div>
        <div className="text-sm">
          Endpoint: http://localhost:3000/webhook
        </div>
      </div>
    </div>
  );
}

export default ConnectionStatus;