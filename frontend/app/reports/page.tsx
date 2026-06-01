'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { FileText, Download, Calendar, Eye, Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import { generatePDFReport, downloadPDF } from '@/lib/pdf-generator'
import { fetchInsights, fetchHealthMetrics, fetchRisks } from '@/lib/api'

interface PreviousReport {
    id: number
    name: string
    date: string
    size: string
    type: string
}

export default function ReportsPage() {
    const [generating, setGenerating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [reportType, setReportType] = useState('comprehensive')
    const [timePeriod, setTimePeriod] = useState('last-month')
    const [success, setSuccess] = useState<string | null>(null)
    const [previousReports, setPreviousReports] = useState<PreviousReport[]>([])
    const [stats, setStats] = useState({
        totalReports: 0,
        thisMonth: 0,
        totalDownloads: 0
    })

    useEffect(() => {
        // Load previous reports from localStorage
        const savedReports = localStorage.getItem('opsense-reports')
        if (savedReports) {
            setPreviousReports(JSON.parse(savedReports))
        }
    }, [])

    useEffect(() => {
        // Update stats
        setStats({
            totalReports: previousReports.length,
            thisMonth: previousReports.filter(r => {
                const reportDate = new Date(r.date)
                const now = new Date()
                return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
            }).length,
            totalDownloads: previousReports.length * 3 // Simulated
        })
    }, [previousReports])

    const handleGenerateReport = async () => {
        setGenerating(true)
        setPreviewUrl(null)
        setSuccess(null)

        try {
            // Fetch real data from APIs
            const [healthMetrics, insights, risks] = await Promise.all([
                fetchHealthMetrics(),
                fetchInsights(),
                fetchRisks(),
            ])

            // Generate dynamic sales data based on current date
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            const currentMonth = new Date().getMonth()
            const salesData = []
            
            for (let i = 0; i <= currentMonth && i < 12; i++) {
                const baseRevenue = 32000
                const growthRate = 0.08
                const revenue = Math.round(baseRevenue * Math.pow(1 + growthRate, i))
                salesData.push({ month: months[i], revenue })
            }

            const metrics = [
                { title: 'Total Revenue', value: `$${salesData.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}`, trend: 12.5 },
                { title: 'Total Expenses', value: '$28,432', trend: -3.2 },
                { title: 'Inventory Health', value: `${healthMetrics.inventoryAccuracy || 76}%`, trend: 5.1 },
                { title: 'Risk Level', value: healthMetrics.expenseControl > 70 ? 'Low' : 'Medium', trend: -8.3 },
            ]

            // Generate PDF
            const doc = generatePDFReport({
                healthScore: healthMetrics.healthScore,
                metrics,
                insights,
                risks,
                salesData,
            })

            // Create preview URL
            const pdfBlob = doc.output('blob')
            const url = URL.createObjectURL(pdfBlob)
            setPreviewUrl(url)
            
            // Save to previous reports
            const newReport: PreviousReport = {
                id: Date.now(),
                name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
                date: new Date().toISOString(),
                size: `${(pdfBlob.size / 1024 / 1024).toFixed(1)} MB`,
                type: reportType
            }
            
            const updatedReports = [newReport, ...previousReports]
            setPreviousReports(updatedReports)
            localStorage.setItem('opsense-reports', JSON.stringify(updatedReports))
            
            setSuccess('Report generated successfully! You can preview and download it below.')
            
            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(null), 5000)
        } catch (error) {
            console.error('Failed to generate report:', error)
            alert('Failed to generate report. Please try again.')
        } finally {
            setGenerating(false)
        }
    }

    const handleDownload = () => {
        if (!previewUrl) return

        // Download the generated PDF
        const link = document.createElement('a')
        link.href = previewUrl
        link.download = `opsense-report-${reportType}-${timePeriod}-${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDownloadPrevious = (report: PreviousReport) => {
        // In a real app, this would fetch the PDF from server
        alert(`Download functionality for "${report.name}" would be implemented with server storage`)
    }

    return (
        <div className="flex h-screen animate-fadeIn">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="max-w-6xl mx-auto p-8">
                        <div className="mb-8 animate-slideUp">
                            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Reports</h1>
                            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Generated analytics and insights reports</p>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slideUp animation-delay-100">
                            <div className="card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{stats.totalReports}</div>
                                        <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Total Reports</div>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                        <FileText size={24} style={{ color: 'var(--accent-teal)' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{stats.thisMonth}</div>
                                        <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>This Month</div>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                        <Calendar size={24} style={{ color: 'var(--accent-teal)' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{stats.totalDownloads}</div>
                                        <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Total Downloads</div>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                        <Download size={24} style={{ color: 'var(--accent-teal)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-6 p-4 rounded-xl border animate-slideUp" style={{ 
                                backgroundColor: 'rgba(0, 201, 177, 0.1)',
                                borderColor: 'rgba(0, 201, 177, 0.2)',
                                color: 'var(--accent-teal)'
                            }}>
                                {success}
                            </div>
                        )}

                        {/* Generate New Report */}
                        <div className="card p-6 mb-8">
                            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Generate New Report</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select 
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                    style={{
                                        backgroundColor: 'var(--bg-surface)',
                                        borderColor: 'var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="comprehensive" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Comprehensive Report</option>
                                    <option value="sales" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Sales Report</option>
                                    <option value="inventory" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Inventory Report</option>
                                    <option value="risk" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Risk Report</option>
                                </select>
                                <select 
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                    style={{
                                        backgroundColor: 'var(--bg-surface)',
                                        borderColor: 'var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="last-month" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Last Month</option>
                                    <option value="last-quarter" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Last Quarter</option>
                                    <option value="last-year" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Last Year</option>
                                </select>
                                <button 
                                    onClick={handleGenerateReport}
                                    disabled={generating}
                                    className="btn-primary flex items-center justify-center gap-2"
                                    style={{ minWidth: '180px' }}
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={18} />
                                            Generate Report
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* PDF Preview */}
                        {previewUrl && (
                            <div className="card p-6 mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Report Preview</h3>
                                    <button 
                                        onClick={handleDownload}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <Download size={18} />
                                        Download PDF
                                    </button>
                                </div>
                                <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
                                    <iframe 
                                        src={previewUrl}
                                        className="w-full"
                                        style={{ height: '800px' }}
                                        title="PDF Preview"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Previous Reports */}
                        <div className="card p-6">
                            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Previous Reports</h3>
                            {previousReports.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                        <FileText size={32} style={{ color: 'var(--accent-teal)' }} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>No Reports Yet</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Generate your first report to see it here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {previousReports.map((report, index) => (
                                        <div key={report.id} className="p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer" 
                                            style={{ 
                                                borderColor: 'var(--border-subtle)',
                                                backgroundColor: 'var(--bg-surface)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(0, 201, 177, 0.4)'
                                                e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                                e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                                        <FileText size={20} style={{ color: 'var(--accent-teal)' }} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{report.name}</h4>
                                                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar size={12} />
                                                                <span>{new Date(report.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}</span>
                                                            </div>
                                                            <span>{report.size}</span>
                                                            <span className="px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)', color: 'var(--accent-teal)' }}>
                                                                {report.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 rounded-lg transition-colors"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.1)'
                                                            e.currentTarget.style.color = 'var(--accent-teal)'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent'
                                                            e.currentTarget.style.color = 'var(--text-secondary)'
                                                        }}
                                                        title="View Report"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button 
                                                        className="p-2 rounded-lg transition-colors"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.1)'
                                                            e.currentTarget.style.color = 'var(--accent-teal)'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent'
                                                            e.currentTarget.style.color = 'var(--text-secondary)'
                                                        }}
                                                        onClick={() => handleDownloadPrevious(report)}
                                                        title="Download Report"
                                                    >
                                                        <Download size={18} />
                                                    </button>
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
    )
}
