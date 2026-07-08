import { formatQuantity } from './quantity.utils'

describe('formatQuantity', () => {
  it('trims trailing zeros from decimals', () => {
    expect(formatQuantity(1.5)).toBe('1.5')
  })

  it('renders whole numbers without decimals', () => {
    expect(formatQuantity(1)).toBe('1')
  })

  it('rounds to 2 decimal places', () => {
    expect(formatQuantity(1.005)).toBe('1')
    expect(formatQuantity(1.235)).toBe('1.24')
  })
})
