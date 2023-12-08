const core = require('@actions/core')

/**
 * Validate preamble input values.
 * @returns {bool|string} Returns a validated preamble input.
 */
module.exports = function validatePreamble(standard = '') {
  const preamble = core.getInput('preamble-file') ?? standard
  core.debug(`Adding preamble file: ${preamble === '' ? 'NONE' : preamble}`)
  return preamble
}
