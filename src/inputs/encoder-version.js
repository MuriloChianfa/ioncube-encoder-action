const core = require('@actions/core')

/**
 * Validate encoder-version input values.
 * @returns {string} Returns a validated encoder-version input.
 */
module.exports = function validateEncoderVersion(standard = 'current') {
  let encoderVersion = core.getInput('encoder-version', { required: true }) ?? standard

  core.debug(`Using encoder version: ${encoderVersion}`)

  if (encoderVersion === 'obsolete') {
    encoderVersion = 'O'
  } else if (encoderVersion === 'legacy') {
    encoderVersion = 'L'
  } else {
    encoderVersion = 'C'
  }

  return encoderVersion
}
