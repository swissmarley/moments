'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Copy, Download, Share2, QrCode, Link as LinkIcon } from 'lucide-react'
import { Link } from '@/navigation'
import QRCode from 'qrcode'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'

interface Event { id: string; title: string; description: string | null; date: string; location: string | null; isActive: boolean }

export default function ShareEventPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState('')
  const t = useTranslations('shareEvent')
  const tc = useTranslations('common')

  useEffect(() => { if (params.id) { fetchEvent() } }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
        generateQRCode(data.event.id)
      } else {
        toast({ title: tc('error'), description: t('toast.eventNotFound'), variant: 'destructive' })
        router.push('/dashboard')
      }
    } catch (error) {
      toast({ title: tc('error'), description: t('toast.failedToLoad'), variant: 'destructive' })
      router.push('/dashboard')
    } finally { setIsLoading(false) }
  }

  const generateQRCode = async (eventId: string) => {
    try {
      const url = `${window.location.origin}/event/${eventId}/upload`
      setShareUrl(url)
      const qrCodeDataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } })
      setQrCodeDataUrl(qrCodeDataUrl)
    } catch (error) { console.error('Error generating QR code:', error) }
  }

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast({ title: t('toast.copied'), description: tc('linkCopied') }) }
    catch { toast({ title: tc('error'), description: t('toast.copyFailed'), variant: 'destructive' }) }
  }

  const downloadQRCode = () => {
    if (qrCodeDataUrl) { const link = document.createElement('a'); link.download = `${event?.title}-qr-code.png`; link.href = qrCodeDataUrl; link.click() }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: event?.title, text: t('nativeShare', {title: event?.title || ''}), url: shareUrl }) } catch {}
    } else { copyToClipboard(shareUrl) }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('toast.eventNotFound')}</h2>
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
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tc('backToDashboard')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{tc('shareEvent')}</h1>
          <div className="ml-4"><LanguageSwitcher /></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            {event.description && (<CardDescription>{event.description}</CardDescription>)}
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="mr-2 h-5 w-5" />
                {t('qr.title')}
              </CardTitle>
              <CardDescription>{t('qr.description')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {qrCodeDataUrl ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img src={qrCodeDataUrl} alt="QR Code" className="border rounded-lg" />
                  </div>
                  <Button onClick={downloadQRCode} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    {t('qr.download')}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                {t('link.title')}
              </CardTitle>
              <CardDescription>{t('link.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('link.label')}</label>
                <div className="flex space-x-2">
                  <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm" />
                  <Button onClick={() => copyToClipboard(shareUrl)} variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Button onClick={shareNative} className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  {tc('shareEvent')}
                </Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">{t('instructions.title')}</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• {t('instructions.step1Title')}</li>
                  <li>• {t('instructions.step2Title')}</li>
                  <li>• {t('instructions.step3Title')}</li>
                  <li>• {t('instructions.step4Title')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('instructions.title')}</CardTitle>
            <CardDescription>{t('instructions.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <h4 className="font-medium">{t('instructions.step1Title')}</h4>
                  <p className="text-sm text-gray-600">{t('instructions.step1Desc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <h4 className="font-medium">{t('instructions.step2Title')}</h4>
                  <p className="text-sm text-gray-600">{t('instructions.step2Desc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <h4 className="font-medium">{t('instructions.step3Title')}</h4>
                  <p className="text-sm text-gray-600">{t('instructions.step3Desc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                <div>
                  <h4 className="font-medium">{t('instructions.step4Title')}</h4>
                  <p className="text-sm text-gray-600">{t('instructions.step4Desc')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4 mt-8">
          <Link href={`/dashboard/events/${event.id}`}>
            <Button variant="outline">{tc('viewEventPhotos')}</Button>
          </Link>
          <Link href="/dashboard">
            <Button>{tc('backToDashboard')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


