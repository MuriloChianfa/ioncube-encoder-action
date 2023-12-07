/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('run succefully with default args', async () => {
    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly with default values
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Encoding files using template: laravel'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'Using encoder version: current'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      3,
      'Using PHP target version: 8.2'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      4,
      'Using target architecture: x86-64'
    )
    expect(debugMock).toHaveBeenNthCalledWith(5, 'Using input files: .')
    expect(debugMock).toHaveBeenNthCalledWith(6, 'Using output path: encrypted')

    // No errors
    expect(debugMock).toHaveBeenNthCalledWith(7, 0)
    expect(debugMock).toHaveBeenNthCalledWith(8, '')
    expect(debugMock).toHaveBeenNthCalledWith(9, '')

    expect(setOutputMock).toHaveBeenCalledWith(
      'status',
      'Project encoded with success'
    )
  }, 20000)
})
