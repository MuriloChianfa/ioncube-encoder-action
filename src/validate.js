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
const validateReflection = require('./inputs/reflection')
const validateEncrypt = require('./inputs/encrypt')
const validateBinary = require('./inputs/binary')
const validateOptimize = require('./inputs/optimize')
const validateComments = require('./inputs/comments')
const validateLoader = require('./inputs/loader')
const validatePreamble = require('./inputs/preamble')
const validatePassphrase = require('./inputs/passphrase')
const validateCheck = require('./inputs/check')
const validateLicense = require('./inputs/license')
const validateCallback = require('./inputs/callback')

/**
 * Set default arguments depending on inputed template.
 * @returns {Promise<object>} Inputs based on templates.
 */
module.exports = async function validate() {
  const ioncube = await validateTrial()
  const trial = ioncube === EVALUATION_PATH ? true : false

  const template = validateTemplate()
  const defaults = choose(template)

  return {
    template,
    ioncube,
    trial,
    encoderVersion: validateEncoderVersion(defaults.encoderVersion),
    phpTargetVersion: validatePhpTargetVersion(defaults.phpTargetVersion),
    arch: validateArchitecture(defaults.arch),
    input: validateInput(defaults.input),
    output: validateOutput(defaults.output),
    reflection: validateReflection(defaults.reflection),
    encrypt: validateEncrypt(defaults.encrypt),
    binary: validateBinary(defaults.binary),
    optimize: validateOptimize(defaults.optimize),
    comments: validateComments(defaults.comments),
    loader: validateLoader(defaults.loader),
    preamble: validatePreamble(defaults.preamble),
    passphrase: validatePassphrase(defaults.passphrase),
    check: validateCheck(defaults.check),
    license: validateLicense(defaults.license),
    callback: validateCallback(defaults.callback)
  }
}
