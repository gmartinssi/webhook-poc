import React from 'react';

function Tabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'articles', name: 'Articles', icon: '📝' },
    { id: 'webhooks', name: 'Webhook Settings', icon: '🔔' },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="flex items-center gap-2">
              <span>{tab.icon}</span>
              {tab.name}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Tabs;