'use client'

import { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Insight } from '@/lib/api'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: 'var(--bg-surface)',
            titleColor: 'var(--text-heading)',
            bodyColor: 'var(--text-secondary)',
            borderColor: 'var(--border-subtle)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
                label: function (context: any) {
                    return `Revenue: $${context.parsed.y.toLocaleString()}`
                }
            }
        },
    },
    scales: {
        y: {
            grid: {
                color: 'var(--border-subtle)',
            },
            ticks: {
                color: 'var(--text-secondary)',
                callback: function (value: any) {
                    return `$${value.toLocaleString()}`
                }
            }
        },
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: 'var(--text-secondary)',
            },
        },
    },
}

interface SalesChartProps {
    insights?: Insight[]
}

export default function SalesChart() {
    return <SalesChartContent />
}

function SalesChartContent({ insights = [] }: SalesChartProps = {}) {
    const [chartData, setChartData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales Revenue',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: 'var(--accent-teal)',
                backgroundColor: 'rgba(0, 168, 150, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: 'var(--accent-teal)',
                pointHoverBorderColor: 'var(--bg-surface)',
                pointHoverBorderWidth: 2,
            },
        ],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const generateSalesData = () => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            const currentMonth = new Date().getMonth()

            const anomalyPenalty = Math.min(0.05, insights.length * 0.004)
            const baseRevenue = 32000 + insights.length * 400
            const growthRate = 0.08 - anomalyPenalty

            const data = []
            const labels = []

            for (let i = 0; i <= currentMonth && i < 12; i++) {
                labels.push(months[i])
                const revenue = Math.round(baseRevenue * Math.pow(1 + growthRate, i))
                data.push(revenue)
            }

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Sales Revenue',
                        data,
                        borderColor: 'var(--accent-teal)',
                        backgroundColor: 'rgba(0, 201, 177, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: 'var(--accent-teal)',
                        pointHoverBorderColor: 'var(--bg-surface)',
                        pointHoverBorderWidth: 2,
                    },
                ],
            })
            setLoading(false)
        }

        generateSalesData()
    }, [insights])

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Sales Analytics</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Revenue trends over time</p>
                </div>
                <select className="px-3 py-1.5 text-sm border rounded-lg" style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                }}>
                    <option>Last 12 months</option>
                    <option>Last 6 months</option>
                    <option>Last 3 months</option>
                </select>
            </div>
            <div className="h-80">
                <Line options={options} data={chartData} />
            </div>
        </div>
    )
}

export function SalesChartRealtime(props: SalesChartProps) {
    return <SalesChartContent {...props} />
}