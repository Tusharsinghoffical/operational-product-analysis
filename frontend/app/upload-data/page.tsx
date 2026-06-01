'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import FileUploader from '@/components/FileUploader'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function UploadDataPage() {
    const [uploaded, setUploaded] = useState(false)

    const handleUpload = (file: File) => {
        console.log('File uploaded:', file.name)
        setUploaded(true)
        setTimeout(() => setUploaded(false), 3000)
    }

    return (
        <ProtectedRoute>
            <div className="flex h-screen animate-fadeIn">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <div className="max-w-4xl mx-auto p-8">
                            <div className="mb-8 animate-slideUp">
                                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Upload Data</h1>
                                <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Upload your business data for AI analysis</p>
                            </div>

                            {uploaded && (
                                <div className="mb-6 p-4 rounded-xl border animate-slideUp" style={{ 
                                    backgroundColor: 'rgba(0, 201, 177, 0.1)',
                                    borderColor: 'rgba(0, 201, 177, 0.2)',
                                    color: 'var(--accent-teal)'
                                }}>
                                    ✅ File uploaded successfully! Analysis has started.
                                </div>
                            )}

                            <div className="animate-slideUp animation-delay-100">
                                <FileUploader onUpload={handleUpload} />
                            </div>

                            <div className="mt-8 p-6 rounded-2xl border animate-slideUp animation-delay-200" style={{
                                backgroundColor: 'var(--bg-surface)',
                                borderColor: 'var(--border-subtle)'
                            }}>
                                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-teal)' }}></span>
                                    Supported Data Types
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <div className="flex items-center gap-2 p-3 rounded-xl transition-colors duration-300" style={{
                                        backgroundColor: 'var(--bg-primary)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}>
                                        <span className="" style={{ color: 'var(--accent-teal)' }}>•</span> Sales transactions
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl transition-colors duration-300" style={{
                                        backgroundColor: 'var(--bg-primary)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}>
                                        <span className="" style={{ color: 'var(--accent-teal)' }}>•</span> Inventory records
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl transition-colors duration-300" style={{
                                        backgroundColor: 'var(--bg-primary)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}>
                                        <span className="" style={{ color: 'var(--accent-teal)' }}>•</span> Expense reports
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl transition-colors duration-300" style={{
                                        backgroundColor: 'var(--bg-primary)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}>
                                        <span className="" style={{ color: 'var(--accent-teal)' }}>•</span> Supplier data
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl transition-colors duration-300" style={{
                                        backgroundColor: 'var(--bg-primary)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}>
                                        <span className="" style={{ color: 'var(--accent-teal)' }}>•</span> Customer feedback
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl transition-colors duration-300" style={{
                                        backgroundColor: 'var(--bg-primary)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}>
                                        <span className="" style={{ color: 'var(--accent-teal)' }}>•</span> Operational logs
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
