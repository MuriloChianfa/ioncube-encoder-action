const core = require('@actions/core')
const exec = require('@actions/exec')
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

  let downloadUrl = process.env.IONCUBE_DOWNLOAD_URL
  let path = ENCODER_PATH
  let ioncube_folder = `${cwd}/ioncube_encoder`
  if (!process.env.IONCUBE_DOWNLOAD_URL) {
    downloadUrl = IONCUBE_EVAL_URL
    path = EVALUATION_PATH
    ioncube_folder = `${cwd}/ioncube_encoder_evaluation`
  }

  const gzip_encoder_path = `${cwd}/ioncube_encoder.tar.gz`

  if (!fs.existsSync(ioncube_folder)) {
    await download(downloadUrl, gzip_encoder_path)

    if (!fs.existsSync(ioncube_folder)) {
      fs.mkdirSync(ioncube_folder, { recursive: true })
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
    await exec.exec(
      `tar -xzvf ${gzip_encoder_path} -C ${ioncube_folder} --strip-components=1`,
      [],
      options
    )

    if (fs.existsSync(gzip_encoder_path)) {
      fs.unlinkSync(gzip_encoder_path)
    }
  }

  return path
}

const download = async (uri, filename) => {
  const downloadUrl = uri ?? IONCUBE_EVAL_URL
  cp.execSync(`wget ${downloadUrl} -O ${filename}`)
}
