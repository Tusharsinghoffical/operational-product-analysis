'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
    LayoutDashboard,
    Brain,
    Upload,
    Shield,
    FileText,
    Settings,
    LogOut,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'AI Insights', href: '/insights', icon: Brain },
    { name: 'Data Upload', href: '/upload-data', icon: Upload },
    { name: 'Risk Monitoring', href: '/risk-monitoring', icon: Shield },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuth()

    useEffect(() => {
        // Warm up route bundles to make sidebar navigation feel instant.
        menuItems.forEach((item) => {
            router.prefetch(item.href)
        })
    }, [router])

    return (
        <aside className="w-64 bg-bg-secondary border-r flex flex-col hidden md:flex" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="p-6">
                <Link href="/" className="flex items-center justify-center">
                    <img 
                        src="/images/logo.png" 
                        alt="OpSense Logo" 
                        className="w-full max-w-[180px] h-auto object-contain"
                    />
                </Link>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            prefetch
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? 'text-accent-teal font-medium'
                                    : 'hover:translate-x-1'
                                }
                            `}
                            style={{
                                backgroundColor: isActive ? 'rgba(0, 201, 177, 0.1)' : 'transparent',
                                color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                            }}
                            onFocus={() => router.prefetch(item.href)}
                            onMouseEnter={(e) => {
                                router.prefetch(item.href)
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.05)'
                                    e.currentTarget.style.color = 'var(--text-primary)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = 'var(--text-secondary)'
                                }
                            }}
                        >
                            <div className={`
                                transition-all duration-300
                                ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                            `}>
                                <Icon size={20} strokeWidth={1.5} />
                            </div>
                            <span>{item.name}</span>
                            {isActive && (
                                <div 
                                    className="ml-auto w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: 'var(--accent-teal)' }}
                                ></div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                {/* User Profile */}
                {isAuthenticated && user && (
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, var(--accent-teal), #00a896)' }}
                            >
                                <span className="text-bg-primary font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-heading)' }}>{user.name}</p>
                                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{ 
                                color: 'var(--accent-orange)',
                                backgroundColor: 'rgba(255, 107, 43, 0.1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 107, 43, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 107, 43, 0.1)'}
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}