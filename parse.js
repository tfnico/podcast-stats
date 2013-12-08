var _ = require('lodash-node');
var fs = require('fs');

//Arguments
var node = process.argv[0];// node
var dir = process.argv[1];
var episodeNumber = process.argv[2];

var Parser = require('./parser');
var parser = new Parser();

function endsWith(str, suffix) {
    if(str) return str.indexOf(suffix, str.length - suffix.length) !== -1;
    else return false;
}

// Read the contents of the file into memory.
fs.readFile('nginx/access.log', function (err, logData) {

    // If an error occurred, throwing it will
    // display the exception and end our app.
    if (err) throw err;

    // logData is a Buffer, convert to string.
    var text = logData.toString();

    var hits = parser.parse(text, episodeNumber)

    //Filter out for episode number if provided
    var episodeHits;
    if(episodeNumber){
       episodeHits = _.filter(hits, function(line){
        return endsWith(line.url, episodeNumber+".mp3");
       });
    } else {
       episodeHits = hits;
    }

    var grouped = _.groupBy(episodeHits, function(line){
        return line.url;
    });

    var bytesPerEpisode = _.mapValues(grouped, function(episodeHits){
        return _.reduce(episodeHits, function(sum, b) {
            return sum+b.bytes;
        },0);
    });
    console.log("BYTES PER EPISODE");
    console.log(bytesPerEpisode);

});

