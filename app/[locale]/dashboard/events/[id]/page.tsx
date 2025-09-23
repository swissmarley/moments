'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Share2, Download, Eye, Users, Calendar, MapPin } from 'lucide-react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'

interface Event { id: string; title: string; description: string | null; date: string; location: string | null; isActive: boolean; createdAt: string }
interface Photo { id: string; filename: string; originalName: string; mimeType: string; size: number; url: string; uploadedBy: string; uploadedAt: string; isApproved: boolean }

export default function EventPhotosPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const t = useTranslations('eventPhotos')
  const tc = useTranslations('common')
  const locale = useLocale()

  useEffect(() => {
    if (params.id) { fetchEventData() }
  }, [params.id])

  const fetchEventData = async () => {
    try {
      const [eventResponse, photosResponse] = await Promise.all([
        fetch(`/api/events/${params.id}`),
        fetch(`/api/events/${params.id}/photos`)
      ])
      if (eventResponse.ok) { const eventData = await eventResponse.json(); setEvent(eventData.event) }
      if (photosResponse.ok) { const photosData = await photosResponse.json(); setPhotos(photosData.photos) }
    } catch (error) {
      toast({ title: tc('error'), description: t('toast.loadError'), variant: 'destructive' })
      router.push('/dashboard')
    } finally { setIsLoading(false) }
  }

  const downloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = photo.originalName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({ title: tc('error'), description: t('toast.downloadError'), variant: 'destructive' })
    }
  }

  const downloadAllPhotos = async () => {
    toast({ title: t('toast.comingSoon'), description: t('toast.bulkSoon') })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h2>
          <Link href="/dashboard">
            <Button>{tc('backToDashboard')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tc('backToDashboard')}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <div className="ml-4"><LanguageSwitcher /></div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/events/${event.id}/share`}>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                {tc('shareEvent')}
              </Button>
            </Link>
            {photos.length > 0 && (
              <Button onClick={downloadAllPhotos}>
                <Download className="mr-2 h-4 w-4" />
                {tc('downloadAll')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {t('details')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('eventInfo')}</h3>
                  <div className="space-y-2">
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
                      {t('photosCollected', {count: photos.length})}
                    </div>
                  </div>
                </div>
              </div>
              {event.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('description')}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {photos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Eye className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noPhotos.title')}</h3>
              <p className="text-gray-600 mb-6">{t('noPhotos.description')}</p>
              <Link href={`/dashboard/events/${event.id}/share`}>
                <Button>
                  <Share2 className="mr-2 h-4 w-4" />
                  {tc('shareEvent')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('eventPhotos', {count: photos.length})}</h2>
            </div>
            <div className="photo-grid">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  <div className="aspect-square relative">
                    <Image src={photo.url} alt={photo.originalName} fill className="object-cover" sizes="(max-width: 640px) 150px, 200px" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); downloadPhoto(photo) }}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{photo.originalName}</p>
                    <p className="text-xs text-gray-500">{t('by', {name: photo.uploadedBy})}</p>
                    <p className="text-xs text-gray-400">{formatDate(new Date(photo.uploadedAt), locale)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button variant="secondary" size="sm" className="absolute top-4 right-4 z-10" onClick={() => setSelectedPhoto(null)}>
              ×
            </Button>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative">
                <Image src={selectedPhoto.url} alt={selectedPhoto.originalName} width={800} height={600} className="object-contain max-h-[70vh]" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedPhoto.originalName}</h3>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{t('by', {name: selectedPhoto.uploadedBy})}</span>
                  <span>{formatDate(new Date(selectedPhoto.uploadedAt), locale)}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button onClick={() => downloadPhoto(selectedPhoto)} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    {tc('download')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


