/**
 * Integration scenario tests for real-world usage patterns
 */

const core = require('@actions/core')
const exec = require('@actions/exec')
const main = require('../src/main')
const { setupCoreMocks, setupExecMock, setupEnvironment } = require('./helpers')

describe('Real-world Integration Scenarios', () => {
  let mocks
  let execMock
  let restoreEnv

  beforeEach(() => {
    jest.clearAllMocks()
    mocks = setupCoreMocks()
    execMock = setupExecMock(0)
    restoreEnv = setupEnvironment({ IONCUBE_DOWNLOAD_URL: '' })
  })

  afterEach(() => {
    if (restoreEnv) restoreEnv()
  })

  describe('Production Deployment Scenarios', () => {
    it('encodes for production with full security (binary + obfuscation + license + passphrase)', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'template') return 'php'
        if (name === 'binary') return true
        if (name === 'obfuscate') return 'all'
        if (name === 'obfuscation-key') return 'prod-key-xyz-789'
        if (name === 'passphrase') return 'production-passphrase-2024'
        if (name === 'license-check') return 'script'
        if (name === 'with-license') return '/opt/licenses/production.txt'
        if (name === 'callback-file') return 'license/callback.php'
        if (name === 'optimize') return 'max'
        if (name === 'no-doc-comments') return 'true'
        if (name === 'without-loader-check') return true // Boolean true to trigger "Checking for loader"
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Encoding into binary format'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using obfuscate option: all'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: prod-key-xyz-789' // gitleaks:allow
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using passphrase: production-passphrase-2024'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using license check: script'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using license file in runtime path: /opt/licenses/production.txt'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using callback file in runtime path: license/callback.php'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith('Using optimization: max')
      expect(mocks.debugMock).toHaveBeenCalledWith('Now allow doc comments')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Checking for loader in environment'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('encodes Laravel app for production with custom paths', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'template') return 'laravel'
        if (name === 'source') return 'app/'
        if (name === 'output') return 'build/encoded'
        if (name === 'encrypt') return '*.blade.php config/*.php'
        if (name === 'skip') return '*/vendor/* */tests/* */node_modules/*'
        if (name === 'ignore') return '*/cache/* */logs/* */sessions/*'
        if (name === 'copy') return '*.json *.txt *.md public/*'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith('Using input files: app/')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using output path: build/encoded'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Encrypting files: *.blade.php, config/*.php'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: */vendor/*, */tests/*, */node_modules/*'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding ignore path: */cache/*, */logs/*, */sessions/*'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding copy path: *.json, *.txt, *.md, public/*'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Development Build Scenarios', () => {
    it('encodes for development with minimal settings (ASCII + no obfuscation)', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'template') return 'php'
        if (name === 'binary') return 'false'
        if (name === 'obfuscate') return 'none'
        if (name === 'optimize') return 'more'
        if (name === 'no-doc-comments') return 'false'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith('Encoding into ASCII format')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using obfuscate option: none'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith('Using optimization: more')
      expect(mocks.debugMock).toHaveBeenCalledWith('Now allow doc comments')
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('encodes with reflection enabled for development debugging', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'allow-reflection-all') return true
        if (name === 'no-doc-comments') return 'false'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Allowing reflection for all'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith('Now allow doc comments')
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Partial Encryption Scenarios', () => {
    it('encrypts only sensitive configuration files', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encrypt') return 'config/*.php database/*.php'
        if (name === 'skip') return '*/public/* */resources/*'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Encrypting files: config/*.php, database/*.php'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: */public/*, */resources/*'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('encrypts Laravel blade templates only', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'encrypt') return '*.blade.php'
        if (name === 'skip') return '*/vendor/* */app/*'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Encrypting files: *.blade.php'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: */vendor/*, */app/*'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('encrypts specific namespace only', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'source') return 'src/Secret/'
        if (name === 'output') return 'dist/Secret/'
        if (name === 'obfuscate') return 'classes,functions'
        if (name === 'obfuscation-key') return 'namespace-key'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using input files: src/Secret/'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using output path: dist/Secret/'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using obfuscate option: classes,functions'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Custom File Handling Scenarios', () => {
    it('copies non-PHP assets while encoding PHP files', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'copy') return '*.json *.xml *.txt *.md *.yml *.yaml'
        if (name === 'ignore') return '*/cache/* */logs/*'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding copy path: *.json, *.xml, *.txt, *.md, *.yml, *.yaml'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding ignore path: */cache/*, */logs/*'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('handles complex ignore patterns for cache and temp files', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'ignore')
          return '*/cache/* */logs/* */tmp/* */temp/* *.log *.cache'
        if (name === 'skip') return '*/test/* */tests/* */Test/*'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding ignore path: */cache/*, */logs/*, */tmp/*, */temp/*, *.log, *.cache'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: */test/*, */tests/*, */Test/*'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Reflection API Scenarios', () => {
    it('allows reflection for specific classes', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'allow-reflection')
          return 'App\\Models\\* App\\Controllers\\*'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using reflection for: App\\Models\\*, App\\Controllers\\*'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('allows reflection for framework compatibility', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'template') return 'laravel'
        if (name === 'allow-reflection-all') return true
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Allowing reflection for all'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Multi-Architecture Scenarios', () => {
    it('encodes for x86 architecture', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'arch') return '86'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using target architecture: x86'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('encodes for x86-64 architecture', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'arch') return '64'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using target architecture: x86-64'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Preamble and Custom Headers', () => {
    it('adds custom preamble file to all encoded files', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'preamble-file') return 'copyright-header.txt'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding preamble file: copyright-header.txt'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('uses preamble with license callback', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'preamble-file') return 'header.txt'
        if (name === 'callback-file') return 'license_callback.php'
        if (name === 'license-check') return 'script'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding preamble file: header.txt'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using callback file in runtime path: license_callback.php'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Multi-Version PHP Target Scenarios', () => {
    it('encodes for PHP 8.0 deployment', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'php-target-version') return '8.0'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using PHP target version: 8.0'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('encodes for PHP 8.1 deployment', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'php-target-version') return '8.1'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using PHP target version: 8.1'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('encodes for PHP 8.2 deployment', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'php-target-version') return '8.2'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using PHP target version: 8.2'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Complex Obfuscation Scenarios', () => {
    it('obfuscates classes and methods only', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'obfuscate') return 'classes,methods'
        if (name === 'obfuscation-key') return 'obf-key-classes-methods'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using obfuscate option: classes,methods'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: obf-key-classes-methods'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('obfuscates functions and line numbers', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'obfuscate') return 'functions,linenos'
        if (name === 'obfuscation-key') return 'obf-key-func-lines'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using obfuscate option: functions,linenos'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: obf-key-func-lines'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)

    it('obfuscates all with line numbers', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'obfuscate') return 'all,linenos'
        if (name === 'obfuscation-key') return 'master-obf-key'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using obfuscate option: all,linenos'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: master-obf-key'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })

  describe('Target Management Scenarios', () => {
    it('creates and replaces target directory', async () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'trial') return 'true'
        if (name === 'create-target') return 'true'
        if (name === 'replace-target') return 'true'
        if (name === 'output') return 'dist/production'
        return ''
      })

      await main.run()

      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Creating target file/directory if not exists'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Replacing target file/directory'
      )
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using output path: dist/production'
      )
      expect(mocks.setOutputMock).toHaveBeenCalledWith(
        'status',
        'Project encoded with success'
      )
    }, 200000)
  })
})
