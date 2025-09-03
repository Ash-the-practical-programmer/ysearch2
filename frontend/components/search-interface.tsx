'use client'

import React, { useState, useCallback } from 'react'
import { Search, Loader2, ThumbsUp, ThumbsDown, ExternalLink, Zap, TrendingUp } from 'lucide-react'
import { SearchInput } from '@/components/symphony/search-input'
import { search, searchWithGEPA, searchTraditional, submitFeedback, getGEPAMetrics } from '@/lib/api'
import type { SearchResponse, SearchResult, FeedbackRequest } from '@/lib/api'

interface SearchInterfaceProps {
  userId?: string
}

export function SearchInterface({ userId = 'default' }: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchMode, setSearchMode] = useState<'gepa' | 'traditional'>('gepa')
  const [lastResponse, setLastResponse] = useState<SearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const searchRequest = {
        query: searchQuery,
        user_id: userId
      }
      
      let response: SearchResponse
      
      if (searchMode === 'gepa') {
        response = await searchWithGEPA(searchRequest)
      } else {
        response = await searchTraditional(searchRequest)
      }
      
      setResults(response.results)
      setLastResponse(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [userId, searchMode])

  const handleFeedback = useCallback(async (resultId: string, feedbackType: 'like' | 'dislike' | 'click') => {
    if (!lastResponse) return
    
    try {
      const feedbackRequest: FeedbackRequest = {
        query: lastResponse.original_query,
        result_id: resultId,
        user_id: userId,
        feedback_type: feedbackType
      }
      
      await submitFeedback(feedbackRequest)
      setFeedback(prev => ({ ...prev, [resultId]: feedbackType }))
    } catch (err) {
      console.error('Feedback submission failed:', err)
    }
  }, [userId, lastResponse])

  const handleResultClick = useCallback((result: SearchResult) => {
    handleFeedback(result.id, 'click')
    window.open(result.url, '_blank')
  }, [handleFeedback])

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          YSearch2 with GEPA Optimization
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered search that learns and improves with every query
        </p>
      </div>

      {/* Search Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSearchMode('gepa')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              searchMode === 'gepa'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            GEPA Optimized
          </button>
          <button
            onClick={() => setSearchMode('traditional')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchMode === 'traditional'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Traditional
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder={`Search with ${searchMode === 'gepa' ? 'GEPA optimization' : 'traditional search'}...`}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {/* Search Info */}
      {lastResponse && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Search Analysis</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Original Query:</span>
              <span className="ml-2 font-medium">{lastResponse.original_query}</span>
            </div>
            {lastResponse.enhanced_query && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Enhanced Query:</span>
                <span className="ml-2 font-medium text-blue-600">{lastResponse.enhanced_query}</span>
              </div>
            )}
            <div>
              <span className="text-gray-600 dark:text-gray-400">Results:</span>
              <span className="ml-2 font-medium">{results.length}</span>
            </div>
            {lastResponse.performance_score && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Performance Score:</span>
                <span className="ml-2 font-medium text-green-600">
                  {(lastResponse.performance_score * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {lastResponse.gepa_optimized && (
            <div className="flex items-center gap-2 text-green-600">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">GEPA Optimization Applied</span>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3
                      className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      {result.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {result.gepa_optimized && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          GEPA Optimized
                        </span>
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {result.url}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Score: {(result.score * 100).toFixed(1)}%
                      </span>
                      {result.personalized_score && (
                        <span className="text-sm text-green-600">
                          Personalized: {(result.personalized_score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFeedback(result.id, 'like')}
                        className={`p-2 rounded-full transition-colors ${
                          feedback[result.id] === 'like'
                            ? 'bg-green-100 text-green-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFeedback(result.id, 'dislike')}
                        className={`p-2 rounded-full transition-colors ${
                          feedback[result.id] === 'dislike'
                            ? 'bg-red-100 text-red-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}