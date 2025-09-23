'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Users, Share2, Shield, Sparkles, Heart, Star } from 'lucide-react'
import { Link, useRouter } from '@/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const locale = useLocale()

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle w-2 h-2 top-1/4 left-1/4 animate-float"></div>
        <div className="particle w-3 h-3 top-1/3 right-1/4 animate-float" style={{animationDelay: '-1s'}}></div>
        <div className="particle w-1 h-1 bottom-1/4 left-1/3 animate-float" style={{animationDelay: '-2s'}}></div>
        <div className="particle w-2 h-2 bottom-1/3 right-1/3 animate-float" style={{animationDelay: '-3s'}}></div>
        <div className="particle w-1 h-1 top-1/2 left-1/2 animate-float" style={{animationDelay: '-4s'}}></div>
      </div>

      <header className="relative z-10 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-primary rounded-xl animate-glow">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text-primary">{tc('brand')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/auth/signin">
              <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 btn-glow">
                {tc('signIn')}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-primary hover:opacity-90 btn-glow text-white">
                {tc('getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">{t('capture')}</span>
            </div>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            {t('hero.share')}
            <span className="block gradient-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              {t('hero.beautiful')}
            </span>
            {t('hero.from')}
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full">
                <Heart className="mr-2 h-5 w-5" />
                {t('hero.start')}
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 glass border-white/20 text-white hover:bg-white/10 btn-glow rounded-full">
                {tc('signIn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h3 className="text-4xl font-bold text-white mb-6">{t('features.title')}</h3>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center glass border-white/20 card-hover group">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-primary rounded-2xl group-hover:animate-bounce">
                  <Camera className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-3">{t('features.create.title')}</CardTitle>
              <CardDescription className="text-white/70">{t('features.create.description')}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center glass border-white/20 card-hover group">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-secondary rounded-2xl group-hover:animate-bounce">
                  <Share2 className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-3">{t('features.share.title')}</CardTitle>
              <CardDescription className="text-white/70">{t('features.share.description')}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center glass border-white/20 card-hover group">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-accent rounded-2xl group-hover:animate-bounce">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-3">{t('features.collect.title')}</CardTitle>
              <CardDescription className="text-white/70">{t('features.collect.description')}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-white mb-6">{t('benefits.title')}</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-warm rounded-2xl group-hover:animate-glow">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">{t('benefits.secure.title')}</h4>
              <p className="text-white/70">{t('benefits.secure.description')}</p>
            </div>
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-cool rounded-2xl group-hover:animate-glow">
                  <Camera className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">{t('benefits.quality.title')}</h4>
              <p className="text-white/70">{t('benefits.quality.description')}</p>
            </div>
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-sunset rounded-2xl group-hover:animate-glow">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">{t('benefits.sharing.title')}</h4>
              <p className="text-white/70">{t('benefits.sharing.description')}</p>
            </div>
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-ocean rounded-2xl group-hover:animate-glow">
                  <Share2 className="h-10 w-10 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3 text-white">{t('benefits.selfHosted.title')}</h4>
              <p className="text-white/70">{t('benefits.selfHosted.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="glass border-white/20 rounded-3xl p-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-primary rounded-2xl animate-float">
                <Star className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-6">{t('cta.title')}</h3>
            <p className="text-xl text-white/80 mb-10">{t('cta.description')}</p>
            <Link href="/auth/signup">
              <Button size="lg" className="text-xl px-12 py-8 bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full">
                <Sparkles className="mr-3 h-6 w-6" />
                {tc('getStartedFree')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 glass border-t border-white/20 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold gradient-text-primary">{tc('brand')}</h4>
          </div>
          <p className="text-white/60">
            {t.rich('footer.copyright', {
              year: new Date().getFullYear().toString()
            })}
          </p>
        </div>
      </footer>
    </div>
  )
}


