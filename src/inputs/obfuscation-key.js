const core = require('@actions/core')

/**
 * Validate obfuscation-key path value.
 * @returns {bool|string} Returns a validated obfuscation-key path input.
 */
module.exports = function validateObfuscationKey(standard = '') {
  const required = { required: false }
  const obfuscationKey = core.getInput('obfuscation-key', required) ?? standard
  const path = obfuscationKey === '' ? 'NONE' : obfuscationKey
  core.debug(`Adding obfuscation-key path: ${path}`)
  return obfuscationKey
}
