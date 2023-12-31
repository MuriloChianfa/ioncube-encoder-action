const core = require('@actions/core')

/**
 * Validate license input values.
 * @returns {bool|string} Returns a validated license input.
 */
module.exports = function validateLicense(standard = '') {
  const license = core.getInput('with-license') ?? standard
  core.debug(
    `Using license file in runtime path: ${license === '' ? 'NONE' : license}`
  )
  return license
}
