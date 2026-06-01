'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { fetchHealthMetrics, HealthMetrics } from '@/lib/api'

interface Metric {
    label: string
    value: number
    trend?: 'up' | 'down' | 'stable'
}

interface BusinessHealthScoreProps {
    healthMetrics?: HealthMetrics
}

export default function BusinessHealthScore({ healthMetrics }: BusinessHealthScoreProps) {
    const [healthScore, setHealthScore] = useState(0)
    const [metrics, setMetrics] = useState<Metric[]>([
        { label: 'Sales Stability', value: 0, trend: 'stable' },
        { label: 'Inventory Accuracy', value: 0, trend: 'stable' },
        { label: 'Expense Control', value: 0, trend: 'stable' },
    ])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (healthMetrics) {
            setHealthScore(healthMetrics.healthScore || 75)
            setMetrics([
                {
                    label: 'Sales Stability',
                    value: healthMetrics.salesStability || 82,
                    trend: (healthMetrics.salesStability || 82) > 80 ? 'up' : 'down'
                },
                {
                    label: 'Inventory Accuracy',
                    value: healthMetrics.inventoryAccuracy || 76,
                    trend: (healthMetrics.inventoryAccuracy || 76) > 75 ? 'up' : 'down'
                },
                {
                    label: 'Expense Control',
                    value: healthMetrics.expenseControl || 69,
                    trend: (healthMetrics.expenseControl || 69) > 70 ? 'up' : 'down'
                },
            ])
            setLoading(false)
            return
        }
        loadMetrics()
    }, [healthMetrics])

    const loadMetrics = async () => {
        setLoading(true)
        try {
            const data = await fetchHealthMetrics()
            if (data) {
                setHealthScore(data.healthScore || 75)
                setMetrics([
                    { 
                        label: 'Sales Stability', 
                        value: data.salesStability || 82,
                        trend: (data.salesStability || 82) > 80 ? 'up' : 'down'
                    },
                    { 
                        label: 'Inventory Accuracy', 
                        value: data.inventoryAccuracy || 76,
                        trend: (data.inventoryAccuracy || 76) > 75 ? 'up' : 'down'
                    },
                    { 
                        label: 'Expense Control', 
                        value: data.expenseControl || 69,
                        trend: (data.expenseControl || 69) > 70 ? 'up' : 'down'
                    },
                ])
            }
        } catch (error) {
            console.error('Failed to load health metrics:', error)
            // Fallback to default values
            setHealthScore(75)
        } finally {
            setLoading(false)
        }
    }

    const getTrendIcon = (trend?: string) => {
        if (trend === 'up') return <TrendingUp size={14} className="text-green-600" />
        if (trend === 'down') return <TrendingDown size={14} className="text-red-600" />
        return <Minus size={14} className="text-gray-400" />
    }

    const getTrendColor = (trend?: string) => {
        if (trend === 'up') return 'text-green-600'
        if (trend === 'down') return 'text-red-600'
        return 'text-gray-500'
    }

    return (
        <div className="card p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Circular Gauge */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="var(--border-subtle)"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="var(--accent-teal)"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 88}
                                strokeDashoffset={2 * Math.PI * 88 * (1 - healthScore / 100)}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold" style={{ color: 'var(--text-heading)' }}>{healthScore}</span>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}> / 100</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--text-heading)' }}>Business Health Score</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Overall operational health</p>
                </div>

                {/* Right Side - Metrics */}
                <div className="flex flex-col justify-center space-y-4">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{metric.label}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-32 rounded-full h-2" style={{ backgroundColor: 'var(--bg-primary)' }}>
                                    <div
                                        className="rounded-full h-2 transition-all"
                                        style={{ width: `${metric.value}%`, backgroundColor: 'var(--accent-teal)' }}
                                    />
                                </div>
                                <span className="text-sm font-medium min-w-[40px]" style={{ color: 'var(--text-heading)' }}>
                                    {metric.value}%
                                </span>
                                <div className={getTrendColor(metric.trend)}>
                                    {getTrendIcon(metric.trend)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}