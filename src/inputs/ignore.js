const core = require('@actions/core')

/**
 * Validate ignore path value.
 * @returns {bool|string} Returns a validated ignore path input.
 */
module.exports = function validateIgnore(standard = '') {
  const ignore = core.getInput('ignore', { required: false }) ?? standard
  core.debug(`Adding ignore path: ${ignore === '' ? 'NONE' : ignore}`)
  return ignore
}
