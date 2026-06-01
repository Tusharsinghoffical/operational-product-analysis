'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Password validation
  const passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password requirements
    if (!Object.values(passwordValidations).every(Boolean)) {
      setError('Password does not meet requirements')
      return
    }

    setIsLoading(true)

    try {
      await signup(name, email, password)
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))' }}>
      <div className="max-w-md w-full animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-medium"
            style={{ background: 'linear-gradient(135deg, var(--accent-teal), #00a896)' }}
          >
            <span className="text-bg-primary font-bold text-3xl">O</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Create Account</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Join OpSense today</p>
        </div>

        {/* Signup Form */}
        <div 
          className="rounded-2xl p-8 border"
          style={{ 
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          {error && (
            <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(255, 107, 43, 0.08)', borderColor: 'rgba(255, 107, 43, 0.2)' }}>
              <p className="text-sm" style={{ color: 'var(--accent-orange)' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                  ) : (
                    <Eye size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-3 space-y-2">
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Password must contain:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-2 text-xs ${passwordValidations.length ? 'text-accent-teal' : 'text-text-secondary'}`}>
                    <CheckCircle size={12} strokeWidth={1.5} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidations.uppercase ? 'text-accent-teal' : 'text-text-secondary'}`}>
                    <CheckCircle size={12} strokeWidth={1.5} />
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidations.lowercase ? 'text-accent-teal' : 'text-text-secondary'}`}>
                    <CheckCircle size={12} strokeWidth={1.5} />
                    <span>Lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidations.digit ? 'text-accent-teal' : 'text-text-secondary'}`}>
                    <CheckCircle size={12} strokeWidth={1.5} />
                    <span>Number</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-xs" style={{ color: 'var(--accent-orange)' }}>Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} strokeWidth={1.5} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium transition-colors" style={{ color: 'var(--accent-teal)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © 2024 OpSense. All rights reserved.
        </p>
      </div>
    </div>
  )
}
