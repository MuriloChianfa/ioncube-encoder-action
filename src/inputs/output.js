const core = require('@actions/core')

/**
 * Validate output input values.
 * @returns {string} Returns a validated output input.
 */
module.exports = function validateOutput(standard = 'encrypted') {
  const output = core.getInput('output') ?? standard

  core.debug(`Using output path: ${output}`)

  return output
}
