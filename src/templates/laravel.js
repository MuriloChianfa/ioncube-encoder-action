/**
 * Input values for laravel projects.
 * @returns {object} Returns defaults values for laravel template.
 */
module.exports = function laravel() {
  return {
    encoderVersion: 'current',
    phpTargetVersion: '8.2',
    arch: 64,
    input: '',
    output: 'encrypted',
    reflection: true,
    encrypt: '*.blade.php',
    binary: true,
    optimize: 'max',
    comments: true, // without
    loader: true, // without
    preamble: '',
    passphrase: 'CHANGEME',
    check: 'script',
    license: '/opt/license',
    callback: 'public/ioncube.php'
  }
}
