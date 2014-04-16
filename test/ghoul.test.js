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
      ghoul_default = new Ghoul();
      expect(ghoul_default.opts).to.be.ok();
      expect(ghoul_default.opts).to.be.an('object');
    });

    it('contains the proper keys', function () {
      ghoul = new Ghoul();
      var keys = Object.keys(ghoul.opts);
      expect(keys.length).to.be(3);
      keys.forEach(function (key) {
        expect(key in ghoul.opts).to.be(true);
      });
    });
  });
});
