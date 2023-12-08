const core = require('@actions/core')

/**
 * Validate binary input values.
 * @returns {bool|string} Returns a validated binary input.
 */
module.exports = function validateBinary(standard = false) {
  const binary = core.getInput('binary') ?? standard
  core.debug(
    binary === true
      ? 'Encoding into binary format'
      : 'Encoding into ASCII format'
  )
  return binary
}
