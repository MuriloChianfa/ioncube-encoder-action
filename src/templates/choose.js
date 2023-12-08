const laravel = require('./laravel')

const templates = {
  laravel
}

/**
 * Choose correct template based on template input value.
 * @returns {object} Returns defaults values based on templates.
 */
module.exports = function choose(template = 'laravel') {
  const standard = {
    encoderVersion: 'current',
    phpTargetVersion: '8.2',
    arch: 64,
    input: '',
    output: 'encrypted',
    reflection: false,
    encrypt: '',
    binary: false,
    optimize: 'more',
    comments: false,
    loader: false,
    preamble: '',
    passphrase: '',
    check: 'auto',
    license: '',
    callback: ''
  }

  const args = templates[template]?.()
  return args ?? standard
}
