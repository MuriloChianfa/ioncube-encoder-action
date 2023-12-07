const laravel = require('./laravel')

const templates = {
  laravel
}

/**
 * Choose correct template based on template input value.
 * @returns {object} Returns defaults values based on templates.
 */
module.exports = async function choose(template = 'laravel') {
  const standard = {
    encoderVersion: 'current',
    phpTargetVersion: '8.2',
    arch: 64,
    input: '',
    output: 'encrypted'
  }

  const args = templates[template]?.()
  return args ?? standard
}
