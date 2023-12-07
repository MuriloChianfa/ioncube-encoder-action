const core = require('@actions/core')
const exec = require('@actions/exec')
const validate = require('./validate')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const inputs = await validate()

    if (!inputs.trial) {
      // TODO: activate ioncube
    }

    let myOutput = ''
    let myError = ''

    const options = {}
    options.listeners = {
      stdout: data => {
        myOutput += data.toString()
      },
      stderr: data => {
        myError += data.toString()
      }
    }
    options.silent = false
    options.failOnStdErr = false
    options.ignoreReturnCode = false

    try {
      const exitCode = await exec.exec(
        `${inputs.ioncube} -${inputs.encoderVersion} -${inputs.phpTargetVersion} -${inputs.arch} ${inputs.input} -o ${inputs.output} --create-target --replace-target`,
        [],
        options
      )
      core.debug(exitCode)
    } catch (error) {
      core.error(error)
    }

    core.debug(myOutput)
    core.debug(myError)

    core.setOutput('status', 'Project encoded with success')
  } catch (error) {
    // TODO: deactivate ioncube
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
