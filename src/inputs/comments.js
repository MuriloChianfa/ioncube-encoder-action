const core = require('@actions/core')

/**
 * Validate comments input values.
 * @returns {bool|string} Returns a validated comments input.
 */
module.exports = function validateComments(standard = true) {
  const comments = !(
    core.getInput('no-doc-comments', { required: true }) ?? standard
  )
  core.debug(
    comments === true ? 'Allowing doc comments' : 'Now allow doc comments'
  )
  return comments
}
