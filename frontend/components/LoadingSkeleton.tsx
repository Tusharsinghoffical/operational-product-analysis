'use client'

export default function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Health Score Skeleton */}
            <div className="card p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="w-48 h-48 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                        <div className="h-6 w-32 rounded mt-4" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                <div className="h-2 w-32 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                                <div className="h-4 w-10 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card p-6">
                        <div className="h-10 w-10 rounded-xl mb-4" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                        <div className="h-4 w-24 rounded mb-2" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                        <div className="h-8 w-32 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
                    </div>
                ))}
            </div>

            {/* Chart Skeleton */}
            <div className="card p-6">
                <div className="h-80 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
            </div>
        </div>
    )
}
