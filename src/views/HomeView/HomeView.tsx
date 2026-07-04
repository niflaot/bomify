import { useTranslations } from 'next-intl'
import type { ReactElement } from 'react'

/**
 * Renders the initial project shell without product-specific UI.
 *
 * @returns The home view container.
 */
export function HomeView(): ReactElement {
  const t = useTranslations('home')

  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  )
}
