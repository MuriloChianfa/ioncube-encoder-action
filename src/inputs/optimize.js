const core = require('@actions/core')

/**
 * Validate optimize input values.
 * @returns {bool|string} Returns a validated optimize input.
 */
module.exports = function validateOptimize(standard = 'max') {
  let optimize = core.getInput('optimize', { required: true }) ?? standard

  if (optimize === 'more') {
    optimize = 'more'
  } else {
    optimize = 'max'
  }

  core.debug(`Using optimization: ${optimize}`)
  return optimize
}
