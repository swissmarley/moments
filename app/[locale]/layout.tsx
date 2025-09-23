import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Moments',
  description: 'Capture and share beautiful moments from your special events',
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }, { locale: 'it' }, { locale: 'fr' }, { locale: 'es' }]
}

async function getMessages(locale: string) {
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default
    return messages
  } catch (error) {
    return (await import('@/messages/en.json')).default
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  const messages = await getMessages(locale)

  if (!['en', 'de', 'it', 'fr', 'es'].includes(locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}


