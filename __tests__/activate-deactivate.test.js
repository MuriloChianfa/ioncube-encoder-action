/**
 * Tests for encoder version flag in --activate and --deactivate commands.
 * Reproduces issue #79: when encoder-version is 'legacy' or 'obsolete',
 * the activation/deactivation calls must include the matching version flag
 * (-L or -O) so the correct binary is licensed before encoding starts.
 */

const exec = require('@actions/exec')
const { setupEnvironment } = require('./helpers')

// Mock validate at the module level so main.js receives a fully controlled
// inputs object without triggering the real IonCube download path.
jest.mock('../src/validate')
const validate = require('../src/validate')
const main = require('../src/main')

const BASE_IONCUBE_PATH = '/path/to/ioncube_encoder.sh'

function makeInputs(overrides = {}) {
  return {
    trial: false,
    ioncube: BASE_IONCUBE_PATH,
    encoderVersion: 'C',
    phpTargetVersion: '81',
    arch: 'x86-64',
    input: '.',
    output: 'encrypted',
    binary: false,
    comments: true,
    createTarget: false,
    replaceTarget: false,
    encrypt: [],
    copy: [],
    ignore: [],
    skip: [],
    obfuscate: '',
    obfuscationKey: '',
    optimize: '',
    reflection: false,
    preamble: '',
    passphrase: '',
    license: '',
    callback: '',
    check: '',
    ...overrides
  }
}

describe('Activate/Deactivate Version Flag Tests', () => {
  let capturedCommands
  let restoreEnv

  beforeEach(() => {
    jest.clearAllMocks()
    capturedCommands = []
    restoreEnv = setupEnvironment({
      IONCUBE_DOWNLOAD_URL: 'https://example.com/ioncube.tar.gz'
    })

    jest.spyOn(exec, 'exec').mockImplementation((cmd, _args, options) => {
      capturedCommands.push(cmd)
      options?.listeners?.stdout?.(Buffer.from(''))
      options?.listeners?.stderr?.(Buffer.from(''))
      return Promise.resolve(0)
    })
  })

  afterEach(() => {
    restoreEnv()
  })

  it('passes -L to --activate and --deactivate when encoder-version is legacy', async () => {
    validate.mockResolvedValue(makeInputs({ encoderVersion: 'L' }))

    await main.run()

    const activateCmd = capturedCommands.find(c => c.includes('--activate'))
    const deactivateCmd = capturedCommands.find(c => c.includes('--deactivate'))

    expect(activateCmd).toBeDefined()
    expect(deactivateCmd).toBeDefined()
    expect(activateCmd).toContain('-L')
    expect(deactivateCmd).toContain('-L')
    // Must NOT activate/deactivate the wrong version
    expect(activateCmd).not.toContain('-C')
    expect(deactivateCmd).not.toContain('-C')
  }, 200000)

  it('passes -O to --activate and --deactivate when encoder-version is obsolete', async () => {
    validate.mockResolvedValue(makeInputs({ encoderVersion: 'O' }))

    await main.run()

    const activateCmd = capturedCommands.find(c => c.includes('--activate'))
    const deactivateCmd = capturedCommands.find(c => c.includes('--deactivate'))

    expect(activateCmd).toBeDefined()
    expect(deactivateCmd).toBeDefined()
    expect(activateCmd).toContain('-O')
    expect(deactivateCmd).toContain('-O')
    expect(activateCmd).not.toContain('-C')
    expect(deactivateCmd).not.toContain('-C')
  }, 200000)

  it('passes -C to --activate and --deactivate when encoder-version is current', async () => {
    validate.mockResolvedValue(makeInputs({ encoderVersion: 'C' }))

    await main.run()

    const activateCmd = capturedCommands.find(c => c.includes('--activate'))
    const deactivateCmd = capturedCommands.find(c => c.includes('--deactivate'))

    expect(activateCmd).toBeDefined()
    expect(deactivateCmd).toBeDefined()
    expect(activateCmd).toContain('-C')
    expect(deactivateCmd).toContain('-C')
  }, 200000)

  it('passes -L to --deactivate even when encoding fails (error path)', async () => {
    validate.mockResolvedValue(makeInputs({ encoderVersion: 'L' }))

    let callCount = 0
    jest.spyOn(exec, 'exec').mockImplementation((cmd, _args, options) => {
      capturedCommands.push(cmd)
      options?.listeners?.stdout?.(Buffer.from(''))
      options?.listeners?.stderr?.(Buffer.from(''))
      callCount++
      if (callCount === 2) {
        // Simulate the encoding step failing
        return Promise.reject(new Error('Encoder exited with code 40'))
      }
      return Promise.resolve(0)
    })

    await main.run()

    const activateCmd = capturedCommands.find(c => c.includes('--activate'))
    const deactivateCmd = capturedCommands.find(c => c.includes('--deactivate'))

    expect(activateCmd).toBeDefined()
    expect(deactivateCmd).toBeDefined()
    expect(activateCmd).toContain('-L')
    expect(deactivateCmd).toContain('-L')
  }, 200000)

  it('does not call --activate or --deactivate when trial is true', async () => {
    validate.mockResolvedValue(makeInputs({ trial: true, encoderVersion: 'L' }))

    await main.run()

    const activateCmd = capturedCommands.find(c => c.includes('--activate'))
    const deactivateCmd = capturedCommands.find(c => c.includes('--deactivate'))

    expect(activateCmd).toBeUndefined()
    expect(deactivateCmd).toBeUndefined()
  }, 200000)

  it('does not call --activate or --deactivate when IONCUBE_DOWNLOAD_URL is not set', async () => {
    restoreEnv()
    restoreEnv = setupEnvironment({ IONCUBE_DOWNLOAD_URL: '' })
    validate.mockResolvedValue(makeInputs({ encoderVersion: 'L' }))

    await main.run()

    const activateCmd = capturedCommands.find(c => c.includes('--activate'))
    const deactivateCmd = capturedCommands.find(c => c.includes('--deactivate'))

    expect(activateCmd).toBeUndefined()
    expect(deactivateCmd).toBeUndefined()
  }, 200000)
})
