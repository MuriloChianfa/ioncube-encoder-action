const core = require('@actions/core')

/**
 * Validate template input values.
 * @returns {string} Returns a validated template input.
 */
module.exports = function validateTemplate() {
  const template = core.getInput('template', { required: false }) ?? 'php'
  core.debug(`Encoding files using template: ${template}`)

  // TODO: validate template values

  return template
}
