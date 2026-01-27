/**
 * Unit tests for input validation functions
 */

const core = require('@actions/core')
const { setupCoreMocks } = require('./helpers')

// Import all input validators
const validateEncoderVersion = require('../src/inputs/encoder-version')
const validatePhpTargetVersion = require('../src/inputs/php-target-version')
const validateArchitecture = require('../src/inputs/architecture')
const validateBinary = require('../src/inputs/binary')
const validateOptimize = require('../src/inputs/optimize')
const validateObfuscate = require('../src/inputs/obfuscate')
const validateCheck = require('../src/inputs/check')
const validateComments = require('../src/inputs/comments')
const validateLoader = require('../src/inputs/loader')
const validateReflection = require('../src/inputs/reflection')
const validateEncrypt = require('../src/inputs/encrypt')
const validateCopy = require('../src/inputs/copy')
const validateIgnore = require('../src/inputs/ignore')
const validateSkip = require('../src/inputs/skip')
const validatePassphrase = require('../src/inputs/passphrase')
const validateLicense = require('../src/inputs/license')
const validateCallback = require('../src/inputs/callback')
const validatePreamble = require('../src/inputs/preamble')
const validateObfuscationKey = require('../src/inputs/obfuscation-key')
const validateCreateTarget = require('../src/inputs/create-target')
const validateReplaceTarget = require('../src/inputs/replace-target')
const validateInput = require('../src/inputs/input')
const validateOutput = require('../src/inputs/output')
const validateTemplate = require('../src/inputs/template')
const parseMultiValue = require('../src/inputs/parse-multi-value')

