/**
 * Build JSON version of glossary for inclusion in package.
 * Run this from the command-line as 'npm run build.js [URL of glossary file]'
 * to recreate 'glossary.js'.
 */

const fs = require('fs')
const request = require('request')
const yaml = require('js-yaml')

// Where to get YAML version of glossary.
const DEFAULT_URL = 'http://raw.githubusercontent.com/carpentries/glosario/master/glossary.yml'

// Where to save JSON version of file.
const DEFAULT_JSON = 'glossary.js'

// Get and save data.
request(DEFAULT_URL, (error, response, body) => {
  const json = yaml.safeLoad(body)
  fs.writeFileSync(DEFAULT_JSON, `module.exports = ${JSON.stringify(json, null, 2)}`)
})
