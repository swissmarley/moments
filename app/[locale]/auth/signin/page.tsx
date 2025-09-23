'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from '@/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Camera, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('signin')
  const tc = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({ title: tc('error'), description: t('toast.invalid'), variant: 'destructive' })
      } else {
        toast({ title: tc('success'), description: t('toast.signedIn') })
        router.push('/dashboard')
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">{t('email')}</Label>
              <Input id="email" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass border-white/20 text-white placeholder:text-white/50 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">{t('password')}</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="glass border-white/20 text-white placeholder:text-white/50 focus:ring-primary/50" />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 btn-glow text-white rounded-full py-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {tc('signIn')}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-white/70">
              {t('noAccount')}{' '}
              <Link href="/auth/signup" className="text-white hover:underline font-medium">
                {t('goSignup')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


