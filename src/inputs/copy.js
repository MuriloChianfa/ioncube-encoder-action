const core = require('@actions/core')

/**
 * Validate copy path value.
 * @returns {bool|string} Returns a validated copy path input.
 */
module.exports = function validateCopy(standard = '') {
  const copy = core.getInput('copy', { required: false }) ?? standard
  core.debug(`Adding copy path: ${copy === '' ? 'NONE' : copy}`)
  return copy
}
