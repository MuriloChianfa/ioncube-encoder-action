const core = require('@actions/core')
const EVALUATION_PATH = './ioncube_encoder_evaluation/ioncube_encoder.sh'

/**
 * Download ioncube evaluation.
 * @returns {string} Returns the path of encoder.
 */
async function evaluation() {
  core.debug('Using trial ioncube to encode files!')
  core.debug('Downloading trial version of ioncube encoder...')

  // TODO: download ioncube evaluation
  // wget https://www.ioncube.com/eval_linux -O ioncube_encoder_evaluation.tar.gz
  // tar -xzvf ioncube_encoder_evaluation.tar.gz

  return EVALUATION_PATH
}

module.exports = {
  EVALUATION_PATH,
  evaluation
}
