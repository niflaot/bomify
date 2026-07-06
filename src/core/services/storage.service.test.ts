import { buildPublicObjectUrl, sanitizeObjectFileName } from './storage.utils'

describe('storage.service', () => {
  it('sanitizes object file names', () => {
    expect(sanitizeObjectFileName(' Product Photo 01.JPG ')).toBe('product-photo-01.jpg')
    expect(sanitizeObjectFileName('---')).toBe('asset')
  })

  it('builds encoded public object URLs', () => {
    expect(buildPublicObjectUrl(
      'https://assets.bomify.test/bucket/',
      'products/id product.jpg'
    )).toBe('https://assets.bomify.test/bucket/products/id%20product.jpg')
  })
})
