import type { ReactElement } from 'react'
import { getTranslations } from 'next-intl/server'

/**
 * Renders the root application route.
 *
 * @returns The initial shell page.
 */
export default async function Page(): Promise<ReactElement> {
  const t = await getTranslations('home')

  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  )
}
