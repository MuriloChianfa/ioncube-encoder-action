/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const exec = require('@actions/exec')
const main = require('../src/main')

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock exec
const execMock = jest
  .spyOn(exec, 'exec')
  .mockImplementation((cmd, args, options) => {
    if (options?.listeners?.stdout) {
      options.listeners.stdout(Buffer.from(''))
    }
    if (options?.listeners?.stderr) {
      options.listeners.stderr(Buffer.from(''))
    }
    return Promise.resolve(0)
  })

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

  describe('PHP template with custom overrides', () => {
    it('runs with PHP template and binary encoding', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'php'
        if (name === 'binary') return true
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Encoding files using template: php'
      )
      expect(debugMock).toHaveBeenCalledWith('Encoding into binary format')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with PHP template and obfuscation enabled', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'php'
        if (name === 'obfuscate') return 'classes,functions'
        if (name === 'obfuscation-key') return 'test-key-123'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Using obfuscate option: classes,functions'
      )
      expect(debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: test-key-123'
      )
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with PHP template and custom file patterns', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'php'
        if (name === 'encrypt') return '*.config.php'
        if (name === 'copy') return '*.txt *.md'
        if (name === 'ignore') return '*/logs/*'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Encrypting files: *.config.php')
      expect(debugMock).toHaveBeenCalledWith('Adding copy path: *.txt *.md')
      expect(debugMock).toHaveBeenCalledWith('Adding ignore path: */logs/*')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with PHP template and max optimization', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'php'
        if (name === 'optimize') return 'max'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Using optimization: max')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Laravel template with custom overrides', () => {
    it('runs with Laravel template and PHP 8.0', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'laravel'
        if (name === 'php-target-version') return '8.0'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Encoding files using template: laravel'
      )
      expect(debugMock).toHaveBeenCalledWith('Using PHP target version: 8.0')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with Laravel template and PHP 8.1', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'laravel'
        if (name === 'php-target-version') return '8.1'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Using PHP target version: 8.1')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with Laravel template and legacy encoder', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'laravel'
        if (name === 'encoder-version') return 'legacy'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Using encoder version: legacy')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with Laravel template and obsolete encoder', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'laravel'
        if (name === 'encoder-version') return 'obsolete'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Using encoder version: obsolete')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with Laravel template and custom ignore patterns', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'laravel'
        if (name === 'ignore') return '*/cache/* */logs/* */temp/*'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Adding ignore path: */cache/* */logs/* */temp/*'
      )
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with Laravel template and custom skip patterns', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'laravel'
        if (name === 'skip') return '*/vendor/* */node_modules/*'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: */vendor/* */node_modules/*'
      )
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with Laravel template and x86 architecture', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'template') return 'laravel'
        if (name === 'arch') return '86'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Using target architecture: x86')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Custom configurations without template', () => {
    it('runs with all manual configurations', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'encoder-version') return 'current'
        if (name === 'php-target-version') return '8.2'
        if (name === 'arch') return '64'
        if (name === 'binary') return true
        if (name === 'optimize') return 'max'
        if (name === 'obfuscate') return 'all'
        if (name === 'obfuscation-key') return 'custom-key'
        if (name === 'passphrase') return 'custom-passphrase'
        if (name === 'encrypt') return '*.php'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Encoding into binary format')
      expect(debugMock).toHaveBeenCalledWith('Using optimization: max')
      expect(debugMock).toHaveBeenCalledWith('Using obfuscate option: all')
      expect(debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: custom-key'
      )
      expect(debugMock).toHaveBeenCalledWith(
        'Using passphrase: custom-passphrase'
      )
      expect(debugMock).toHaveBeenCalledWith('Encrypting files: *.php')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with reflection API enabled for all', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'allow-reflection-all') return true // Return boolean not string
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Allowing reflection for all')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with specific reflection patterns', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'allow-reflection') return 'MyClass::* MyNamespace\\*'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Using reflection for: MyClass::* MyNamespace\\*'
      )
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with preamble file', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'preamble-file') return 'header.txt'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Adding preamble file: header.txt')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with license check in script mode', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'license-check') return 'script'
        if (name === 'with-license') return '/path/to/license'
        if (name === 'callback-file') return 'callback.php'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Using license check: script')
      expect(debugMock).toHaveBeenCalledWith(
        'Using license file in runtime path: /path/to/license'
      )
      expect(debugMock).toHaveBeenCalledWith(
        'Using callback file in runtime path: callback.php'
      )
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with create and replace target options', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'create-target') return true
        if (name === 'replace-target') return true
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Creating target file/directory if not exists'
      )
      expect(debugMock).toHaveBeenCalledWith('Replacing target file/directory')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs with no doc comments option', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'no-doc-comments') return 'true'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith('Now allow doc comments')
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('runs without loader check', async () => {
      getInputMock.mockImplementation(name => {
        if (name === 'trial') return true
        if (name === 'without-loader-check') return 'true'
        return ''
      })

      await main.run()
      expect(runMock).toHaveReturned()

      expect(debugMock).toHaveBeenCalledWith(
        'Not checking for loader in environment'
      )
      expect(setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })
})
