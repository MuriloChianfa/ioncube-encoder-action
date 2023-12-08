const core = require('@actions/core')

/**
 * Validate check input values.
 * @returns {bool|string} Returns a validated check input.
 */
module.exports = function validateCheck(standard = 'auto') {
  let check = core.getInput('license-check') ?? standard

  if (check === 'auto') {
    check = 'auto'
  } else {
    check = 'script'
  }

  core.debug(`Using license check: ${check}`)
  return check
}
