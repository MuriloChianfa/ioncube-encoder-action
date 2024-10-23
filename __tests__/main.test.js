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
    getInputMock.mockImplementation(name => {
      if (name === 'trial') return true
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly with default values
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Encoding files using template: php'
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
    expect(debugMock).toHaveBeenNthCalledWith(7, 'Using reflection for: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(8, 'Encrypting files: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(9, 'Encoding into ASCII format')
    expect(debugMock).toHaveBeenNthCalledWith(10, 'Using optimization: more')
    expect(debugMock).toHaveBeenNthCalledWith(11, 'Now allow doc comments')
    expect(debugMock).toHaveBeenNthCalledWith(
      12,
      'Checking for loader in environment'
    )
    expect(debugMock).toHaveBeenNthCalledWith(13, 'Adding preamble file: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(14, 'Using passphrase: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(15, 'Using license check: auto')
    expect(debugMock).toHaveBeenNthCalledWith(
      16,
      'Using license file in runtime path: NONE'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      17,
      'Using callback file in runtime path: NONE'
    )
    expect(debugMock).toHaveBeenNthCalledWith(18, 'Adding copy path: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(19, 'Adding ignore path: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(20, 'Adding a path to skip: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(
      21,
      'Input for obfuscate option is not valid!'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      22,
      'Using obfuscate option: none'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      23,
      'Adding obfuscation-key path: NONE'
    )

    // No errors
    expect(debugMock).toHaveBeenNthCalledWith(24, 0)
    expect(debugMock).toHaveBeenNthCalledWith(25, '')
    expect(debugMock).toHaveBeenNthCalledWith(26, '')

    expect(setOutputMock).toHaveBeenCalledWith(
      'status',
      'Project encoded with success'
    )
  }, 200000)

  it('run succefully with laravel template', async () => {
    getInputMock.mockImplementation(name => {
      if (name === 'template') return 'laravel'
      if (name === 'trial') return true
    })

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
    expect(debugMock).toHaveBeenNthCalledWith(7, 'Allowing reflection for all')
    expect(debugMock).toHaveBeenNthCalledWith(
      8,
      'Encrypting files: *.blade.php'
    )
    expect(debugMock).toHaveBeenNthCalledWith(9, 'Encoding into binary format')
    expect(debugMock).toHaveBeenNthCalledWith(10, 'Using optimization: max')
    expect(debugMock).toHaveBeenNthCalledWith(11, 'Now allow doc comments')
    expect(debugMock).toHaveBeenNthCalledWith(
      12,
      'Not checking for loader in environment'
    )
    expect(debugMock).toHaveBeenNthCalledWith(13, 'Adding preamble file: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(14, 'Using passphrase: CHANGEME')
    expect(debugMock).toHaveBeenNthCalledWith(15, 'Using license check: script')
    expect(debugMock).toHaveBeenNthCalledWith(
      16,
      'Using license file in runtime path: /opt/license'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      17,
      'Using callback file in runtime path: public/ioncube.php'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      18,
      'Creating target file/directory if not exists'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      19,
      'Replacing target file/directory'
    )
    expect(debugMock).toHaveBeenNthCalledWith(20, 'Adding copy path: NONE')
    expect(debugMock).toHaveBeenNthCalledWith(
      21,
      'Adding ignore path: */cache/*'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      22,
      'Adding a path to skip: */vendor/*'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      23,
      'Using obfuscate option: classes'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      24,
      'Adding obfuscation-key path: CHANGEME'
    )

    // No errors
    expect(debugMock).toHaveBeenNthCalledWith(25, 0)
    expect(debugMock).toHaveBeenNthCalledWith(26, '')
    expect(debugMock).toHaveBeenNthCalledWith(27, '')

    expect(setOutputMock).toHaveBeenCalledWith(
      'status',
      'Project encoded with success'
    )
  }, 200000)
})
