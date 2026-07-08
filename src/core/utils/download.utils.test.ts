import { downloadBlob, downloadFilesAsZip } from './download.utils'

describe('downloadBlob', () => {
  it('creates an object URL, clicks a temporary download anchor, and revokes the URL', () => {
    const createSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    const revokeSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    downloadBlob(new Blob(['hi']), 'file.txt')

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(revokeSpy).toHaveBeenCalledWith('blob:mock-url')
  })
})

describe('downloadFilesAsZip', () => {
  it('bundles the given files into a single zip download', async () => {
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await downloadFilesAsZip(
      [{ content: 'hello', name: 'a.txt' }, { content: 'world', name: 'b.txt' }],
      'bundle.zip'
    )

    expect(clickSpy).toHaveBeenCalledTimes(1)
  })
})
