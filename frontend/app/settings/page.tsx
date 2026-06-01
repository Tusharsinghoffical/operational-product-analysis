'use client'

import Sidebar from '@/components/Sidebar'
import { Bell, Shield, Globe, User, ChevronRight } from 'lucide-react'

export default function SettingsPage() {
    const settingsSections = [
        { icon: User, title: 'Profile Settings', description: 'Manage your account information' },
        { icon: Bell, title: 'Notifications', description: 'Configure alert preferences' },
        { icon: Shield, title: 'Security', description: 'Security and access settings' },
        { icon: Globe, title: 'Integrations', description: 'Connect external services' },
    ]

    return (
        <div className="flex h-screen animate-fadeIn">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="max-w-4xl mx-auto p-8">
                        <div className="mb-8 animate-slideUp">
                            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Settings</h1>
                            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your account and platform preferences</p>
                        </div>

                        <div className="space-y-4 animate-slideUp animation-delay-100">
                            {settingsSections.map((section, index) => {
                                const Icon = section.icon
                                return (
                                    <div 
                                        key={index} 
                                        className="card p-6 transition-all duration-300 cursor-pointer" 
                                        style={{
                                            backgroundColor: 'var(--bg-surface)',
                                            borderColor: 'var(--border-subtle)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(0, 201, 177, 0.4)'
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'
                                            e.currentTarget.style.transform = 'scale(1.01)'
                                            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                            e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
                                            e.currentTarget.style.transform = 'scale(1)'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300" 
                                                style={{ 
                                                    backgroundColor: 'rgba(0, 201, 177, 0.1)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.2)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.1)'
                                                }}
                                            >
                                                <Icon size={22} style={{ color: 'var(--accent-teal)' }} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold" style={{ color: 'var(--text-heading)' }}>{section.title}</h3>
                                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{section.description}</p>
                                            </div>
                                            <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}