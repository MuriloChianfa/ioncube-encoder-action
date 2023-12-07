const core = require('@actions/core')

/**
 * Validate php-target-version input values.
 * @returns {string} Returns a validated php-target-version input.
 */
module.exports = function validatePhpTargetVersion(standard = '8.2') {
  let phpTargetVersion =
    core.getInput('php-target-version', { required: true }) ?? standard

  core.debug(`Using PHP target version: ${phpTargetVersion}`)

  if (phpTargetVersion === '8.0') {
    phpTargetVersion = '80'
  } else if (phpTargetVersion === '8.1') {
    phpTargetVersion = '81'
  } else {
    phpTargetVersion = '82'
  }

  return phpTargetVersion
}
