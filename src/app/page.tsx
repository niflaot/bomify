import type { ReactElement } from 'react'
import { getTranslations } from 'next-intl/server'

import { PieceRenderer } from '@/components/PieceRenderer'

/**
 * Renders the root application route.
 *
 * @returns The initial shell page.
 */
export default async function Page(): Promise<ReactElement> {
  const t = await getTranslations('home')
  const rendererLabels = {
    fallbackError: t('fallbackError'),
    height: t('height'),
    loading: t('loading'),
    width: t('width')
  }
  const pieces = [
    {
      id: '1',
      name: t('pieceOne')
    },
    {
      id: '2',
      name: t('pieceTwo')
    }
  ] as const

  return (
    <main
      style={{
        display: 'grid',
        gap: '2.5rem',
        margin: '0 auto',
        maxWidth: '1280px',
        padding: '2rem'
      }}
    >
      <header>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </header>

      <section
        aria-label={t('piecesTitle')}
        style={{
          display: 'grid',
          gap: '2.5rem'
        }}
      >
        {pieces.map(piece => (
          <article
            key={piece.id}
            style={{
              display: 'grid',
              gap: '1rem'
            }}
          >
            <h2 style={{ margin: 0 }}>{piece.name}</h2>
            <div
              style={{
                alignItems: 'start',
                display: 'grid',
                gap: '1.5rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
              }}
            >
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <h3 style={{ margin: 0 }}>{t('pdfFormat')}</h3>
                <PieceRenderer
                  ariaLabel={t('previewLabel', {
                    format: t('pdfFormat'),
                    name: piece.name
                  })}
                  framed={false}
                  labels={rendererLabels}
                  source={`/${piece.id}.pdf`}
                  sourceType="pdf"
                />
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <h3 style={{ margin: 0 }}>{t('dxfFormat')}</h3>
                <PieceRenderer
                  ariaLabel={t('previewLabel', {
                    format: t('dxfFormat'),
                    name: piece.name
                  })}
                  framed={false}
                  labels={rendererLabels}
                  source={`/${piece.id}.dxf`}
                  sourceType="dxf"
                  strokeWidth={1}
                />
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
