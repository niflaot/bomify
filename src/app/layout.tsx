import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import type { ReactNode, ReactElement } from 'react'

import { AppToaster } from '@/components/AppToaster'
import '@/styles/globals.css'

type RootLayoutProps = {
  readonly children: ReactNode
}

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter'
})

/**
 * Builds localized metadata for the application shell.
 *
 * @returns The metadata consumed by Next.js.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')

  return {
    icons: {
      apple: '/logo.svg',
      icon: '/logo.svg',
      shortcut: '/logo.svg'
    },
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
    <html className={inter.variable} lang={locale}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {props.children}
          <AppToaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
