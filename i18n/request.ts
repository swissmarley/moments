import {getRequestConfig} from 'next-intl/server'

export default getRequestConfig(async ({locale}) => {
  const supported = ['en', 'de', 'it', 'fr', 'es']
  const effectiveLocale = supported.includes(locale) ? locale : 'en'

  return {
    messages: (await import(`../messages/${effectiveLocale}.json`)).default
  }
})


