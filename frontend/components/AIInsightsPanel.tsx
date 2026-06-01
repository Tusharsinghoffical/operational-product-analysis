'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, TrendingDown, Package, Clock, Upload } from 'lucide-react'
import { fetchInsights, Insight } from '@/lib/api'

const severityIcons = {
    high: <AlertTriangle size={20} />,
    medium: <Package size={20} />,
    low: <TrendingDown size={20} />,
}

const severityColors = {
    high: 'rgba(255, 107, 43, 0.1) text-accent-orange border-accent-orange',
    medium: 'rgba(255, 193, 7, 0.1) text-yellow-500 border-yellow-500',
    low: 'rgba(0, 201, 177, 0.1) text-accent-teal border-accent-teal',
}

const severityIconColors = {
    high: 'text-accent-orange',
    medium: 'text-yellow-500',
    low: 'text-accent-teal',
}

interface AIInsightsPanelProps {
    insights?: Insight[]
    loading?: boolean
    onRefresh?: () => Promise<void> | void
}

export default function AIInsightsPanel({ insights: externalInsights, loading: externalLoading = false, onRefresh }: AIInsightsPanelProps) {
    const [insights, setInsights] = useState<Insight[]>([])
    const [loading, setLoading] = useState(true)
    const isControlled = Array.isArray(externalInsights)

    useEffect(() => {
        if (isControlled) {
            setInsights(externalInsights || [])
            setLoading(externalLoading)
            return
        }
        loadInsights()
    }, [isControlled, externalInsights, externalLoading])

    const loadInsights = async () => {
        setLoading(true)
        try {
            const data = await fetchInsights()
            setInsights(data)
        } catch (error) {
            console.error('Failed to load insights:', error)
        } finally {
            setLoading(false)
        }
    }

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

    if (loading) {
        return (
            <div className="card p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 rounded w-1/3" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                    <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
                            <div className="flex items-start gap-4">
                                <div className="w-5 h-5 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                    <div className="h-3 rounded w-full" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (insights.length === 0) {
        return (
            <div className="card p-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                        <Clock size={32} style={{ color: 'var(--accent-teal)' }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>No Insights Yet</h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Upload data to generate AI insights</p>
                    <a 
                        href="/upload-data"
                        className="inline-flex items-center gap-2 btn-secondary"
                    >
                        <Upload size={16} />
                        Upload Data
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>AI Insights</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Detected anomalies and recommendations</p>
                </div>
                <button 
                    onClick={() => {
                        if (onRefresh) {
                            onRefresh()
                            return
                        }
                        loadInsights()
                    }}
                    className="text-sm font-medium"
                    style={{ color: 'var(--accent-teal)' }}
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-4" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className="p-4 rounded-xl border hover:shadow-md transition-all"
                        style={{ borderColor: 'var(--border-subtle)' }}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`${severityIconColors[insight.severity.toLowerCase() as keyof typeof severityIconColors]} mt-1`}>
                                {severityIcons[insight.severity.toLowerCase() as keyof typeof severityIcons]}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold" style={{ color: 'var(--text-heading)' }}>{insight.message}</h4>
                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${severityColors[insight.severity.toLowerCase() as keyof typeof severityColors]}`}>
                                        {insight.severity}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    <Clock size={12} />
                                    <span>{formatTimestamp(insight.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
