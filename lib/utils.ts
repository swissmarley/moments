import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDate(date: Date, locale: string = 'en'): string {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE',
    it: 'it-IT',
    fr: 'fr-FR',
    es: 'es-ES',
  }
  const resolved = localeMap[locale] || locale
  return new Intl.DateTimeFormat(resolved, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateEventUrl(eventId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/event/${eventId}/upload`
}

export function validateImageFile(file: File): { valid: boolean; error?: string; errorCode?: 'fileTooLarge' | 'invalidType' } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB', errorCode: 'fileTooLarge' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed', errorCode: 'invalidType' }
  }
  
  return { valid: true }
}





