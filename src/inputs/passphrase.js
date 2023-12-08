const core = require('@actions/core')

/**
 * Validate passphrase input values.
 * @returns {bool|string} Returns a validated passphrase input.
 */
module.exports = function validatePassphrase(standard = '') {
  const passphrase = core.getInput('passphrase') ?? standard
  core.debug(`Using passphrase: ${passphrase === '' ? 'NONE' : passphrase}`)
  return passphrase
}
