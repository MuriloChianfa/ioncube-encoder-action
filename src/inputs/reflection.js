const core = require('@actions/core')
const parseMultiValue = require('./parse-multi-value')

/**
 * Validate reflection input values.
 * @returns {bool|Array<string>} Returns true for allow-reflection-all, or an array of reflection patterns.
 */
module.exports = function validateReflection(standard = false) {
  const reflectionAll = core.getInput('allow-reflection-all') ?? standard

  if (reflectionAll === true) {
    core.debug('Allowing reflection for all')
    return true
  }

  const reflection =
    core.getInput('allow-reflection') ?? (standard === false ? '' : standard)
  const values = parseMultiValue(reflection)

  if (values.length === 0) {
    core.debug('Using reflection for: NONE')
    return []
  }

  core.debug(`Using reflection for: ${values.join(', ')}`)
  return values
}
