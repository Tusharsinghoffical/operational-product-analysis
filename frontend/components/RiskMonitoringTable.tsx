'use client'

import { useState, useEffect } from 'react'
import { fetchRisks, RiskItem } from '@/lib/api'
import { Shield, Upload, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, CheckCircle, Clock, XCircle } from 'lucide-react'

interface DetailedRisk extends RiskItem {
    description?: string
    problem?: string
    solution?: string
    impact?: string
}

const severityColors = {
    High: 'text-accent-orange rgba(255, 107, 43, 0.1)',
    Medium: 'text-yellow-500 rgba(255, 193, 7, 0.1)',
    Low: 'text-accent-teal rgba(0, 201, 177, 0.1)',
}

const severityIcons = {
    High: <AlertTriangle size={18} />,
    Medium: <AlertCircle size={18} />,
    Low: <Info size={18} />,
}

const statusIcons = {
    Active: <XCircle size={14} />,
    Investigating: <Clock size={14} />,
    Resolved: <CheckCircle size={14} />,
}

// Generate detailed information for each risk
const generateRiskDetails = (risk: RiskItem): DetailedRisk => {
    const details: Record<string, { problem: string; solution: string; impact: string; description: string }> = {
        'unusual operational patterns': {
            description: 'Anomaly detection has identified unusual patterns in your operational data',
            problem: 'The system detected abnormal data points that deviate significantly from normal patterns. This could indicate data quality issues, system errors, or genuine operational anomalies.',
            solution: '1. Review the flagged transactions in detail\n2. Verify data entry accuracy\n3. Check for system integration issues\n4. Investigate if these are legitimate business events\n5. Implement data validation rules',
            impact: 'May affect business intelligence accuracy and decision-making quality'
        },
        'average total amount': {
            description: 'Significant variability in transaction amounts detected',
            problem: 'High variance in transaction values indicates inconsistent pricing, variable order sizes, or potential pricing errors that could impact revenue predictability.',
            solution: '1. Analyze pricing strategy consistency\n2. Review discount policies\n3. Segment customers by transaction size\n4. Implement price controls\n5. Monitor high-value transactions',
            impact: 'Revenue forecasting accuracy may be compromised'
        },
        'average discount percentage': {
            description: 'Discount patterns may be affecting profit margins',
            problem: 'Current discount strategies, especially high discounts (up to 20%), are eroding profit margins particularly in high-volume categories like Electronics and Clothing.',
            solution: '1. Review discount thresholds by category\n2. Implement maximum discount limits\n3. Analyze discount ROI\n4. Use targeted instead of blanket discounts\n5. Monitor profit margins weekly',
            impact: 'Reduced profitability, especially in high-volume product categories'
        },
        'anomaly score': {
            description: 'Data quality and consistency issues detected',
            problem: 'A significant portion of transactions show anomaly scores indicating potential data quality problems, pricing inconsistencies, or inventory management issues.',
            solution: '1. Conduct data quality audit\n2. Validate pricing data sources\n3. Check inventory tracking systems\n4. Implement automated data validation\n5. Set up anomaly alerts',
            impact: 'Poor data quality affects all downstream analytics and business decisions'
        },
        'average profit': {
            description: 'Profit variability indicates optimization opportunities',
            problem: 'High standard deviation in profit per transaction suggests inconsistent pricing, variable costs, or inefficient inventory management affecting profitability.',
            solution: '1. Optimize pricing strategy\n2. Negotiate better supplier terms\n3. Improve inventory turnover\n4. Reduce operational costs\n5. Focus on high-margin products',
            impact: 'Potential profit loss due to inefficiencies in pricing and cost management'
        },
        'average cost price': {
            description: 'Cost management opportunities identified',
            problem: 'High variability in cost prices indicates inconsistent supplier pricing, lack of negotiation, or inefficient product mix affecting overall margins.',
            solution: '1. Negotiate volume discounts with suppliers\n2. Diversify supplier base\n3. Optimize product mix\n4. Implement cost tracking\n5. Review procurement processes',
            impact: 'Higher costs reduce competitive advantage and profit margins'
        },
        'Revenue is highly variable': {
            description: 'Revenue inconsistency detected across time periods',
            problem: 'High standard deviation in revenue indicates unstable sales performance, seasonal fluctuations, or inconsistent business operations.',
            solution: '1. Analyze seasonal patterns\n2. Diversify revenue streams\n3. Implement sales strategies\n4. Improve customer retention\n5. Create revenue forecasts',
            impact: 'Unpredictable cash flow and difficulty in financial planning'
        },
        'Expenses have a high standard deviation': {
            description: 'Expense management inefficiencies detected',
            problem: 'Inconsistent expense patterns suggest poor cost control, irregular spending, or lack of budget adherence across different periods.',
            solution: '1. Implement strict budget controls\n2. Review expense categories\n3. Set spending limits\n4. Automate expense tracking\n5. Conduct monthly expense reviews',
            impact: 'Uncontrolled expenses reduce profitability and cash flow stability'
        },
        'anomaly on': {
            description: 'Specific date anomaly detected in transaction data',
            problem: 'Unusual transaction activity on a specific date with abnormally high quantity or revenue that significantly deviates from normal patterns.',
            solution: '1. Investigate the specific date transactions\n2. Verify if it was a legitimate bulk order\n3. Check for data entry errors\n4. Review system logs\n5. Document exceptional circumstances',
            impact: 'Single anomalous events can skew analytics and trend analysis'
        },
        'average quantity sold': {
            description: 'Inventory management performance analysis',
            problem: 'Analysis of quantity sold patterns to assess inventory management effectiveness and stock level optimization.',
            solution: '1. Monitor stock turnover rates\n2. Implement just-in-time inventory\n3. Use demand forecasting\n4. Optimize reorder points\n5. Reduce excess inventory',
            impact: 'Stable quantity patterns indicate good inventory management'
        },
        'average price': {
            description: 'Pricing strategy stability assessment',
            problem: 'Analysis of price consistency to evaluate pricing strategy effectiveness and market positioning.',
            solution: '1. Review pricing strategy regularly\n2. Monitor competitor pricing\n3. Implement dynamic pricing\n4. Test price elasticity\n5. Align prices with value proposition',
            impact: 'Stable pricing indicates consistent market positioning'
        },
        'majority of businesses have a high rating': {
            description: 'Customer satisfaction analysis',
            problem: 'Analysis of customer ratings and satisfaction levels across business operations.',
            solution: '1. Maintain high service quality\n2. Collect customer feedback\n3. Address negative reviews\n4. Implement loyalty programs\n5. Monitor satisfaction metrics',
            impact: 'High ratings drive customer retention and positive word-of-mouth'
        },
        'lack of data on reviews': {
            description: 'Missing customer review data detected',
            problem: 'Complete absence of review data limits ability to assess customer satisfaction and make data-driven improvements.',
            solution: '1. Implement review collection system\n2. Encourage customer feedback\n3. Integrate review platforms\n4. Monitor online reviews\n5. Create feedback loops',
            impact: 'Missing review data prevents customer satisfaction analysis'
        },
        'high anomaly rate': {
            description: 'Widespread data quality issues detected',
            problem: 'Very high percentage of data points flagged as anomalous, indicating systemic data quality or operational consistency issues.',
            solution: '1. Conduct comprehensive data audit\n2. Review data collection processes\n3. Implement data validation\n4. Train staff on data entry\n5. Set up automated quality checks',
            impact: 'Systemic data issues affect all business intelligence and reporting'
        },
        'phone country code': {
            description: 'Geographic distribution analysis of customer base',
            problem: 'Analysis of customer geographic distribution based on phone country codes for marketing optimization.',
            solution: '1. Analyze geographic customer distribution\n2. Target marketing by region\n3. Optimize regional support\n4. Expand to high-demand areas\n5. Localize marketing campaigns',
            impact: 'Geographic insights enable targeted marketing and expansion'
        },
        'latitude and longitude': {
            description: 'Geographic concentration of business operations',
            problem: 'Business operations concentrated in specific geographic areas, presenting both opportunities and risks.',
            solution: '1. Map customer locations\n2. Identify underserved areas\n3. Optimize logistics\n4. Plan regional expansion\n5. Partner with local businesses',
            impact: 'Geographic concentration affects market reach and logistics'
        }
    }

    const riskTypeLower = risk.riskType.toLowerCase()
    
    // Find matching detail template
    for (const [key, value] of Object.entries(details)) {
        if (riskTypeLower.includes(key)) {
            return {
                ...risk,
                ...value
            }
        }
    }

    // Default details if no match
    return {
        ...risk,
        description: 'Risk detected in operational data',
        problem: 'An operational risk has been identified that requires attention and investigation.',
        solution: '1. Review the risk details\n2. Assess business impact\n3. Develop action plan\n4. Implement mitigation strategies\n5. Monitor progress',
        impact: 'Potential impact on business operations and performance'
    }
}

