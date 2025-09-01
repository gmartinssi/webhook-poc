import { useState, useEffect } from 'react';
import Tabs from './components/Tabs';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import WebhookSettings from './components/WebhookSettings';
import { articleAPI } from './services/api';

function App() {
  const [userId, setUserId] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch articles when userId changes
  useEffect(() => {
    if (userId) {
      fetchArticles();
    } else {
      setArticles([]);
    }
  }, [userId]);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await articleAPI.getByUserId(userId);
      setArticles(data);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetUserId = (e) => {
    e.preventDefault();
    if (tempUserId.trim()) {
      setUserId(tempUserId.trim());
    }
  };

  const handleArticleCreated = (newArticle) => {
    setArticles([newArticle, ...articles]);
  };

  const handleArticleDeleted = (articleId) => {
    setArticles(articles.filter(article => article.id !== articleId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Article Management System
            </h1>
            <span className="text-sm text-gray-500">Webhook POC</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User ID Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSetUserId} className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  id="userId"
                  value={tempUserId}
                  onChange={(e) => setTempUserId(e.target.value)}
                  placeholder="Enter your user ID (e.g., 1, 2, 3...)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Set User
                </button>
              </div>
              {userId && (
                <p className="mt-2 text-sm text-green-600">
                  Active User ID: <span className="font-semibold">{userId}</span>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Content Area */}
        {userId ? (
          <>
            {/* Tabs */}
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'articles' ? (
                <div className="space-y-6">
                  {/* Article Form */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Create New Article
                    </h2>
                    <ArticleForm 
                      userId={userId} 
                      onArticleCreated={handleArticleCreated}
                    />
                  </div>

                  {/* Articles List */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Your Articles
                    </h2>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                        {error}
                      </div>
                    )}
                    <ArticleList 
                      articles={articles}
                      userId={userId}
                      loading={loading}
                      onArticleDeleted={handleArticleDeleted}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Webhook Configuration
                  </h2>
                  <WebhookSettings userId={userId} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              Please enter a User ID above to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;