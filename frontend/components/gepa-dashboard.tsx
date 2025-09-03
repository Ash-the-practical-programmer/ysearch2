'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Activity, Zap, Users, BarChart3, RefreshCw } from 'lucide-react'
import { getGEPAMetrics, getGEPAStatus, triggerGEPAOptimization } from '@/lib/api'

interface GEPADashboardProps {
  className?: string
}

export function GEPADashboard({ className = '' }: GEPADashboardProps) {
  const [metrics, setMetrics] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchData = async () => {
    try {
      const [metricsData, statusData] = await Promise.all([
        getGEPAMetrics(),
        getGEPAStatus()
      ])
      setMetrics(metricsData)
      setStatus(statusData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch GEPA data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptimize = async () => {
    setIsOptimizing(true)
    try {
      await triggerGEPAOptimization()
      // Refresh data after optimization
      await fetchData()
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">GEPA Optimization Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {status?.gepa_system_status || 'Unknown'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {status?.total_agents || 0} agents active
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Performance</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {metrics?.gepa_reasoning?.average_performance ? 
              `${(metrics.gepa_reasoning.average_performance * 100).toFixed(1)}%` : 
              'N/A'
            }
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Average optimization score
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {metrics?.gepa_reasoning?.total_processed || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Total queries optimized
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Users</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {metrics?.active_users || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Active users learning
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reasoning Agent Metrics */}
        {metrics?.gepa_reasoning && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              GEPA Reasoning Agent
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Optimization Cycles:</span>
                <span className="font-medium">{metrics.gepa_reasoning.optimization_cycles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Learning Rate:</span>
                <span className="font-medium">{metrics.gepa_reasoning.learning_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Processed:</span>
                <span className="font-medium">{metrics.gepa_reasoning.total_processed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Agent Metrics */}
        {metrics?.gepa_search && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              GEPA Search Agent
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Searches Optimized:</span>
                <span className="font-medium">{metrics.gepa_search.searches_optimized}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Improvement Score:</span>
                <span className="font-medium text-green-600">
                  +{(metrics.gepa_search.improvement_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">User Satisfaction:</span>
                <span className="font-medium text-green-600">
                  {(metrics.gepa_search.user_satisfaction * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agent Status */}
      {status?.agents && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
          <div className="space-y-3">
            {Object.entries(status.agents).map(([agentId, agentData]: [string, any]) => (
              <div key={agentId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">{agentId}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {agentData.optimization_enabled ? 'Optimization Enabled' : 'Standard Mode'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {agentData.performance_score && (
                    <span className="text-sm text-green-600 font-medium">
                      {(agentData.performance_score * 100).toFixed(1)}%
                    </span>
                  )}
                  <div className={`w-3 h-3 rounded-full ${
                    agentData.active ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}