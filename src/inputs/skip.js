const core = require('@actions/core')
const parseMultiValue = require('./parse-multi-value')

/**
 * Validate skip path value.
 * @returns {Array<string>} Returns an array of validated skip path inputs.
 */
module.exports = function validateSkip(standard = '') {
  const skip = core.getInput('skip', { required: false }) ?? standard
  const values = parseMultiValue(skip)

  if (values.length === 0) {
    core.debug('Adding a path to skip: NONE')
    return []
  }

  core.debug(`Adding a path to skip: ${values.join(', ')}`)
  return values
}
