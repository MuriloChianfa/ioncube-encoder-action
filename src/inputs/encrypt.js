const core = require('@actions/core')
const parseMultiValue = require('./parse-multi-value')

/**
 * Validate encrypt input values.
 * @returns {Array<string>} Returns an array of validated encrypt inputs.
 */
module.exports = function validateEncrypt(standard = '') {
  const encrypt = core.getInput('encrypt') ?? standard
  const values = parseMultiValue(encrypt)

  if (values.length === 0) {
    core.debug('Encrypting files: NONE')
    return []
  }

  core.debug(`Encrypting files: ${values.join(', ')}`)
  return values
}
