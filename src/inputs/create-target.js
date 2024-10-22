const core = require('@actions/core')

/**
 * Validate create-target input values.
 * @returns {bool|string} Returns a validated create-target input.
 */
module.exports = function validateCreateTarget(standard = false) {
  const createTarget = core.getInput('create-target', { required: false }) ?? standard
  if (createTarget) {
    core.debug('Creating target file/directory if not exists')
  }
  return createTarget
}
