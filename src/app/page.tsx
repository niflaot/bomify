import type { ReactElement } from 'react'

import { HomeView } from '@/views/HomeView/HomeView'

/**
 * Renders the root application route.
 *
 * @returns The initial home view.
 */
export default function Page(): ReactElement {
  return <HomeView />
}
