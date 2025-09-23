'use client'

import {useTransition} from 'react'
import {useLocale, useTranslations} from 'next-intl'
import {usePathname, useRouter} from '@/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const languages = [
  {value: 'en', label: 'English'},
  {value: 'de', label: 'Deutsch'},
  {value: 'it', label: 'Italiano'},
  {value: 'fr', label: 'Français'},
  {value: 'es', label: 'Español'}
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('common.language')

  return (
    <div className="min-w-[140px]">
      <Select
        value={locale}
        onValueChange={(nextLocale) => {
          startTransition(() => {
            router.replace(pathname, {locale: nextLocale})
          })
        }}
        disabled={isPending}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t('label')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}


