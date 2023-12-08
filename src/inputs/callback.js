const core = require('@actions/core')

/**
 * Validate callback input values.
 * @returns {bool|string} Returns a validated callback input.
 */
module.exports = function validateCallback(standard = '') {
  const callback = core.getInput('callback-file') ?? standard
  core.debug(
    `Using callback file in runtime path: ${
      callback === '' ? 'NONE' : callback
    }`
  )
  return callback
}
