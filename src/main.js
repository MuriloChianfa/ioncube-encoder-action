const core = require('@actions/core')
const exec = require('@actions/exec')
const validate = require('./validate')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  const inputs = await validate()

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

  if (!inputs.trial && process.env.IONCUBE_DOWNLOAD_URL) {
    try {
      const exitCode = await exec.exec(
        `${inputs.ioncube} --activate`,
        [],
        options
      )
      core.debug(exitCode)
    } catch (error) {
      core.error(error)
    }
  }

  myOutput = ''
  myError = ''

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

  try {
    const command = `${inputs.ioncube} -${inputs.encoderVersion} -${inputs.phpTargetVersion} -${inputs.arch} ${inputs.input} -o ${inputs.output} ${customOptions} --create-target --replace-target`

    let exitCode = await exec.exec(command, [], options)
    core.debug(exitCode)
    core.debug(myOutput)
    core.debug(myError)

    if (!inputs.trial && process.env.IONCUBE_DOWNLOAD_URL) {
      myOutput = ''
      myError = ''

      exitCode = await exec.exec(`${inputs.ioncube} --deactivate`, [], options)

      core.debug(exitCode)
      core.debug(myOutput)
      core.debug(myError)
    }

    core.setOutput('status', 'Project encoded with success')
  } catch (error) {
    if (!inputs.trial && process.env.IONCUBE_DOWNLOAD_URL) {
      myOutput = ''
      myError = ''

      const exitCode = await exec.exec(
        `${inputs.ioncube} --deactivate`,
        [],
        options
      )

      core.debug(exitCode)
      core.debug(myOutput)
      core.debug(myError)
    }

    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
