import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import type { ReactNode, ReactElement } from 'react'

type RootLayoutProps = {
  readonly children: ReactNode
}

/**
 * Builds localized metadata for the application shell.
 *
 * @returns The metadata consumed by Next.js.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')

  return {
    title: t('title')
  }
}

/**
 * Provides the shared application shell and internationalization context.
 *
 * @param props - Root layout properties provided by Next.js.
 * @returns The localized root HTML document.
 */
export default async function RootLayout(
  props: RootLayoutProps
): Promise<ReactElement> {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
