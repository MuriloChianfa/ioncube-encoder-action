const core = require('@actions/core')

/**
 * Validate reflection input values.
 * @returns {bool|string} Returns a validated reflection input.
 */
module.exports = function validateReflection(standard = false) {
  const reflectionAll = core.getInput('allow-reflection-all') ?? standard

  if (reflectionAll === true) {
    core.debug('Allowing reflection for all')
    return true
  }

  const reflection =
    core.getInput('allow-reflection') ?? (standard === false ? '' : standard)
  core.debug(`Using reflection for: ${reflection === '' ? 'NONE' : reflection}`)
  return reflection
}
