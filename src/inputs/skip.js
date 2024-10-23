const core = require('@actions/core')

/**
 * Validate skip path value.
 * @returns {bool|string} Returns a validated skip path input.
 */
module.exports = function validateSkip(standard = '') {
  const skip = core.getInput('skip', { required: false }) ?? standard
  core.debug(`Adding a path to skip: ${skip === '' ? 'NONE' : skip}`)
  return skip
}
