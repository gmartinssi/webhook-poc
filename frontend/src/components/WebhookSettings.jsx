import React, { useState, useEffect } from 'react';
import { webhookAPI } from '../services/api';

function WebhookSettings({ userId }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState(null);

  // Fetch existing webhook when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchWebhook();
    }
  }, [userId]);

  const fetchWebhook = async () => {
    setFetching(true);
    try {
      const data = await webhookAPI.getByUserId(userId);
      if (data) {
        setCurrentWebhook(data);
        setWebhookUrl(data.webhookUrl || '');
      }
    } catch (err) {
      console.error('Error fetching webhook:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!webhookUrl.trim()) {
      setError('Please enter a webhook URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(webhookUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const subscriptionData = {
        userId: parseInt(userId),
        webhookUrl: webhookUrl.trim()
      };
      
      const result = await webhookAPI.subscribe(subscriptionData);
      setCurrentWebhook(result);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update webhook settings. Please try again.');
      console.error('Error updating webhook:', err);
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!currentWebhook?.webhookUrl) {
      setError('No webhook URL configured');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Create a test article to trigger the webhook
      const testArticle = {
        title: 'Test Article for Webhook',
        content: 'This is a test article created to verify webhook functionality.',
        userId: parseInt(userId)
      };

      const response = await fetch('http://localhost:8080/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testArticle)
      });

      if (response.ok) {
        setSuccess(true);
        setError('');
        setTimeout(() => {
          setSuccess(false);
          setError('Test article created! Check your webhook endpoint for the notification.');
        }, 500);
      } else {
        throw new Error('Failed to create test article');
      }
    } catch (err) {
      setError('Failed to test webhook. Please ensure your backend is running.');
      console.error('Error testing webhook:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
            Webhook settings updated successfully!
          </div>
        )}

        <div>
          <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Webhook URL
          </label>
          <input
            type="url"
            id="webhookUrl"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://example.com/webhook"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the URL where you want to receive webhook notifications for article events
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            disabled
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors duration-200
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
          >
            {loading ? 'Saving...' : currentWebhook ? 'Update Webhook' : 'Subscribe Webhook'}
          </button>
          
          {currentWebhook && (
            <button
              type="button"
              onClick={testWebhook}
              disabled={loading}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                ${loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                }`}
            >
              Test Webhook
            </button>
          )}
        </div>
      </form>

      {/* Current Webhook Info */}
      {currentWebhook && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Current Webhook Configuration
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-blue-700">
              <span className="font-medium">URL:</span> {currentWebhook.webhookUrl}
            </p>
            <p className="text-blue-700">
              <span className="font-medium">User ID:</span> {currentWebhook.userId}
            </p>
          </div>
        </div>
      )}

      {/* Webhook Events Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Webhook Events
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Your webhook endpoint will receive POST requests for the following events:
        </p>
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span><strong>ARTICLE_CREATED</strong> - When a new article is created</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span><strong>ARTICLE_UPDATED</strong> - When an article is updated</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">✓</span>
            <span><strong>ARTICLE_DELETED</strong> - When an article is deleted</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default WebhookSettings;