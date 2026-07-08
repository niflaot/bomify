import { formatCop, parseCopInput } from './currency.utils'

describe('formatCop', () => {
  it('formats a whole peso amount with a period thousands separator', () => {
    expect(formatCop(140000)).toBe('$140.000')
  })

  it('formats zero', () => {
    expect(formatCop(0)).toBe('$0')
  })

  it('returns a placeholder for null', () => {
    expect(formatCop(null)).toBe('—')
  })
})

describe('parseCopInput', () => {
  it('strips currency symbols and thousands separators', () => {
    expect(parseCopInput('$140.000')).toBe(140000)
  })

  it('parses plain digits', () => {
    expect(parseCopInput('5000')).toBe(5000)
  })

  it('returns null for empty input', () => {
    expect(parseCopInput('')).toBeNull()
    expect(parseCopInput('   ')).toBeNull()
  })
})
