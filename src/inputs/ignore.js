const core = require('@actions/core')
const parseMultiValue = require('./parse-multi-value')

/**
 * Validate ignore path value.
 * @returns {Array<string>} Returns an array of validated ignore path inputs.
 */
module.exports = function validateIgnore(standard = '') {
  const ignore = core.getInput('ignore', { required: false }) ?? standard
  const values = parseMultiValue(ignore)

  if (values.length === 0) {
    core.debug('Adding ignore path: NONE')
    return []
  }

  core.debug(`Adding ignore path: ${values.join(', ')}`)
  return values
}
