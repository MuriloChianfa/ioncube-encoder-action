const core = require('@actions/core')

/**
 * Validate replace-target input values.
 * @returns {bool|string} Returns a validated replace-target input.
 */
module.exports = function validateReplaceTarget(standard = false) {
  const replaceTarget = core.getInput('replace-target', { required: false }) ?? standard
  if (replaceTarget) {
    core.debug('Replacing target file/directory')
  }
  return replaceTarget
}
