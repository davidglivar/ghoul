Ghoul
=====

Ghoul is a wrapper around [mocha-phantomjs](https://github.com/Medium/phantomjs)
with a few strict assumptions:

1. You're writing tests for front-end consumption only
2. You're using CommonJS-style exports in your library (ie, browserify)
3. You want to use [mocha](http://visionmedia.github.io/mocha/)
4. You want to use [expect.js](https://github.com/LearnBoost/expect.js/)
5. You only want terminal output

In the future I'd like to make this not as strict, but for the time being this
is how it will be as this is my current workflow.

As with most things on github, this is a work in progress and API breaking
changes are possible with future releases until a stable version is reached.

Usage
-----

If you want global access to the ghoul executable install with the global flag

    npm i -g ghoul

If you want to use the exposed API or the executable locally

    npm i ghoul [--save-dev]

### API

    var Ghoul = require('ghoul')
      , ghoul = new Ghoul({ testDirectory: 'test' });
    ghoul.run();

### Executable

    Usage: ghoul [options]

    Options:

      -h, --help                        output usage information
      -t, --test-directory <directory>  Directory containing tests

TODO
----

- HTML Fixtures
- More choices for assertion libraries (default to node's assert)
- Expose more options for mocha-phantomjs

