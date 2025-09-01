import React, { useState } from 'react';
import { articleAPI } from '../services/api';

function ArticleList({ articles, userId, loading, onArticleDeleted }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setDeletingId(articleId);
    try {
      await articleAPI.delete(articleId, userId);
      if (onArticleDeleted) {
        onArticleDeleted(articleId);
      }
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">No articles yet</p>
        <p className="text-sm text-gray-400 mt-1">Create your first article above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {article.title}
              </h3>
              <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                {article.content}
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <span>ID: {article.id}</span>
                <span>•</span>
                <span>Created: {formatDate(article.createdAt)}</span>
                {article.updatedAt !== article.createdAt && (
                  <>
                    <span>•</span>
                    <span>Updated: {formatDate(article.updatedAt)}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(article.id)}
              disabled={deletingId === article.id}
              className={`ml-4 p-2 rounded-md transition-colors duration-200
                ${deletingId === article.id
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              title="Delete article"
            >
              {deletingId === article.id ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArticleList;