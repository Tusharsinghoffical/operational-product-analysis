'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { uploadSalesData } from '@/lib/api'

interface FileUploaderProps {
    onUpload?: (file: File) => void
}

export default function FileUploader({ onUpload }: FileUploaderProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
            setSuccess(null)
            setError(null)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        maxFiles: 1,
    })

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setProgress(0)
        setSuccess(null)
        setError(null)

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)

            const response = await uploadSalesData(file)
            
            clearInterval(progressInterval)
            setProgress(100)
            setSuccess(`${response.message}. ${response.insights.length} insights generated.`)
            
            if (onUpload) onUpload(file)
            
            setTimeout(() => {
                setFile(null)
                setProgress(0)
                setSuccess(null)
            }, 5000)
        } catch (err: any) {
            let errorMessage = 'Failed to upload file'
            if (err.message === 'Failed to fetch') {
                errorMessage = 'Unable to connect to the server. Please make sure the backend is running on port 8000.'
            } else if (err.message) {
                errorMessage = err.message
            }
            setError(errorMessage)
            setProgress(0)
        } finally {
            setUploading(false)
        }
    }

    const removeFile = () => {
        setFile(null)
        setProgress(0)
        setSuccess(null)
        setError(null)
    }

    return (
        <div className="space-y-6">
            {success && (
                <div className="p-4 rounded-xl border flex items-start gap-3 animate-slideUp" style={{
                    backgroundColor: 'rgba(0, 201, 177, 0.1)',
                    borderColor: 'rgba(0, 201, 177, 0.2)'
                }}>
                    <CheckCircle size={20} style={{ color: 'var(--accent-teal)', marginTop: '0.125rem', flexShrink: 0 }} />
                    <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--accent-teal)' }}>{success}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl border flex items-start gap-3 animate-slideUp" style={{
                    backgroundColor: 'rgba(255, 107, 43, 0.1)',
                    borderColor: 'rgba(255, 107, 43, 0.2)'
                }}>
                    <AlertCircle size={20} style={{ color: 'var(--accent-orange)', marginTop: '0.125rem', flexShrink: 0 }} />
                    <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--accent-orange)' }}>Upload Failed</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--accent-orange)' }}>{error}</p>
                        {error.includes('backend') && (
                            <p className="text-xs mt-2" style={{ color: 'rgba(255, 107, 43, 0.8)' }}>
                                Tip: Run <code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'rgba(255, 107, 43, 0.1)' }}>start-backend.bat</code> to start the server
                            </p>
                        )}
                    </div>
                </div>
            )}

            {!file ? (
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                        ${isDragActive
                            ? 'scale-[1.02]'
                            : 'hover:scale-[1.01]'
                        }
                    `}
                    style={{
                        borderColor: isDragActive ? 'var(--accent-teal)' : 'var(--border-subtle)',
                        backgroundColor: isDragActive ? 'rgba(0, 201, 177, 0.05)' : 'var(--bg-surface)'
                    }}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <div className={`
                            w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300
                            ${isDragActive ? 'scale-110' : ''}
                        `}
                        style={{
                            backgroundColor: isDragActive ? 'rgba(0, 201, 177, 0.2)' : 'rgba(0, 201, 177, 0.1)'
                        }}>
                            <Upload size={36} style={{ 
                                color: isDragActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                                transition: 'color 0.3s'
                            }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
                            {isDragActive ? 'Drop your file here' : 'Upload your data file'}
                        </h3>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                            Drag and drop or click to select CSV or Excel files
                        </p>
                        <button className="btn-secondary flex items-center gap-2">
                            <Sparkles size={16} style={{ color: 'var(--accent-teal)' }} />
                            Browse files
                        </button>
                        <div className="flex items-center gap-4 mt-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-teal)' }}></span>
                                CSV
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3b82f6' }}></span>
                                XLSX
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-orange)' }}></span>
                                XLS
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card p-6 animate-slideUp">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 201, 177, 0.1)' }}>
                                <FileSpreadsheet size={24} style={{ color: 'var(--accent-teal)' }} />
                            </div>
                            <div>
                                <p className="font-medium" style={{ color: 'var(--text-heading)' }}>{file.name}</p>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            disabled={uploading}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {uploading && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-teal)' }}></span>
                                    Uploading & Analyzing...
                                </span>
                                <span className="text-sm font-medium" style={{ color: 'var(--accent-teal)' }}>{progress}%</span>
                            </div>
                            <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                                <div
                                    className="rounded-full h-2.5 transition-all duration-300"
                                    style={{ 
                                        width: `${progress}%`,
                                        background: 'linear-gradient(90deg, var(--accent-teal), #00a896)'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    >
                        {uploading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Upload & Analyze
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
