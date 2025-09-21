'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Users, Share2, Shield, Sparkles, Heart, Star } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center animated-bg">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-white/20 border-t-white"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-4 border-transparent border-t-white/40"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle w-2 h-2 top-1/4 left-1/4 animate-float"></div>
        <div className="particle w-3 h-3 top-1/3 right-1/4 animate-float" style={{animationDelay: '-1s'}}></div>
        <div className="particle w-1 h-1 bottom-1/4 left-1/3 animate-float" style={{animationDelay: '-2s'}}></div>
        <div className="particle w-2 h-2 bottom-1/3 right-1/3 animate-float" style={{animationDelay: '-3s'}}></div>
        <div className="particle w-1 h-1 top-1/2 left-1/2 animate-float" style={{animationDelay: '-4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-primary rounded-xl animate-glow">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text-primary">Moments</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/auth/signin">
              <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 btn-glow">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-primary hover:opacity-90 btn-glow text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Capture Life's Beautiful Moments</span>
            </div>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Share
            <span className="block gradient-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Beautiful Moments
            </span>
            from Your Events
          </h2>
          
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create magical events, share QR codes with guests, and collect all photos in one stunning gallery. 
            Perfect for weddings, parties, celebrations, and life's special moments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full">
                <Heart className="mr-2 h-5 w-5" />
                Start Creating Magic
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 glass border-white/20 text-white hover:bg-white/10 btn-glow rounded-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h3 className="text-4xl font-bold text-white mb-6">
            How It Works
          </h3>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Simple, secure, and beautiful photo sharing for any event
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center glass border-white/20 card-hover group">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-primary rounded-2xl group-hover:animate-bounce">
                  <Camera className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-3">Create Event</CardTitle>
              <CardDescription className="text-white/70">
                Set up your event with details and get a unique QR code
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center glass border-white/20 card-hover group">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-secondary rounded-2xl group-hover:animate-bounce">
                  <Share2 className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-3">Share with Guests</CardTitle>
              <CardDescription className="text-white/70">
                Share the QR code or link with your event guests
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center glass border-white/20 card-hover group">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-accent rounded-2xl group-hover:animate-bounce">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-3">Collect Photos</CardTitle>
              <CardDescription className="text-white/70">
                Guests upload photos with their names, you get them all
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-white mb-6">
              Why Choose Moments?
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-warm rounded-2xl group-hover:animate-glow">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">Secure & Private</h4>
              <p className="text-white/70">
                Your photos are secure and only accessible to event creators
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-cool rounded-2xl group-hover:animate-glow">
                  <Camera className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">High Quality</h4>
              <p className="text-white/70">
                Maintain original photo quality with smart compression
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-sunset rounded-2xl group-hover:animate-glow">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">Easy Sharing</h4>
              <p className="text-white/70">
                Simple QR codes make sharing with guests effortless
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-ocean rounded-2xl group-hover:animate-glow">
                  <Share2 className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">Self-Hosted</h4>
              <p className="text-white/70">
                Full control over your data with self-hosting options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="glass border-white/20 rounded-3xl p-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-primary rounded-2xl animate-float">
                <Star className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Capture Beautiful Moments?
            </h3>
            <p className="text-xl text-white/80 mb-10">
              Join thousands of event organizers who trust Moments to preserve their special memories
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="text-xl px-12 py-8 bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full">
                <Sparkles className="mr-3 h-6 w-6" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-white/20 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold gradient-text-primary">Moments</h4>
          </div>
          <p className="text-white/60">
            © 2024 Moments. All rights reserved. Made with ❤️ for capturing life's beautiful moments.
          </p>
        </div>
      </footer>
    </div>
  )
}



