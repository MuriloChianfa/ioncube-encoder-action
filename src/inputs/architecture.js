const core = require('@actions/core')

/**
 * Validate arch input values.
 * @returns {string} Returns a validated arch input.
 */
module.exports = function validateArchitecture(standard = '64') {
  let arch = core.getInput('arch', { required: true }) ?? standard

  if (arch === '86') {
    arch = 'x86'
  } else {
    arch = 'x86-64'
  }

  core.debug(`Using target architecture: ${arch}`)

  return arch
}
