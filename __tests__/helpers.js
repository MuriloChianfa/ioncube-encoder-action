/**
 * Shared test utilities and mock helpers
 */

const core = require('@actions/core')
const exec = require('@actions/exec')

/**
 * Create a mock for getInput that returns specific values based on input names
 * @param {Object} inputs - Object mapping input names to values
 * @returns {jest.Mock} Mocked getInput function
 */
function createGetInputMock(inputs = {}) {
  return jest.fn(name => {
    if (name in inputs) {
      const value = inputs[name]
      // Convert boolean values to strings as GitHub Actions does
      if (typeof value === 'boolean') {
        return value.toString()
      }
      return value
    }
    return ''
  })
}

/**
 * Create a mock for getBooleanInput
 * @param {Object} inputs - Object mapping input names to boolean values
 * @returns {jest.Mock} Mocked getBooleanInput function
 */
function createGetBooleanInputMock(inputs = {}) {
  return jest.fn(name => {
    if (name in inputs) {
      return inputs[name]
    }
    return false
  })
}

/**
 * Setup standard mocks for GitHub Actions core library
 * @returns {Object} Object containing all mock functions
 */
function setupCoreMocks() {
  const debugMock = jest.spyOn(core, 'debug').mockImplementation()
  const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  const getBooleanInputMock = jest
    .spyOn(core, 'getBooleanInput')
    .mockImplementation()
  const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  const errorMock = jest.spyOn(core, 'error').mockImplementation()
  const warningMock = jest.spyOn(core, 'warning').mockImplementation()
  const infoMock = jest.spyOn(core, 'info').mockImplementation()

  return {
    debugMock,
    getInputMock,
    getBooleanInputMock,
    setFailedMock,
    setOutputMock,
    errorMock,
    warningMock,
    infoMock
  }
}

/**
 * Setup exec mock for IonCube command execution
 * @param {number} exitCode - Exit code to return (0 for success)
 * @param {string} stdout - Standard output
 * @param {string} stderr - Standard error
 * @returns {jest.Mock} Mocked exec.exec function
 */
function setupExecMock(exitCode = 0, stdout = '', stderr = '') {
  return jest.spyOn(exec, 'exec').mockImplementation((cmd, args, options) => {
    if (options?.listeners?.stdout && stdout) {
      options.listeners.stdout(Buffer.from(stdout))
    }
    if (options?.listeners?.stderr && stderr) {
      options.listeners.stderr(Buffer.from(stderr))
    }
    if (exitCode !== 0) {
      return Promise.reject(
        new Error(`Command failed with exit code ${exitCode}`)
      )
    }
    return Promise.resolve(exitCode)
  })
}

/**
 * Setup environment variables for testing
 * @param {Object} envVars - Object containing environment variables
 */
function setupEnvironment(envVars = {}) {
  const originalEnv = { ...process.env }

  // Set environment variables
  for (const key of Object.keys(envVars)) {
    process.env[key] = envVars[key]
  }

  return () => {
    // Restore original environment
    for (const key of Object.keys(envVars)) {
      if (originalEnv[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = originalEnv[key]
      }
    }
  }
}

/**
 * Create input configuration for PHP template with custom overrides
 * @param {Object} overrides - Custom input values to override defaults
 * @returns {Object} Complete input configuration
 */
function createPhpTemplateInputs(overrides = {}) {
  return {
    trial: true,
    template: 'php',
    'encoder-version': 'current',
    'php-target-version': '8.2',
    arch: '64',
    source: '',
    output: 'encrypted',
    'allow-reflection': '',
    'allow-reflection-all': false,
    encrypt: '',
    binary: false,
    optimize: 'more',
    'no-doc-comments': false,
    'without-loader-check': false,
    'preamble-file': '',
    passphrase: '',
    'license-check': 'auto',
    'with-license': '',
    'callback-file': '',
    'create-target': false,
    'replace-target': false,
    copy: '',
    ignore: '',
    skip: '',
    obfuscate: 'none',
    'obfuscation-key': '',
    ...overrides
  }
}

/**
 * Create input configuration for Laravel template with custom overrides
 * @param {Object} overrides - Custom input values to override defaults
 * @returns {Object} Complete input configuration
 */
function createLaravelTemplateInputs(overrides = {}) {
  return {
    trial: true,
    template: 'laravel',
    'encoder-version': 'current',
    'php-target-version': '8.2',
    arch: '64',
    source: '',
    output: 'encrypted',
    'allow-reflection': '',
    'allow-reflection-all': true,
    encrypt: '*.blade.php',
    binary: true,
    optimize: 'max',
    'no-doc-comments': false,
    'without-loader-check': true,
    'preamble-file': '',
    passphrase: 'CHANGEME',
    'license-check': 'script',
    'with-license': '/opt/license',
    'callback-file': 'public/ioncube.php',
    'create-target': true,
    'replace-target': true,
    copy: '',
    ignore: '*/cache/*',
    skip: '*/vendor/*',
    obfuscate: 'classes',
    'obfuscation-key': 'CHANGEME',
    ...overrides
  }
}

/**
 * Assert that debug messages contain expected patterns
 * @param {jest.Mock} debugMock - The debug mock function
 * @param {Array<string>} expectedMessages - Array of expected message substrings
 */
function assertDebugMessages(debugMock, expectedMessages) {
  const allCalls = debugMock.mock.calls.map(call => call[0])
  const allMessages = allCalls.join('\n')

  for (const expected of expectedMessages) {
    const found = allCalls.some(
      call => typeof call === 'string' && call.includes(expected)
    )
    if (!found) {
      throw new Error(
        `Expected debug message containing "${expected}" but not found.\nAll messages:\n${allMessages}`
      )
    }
  }
}

/**
 * Get all debug messages as array
 * @param {jest.Mock} debugMock - The debug mock function
 * @returns {Array<string>} Array of debug messages
 */
function getDebugMessages(debugMock) {
  return debugMock.mock.calls.map(call => call[0]?.toString() || '')
}

/**
 * Create a test scenario configuration
 * @param {string} name - Scenario name
 * @param {Object} inputs - Input configuration
 * @param {Array<string>} expectedDebugMessages - Expected debug messages
 * @returns {Object} Test scenario configuration
 */
function createTestScenario(name, inputs, expectedDebugMessages = []) {
  return {
    name,
    inputs,
    expectedDebugMessages
  }
}

module.exports = {
  createGetInputMock,
  createGetBooleanInputMock,
  setupCoreMocks,
  setupExecMock,
  setupEnvironment,
  createPhpTemplateInputs,
  createLaravelTemplateInputs,
  assertDebugMessages,
  getDebugMessages,
  createTestScenario
}
