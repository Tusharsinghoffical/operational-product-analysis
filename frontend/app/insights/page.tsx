'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import AIInsightsPanel from '@/components/AIInsightsPanel'
import ProtectedRoute from '@/components/ProtectedRoute'
import { fetchInsights, Insight } from '@/lib/api'
import { Brain, AlertTriangle, AlertCircle, Info, Clock, TrendingUp, Lightbulb, Filter } from 'lucide-react'

export default function InsightsPage() {
    const [insights, setInsights] = useState<Insight[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
    const [stats, setStats] = useState({
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        today: 0
    })

    useEffect(() => {
        loadInsights()
    }, [])

    const loadInsights = async () => {
        setLoading(true)
        try {
            const data = await fetchInsights()
            setInsights(data)
            
            // Calculate stats
            const today = new Date().toDateString()
            setStats({
                total: data.length,
                high: data.filter(i => i.severity.toLowerCase() === 'high').length,
                medium: data.filter(i => i.severity.toLowerCase() === 'medium').length,
                low: data.filter(i => i.severity.toLowerCase() === 'low').length,
                today: data.filter(i => new Date(i.timestamp).toDateString() === today).length
            })
        } catch (error) {
            console.error('Failed to load insights:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredInsights = insights.filter(insight => {
        if (filter === 'all') return true
        return insight.severity.toLowerCase() === filter
    })

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffHours < 1) return 'Just now'
        if (diffHours < 24) return `${diffHours} hours ago`
        if (diffDays === 1) return '1 day ago'
        return `${diffDays} days ago`
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': return <AlertTriangle size={18} />
            case 'medium': return <AlertCircle size={18} />
            case 'low': return <Info size={18} />
            default: return <Info size={18} />
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': return 'text-accent-orange rgba(255, 107, 43, 0.1)'
            case 'medium': return 'text-yellow-500 rgba(255, 193, 7, 0.1)'
            case 'low': return 'text-accent-teal rgba(0, 201, 177, 0.1)'
            default: return 'text-accent-teal rgba(0, 201, 177, 0.1)'
        }
    }

    return (
        <ProtectedRoute>
            <div className="flex h-screen animate-fadeIn">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <div className="max-w-7xl mx-auto p-8">
                            <div className="mb-8 animate-slideUp">
                                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>AI Insights</h1>
                                <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Deep analysis and intelligent recommendations</p>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-slideUp animation-delay-100">
                                <div className="card p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{stats.total}</div>
                                            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Total Insights</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                            <Brain size={20} style={{ color: 'var(--accent-teal)' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-orange)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-accent-orange">{stats.high}</div>
                                            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>High Priority</div>
                                        </div>
                                        <AlertTriangle size={20} className="text-accent-orange" />
                                    </div>
                                </div>
                                <div className="card p-4" style={{ borderLeft: '3px solid #ffc107' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-yellow-500">{stats.medium}</div>
                                            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Medium Priority</div>
                                        </div>
                                        <AlertCircle size={20} className="text-yellow-500" />
                                    </div>
                                </div>
                                <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-accent-teal">{stats.low}</div>
                                            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Low Priority</div>
                                        </div>
                                        <Info size={20} className="text-accent-teal" />
                                    </div>
                                </div>
                                <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{stats.today}</div>
                                            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Today</div>
                                        </div>
                                        <Clock size={20} style={{ color: 'var(--accent-teal)' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Filter Controls */}
                            <div className="card p-4 mb-6 animate-slideUp animation-delay-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filter by Severity:</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setFilter('all')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                filter === 'all' ? 'btn-primary' : 'btn-secondary'
                                            }`}
                                        >
                                            All ({stats.total})
                                        </button>
                                        <button
                                            onClick={() => setFilter('high')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                filter === 'high' ? 'btn-primary' : 'btn-secondary'
                                            }`}
                                            style={filter !== 'high' ? { color: 'var(--accent-orange)', borderColor: 'var(--accent-orange)' } : {}}
                                        >
                                            High ({stats.high})
                                        </button>
                                        <button
                                            onClick={() => setFilter('medium')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                filter === 'medium' ? 'btn-primary' : 'btn-secondary'
                                            }`}
                                            style={filter !== 'medium' ? { color: '#ffc107', borderColor: '#ffc107' } : {}}
                                        >
                                            Medium ({stats.medium})
                                        </button>
                                        <button
                                            onClick={() => setFilter('low')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                filter === 'low' ? 'btn-primary' : 'btn-secondary'
                                            }`}
                                        >
                                            Low ({stats.low})
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Insights List */}
                            <div className="animate-slideUp animation-delay-300">
                                {loading ? (
                                    <div className="card p-6">
                                        <div className="animate-pulse space-y-4">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                                            <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : filteredInsights.length === 0 ? (
                                    <div className="card p-6">
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                                <Lightbulb size={32} style={{ color: 'var(--accent-teal)' }} />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>No Insights Found</h3>
                                            <p style={{ color: 'var(--text-secondary)' }}>Upload data to generate AI insights</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredInsights.map((insight) => (
                                            <div
                                                key={insight.id}
                                                className="card p-6 hover:shadow-lg transition-all"
                                                style={{ borderLeft: `4px solid ${
                                                    insight.severity.toLowerCase() === 'high' ? 'var(--accent-orange)' :
                                                    insight.severity.toLowerCase() === 'medium' ? '#ffc107' :
                                                    'var(--accent-teal)'
                                                }`}}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`${getSeverityColor(insight.severity)} p-2 rounded-lg`}>
                                                        {getSeverityIcon(insight.severity)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h3 className="text-base font-semibold flex-1" style={{ color: 'var(--text-heading)' }}>
                                                                {insight.message}
                                                            </h3>
                                                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ml-4 ${getSeverityColor(insight.severity)}`}>
                                                                {insight.severity}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={12} />
                                                                <span>{formatTimestamp(insight.timestamp)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <TrendingUp size={12} />
                                                                <span>AI-Generated Insight</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
