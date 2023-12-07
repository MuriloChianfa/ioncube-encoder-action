const core = require('@actions/core')
const evaluation = require('../evaluation')

/**
 * Validate trial input values.
 * @returns {string} Returns a validated trial input.
 */
module.exports = function validateTrial() {
  const trial = core.getInput('trial', { required: true }) ?? false

  if (trial) {
    return evaluation.evaluation()
  }

  // TODO: add a default path parameter
  return 'ioncube_encoder.sh'
}
