'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Copy, Download, Share2, QrCode, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import QRCode from 'qrcode'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  isActive: boolean
}

export default function ShareEventPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
        generateQRCode(data.event.id)
      } else {
        toast({
          title: 'Error',
          description: 'Event not found',
          variant: 'destructive',
        })
        router.push('/dashboard')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event',
        variant: 'destructive',
      })
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const generateQRCode = async (eventId: string) => {
    try {
      const url = `${window.location.origin}/event/${eventId}/upload`
      setShareUrl(url)
      
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeDataUrl(qrCodeDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a')
      link.download = `${event?.title}-qr-code.png`
      link.href = qrCodeDataUrl
      link.click()
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Join me at ${event?.title}! Upload your photos here:`,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard(shareUrl)
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Share Event</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Event Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            {event.description && (
              <CardDescription>{event.description}</CardDescription>
            )}
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="mr-2 h-5 w-5" />
                QR Code
              </CardTitle>
              <CardDescription>
                Guests can scan this QR code to upload photos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {qrCodeDataUrl ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="QR Code" 
                      className="border rounded-lg"
                    />
                  </div>
                  <Button onClick={downloadQRCode} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Share Link Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                Share Link
              </CardTitle>
              <CardDescription>
                Copy and share this link with your guests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Upload Link</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(shareUrl)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={shareNative} className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  How to share with guests:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Print the QR code and display it at your event</li>
                  <li>• Share the link via text, email, or social media</li>
                  <li>• Guests can scan or click to upload photos instantly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions for Guests</CardTitle>
            <CardDescription>
              Here's what your guests will see when they access the upload page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Scan QR Code or Visit Link</h4>
                  <p className="text-sm text-gray-600">
                    Guests can scan the QR code with their phone camera or visit the share link
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Enter Their Name</h4>
                  <p className="text-sm text-gray-600">
                    Guests will be asked to enter their name to identify their photos
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Upload Photos</h4>
                  <p className="text-sm text-gray-600">
                    They can select and upload multiple photos from their device
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Photos Appear in Your Gallery</h4>
                  <p className="text-sm text-gray-600">
                    All uploaded photos will appear in your event dashboard
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Link href={`/dashboard/events/${event.id}`}>
            <Button variant="outline">
              View Event Photos
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}





