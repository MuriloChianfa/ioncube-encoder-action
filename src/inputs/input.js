const core = require('@actions/core')

/**
 * Validate input input values.
 * @returns {string} Returns a validated input input.
 */
module.exports = function validateInput(standard = '') {
  let input = core.getInput('source', { required: true }) ?? standard

  core.debug(`Using input files: ${input === '' ? '.' : input}`)

  if (input === '') {
    input = __dirname
  }

  return input.replace(/\/$/, '')
}
