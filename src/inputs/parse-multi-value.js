const core = require('@actions/core')

/**
 * Parse multi-value input that can be space-separated, newline-separated, or comma-separated.
 * @param {string} value - The input value to parse
 * @returns {Array<string>} Array of trimmed, non-empty values
 */
function parseMultiValue(value) {
  if (!value || value === '') {
    return []
  }

  // Convert to string if needed
  const stringValue = String(value)

  // Split by newlines, commas, or spaces
  // Priority: newlines > commas > spaces
  let values = []

  if (stringValue.includes('\n')) {
    // Newline-separated (from YAML multiline syntax)
    values = stringValue.split('\n')
  } else if (stringValue.includes(',')) {
    // Comma-separated
    values = stringValue.split(',')
  } else {
    // Space-separated
    values = stringValue.split(/\s+/)
  }

  // Trim and filter out empty values
  const result = values.map(v => v.trim()).filter(v => v !== '')

  return result
}

module.exports = parseMultiValue
