import { buildExportFileName, slugify } from './sheet-export.filename'

describe('slugify', () => {
  it('lowercases, strips accents, and hyphenates', () => {
    expect(slugify('Kairos Backpack — Lona Azul')).toBe('kairos-backpack-lona-azul')
  })

  it('trims leading/trailing hyphens produced by punctuation', () => {
    expect(slugify('  ¡Hola!  ')).toBe('hola')
  })

  it('returns an empty string when nothing survives', () => {
    expect(slugify('###')).toBe('')
  })
})

describe('buildExportFileName', () => {
  it('joins parts with the extension', () => {
    expect(buildExportFileName(['Kairos Backpack', 'Lona Azul', 'producción'], 'dxf'))
      .toBe('kairos-backpack-lona-azul-produccion.dxf')
  })

  it('skips parts that slugify to nothing', () => {
    expect(buildExportFileName(['Kairos Backpack', '', 'Hoja 1'], 'pdf'))
      .toBe('kairos-backpack-hoja-1.pdf')
  })

  it('falls back to "export" when every part is empty', () => {
    expect(buildExportFileName(['', '###'], 'zip')).toBe('export.zip')
  })
})
