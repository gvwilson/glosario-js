/**
 * Glossary of programming and data science terms.
 */

/**
 * Default glossary data (JSON version of definitive glossary file).
 */
const GLOSSARY_DATA = require('./glossary')

/**
 * Top-level keys in entries that _aren't_ languages.
 */
const NON_LANGUAGE_KEYS = new Set(['slug', 'ref'])

/**
 * What to return when a term is not found if exceptions are not wanted.
 */
const EMPTY_RESPONSE = {
  term: null,
  def: null,
  ref: null,
  acronym: null
}

/**
 * Implementation of glossary.
 */
class Glossary {
  /**
   * Build a new glossary handler.
   * @param {string} [DEFAULT_LANGUAGE] language What language to use (2-letter code).
   * @param {Boolean} throwExceptions [true] Throw exceptions or return empty structure?
   * @param {Array<Object>} data Use this data instead of default glossary.
   */
  constructor (language = Glossary.DEFAULT_LANGUAGE, throwExceptions = true, data = null) {
    // Configuration parameters.
    this._language = language
    this._throwExceptions = throwExceptions

    // Use testing data?
    data = data ? data : GLOSSARY_DATA

    // Enable lookup by slug and by term in selected language.
    this._bySlug = {}
    data.forEach(entry => {
      this._bySlug[entry.slug] = entry
    })
  }

  /**
   * Get language setting.
   */
  getLanguage () {
    return this._language
  }

  /**
   * Get set of known slugs.
   */
  allSlugs () {
    return new Set(Object.keys(this._bySlug))
  }

  /**
   * Get set of terms with definitions in this language.
   */
  allTerms () {
    return new Set(
      Object.keys(this._bySlug)
        .filter(slug => this._language in this._bySlug[slug])
        .map(slug => this._bySlug[slug][this._language].term)
    )
  }

  /**
   * Check for definition by slug.
   * @param {string} slug What to look up.
   * @param {string [null] language Language wanted (use configured language by default).
   * @returns {Boolean} Definition exists.
   */
  hasSlug (slug, language = null) {
    language = language || this._language
    return (slug in this._bySlug) && (language in this._bySlug[slug])
  }

  /**
   * Get definition, acronym, and cross-references by slug.
   * @param {string} slug What to look up.
   * @param {string [null] language Language wanted (use configured language by default).
   * @returns {Object} Contains `lang`, `term`, `def`, `ref`, `acronym`, which may be null.
   */
  bySlug (slug, language = null) {
    // Use provided language or constructed default.
    language = language || this._language

    // Unknown slug.
    if (!(slug in this._bySlug)) {
      if (this._throwExceptions) {
        throw new Error(`No entry for slug ${slug}`)
      }
      return {
        ...EMPTY_RESPONSE,
        lang: this._language
      }
    }

    // No definition in language for this slug.
    const entry = this._bySlug[slug]
    if (!(language in entry)) {
      return {
        ...EMPTY_RESPONSE,
        lang: this._language,
        ref: ('ref' in entry) ? entry.ref : null
      }
    }

    // Full response.
    const details = entry[this._language]
    return {
      lang: this._language,
      term: details.term,
      def: details.def,
      ref: ('ref' in entry) ? entry.ref : null,
      acronym: ('acronym' in details) ? details.acronym : null
    }
  }
}

/**
 * Language to use when nothing specified.
 */
Glossary.DEFAULT_LANGUAGE = 'en'

// Export glossary constructor.
module.exports = Glossary
