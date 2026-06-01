'use client'

import { Bell, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function TopNav() {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            {/* Desktop/Tablet TopNav */}
            <header 
                className="hidden md:flex h-16 items-center justify-between px-8 fixed top-0 left-64 right-0 z-50 transition-all duration-250 navbar-scrolled"
                style={{
                    backgroundColor: scrolled ? 'rgba(7, 21, 32, 0.95)' : 'rgba(4, 13, 20, 0.85)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: `1px solid ${scrolled ? 'rgba(0, 201, 177, 0.2)' : 'var(--border-subtle)'}`
                }}
            >
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        className="p-2 rounded-xl transition-all"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 201, 177, 0.08)'
                            e.currentTarget.style.color = 'var(--text-primary)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                        }}
                    >
                        <Bell size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            {/* Mobile TopNav */}
            <header 
                className="md:hidden flex h-14 items-center justify-between px-5 fixed top-0 left-0 right-0 z-50"
                style={{
                    backgroundColor: 'rgba(4, 13, 20, 0.95)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: '1px solid var(--border-subtle)'
                }}
            >
                <div className="flex items-center gap-3">
                    <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--accent-teal), #00a896)' }}
                    >
                        <span className="text-bg-primary font-bold text-lg">O</span>
                    </div>
                    <span className="text-lg font-bold" style={{ color: 'var(--text-heading)', fontFamily: 'Playfair Display, Georgia, serif' }}>OpSense</span>
                </div>

                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: 'var(--accent-teal)' }}
                >
                    {showMobileMenu ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div 
                    className="md:hidden fixed inset-0 z-40 animate-slideUp"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                    <div className="flex flex-col h-full pt-16">
                        <nav className="flex-1 px-8 py-6 space-y-2">
                            {['Dashboard', 'AI Insights', 'Data Upload', 'Risk Monitoring', 'Reports', 'Settings'].map((item, index) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="flex items-center py-4 text-lg font-medium transition-colors"
                                    style={{ color: 'var(--text-primary)' }}
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="px-8 py-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                            <button className="btn-primary w-full mb-4">
                                Get Started
                            </button>
                            <div className="flex items-center justify-center gap-4">
                                <Bell size={20} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                                <SettingsIcon size={20} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