const statusColors = {
    Active: 'text-accent-orange rgba(255, 107, 43, 0.1)',
    Investigating: 'text-yellow-500 rgba(255, 193, 7, 0.1)',
    Resolved: 'text-accent-teal rgba(0, 201, 177, 0.1)',
}

interface RiskMonitoringTableProps {
    risks?: RiskItem[]
    loading?: boolean
    onRefresh?: () => Promise<void> | void
}

export default function RiskMonitoringTable({ risks: externalRisks, loading: externalLoading = false, onRefresh }: RiskMonitoringTableProps) {
    const [risks, setRisks] = useState<DetailedRisk[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedRisk, setExpandedRisk] = useState<number | null>(null)
    const isControlled = Array.isArray(externalRisks)

    useEffect(() => {
        if (isControlled) {
            const detailedRisks = (externalRisks || []).map((risk) => generateRiskDetails(risk))
            setRisks(detailedRisks)
            setLoading(externalLoading)
            return
        }
        loadRisks()
    }, [isControlled, externalRisks, externalLoading])

    const loadRisks = async () => {
        setLoading(true)
        try {
            const data = await fetchRisks()
            // Add detailed information to each risk
            const detailedRisks = data.map(risk => generateRiskDetails(risk))
            setRisks(detailedRisks)
        } catch (error) {
            console.error('Failed to load risks:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleExpand = (id: number) => {
        setExpandedRisk(expandedRisk === id ? null : id)
    }

    if (loading) {
        return (
            <div className="card p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 rounded w-1/3" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                    <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                    ))}
                </div>
            </div>
        )
    }

    if (risks.length === 0) {
        return (
            <div className="card p-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                        <Shield size={32} style={{ color: 'var(--accent-teal)' }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>No Risks Detected</h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Upload data to start monitoring for potential risks</p>
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
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Risk Monitoring</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Active operational risks and threats</p>
                </div>
                <button 
                    onClick={() => {
                        if (onRefresh) {
                            onRefresh()
                            return
                        }
                        loadRisks()
                    }}
                    className="text-sm font-medium"
                    style={{ color: 'var(--accent-teal)' }}
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-4" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
                {risks.map((risk) => (
                    <div
                        key={risk.id}
                        className="rounded-xl border transition-all hover:shadow-lg"
                        style={{ 
                            borderColor: 'var(--border-subtle)',
                            backgroundColor: expandedRisk === risk.id ? 'rgba(0, 201, 177, 0.02)' : 'var(--bg-surface)'
                        }}
                    >
                        {/* Risk Header */}
                        <div 
                            className="p-4 cursor-pointer"
                            onClick={() => toggleExpand(risk.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${severityColors[risk.severity]} p-2 rounded-lg`}>
                                    {severityIcons[risk.severity]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold" style={{ color: 'var(--text-heading)' }}>
                                            {risk.riskType.length > 80 ? risk.riskType.substring(0, 80) + '...' : risk.riskType}
                                        </h4>
                                        {expandedRisk === risk.id ? (
                                            <ChevronUp size={20} style={{ color: 'var(--accent-teal)' }} />
                                        ) : (
                                            <ChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${severityColors[risk.severity]}`}>
                                            {risk.severity}
                                        </span>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${statusColors[risk.status]}`}>
                                            {statusIcons[risk.status]}
                                            {risk.status}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            {risk.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedRisk === risk.id && (
                            <div className="px-4 pb-6 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                                <div className="space-y-4">
                                    {/* Description */}
                                    <div>
                                        <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent-teal)' }}>Description</h5>
                                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{risk.description}</p>
                                    </div>

                                    {/* Problem */}
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 43, 0.05)' }}>
                                        <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent-orange)' }}>Problem</h5>
                                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{risk.problem}</p>
                                    </div>

                                    {/* Impact */}
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 193, 7, 0.05)' }}>
                                        <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent-teal)' }}>Business Impact</h5>
                                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{risk.impact}</p>
                                    </div>

                                    {/* Solution */}
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 201, 177, 0.05)' }}>
                                        <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent-teal)' }}>Recommended Solutions</h5>
                                        <div className="text-sm space-y-1" style={{ color: 'var(--text-primary)' }}>
                                            {risk.solution?.split('\n').map((step, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <span className="text-accent-teal font-bold">{index + 1}.</span>
                                                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
