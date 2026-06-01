'use client'

import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import BusinessHealthScore from '@/components/BusinessHealthScore'
import { MetricsGridRealtime } from '@/components/MetricsGrid'
import { SalesChartRealtime } from '@/components/SalesChart'
import AIInsightsPanel from '@/components/AIInsightsPanel'
import RiskMonitoringTable from '@/components/RiskMonitoringTable'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ProtectedRoute from '@/components/ProtectedRoute'
import { fetchInsights, mapInsightsToRisks, buildHealthMetricsFromInsights, HealthMetrics, Insight, RiskItem } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { RefreshCw, TrendingUp, AlertTriangle, CheckCircle, FileText } from 'lucide-react'

export default function DashboardPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [dashboardData, setDashboardData] = useState<{
    healthMetrics: HealthMetrics | null,
    insights: Insight[],
    risks: RiskItem[],
  }>({
    healthMetrics: null,
    insights: [],
    risks: [],
  })

  const [quickStats, setQuickStats] = useState({
    totalInsights: 0,
    highRisks: 0,
    activeRisks: 0,
    healthScore: 0
  })

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const insights = await fetchInsights()
      const healthMetrics = buildHealthMetricsFromInsights(insights)
      const risks = mapInsightsToRisks(insights)
      
      setDashboardData({
        healthMetrics,
        insights,
        risks,
      })
      
      // Calculate quick stats
      setQuickStats({
        totalInsights: insights.length,
        highRisks: risks.filter((r: any) => r.severity === 'High').length,
        activeRisks: risks.filter((r: any) => r.status === 'Active').length,
        healthScore: healthMetrics.healthScore || 0
      })
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }, [])

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchDashboardData()
      setLoading(false)
    }
    
    loadData()
  }, [fetchDashboardData])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchDashboardData])

  // Realtime updates via websocket (production-style event driven refresh)
  useEffect(() => {
    if (!token) return

    const wsBase = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
    const socket = new WebSocket(`${wsBase}/ws/insights?token=${encodeURIComponent(token)}`)

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message?.event === 'insights.updated') {
          fetchDashboardData()
        }
      } catch (err) {
        console.error('Invalid websocket message:', err)
      }
    }

    socket.onerror = (err) => {
      console.error('Realtime websocket error:', err)
    }

    return () => {
      socket.close()
    }
  }, [token, fetchDashboardData])

  // Manual refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen animate-fadeIn">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto p-8">
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <div className="space-y-6">
                  <div className="mb-8 animate-slideUp">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Business Overview</h1>
                        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>AI-powered operational insights and health monitoring</p>
                        {lastUpdated && (
                          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                            Last updated: {lastUpdated.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                        style={{ 
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--accent-teal)',
                          border: '1px solid var(--border-subtle)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                      >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slideUp animation-delay-100">
                    <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold" style={{ color: 'var(--accent-teal)' }}>{quickStats.healthScore}</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Health Score</div>
                        </div>
                        <TrendingUp size={24} style={{ color: 'var(--accent-teal)' }} />
                      </div>
                    </div>
                    <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{quickStats.totalInsights}</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>AI Insights</div>
                        </div>
                        <FileText size={24} style={{ color: 'var(--accent-teal)' }} />
                      </div>
                    </div>
                    <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-orange)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-accent-orange">{quickStats.highRisks}</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>High Risks</div>
                        </div>
                        <AlertTriangle size={24} className="text-accent-orange" />
                      </div>
                    </div>
                    <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{quickStats.activeRisks}</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Active Risks</div>
                        </div>
                        <CheckCircle size={24} style={{ color: 'var(--accent-teal)' }} />
                      </div>
                    </div>
                  </div>
                  <div className="animate-slideUp animation-delay-200">
                    <BusinessHealthScore healthMetrics={dashboardData.healthMetrics || undefined} />
                  </div>
                  <div className="animate-slideUp animation-delay-300">
                    <MetricsGridRealtime
                      healthMetrics={dashboardData.healthMetrics || undefined}
                      insightsCount={dashboardData.insights.length}
                    />
                  </div>
                  <div className="animate-slideUp animation-delay-400">
                    <SalesChartRealtime insights={dashboardData.insights} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slideUp animation-delay-500">
                    <AIInsightsPanel
                      insights={dashboardData.insights}
                      loading={loading}
                      onRefresh={handleRefresh}
                    />
                    <RiskMonitoringTable
                      risks={dashboardData.risks}
                      loading={loading}
                      onRefresh={handleRefresh}
                    />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
