const core = require('@actions/core')
const EVALUATION_PATH = './ioncube_encoder_evaluation/ioncube_encoder.sh'
const tar = require('tar')
const fs = require('fs')
const cp = require('child_process')
const process = require('process')

/**
 * Download ioncube evaluation.
 * @returns {Promise<string>} Returns the path of encoder.
 */
module.exports = async function evaluation() {
  const cwd = process.cwd()

  if (!fs.existsSync('ioncube_encoder_evaluation')) {
    await download(
      'https://www.ioncube.com/eval_linux',
      `${cwd}/ioncube_encoder_evaluation.tar.gz`
    )
    await tar.extract({ file: `${cwd}/ioncube_encoder_evaluation.tar.gz` })

    if (fs.existsSync(`${cwd}/ioncube_encoder_evaluation.tar.gz`)) {
      fs.unlinkSync(`${cwd}/ioncube_encoder_evaluation.tar.gz`)
    }
  }

  return EVALUATION_PATH
}

const download = async (uri, filename) => {
  cp.execSync(`wget ${uri} -O ${filename}`)
}
