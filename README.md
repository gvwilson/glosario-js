# glosario-js

An interface to [Glosario](https://github.com/carpentries/glosario/) in JavaScript.
Contributions are welcome:
please see our [Code of Conduct](./CONDUCT.md) for guidelines,
and our [License](./LICENSE.md) for licensing.

## Usage

```js
const Glossary = require('glosario-js');

const g = new Glossary('en');	// Use 'es' for Spanish, etc.

g.getLanguage();		// => 'en'
g.allSlugs();			// => Set(['abandonware', 'absolute_path', ...])
g.allTerms();			// => Set(['abandonware', 'absolute path', ...])
g.hasSlug('some_key');		// => true or false

g.bySlug('xml');
/*
 * {
 *   lang: 'en',
 *   term: 'XML',
 *   def: '...Markdown definition',
 *   ref: [...cross-reference slugs...]
 *   acronym: null
 * }
 */

g.bySlug('unknown_slug');
/*
 * {
 *   lang: 'en',
 *   term: null,
 *   def: null,
 *   ref: null,
 *   acronym: null
 * }
 */
```

## Maintenance

1.  To update the glossary with the latest terms included in <https://glosario.carpentries.org/>,
    `npm run build` to get the current `glossary.yml` file and re-create `./glossary.js`
    (a JSON version of the same data).

1.  `npm run test` to re-run Mocha tests.
