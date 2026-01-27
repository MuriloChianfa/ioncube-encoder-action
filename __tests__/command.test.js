/**
 * Command generation and construction tests
 */

const core = require('@actions/core')
const exec = require('@actions/exec')
const main = require('../src/main')
const { setupCoreMocks, setupExecMock } = require('./helpers')

describe('Command Generation Tests', () => {
  let mocks
  let execMock
  let capturedCommands

  beforeEach(() => {
    jest.clearAllMocks()
    mocks = setupCoreMocks()
    capturedCommands = []

    // Mock exec to capture the command strings
    execMock = jest
      .spyOn(exec, 'exec')
      .mockImplementation((cmd, args, options) => {
        capturedCommands.push(cmd)
        if (options?.listeners?.stdout) {
          options.listeners.stdout(Buffer.from(''))
        }
        if (options?.listeners?.stderr) {
          options.listeners.stderr(Buffer.from(''))
        }
        return Promise.resolve(0)
      })
  })

  describe('Basic Command Structure', () => {
    it('generates command with correct encoder version flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encoder-version') return 'current'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('-C')
    }, 200000)

    it('generates command with legacy encoder flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encoder-version') return 'legacy'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('-L')
    }, 200000)

    it('generates command with obsolete encoder flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encoder-version') return 'obsolete'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('-O')
    }, 200000)

    it('generates command with correct PHP version flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'php-target-version') return '8.1'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('-81')
    }, 200000)

    it('generates command with correct architecture flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'arch') return '86'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('-x86')
    }, 200000)

    it('generates command with input and output paths', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'source') return 'src/'
        if (name === 'output') return 'dist/'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('src') // Trailing slash is stripped
      expect(encodingCommand).toContain('-o dist/')
    }, 200000)
  })

  describe('Optional Flag Inclusion', () => {
    it('includes --binary flag only when binary is true', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'binary') return true
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--binary')
    }, 200000)

    it('excludes --binary flag when binary is false', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'binary') return 'false'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).not.toContain('--binary')
    }, 200000)

    it('includes --no-doc-comments flag only when comments is false', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'no-doc-comments') return 'true'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--no-doc-comments')
    }, 200000)

    it('always includes --create-target and --replace-target flags', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--create-target')
      expect(encodingCommand).toContain('--replace-target')
    }, 200000)

    it('includes create-target flag from custom options', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'create-target') return 'true'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--create-target')
    }, 200000)

    it('includes replace-target flag from custom options', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'replace-target') return 'true'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--replace-target')
    }, 200000)
  })

  describe('String Parameter Escaping', () => {
    it('properly quotes encrypt pattern', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encrypt') return '*.blade.php'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--encrypt "*.blade.php"')
    }, 200000)

    it('properly quotes copy pattern', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'copy') return '*.txt'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--copy "*.txt"')
    }, 200000)

    it('generates multiple --copy flags for space-separated patterns', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'copy') return '*.txt *.md'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--copy "*.txt"')
      expect(encodingCommand).toContain('--copy "*.md"')
    }, 200000)

    it('generates multiple --encrypt flags for space-separated patterns', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encrypt') return '*.blade.php *.env.example'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--encrypt "*.blade.php"')
      expect(encodingCommand).toContain('--encrypt "*.env.example"')
    }, 200000)

    it('generates multiple --ignore flags for space-separated patterns', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'ignore') return '*/cache/* */logs/*'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--ignore "*/cache/*"')
      expect(encodingCommand).toContain('--ignore "*/logs/*"')
    }, 200000)

    it('generates multiple --skip flags for space-separated patterns', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'skip') return '*/vendor/* */node_modules/*'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--skip "*/vendor/*"')
      expect(encodingCommand).toContain('--skip "*/node_modules/*"')
    }, 200000)

    it('properly quotes ignore pattern', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'ignore') return '*/cache/*'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--ignore "*/cache/*"')
    }, 200000)

    it('properly quotes skip pattern', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'skip') return '*/vendor/*'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--skip "*/vendor/*"')
    }, 200000)

    it('properly quotes obfuscate pattern', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'obfuscate') return 'classes,functions'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--obfuscate "classes,functions"')
    }, 200000)

    it('properly quotes obfuscation key', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'obfuscation-key') return 'my-secret-key'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--obfuscation-key "my-secret-key"')
    }, 200000)

    it('properly quotes passphrase', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'passphrase') return 'my passphrase'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--passphrase "my passphrase"')
    }, 200000)

    it('properly quotes callback file', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'callback-file') return 'path/to/callback.php'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain(
        '--callback-file "path/to/callback.php"'
      )
    }, 200000)
  })

  describe('Special Characters Handling', () => {
    it('handles passphrase with special characters', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'passphrase') return 'P@ss$w0rd!'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--passphrase "P@ss$w0rd!"')
    }, 200000)

    it('handles patterns with wildcards', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encrypt') return '**/*.php'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--encrypt "**/*.php"')
    }, 200000)

    it('handles paths with spaces', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'preamble-file') return 'path with spaces/header.txt'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain(
        '--preamble-file path with spaces/header.txt'
      )
    }, 200000)
  })

  describe('Optimization Flags', () => {
    it('includes --optimize more flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'optimize') return 'more'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--optimize more')
    }, 200000)

    it('includes --optimize max flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'optimize') return 'max'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--optimize max')
    }, 200000)
  })

  describe('Reflection Flags', () => {
    it('includes --allow-reflection-all flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'allow-reflection-all') return true
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--allow-reflection-all')
    }, 200000)

    it('includes --allow-reflection with single pattern', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'allow-reflection') return 'MyClass::*'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--allow-reflection MyClass::*')
    }, 200000)

    it('generates multiple --allow-reflection flags for space-separated patterns', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'allow-reflection') return 'MyClass::* AnotherClass::method'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--allow-reflection MyClass::*')
      expect(encodingCommand).toContain('--allow-reflection AnotherClass::method')
    }, 200000)
  })

  describe('License Flags', () => {
    it('includes --license-check auto flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'license-check') return 'auto'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--license-check auto')
    }, 200000)

    it('includes --license-check script flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'license-check') return 'script'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--license-check script')
    }, 200000)

    it('includes --with-license flag', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'with-license') return '/opt/license'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--with-license /opt/license')
    }, 200000)
  })

  describe('Empty Value Handling', () => {
    it('excludes encrypt flag when empty', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encrypt') return ''
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).not.toContain('--encrypt')
    }, 200000)

    it('excludes copy flag when empty', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'copy') return ''
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).not.toContain('--copy')
    }, 200000)

    it('excludes ignore flag when empty', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'ignore') return ''
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).not.toContain('--ignore')
    }, 200000)

    it('excludes skip flag when empty', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'skip') return ''
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).not.toContain('--skip')
    }, 200000)

    it('includes obfuscate none flag when obfuscate is none', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'obfuscate') return 'none'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--obfuscate "none"')
    }, 200000)

    it('excludes passphrase flag when empty', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'passphrase') return ''
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).not.toContain('--passphrase')
    }, 200000)
  })

  describe('Complex Command Assembly', () => {
    it('assembles command with multiple flags correctly', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'binary') return true
        if (name === 'optimize') return 'max'
        if (name === 'obfuscate') return 'classes'
        if (name === 'obfuscation-key') return 'key123'
        if (name === 'encrypt') return '*.php'
        return ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )
      expect(encodingCommand).toContain('--binary')
      expect(encodingCommand).toContain('--optimize max')
      expect(encodingCommand).toContain('--obfuscate "classes"')
      expect(encodingCommand).toContain('--obfuscation-key "key123"')
      expect(encodingCommand).toContain('--encrypt "*.php"')
    }, 200000)

    it('assembles command with all available options', async () => {
      mocks.getInputMock.mockImplementation(name => {
        const inputs = {
          trial: 'true',
          'encoder-version': 'current',
          'php-target-version': '8.2',
          arch: '64',
          source: 'src/',
          output: 'dist/',
          binary: true,
          'no-doc-comments': 'true',
          'create-target': 'true',
          'replace-target': 'true',
          encrypt: '*.php',
          copy: '*.txt',
          ignore: '*/cache/*',
          skip: '*/vendor/*',
          obfuscate: 'all',
          'obfuscation-key': 'key',
          optimize: 'max',
          'allow-reflection-all': true,
          'preamble-file': 'header.txt',
          passphrase: 'pass',
          'license-check': 'script',
          'with-license': '/opt/license',
          'callback-file': 'callback.php'
        }
        return inputs[name] || ''
      })

      await main.run()

      const encodingCommand = capturedCommands.find(cmd =>
        cmd.includes('ioncube_encoder')
      )

      // Verify key components are present
      expect(encodingCommand).toContain('-C')
      expect(encodingCommand).toContain('-82')
      expect(encodingCommand).toContain('-x86-64')
      expect(encodingCommand).toContain('src') // Trailing slash stripped
      expect(encodingCommand).toContain('-o dist/')
      expect(encodingCommand).toContain('--binary')
      expect(encodingCommand).toContain('--no-doc-comments')
      expect(encodingCommand).toContain('--create-target')
      expect(encodingCommand).toContain('--replace-target')
      expect(encodingCommand).toContain('--encrypt')
      expect(encodingCommand).toContain('--copy')
      expect(encodingCommand).toContain('--ignore')
      expect(encodingCommand).toContain('--skip')
      expect(encodingCommand).toContain('--obfuscate')
      expect(encodingCommand).toContain('--obfuscation-key')
      expect(encodingCommand).toContain('--optimize max')
      expect(encodingCommand).toContain('--allow-reflection-all')
      expect(encodingCommand).toContain('--preamble-file')
      expect(encodingCommand).toContain('--passphrase')
      expect(encodingCommand).toContain('--license-check script')
      expect(encodingCommand).toContain('--with-license')
      expect(encodingCommand).toContain('--callback-file')
    }, 200000)
  })
})
