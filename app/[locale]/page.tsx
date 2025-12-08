'use client'

import dynamic from 'next/dynamic'

const HomeContent = dynamic(() => import('./HomeContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center animated-bg">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-white/20 border-t-white"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-4 border-transparent border-t-white/40"></div>
      </div>
    </div>
  )
})

export default function HomePage() {
  return <HomeContent />
}
