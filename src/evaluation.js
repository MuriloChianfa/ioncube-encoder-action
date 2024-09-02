const core = require('@actions/core')
const EVALUATION_PATH = './ioncube_encoder_evaluation/ioncube_encoder.sh'
const ENCODER_PATH = './ioncube_encoder/ioncube_encoder.sh'
const IONCUBE_EVAL_URL = 'https://www.ioncube.com/eval_linux'
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

  const gzip_evaluation_path = `${cwd}/ioncube_encoder_evaluation.tar.gz`

  if (!fs.existsSync(`${cwd}/ioncube_encoder_evaluation`)) {
    await download(IONCUBE_EVAL_URL, gzip_evaluation_path)
    await tar.extract({ file: gzip_evaluation_path })

    if (fs.existsSync(gzip_evaluation_path)) {
      fs.unlinkSync(gzip_evaluation_path)
    }
  }

  return EVALUATION_PATH
}

/**
 * Download ioncube licensed version.
 * @returns {Promise<string>} Returns the path of encoder.
 */
module.exports = async function encoder() {
  const cwd = process.cwd()

  let downloadUrl = IONCUBE_EVAL_URL
  let path = ENCODER_PATH
  let ioncube_folder = `${cwd}/ioncube_encoder`
  if (!process.env.IONCUBE_DOWNLOAD_URL) {
    downloadUrl = process.env.IONCUBE_DOWNLOAD_URL
    path = EVALUATION_PATH
    ioncube_folder = `${cwd}/ioncube_encoder_evaluation`
  }

  const gzip_encoder_path = `${cwd}/ioncube_encoder.tar.gz`

  if (!fs.existsSync(ioncube_folder)) {
    await download(downloadUrl, gzip_encoder_path)
    await tar.extract({ file: gzip_encoder_path })

    if (fs.existsSync(gzip_encoder_path)) {
      fs.unlinkSync(gzip_encoder_path)
    }
  }

  return path
}

const download = async (uri, filename) => {
  cp.execSync(`wget ${uri} -O ${filename}`)
}
