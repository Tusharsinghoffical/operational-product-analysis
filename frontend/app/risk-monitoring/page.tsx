'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import RiskMonitoringTable from '@/components/RiskMonitoringTable'
import { fetchRisks } from '@/lib/api'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'

export default function RiskMonitoringPage() {
    const [stats, setStats] = useState({
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        active: 0,
        resolved: 0
    })

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const risks = await fetchRisks()
            setStats({
                total: risks.length,
                high: risks.filter(r => r.severity === 'High').length,
                medium: risks.filter(r => r.severity === 'Medium').length,
                low: risks.filter(r => r.severity === 'Low').length,
                active: risks.filter(r => r.status === 'Active').length,
                resolved: risks.filter(r => r.status === 'Resolved').length
            })
        } catch (error) {
            console.error('Failed to load risk stats:', error)
        }
    }

    return (
        <div className="flex h-screen animate-fadeIn">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="max-w-7xl mx-auto p-8">
                        <div className="mb-8 animate-slideUp">
                            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Risk Monitoring</h1>
                            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Track and manage operational risks</p>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-slideUp animation-delay-100">
                            <div className="card p-4">
                                <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{stats.total}</div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Total Risks</div>
                            </div>
                            <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-orange)' }}>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-accent-orange" />
                                    <div className="text-2xl font-bold text-accent-orange">{stats.high}</div>
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>High Severity</div>
                            </div>
                            <div className="card p-4" style={{ borderLeft: '3px solid #ffc107' }}>
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={16} className="text-yellow-500" />
                                    <div className="text-2xl font-bold text-yellow-500">{stats.medium}</div>
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Medium Severity</div>
                            </div>
                            <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
                                <div className="flex items-center gap-2">
                                    <Info size={16} className="text-accent-teal" />
                                    <div className="text-2xl font-bold text-accent-teal">{stats.low}</div>
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Low Severity</div>
                            </div>
                            <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-orange)' }}>
                                <div className="text-2xl font-bold text-accent-orange">{stats.active}</div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Active</div>
                            </div>
                            <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-accent-teal" />
                                    <div className="text-2xl font-bold text-accent-teal">{stats.resolved}</div>
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Resolved</div>
                            </div>
                        </div>

                        <div className="animate-slideUp animation-delay-200">
                            <RiskMonitoringTable />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}