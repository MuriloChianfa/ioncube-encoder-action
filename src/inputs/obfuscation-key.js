const core = require('@actions/core')

/**
 * Validate obfuscation-key path value.
 * @returns {bool|string} Returns a validated obfuscation-key path input.
 */
module.exports = function validateObfuscationKey(standard = '') {
  const obfuscationKey = core.getInput('obfuscation-key', { required: false }) ?? standard
  core.debug(`Adding obfuscation-key path: ${obfuscationKey === '' ? 'NONE' : obfuscationKey}`)
  return obfuscationKey
}
