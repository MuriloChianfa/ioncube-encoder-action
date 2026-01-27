const core = require('@actions/core')
const parseMultiValue = require('./parse-multi-value')

/**
 * Validate copy path value.
 * @returns {Array<string>} Returns an array of validated copy path inputs.
 */
module.exports = function validateCopy(standard = '') {
  const copy = core.getInput('copy', { required: false }) ?? standard
  const values = parseMultiValue(copy)

  if (values.length === 0) {
    core.debug('Adding copy path: NONE')
    return []
  }

  core.debug(`Adding copy path: ${values.join(', ')}`)
  return values
}
