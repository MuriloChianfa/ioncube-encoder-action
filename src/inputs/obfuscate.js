const core = require('@actions/core')

/**
 * Validate obfuscate value.
 * @returns {bool|string} Returns a validated obfuscate input.
 */
module.exports = function validateObfuscate(standard = 'none') {
  let obfuscate = core.getInput('obfuscate', { required: false }) ?? standard

  const obfuscateValues = obfuscate.split(',').map(value => value.trim())

  const isValid = obfuscateValues.every(value =>
    ['all', 'locals', 'functions', 'methods', 'classes', 'linenos'].includes(
      value
    )
  )
  if (!isValid) {
    core.debug(`Input for obfuscate option is not valid!`)
  }

  obfuscate = isValid ? obfuscateValues.join(',') : 'none'

  core.debug(`Using obfuscate option: ${obfuscate}`)
  return obfuscate
}
