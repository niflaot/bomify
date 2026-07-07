import { normalizePieceName } from './piece.service.utils'

describe('normalizePieceName', () => {
  it('stores piece names in uppercase', () => {
    expect(normalizePieceName(' front pocket ')).toBe('FRONT POCKET')
  })
})
