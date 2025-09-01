import React from 'react';

function Stats({ webhooks }) {
  // Calculate statistics
  const eventTypeCounts = webhooks.reduce((acc, webhook) => {
    acc[webhook.eventType] = (acc[webhook.eventType] || 0) + 1;
    return acc;
  }, {});

  const lastHourWebhooks = webhooks.filter(w => {
    const webhookTime = new Date(w.timestamp);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return webhookTime > oneHourAgo;
  });

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'ARTICLE_CREATED': return 'bg-green-100 text-green-800';
      case 'ARTICLE_UPDATED': return 'bg-blue-100 text-blue-800';
      case 'ARTICLE_DELETED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Total Webhooks</p>
            <p className="text-2xl font-semibold text-gray-900">{webhooks.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Last Hour</p>
            <p className="text-2xl font-semibold text-gray-900">{lastHourWebhooks.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Event Types</p>
            <p className="text-2xl font-semibold text-gray-900">{Object.keys(eventTypeCounts).length}</p>
          </div>
        </div>
      </div>

      {/* Event Type Breakdown */}
      {Object.keys(eventTypeCounts).length > 0 && (
        <div className="col-span-full bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Event Type Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(eventTypeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(type)}`}>
                  {type}
                </span>
                <span className="text-xl font-semibold text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stats;