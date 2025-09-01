import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import WebhookList from './components/WebhookList';
import WebhookDetails from './components/WebhookDetails';
import Header from './components/Header';
import Stats from './components/Stats';
import ConnectionStatus from './components/ConnectionStatus';

const SOCKET_URL = 'http://localhost:3000';

function App() {
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to webhook server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from webhook server');
      setIsConnected(false);
    });

    // Handle initial webhooks load
    newSocket.on('initial-webhooks', (initialWebhooks) => {
      setWebhooks(initialWebhooks);
    });

    // Handle new webhook
    newSocket.on('new-webhook', (webhook) => {
      setWebhooks(prev => [webhook, ...prev]);
      
      // Show notification (optional)
      if (Notification.permission === 'granted') {
        new Notification('New Webhook Received', {
          body: `Event: ${webhook.eventType}`,
          icon: '/webhook-icon.svg'
        });
      }
    });

    // Handle webhooks cleared
    newSocket.on('webhooks-cleared', () => {
      setWebhooks([]);
      setSelectedWebhook(null);
    });

    setSocket(newSocket);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      newSocket.close();
    };
  }, []);

  const handleClearWebhooks = useCallback(() => {
    if (socket && window.confirm('Are you sure you want to clear all webhooks?')) {
      socket.emit('clear-webhooks');
    }
  }, [socket]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(webhooks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `webhooks-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [webhooks]);

  // Filter webhooks based on search and filter criteria
  const filteredWebhooks = webhooks.filter(webhook => {
    const matchesFilter = filter === 'all' || webhook.eventType === filter;
    const matchesSearch = searchTerm === '' || 
      JSON.stringify(webhook).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get unique event types for filter
  const eventTypes = [...new Set(webhooks.map(w => w.eventType))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onClear={handleClearWebhooks}
        onExport={handleExport}
        webhookCount={webhooks.length}
      />
      
      <ConnectionStatus isConnected={isConnected} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stats webhooks={webhooks} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Webhook List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Search webhooks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Events</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <WebhookList 
                webhooks={filteredWebhooks}
                selectedWebhook={selectedWebhook}
                onSelectWebhook={setSelectedWebhook}
              />
            </div>
          </div>
          
          {/* Webhook Details */}
          <div className="lg:col-span-1">
            <WebhookDetails webhook={selectedWebhook} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;