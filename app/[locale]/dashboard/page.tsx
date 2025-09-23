'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from '@/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Plus, Calendar, MapPin, Users, Eye } from 'lucide-react'
import { Link } from '@/navigation'
import { formatDate } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLocale } from 'next-intl'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  isActive: boolean
  createdAt: string
  _count: { photos: number }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('dashboard')
  const tc = useTranslations('common')
  const locale = useLocale()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchEvents()
  }, [session, status, router])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-primary rounded-xl animate-glow">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text-primary">Moments</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <span className="text-sm text-gray-600">{t('welcome', {name: session?.user?.name || ''})}</span>
            <Button variant="outline" onClick={() => { window.location.href = '/api/auth/signout' }}>
              {tc('signOut')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('welcomeBack', {name: session?.user?.name || ''})}</h2>
          <p className="text-gray-600">{t('manage')}</p>
        </div>

        <div className="mb-8">
          <Link href="/dashboard/events/create">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full">
              <Plus className="mr-2 h-5 w-5" />
              {t('createNewEvent')}
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <Card className="text-center py-12 glass border-white/20 card-hover">
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-primary rounded-2xl animate-float">
                  <Calendar className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{t('noEvents.title')}</h3>
              <p className="text-white/70 mb-8 text-lg">{t('noEvents.description')}</p>
              <Link href="/dashboard/events/create">
                <Button className="bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full px-8 py-4">
                  <Plus className="mr-2 h-5 w-5" />
                  {t('noEvents.cta')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="glass border-white/20 card-hover group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                      {event.description && (
                        <CardDescription className="mb-3">{event.description}</CardDescription>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {event.isActive ? tc('active') : tc('inactive')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(new Date(event.date), locale)}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="mr-2 h-4 w-4" />
                      {t('photosCollected', {count: event._count.photos})}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        {tc('viewPhotos')}
                      </Button>
                    </Link>
                    <Link href={`/dashboard/events/${event.id}/share`} className="flex-1">
                      <Button className="w-full">{tc('shareEvent')}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


