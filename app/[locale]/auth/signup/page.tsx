'use client'

import { useState } from 'react'
import { useRouter } from '@/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Camera, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('signup')
  const tc = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({ title: tc('error'), description: t('toast.passwordMismatch'), variant: 'destructive' })
      return
    }

    if (password.length < 6) {
      toast({ title: tc('error'), description: t('toast.passwordTooShort'), variant: 'destructive' })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await response.json()
      if (response.ok) {
        toast({ title: tc('success'), description: t('toast.created') })
        router.push('/auth/signin')
      } else {
        toast({ title: tc('error'), description: data.error || t('toast.generic'), variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: tc('error'), description: t('toast.generic'), variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg relative overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle w-2 h-2 top-1/4 left-1/4 animate-float"></div>
        <div className="particle w-3 h-3 top-1/3 right-1/4 animate-float" style={{animationDelay: '-1s'}}></div>
        <div className="particle w-1 h-1 bottom-1/4 left-1/3 animate-float" style={{animationDelay: '-2s'}}></div>
      </div>
      <Card className="w-full max-w-md glass border-white/20 relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-2xl animate-glow">
              <Camera className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">{t('title')}</CardTitle>
          <CardDescription className="text-white/70">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">{t('fullName')}</Label>
              <Input id="name" type="text" placeholder={t('placeholder.fullName')} value={name} onChange={(e) => setName(e.target.value)} required className="glass border-white/20 text-white placeholder:text-white/50 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">{t('email')}</Label>
              <Input id="email" type="email" placeholder={t('placeholder.email')} value={email} onChange={(e) => setEmail(e.target.value)} required className="glass border-white/20 text-white placeholder:text-white/50 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">{t('password')}</Label>
              <Input id="password" type="password" placeholder={t('placeholder.password')} value={password} onChange={(e) => setPassword(e.target.value)} required className="glass border-white/20 text-white placeholder:text-white/50 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-medium">{t('confirmPassword')}</Label>
              <Input id="confirmPassword" type="password" placeholder={t('placeholder.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="glass border-white/20 text-white placeholder:text-white/50 focus:ring-primary/50" />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full py-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {t('submit')}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-white/70">
              {t('haveAccount')}{' '}
              <Link href="/auth/signin" className="text-white hover:underline font-medium">
                {t('goSignin')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


