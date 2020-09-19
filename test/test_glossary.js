'use strict'

const assert = require('assert')
assert.every = (values, callback, message) => {
  assert(values.every(v => callback(v)), message)
}

const Glossary = require('../index')

const ONE_TERM = [
  {
    "slug": "_test_term",
    "en": {
      "term": "test term",
      "def": "for testing purposes"
    }
  }
]

describe('test glossary lookup', () => {
  it('constructs with known language', (done) => {
    const g = new Glossary()
    assert.equal(g.getLanguage(), Glossary.DEFAULT_LANGUAGE,
                 `Language not correctly set by default`)
    done()
  })

  it('has term that exists by slug in default language', (done) => {
    const g = new Glossary()
    assert(g.hasSlug('absolute_path'),
           `Expected to have term by slug`)
    assert(!g.hasSlug('non_existent_term'),
           `Should not have non-existent slug`)
    done()
  })

  it('has term that exists by slug in non-default language', (done) => {
    const g = new Glossary()
    assert(g.hasSlug('absolute_path', 'fr'),
           `Expected to have term by slug in non-default language`)
    assert(!g.hasSlug('non_existent_term', 'fr'),
           `Should not have non-existent slug in any language`)
    done()
  })

  it('sets language during construction', (done) => {
    const g = new Glossary('fr')
    assert.equal(g.getLanguage(), 'fr',
                 `Wrong language after construction`)
    done()
  })

  it('puts correct fields in response for existing definition', (done) => {
    const g = new Glossary()
    const actual = g.bySlug('absolute_path')
    assert.every(['lang', 'term', 'def', 'ref', 'acronym'],
                 key => (key in actual),
                 `Response for existing terms lacks key(s)`)
    done()
  })

  it('puts correct fields in response when definition missing in language', (done) => {
    const g = new Glossary('fr', true, ONE_TERM)
    const actual = g.bySlug('_test_term')
    assert(('lang' in actual) && (actual.lang === 'fr'),
           `Language should be in empty response`)
    assert.every(['term', 'def', 'ref', 'acronym'],
                 key => ((key in actual) && (actual[key] === null)),
                 `Response missing keys or has non-null entries`)
    done()
  })

  it('gets the right definition', (done) => {
    const g = new Glossary('en', true, ONE_TERM)
    const actual = g.bySlug('_test_term')
    const expected = {
      lang: 'en',
      term: 'test term',
      def: 'for testing purposes',
      ref: null,
      acronym: null
    }
    assert.deepEqual(actual, expected,
                     `Wrong values returned for definition`)
    done()
  })

  it('reports the right set of slugs', (done) => {
    const g = new Glossary('en', true, ONE_TERM)
    const actual = g.allSlugs()
    assert.equal(actual.size, 1,
                 `Should only have one slug`)
    assert(actual.has('_test_term'),
           `Wrong slug in results`)
    done()
  })

  it('reports the right set of terms', (done) => {
    const g = new Glossary('en', true, ONE_TERM)
    const actual = g.allTerms()
    assert.equal(actual.size, 1,
                 `Should only have one term`)
    assert(actual.has('test term'),
           `Wrong term in results`)
    done()
  })
})
