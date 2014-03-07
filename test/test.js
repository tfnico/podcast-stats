var Parser = require('../src/parser');

var assert = require("assert");
describe('Parser', function(){
  var parser = new Parser();
  describe('#parse()', function(){
    it('should find zero hits in empty text', function(){
      var text = ""
      var hits = parser.parse(text);
      assert.equal(0, hits.length);
    })
  })
})

