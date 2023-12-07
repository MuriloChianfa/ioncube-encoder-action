const core = require('@actions/core')

const EVALUATION_PATH = require('./evaluation')
const choose = require('./templates/choose')
const validateTrial = require('./inputs/trial')
const validateTemplate = require('./inputs/template')
const validateEncoderVersion = require('./inputs/encoder-version')
const validatePhpTargetVersion = require('./inputs/php-target-version')
const validateArchitecture = require('./inputs/architecture')
const validateInput = require('./inputs/input')
const validateOutput = require('./inputs/output')

/**
 * Set default arguments depending on inputed template.
 * @returns {object} Inputs based on templates.
 */
module.exports = function validate() {
  const template = validateTemplate()

  const ioncube = validateTrial()
  const trial = ioncube === EVALUATION_PATH ? true : false

  const defaults = choose(template)

  const encoderVersion = validateEncoderVersion(defaults.encoderVersion)
  const phpTargetVersion = validatePhpTargetVersion(defaults.phpTargetVersion)
  const arch = validateArchitecture(defaults.arch)
  const input = validateInput(defaults.input)
  const output = validateOutput(defaults.output)

  return {
    template,
    ioncube,
    trial,
    encoderVersion,
    phpTargetVersion,
    arch,
    input,
    output
  }
}
