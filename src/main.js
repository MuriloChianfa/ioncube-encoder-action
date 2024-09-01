const core = require('@actions/core')
const exec = require('@actions/exec')
const validate = require('./validate')
const binary = require('./inputs/binary')

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

    let customOptions = ''

    if (inputs.binary === true) {
      customOptions += ' --binary'
    }

    if (inputs.comments === false) {
      customOptions += ' --no-doc-comments'
    }

    if (inputs.encrypt !== '') {
      customOptions += ` --encrypt "${inputs.encrypt}"`
    }

    if (inputs.optimize === 'more' || inputs.optimize === 'max') {
      customOptions += ` --optimize ${inputs.optimize}`
    }

    if (inputs.reflection === true) {
      customOptions += ` --allow-reflection-all`
    } else if (inputs.reflection !== '') {
      customOptions += ` --allow-reflection ${inputs.reflection}`
    }

    if (inputs.preamble !== '') {
      customOptions += ` --preamble-file ${inputs.preamble}`
    }

    if (inputs.passphrase !== '') {
      customOptions += ` --passphrase "${inputs.passphrase}"`
    }

    if (inputs.license !== '') {
      customOptions += ` --with-license ${inputs.license}`
    }

    if (inputs.callback !== '') {
      customOptions += ` --callback-file "${inputs.callback}"`
    }

    if (inputs.check === 'auto' || inputs.check === 'script') {
      customOptions += ` --license-check ${inputs.check}`
    }

    customOptions.trim()

    const command = `${inputs.ioncube} -${inputs.encoderVersion} -${inputs.phpTargetVersion} -${inputs.arch} ${inputs.input} -o ${inputs.output} ${customOptions} --create-target --replace-target`
    // core.debug(command)
    try {
      const exitCode = await exec.exec(command, [], options)
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
