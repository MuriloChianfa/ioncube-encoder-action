const core = require('@actions/core')
const evaluation = require('../evaluation')

/**
 * Validate trial input values.
 * @returns {Promise<string>} Returns a validated trial input.
 */
module.exports = async function validateTrial() {
  const trial = core.getInput('trial', { required: false }) ?? true

  if (trial) {
    return await evaluation()
  }

  // TODO: add a default path parameter
  return 'ioncube_encoder.sh'
}
