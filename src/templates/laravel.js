/**
 * Input values for laravel projects.
 * @returns {object} Returns defaults values for laravel template.
 */
module.exports = async function laravel() {
  return {
    encoderVersion: 'current',
    phpTargetVersion: '8.2',
    arch: 64,
    input: '',
    output: 'encrypted'
  }
}
