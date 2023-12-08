const core = require('@actions/core')

/**
 * Validate loader input values.
 * @returns {bool|string} Returns a validated loader input.
 */
module.exports = function validateLoader(standard = true) {
  const loader = !(
    core.getInput('without-loader-check', { required: true }) ?? standard
  )
  core.debug(
    loader === true
      ? 'Checking for loader in environment'
      : 'Not checking for loader in environment'
  )
  return loader
}
