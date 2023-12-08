const core = require('@actions/core')

/**
 * Validate encrypt input values.
 * @returns {bool|string} Returns a validated encrypt input.
 */
module.exports = function validateEncrypt(standard = '') {
  const encrypt = core.getInput('encrypt') ?? standard
  core.debug(`Encrypting files: ${encrypt === '' ? 'NONE' : encrypt}`)
  return encrypt
}
