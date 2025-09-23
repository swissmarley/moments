'use client'

import { useState } from 'react'
import { useRouter } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Loader2, Calendar, MapPin, FileText } from 'lucide-react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'

export default function CreateEventPage() {
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('createEvent')
  const tc = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        toast({ title: tc('success'), description: t('toast.created') })
        router.push(`/dashboard/events/${data.event.id}/share`)
      } else {
        toast({ title: tc('error'), description: t('toast.error'), variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: tc('error'), description: t('toast.generic'), variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {t('details')}
            </CardTitle>
            <CardDescription>{t('detailsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('labels.title')}</Label>
                <Input id="title" name="title" type="text" placeholder={t('labels.titlePlaceholder')} value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('labels.description')}</Label>
                <textarea id="description" name="description" placeholder={t('labels.descriptionPlaceholder')} value={formData.description} onChange={handleInputChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">{t('labels.date')}</Label>
                <Input id="date" name="date" type="datetime-local" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('labels.location')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="location" name="location" type="text" placeholder={t('labels.locationPlaceholder')} value={formData.location} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FileText className="mr-3 h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">{t('info.title')}</h4>
                    <p className="text-sm text-blue-700">{t('info.body')}</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">{tc('cancel')}</Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('submit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


