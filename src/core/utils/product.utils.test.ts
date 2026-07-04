import { getProductDisplayName } from './product.utils'

describe('getProductDisplayName', () => {
  it('prefers the default realm datasheet name', () => {
    const displayName = getProductDisplayName({
      sku: 'SKU-001',
      datasheets: [
        { realm: 'sales', name: 'Sales name' },
        { realm: 'default', name: 'Default name' }
      ]
    })

    expect(displayName).toBe('Default name')
  })

  it('falls back to the first non-empty datasheet name', () => {
    const displayName = getProductDisplayName({
      sku: 'SKU-001',
      datasheets: [
        { realm: 'default', name: ' ' },
        { realm: 'sales', name: 'Sales name' }
      ]
    })

    expect(displayName).toBe('Sales name')
  })

  it('uses the SKU when no datasheet name is available', () => {
    const displayName = getProductDisplayName({
      sku: 'SKU-001',
      datasheets: []
    })

    expect(displayName).toBe('SKU-001')
  })
})
