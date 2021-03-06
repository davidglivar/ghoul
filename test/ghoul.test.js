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

  describe('settings', function () {
    
    it('is a public namespace', function () {
      ghoul = new Ghoul();
      expect(ghoul.settings).to.be.ok();
      expect(ghoul.settings).to.be.an('object');
    });

    it('contains the proper keys', function () {
      ghoul = new Ghoul();
      var keys = Object.keys(ghoul.settings);
      expect(keys.length).to.be(5);
      expect(ghoul.settings).to.only.have.keys([
       'assertionPath', 
       'frameworkPath', 
       'reporter',
       'testDirectory',
       'libs'
      ]);
    });

    it('only merges in proper options', function () {
      ghoul = new Ghoul({ invalid: true });
      expect(ghoul.settings).to.not.have.property('invalid');
    });

    it('properly overrides defaults with passed options', function () {
      ghoul = new Ghoul({ assertionPath: './node_modules/some/other/lib.js' });
      expect(ghoul.settings.assertionPath).to.match(/some\/other\/lib\.js$/);
    });
  });

  describe('#run()', function () {
    
    it('is exposed on the constructor instance', function () {
      ghoul = new Ghoul();
      expect(ghoul.run).to.be.ok();
      expect(ghoul.run).to.be.a('function');
    });
  });
});
