import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'de', 'it', 'fr', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always'
})

export const config = {
  matcher: ['/((?!api|_next|uploads|.*\\..*).*)']
}


