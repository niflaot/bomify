import type { ExportableSheet } from './sheet-export.types'
import { groupSheetsForExport } from './sheet-export.grouping'

function buildSheet(id: string, groupKey?: string): ExportableSheet {
  return { groupKey, heightMm: 700, id, name: id, pieces: [], widthMm: 1000 }
}

describe('groupSheetsForExport', () => {
  it('bundles every sheet into a single group when combined', () => {
    const sheets = [buildSheet('a'), buildSheet('b')]

    expect(groupSheetsForExport(sheets, 'combined')).toEqual([sheets])
  })

  it('returns one group per sheet for perSheet', () => {
    const sheets = [buildSheet('a'), buildSheet('b')]

    expect(groupSheetsForExport(sheets, 'perSheet')).toEqual([[sheets[0]], [sheets[1]]])
  })

  it('returns one group per distinct groupKey for perGroup, in first-seen order', () => {
    const sheetA1 = buildSheet('a1', 'material-a')
    const sheetB1 = buildSheet('b1', 'material-b')
    const sheetA2 = buildSheet('a2', 'material-a')

    expect(groupSheetsForExport([sheetA1, sheetB1, sheetA2], 'perGroup')).toEqual([
      [sheetA1, sheetA2],
      [sheetB1]
    ])
  })

  it('falls back to one group per sheet for perGroup when there is no groupKey', () => {
    const sheets = [buildSheet('a'), buildSheet('b')]

    expect(groupSheetsForExport(sheets, 'perGroup')).toEqual([[sheets[0]], [sheets[1]]])
  })

  it('handles an empty sheet list', () => {
    expect(groupSheetsForExport([], 'combined')).toEqual([[]])
    expect(groupSheetsForExport([], 'perSheet')).toEqual([])
    expect(groupSheetsForExport([], 'perGroup')).toEqual([])
  })
})
