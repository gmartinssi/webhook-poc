import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';

function WebhookList({ webhooks, selectedWebhook, onSelectWebhook }) {
  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'ARTICLE_CREATED':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'ARTICLE_UPDATED':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'ARTICLE_DELETED':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'ARTICLE_CREATED': return 'bg-green-100 text-green-800 border-green-200';
      case 'ARTICLE_UPDATED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ARTICLE_DELETED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (webhooks.length === 0) {
    return (
      <div className="p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No webhooks yet</h3>
        <p className="mt-1 text-sm text-gray-500">Waiting for incoming webhooks...</p>
        <div className="mt-4">
          <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Listening...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto">
      {webhooks.map((webhook, index) => (
        <div
          key={webhook.id}
          onClick={() => onSelectWebhook(webhook)}
          className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
            selectedWebhook?.id === webhook.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
          } ${index === 0 ? 'webhook-animate-in' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getEventTypeIcon(webhook.eventType)}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(webhook.eventType)}`}>
                    {webhook.eventType}
                  </span>
                  {webhook.data?.userId && (
                    <span className="text-xs text-gray-500">
                      User #{webhook.data.userId}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {webhook.data?.title || 'Webhook Event'}
                </p>
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{format(new Date(webhook.timestamp), 'HH:mm:ss')}</span>
                  <span>{formatDistanceToNow(new Date(webhook.timestamp), { addSuffix: true })}</span>
                  <span>ID: {webhook.id.substring(0, 8)}...</span>
                </div>
              </div>
            </div>
            {index === 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                New
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WebhookList;