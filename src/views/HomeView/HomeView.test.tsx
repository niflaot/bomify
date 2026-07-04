import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactElement } from 'react'

import messages from '../../../messages/en.json'
import { HomeView } from './HomeView'

function renderHomeView(): ReactElement {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <HomeView />
    </NextIntlClientProvider>
  )
}

describe('HomeView', () => {
  it('renders the translated project title', () => {
    render(renderHomeView())

    expect(screen.getByRole('heading', { name: 'Bomify' })).toBeInTheDocument()
  })
})
