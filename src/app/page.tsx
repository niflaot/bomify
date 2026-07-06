import type { ReactElement } from 'react'
import { getTranslations } from 'next-intl/server'

import { MaterialCutCanvas } from '@/components/MaterialCutCanvas'
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
      heightMm: 100,
      id: '1',
      name: t('pieceOne'),
      quantity: 3,
      widthMm: 305
    },
    {
      heightMm: 230,
      id: '2',
      name: t('pieceTwo'),
      quantity: 2,
      widthMm: 270.9
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

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>{t('cutCanvasTitle')}</h2>
        <MaterialCutCanvas
          backgroundColor="#fffdfa"
          borderColor="hsl(24 12% 65%)"
          gridColor="rgba(143, 101, 56, 0.14)"
          majorGridColor="rgba(143, 101, 56, 0.26)"
          labels={{
            efficiency: t('efficiency'),
            fallbackError: t('fallbackError'),
            height: t('height'),
            loading: t('loading'),
            piece: t('piece'),
            unplaced: t('unplaced'),
            used: t('used'),
            waste: t('waste'),
            width: t('width')
          }}
          materialHeightCm={60}
          materialWidthCm={80}
          pieceHoverStrokeColor="#9a643c"
          pieceHoverStrokeWidth={1.5}
          pieceStrokeColor="#2a221c"
          pieces={pieces.map(piece => ({
            heightMm: piece.heightMm,
            id: piece.id,
            name: piece.name,
            quantity: piece.quantity,
            source: `/${piece.id}.dxf`,
            sourceType: 'dxf',
            widthMm: piece.widthMm
          }))}
        />
      </section>

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
                  measurements={{
                    heightMm: piece.heightMm,
                    widthMm: piece.widthMm
                  }}
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
