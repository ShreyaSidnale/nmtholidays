import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { defaultLocale, isLocale } from './config'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export default getRequestConfig(async () => {
  const store = await cookies()
  const cookieLocale = store.get(LOCALE_COOKIE)?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