describe('Input Validators', () => {
  let mocks

  beforeEach(() => {
    jest.clearAllMocks()
    mocks = setupCoreMocks()
  })

  describe('parseMultiValue', () => {
    it('parses space-separated values', () => {
      const result = parseMultiValue('*.txt *.md *.json')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })

    it('parses newline-separated values', () => {
      const result = parseMultiValue('*.txt\n*.md\n*.json')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })

    it('parses comma-separated values', () => {
      const result = parseMultiValue('*.txt,*.md,*.json')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })

    it('trims whitespace from values', () => {
      const result = parseMultiValue('  *.txt  ,  *.md  ,  *.json  ')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })

    it('filters out empty values', () => {
      const result = parseMultiValue('*.txt  *.md  *.json')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })

    it('returns empty array for empty string', () => {
      const result = parseMultiValue('')
      expect(result).toEqual([])
    })

    it('returns single element array for single value', () => {
      const result = parseMultiValue('*.txt')
      expect(result).toEqual(['*.txt'])
    })

    it('handles mixed whitespace in newline-separated values', () => {
      const result = parseMultiValue('  *.txt  \n  *.md  \n  *.json  ')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })
  })

  describe('validateEncoderVersion', () => {
    test.each([
      ['current', 'C'],
      ['legacy', 'L'],
      ['obsolete', 'O']
    ])('converts "%s" to "%s"', (input, expected) => {
      mocks.getInputMock.mockReturnValue(input)
      const result = validateEncoderVersion()
      expect(result).toBe(expected)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        `Using encoder version: ${input}`
      )
    })

    it('uses default value when no input provided', () => {
      mocks.getInputMock.mockReturnValue(null)
      const result = validateEncoderVersion('legacy')
      expect(result).toBe('L')
    })

    it('defaults to current for unknown or empty values', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateEncoderVersion()
      expect(result).toBe('C')
    })

    it('defaults to current for unknown values', () => {
      mocks.getInputMock.mockReturnValue('unknown')
      const result = validateEncoderVersion()
      expect(result).toBe('C')
    })
  })

  describe('validatePhpTargetVersion', () => {
    test.each([
      ['8.0', '80'],
      ['8.1', '81'],
      ['8.2', '82']
    ])('converts "%s" to "%s"', (input, expected) => {
      mocks.getInputMock.mockReturnValue(input)
      const result = validatePhpTargetVersion()
      expect(result).toBe(expected)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        `Using PHP target version: ${input}`
      )
    })

    it('uses default value when no input provided', () => {
      mocks.getInputMock.mockReturnValue(null)
      const result = validatePhpTargetVersion('8.0')
      expect(result).toBe('80')
    })

    it('defaults to 8.2 for empty values', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validatePhpTargetVersion()
      expect(result).toBe('82')
    })

    it('defaults to 8.2 for unknown values', () => {
      mocks.getInputMock.mockReturnValue('7.4')
      const result = validatePhpTargetVersion()
      expect(result).toBe('82')
    })
  })

  describe('validateArchitecture', () => {
    test.each([
      ['86', 'x86'],
      ['64', 'x86-64']
    ])('converts "%s" to "%s"', (input, expected) => {
      mocks.getInputMock.mockReturnValue(input)
      const result = validateArchitecture()
      expect(result).toBe(expected)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        `Using target architecture: ${expected}`
      )
    })

    it('uses default value when no input provided', () => {
      mocks.getInputMock.mockReturnValue(null)
      const result = validateArchitecture('86')
      expect(result).toBe('x86')
    })

    it('defaults to x86-64 for empty values', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateArchitecture()
      expect(result).toBe('x86-64')
    })

    it('defaults to x86-64 for unknown values', () => {
      mocks.getInputMock.mockReturnValue('arm')
      const result = validateArchitecture()
      expect(result).toBe('x86-64')
    })
  })

  describe('validateBinary', () => {
    it('returns true and logs binary format', () => {
      mocks.getInputMock.mockReturnValue(true)
      const result = validateBinary(true)
      expect(result).toBe(true)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Encoding into binary format'
      )
    })

    it('returns false and logs ASCII format', () => {
      mocks.getInputMock.mockReturnValue(false)
      const result = validateBinary(false)
      expect(result).toBe(false)
      expect(mocks.debugMock).toHaveBeenCalledWith('Encoding into ASCII format')
    })

    it('returns empty string when no input', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateBinary(false)
      expect(result).toBe('')
    })
  })

  describe('validateOptimize', () => {
    test.each([
      ['more', 'more'],
      ['max', 'max']
    ])('handles "%s" optimization level', (input, expected) => {
      mocks.getInputMock.mockReturnValue(input)
      const result = validateOptimize()
      expect(result).toBe(expected)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        `Using optimization: ${expected}`
      )
    })

    it('defaults to max for unknown values', () => {
      mocks.getInputMock.mockReturnValue('ultra')
      const result = validateOptimize()
      expect(result).toBe('max')
    })

    it('defaults to max when empty input', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateOptimize()
      expect(result).toBe('max')
    })

    it('uses default value when null', () => {
      mocks.getInputMock.mockReturnValue(null)
      const result = validateOptimize('max')
      expect(result).toBe('max')
    })
  })

  describe('validateObfuscate', () => {
    test.each([
      ['all', 'all'],
      ['classes', 'classes'],
      ['functions', 'functions'],
      ['methods', 'methods'],
      ['locals', 'locals'],
      ['linenos', 'linenos'],
      ['classes,functions', 'classes,functions'],
      ['all,linenos', 'all,linenos']
    ])('accepts valid obfuscation option "%s"', (input, expected) => {
      mocks.getInputMock.mockReturnValue(input)
      const result = validateObfuscate()
      expect(result).toBe(expected)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        `Using obfuscate option: ${expected}`
      )
    })

    it('handles whitespace in comma-separated values', () => {
      mocks.getInputMock.mockReturnValue('classes, functions, methods')
      const result = validateObfuscate()
      expect(result).toBe('classes,functions,methods')
    })

    it('returns "none" for invalid values', () => {
      mocks.getInputMock.mockReturnValue('invalid')
      const result = validateObfuscate()
      expect(result).toBe('none')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Input for obfuscate option is not valid!'
      )
    })

    it('returns "none" for partially invalid comma-separated values', () => {
      mocks.getInputMock.mockReturnValue('classes,invalid,functions')
      const result = validateObfuscate()
      expect(result).toBe('none')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Input for obfuscate option is not valid!'
      )
    })

    it('returns none for empty input', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateObfuscate()
      expect(result).toBe('none')
    })

    it('uses default value when null', () => {
      mocks.getInputMock.mockReturnValue(null)
      const result = validateObfuscate('functions')
      expect(result).toBe('functions')
    })
  })

  describe('validateCheck', () => {
    test.each([
      ['auto', 'auto'],
      ['script', 'script']
    ])('handles license check mode "%s"', (input, expected) => {
      mocks.getInputMock.mockReturnValue(input)
      const result = validateCheck()
      expect(result).toBe(expected)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        `Using license check: ${expected}`
      )
    })

    it('defaults to script for unknown values', () => {
      mocks.getInputMock.mockReturnValue('manual')
      const result = validateCheck()
      expect(result).toBe('script')
    })

    it('defaults to script for empty input', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateCheck()
      expect(result).toBe('script')
    })

    it('uses default value when null', () => {
      mocks.getInputMock.mockReturnValue(null)
      const result = validateCheck('script')
      expect(result).toBe('script')
    })
  })

  describe('validateComments', () => {
    it('returns false when no-doc-comments input is falsy', () => {
      mocks.getInputMock.mockReturnValue('false')
      const result = validateComments(false)
      expect(result).toBe(false)
    })

    it('returns true when comments are allowed', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateComments(true)
      expect(result).toBe(true)
      expect(mocks.debugMock).toHaveBeenCalledWith('Allowing doc comments')
    })
  })

  describe('validateLoader', () => {
    it('returns value from getInput', () => {
      mocks.getInputMock.mockReturnValue('false')
      const result = validateLoader(false)
      expect(result).toBe('false')
    })

    it('returns string when checking loader', () => {
      mocks.getInputMock.mockReturnValue('true')
      const result = validateLoader(true)
      expect(result).toBe('true')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Not checking for loader in environment'
      )
    })
  })

  describe('validateReflection', () => {
    it('returns true for allow-reflection-all', () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'allow-reflection-all') return true
        if (name === 'allow-reflection') return ''
        return ''
      })
      const result = validateReflection(false)
      expect(result).toBe(true)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Allowing reflection for all'
      )
    })

    it('returns single pattern for specific reflection', () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'allow-reflection') return 'MyClass::*'
        if (name === 'allow-reflection-all') return ''
        return ''
      })
      const result = validateReflection(false)
      expect(result).toEqual(['MyClass::*'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using reflection for: MyClass::*'
      )
    })

    it('returns multiple patterns for space-separated reflection', () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'allow-reflection')
          return 'MyClass::* AnotherClass::method'
        if (name === 'allow-reflection-all') return ''
        return ''
      })
      const result = validateReflection(false)
      expect(result).toEqual(['MyClass::*', 'AnotherClass::method'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using reflection for: MyClass::*, AnotherClass::method'
      )
    })

    it('handles newline-separated patterns', () => {
      mocks.getInputMock.mockImplementation(name => {
        if (name === 'allow-reflection') return 'MyClass::*\nAnotherClass::*'
        if (name === 'allow-reflection-all') return ''
        return ''
      })
      const result = validateReflection(false)
      expect(result).toEqual(['MyClass::*', 'AnotherClass::*'])
    })

    it('returns empty array when no reflection is set', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateReflection(false)
      expect(result).toEqual([])
      expect(mocks.debugMock).toHaveBeenCalledWith('Using reflection for: NONE')
    })
  })

  describe('validateEncrypt', () => {
    it('handles single file pattern', () => {
      mocks.getInputMock.mockReturnValue('*.blade.php')
      const result = validateEncrypt('')
      expect(result).toEqual(['*.blade.php'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Encrypting files: *.blade.php'
      )
    })

    it('handles multiple space-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*.blade.php *.env.example')
      const result = validateEncrypt('')
      expect(result).toEqual(['*.blade.php', '*.env.example'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Encrypting files: *.blade.php, *.env.example'
      )
    })

    it('handles newline-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*.blade.php\n*.env.example')
      const result = validateEncrypt('')
      expect(result).toEqual(['*.blade.php', '*.env.example'])
    })

    it('handles comma-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*.blade.php,*.env.example')
      const result = validateEncrypt('')
      expect(result).toEqual(['*.blade.php', '*.env.example'])
    })

    it('returns empty array for empty pattern', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateEncrypt('')
      expect(result).toEqual([])
      expect(mocks.debugMock).toHaveBeenCalledWith('Encrypting files: NONE')
    })
  })

  describe('validateCopy', () => {
    it('handles single copy pattern', () => {
      mocks.getInputMock.mockReturnValue('*.txt')
      const result = validateCopy('')
      expect(result).toEqual(['*.txt'])
      expect(mocks.debugMock).toHaveBeenCalledWith('Adding copy path: *.txt')
    })

    it('handles multiple space-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*.txt *.md')
      const result = validateCopy('')
      expect(result).toEqual(['*.txt', '*.md'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding copy path: *.txt, *.md'
      )
    })

    it('handles newline-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*.txt\n*.md\n*.json')
      const result = validateCopy('')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })

    it('handles comma-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*.txt,*.md,*.json')
      const result = validateCopy('')
      expect(result).toEqual(['*.txt', '*.md', '*.json'])
    })

    it('returns empty array for empty pattern', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateCopy('')
      expect(result).toEqual([])
      expect(mocks.debugMock).toHaveBeenCalledWith('Adding copy path: NONE')
    })
  })

  describe('validateIgnore', () => {
    it('handles single ignore pattern', () => {
      mocks.getInputMock.mockReturnValue('*/cache/*')
      const result = validateIgnore('')
      expect(result).toEqual(['*/cache/*'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding ignore path: */cache/*'
      )
    })

    it('handles multiple space-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*/cache/* */logs/*')
      const result = validateIgnore('')
      expect(result).toEqual(['*/cache/*', '*/logs/*'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding ignore path: */cache/*, */logs/*'
      )
    })

    it('handles newline-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*/cache/*\n*/logs/*\n*/temp/*')
      const result = validateIgnore('')
      expect(result).toEqual(['*/cache/*', '*/logs/*', '*/temp/*'])
    })

    it('handles comma-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*/cache/*,*/logs/*')
      const result = validateIgnore('')
      expect(result).toEqual(['*/cache/*', '*/logs/*'])
    })

    it('returns empty array for empty pattern', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateIgnore('')
      expect(result).toEqual([])
      expect(mocks.debugMock).toHaveBeenCalledWith('Adding ignore path: NONE')
    })
  })

  describe('validateSkip', () => {
    it('handles single skip pattern', () => {
      mocks.getInputMock.mockReturnValue('*/vendor/*')
      const result = validateSkip('')
      expect(result).toEqual(['*/vendor/*'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: */vendor/*'
      )
    })

    it('handles multiple space-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*/vendor/* */node_modules/*')
      const result = validateSkip('')
      expect(result).toEqual(['*/vendor/*', '*/node_modules/*'])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: */vendor/*, */node_modules/*'
      )
    })

    it('handles newline-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*/vendor/*\n*/node_modules/*')
      const result = validateSkip('')
      expect(result).toEqual(['*/vendor/*', '*/node_modules/*'])
    })

    it('handles comma-separated patterns', () => {
      mocks.getInputMock.mockReturnValue('*/vendor/*,*/node_modules/*')
      const result = validateSkip('')
      expect(result).toEqual(['*/vendor/*', '*/node_modules/*'])
    })

    it('returns empty array for empty pattern', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateSkip('')
      expect(result).toEqual([])
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding a path to skip: NONE'
      )
    })
  })

  describe('validatePassphrase', () => {
    it('handles passphrase value', () => {
      mocks.getInputMock.mockReturnValue('my-secret-key')
      const result = validatePassphrase('')
      expect(result).toBe('my-secret-key')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using passphrase: my-secret-key'
      )
    })

    it('returns NONE for empty passphrase', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validatePassphrase('')
      expect(result).toBe('')
      expect(mocks.debugMock).toHaveBeenCalledWith('Using passphrase: NONE')
    })
  })

  describe('validateLicense', () => {
    it('handles license path', () => {
      mocks.getInputMock.mockReturnValue('/opt/license')
      const result = validateLicense('')
      expect(result).toBe('/opt/license')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using license file in runtime path: /opt/license'
      )
    })

    it('returns NONE for empty license', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateLicense('')
      expect(result).toBe('')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using license file in runtime path: NONE'
      )
    })
  })

  describe('validateCallback', () => {
    it('handles callback file path', () => {
      mocks.getInputMock.mockReturnValue('public/callback.php')
      const result = validateCallback('')
      expect(result).toBe('public/callback.php')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using callback file in runtime path: public/callback.php'
      )
    })

    it('returns NONE for empty callback', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateCallback('')
      expect(result).toBe('')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Using callback file in runtime path: NONE'
      )
    })
  })

  describe('validatePreamble', () => {
    it('handles preamble file path', () => {
      mocks.getInputMock.mockReturnValue('header.txt')
      const result = validatePreamble('')
      expect(result).toBe('header.txt')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding preamble file: header.txt'
      )
    })

    it('returns NONE for empty preamble', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validatePreamble('')
      expect(result).toBe('')
      expect(mocks.debugMock).toHaveBeenCalledWith('Adding preamble file: NONE')
    })
  })

  describe('validateObfuscationKey', () => {
    it('handles obfuscation key', () => {
      mocks.getInputMock.mockReturnValue('my-key-123')
      const result = validateObfuscationKey('')
      expect(result).toBe('my-key-123')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: my-key-123'
      )
    })

    it('returns NONE for empty key', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateObfuscationKey('')
      expect(result).toBe('')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Adding obfuscation-key path: NONE'
      )
    })
  })

  describe('validateCreateTarget', () => {
    it('returns string "true" when create-target is enabled', () => {
      mocks.getInputMock.mockReturnValue('true')
      const result = validateCreateTarget(true)
      expect(result).toBe('true')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Creating target file/directory if not exists'
      )
    })

    it('returns empty string when create-target is disabled', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateCreateTarget(false)
      expect(result).toBe('')
    })
  })

  describe('validateReplaceTarget', () => {
    it('returns string "true" when replace-target is enabled', () => {
      mocks.getInputMock.mockReturnValue('true')
      const result = validateReplaceTarget(true)
      expect(result).toBe('true')
      expect(mocks.debugMock).toHaveBeenCalledWith(
        'Replacing target file/directory'
      )
    })

    it('returns empty string when replace-target is disabled', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateReplaceTarget(false)
      expect(result).toBe('')
    })
  })

  describe('validateInput', () => {
    it('handles custom input path and strips trailing slash', () => {
      mocks.getInputMock.mockReturnValue('src/')
      const result = validateInput('')
      expect(result).toBe('src')
      expect(mocks.debugMock).toHaveBeenCalledWith('Using input files: src/')
    })

    it('uses __dirname when empty', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateInput('')
      expect(result).toContain('inputs')
      expect(mocks.debugMock).toHaveBeenCalledWith('Using input files: .')
    })
  })

  describe('validateOutput', () => {
    it('handles custom output path', () => {
      mocks.getInputMock.mockReturnValue('dist/')
      const result = validateOutput('encrypted')
      expect(result).toBe('dist/')
      expect(mocks.debugMock).toHaveBeenCalledWith('Using output path: dist/')
    })

    it('returns empty string when getInput returns empty', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateOutput('encrypted')
      expect(result).toBe('')
      expect(mocks.debugMock).toHaveBeenCalledWith('Using output path: ')
    })
  })

  describe('validateTemplate', () => {
    test.each([
      ['laravel', 'laravel'],
      ['php', 'php']
    ])('handles template "%s"', (input, expected) => {
      mocks.getInputMock.mockReturnValue(input)
      const result = validateTemplate()
      expect(result).toBe(expected)
      expect(mocks.debugMock).toHaveBeenCalledWith(
        `Encoding files using template: ${expected}`
      )
    })

    it('returns empty string when getInput returns empty', () => {
      mocks.getInputMock.mockReturnValue('')
      const result = validateTemplate()
      expect(result).toBe('')
    })
  })
})
