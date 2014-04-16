var expect = require('expect.js')
  , Ghoul = require('../ghoul');

var ghoul = null
  , ghoul_default = null;

function cleanup() {
  ghoul = null;
  ghoul_default = null;
}

describe('Ghoul', function () {
  afterEach(cleanup);

  it('is exported', function () {
    expect(Ghoul).to.be.ok();
    expect(Ghoul).to.be.a('function');
  });

  describe('opts', function () {
    
    it('is a public namespace', function () {
      ghoul = new Ghoul();
      expect(ghoul.opts).to.be.ok();
      expect(ghoul.opts).to.be.an('object');
    });

    it('contains the proper keys', function () {
      ghoul = new Ghoul();
      var keys = Object.keys(ghoul.opts);
      expect(keys.length).to.be(3);
      expect(ghoul.opts).to.only.have.keys(['assertionPath', 'frameworkPath', 'testDirectory']);
    });

    it('only merges in proper options', function () {
      ghoul = new Ghoul({ invalid: true });
      expect(ghoul.opts).to.not.have.property('invalid');
    });

    it('properly overrides defaults with passed options', function () {
      ghoul = new Ghoul({ assertionPath: './node_modules/some/other/lib.js' });
      expect(ghoul.opts.assertionPath).to.match(/some\/other\/lib\.js$/);
    });
  });
});
