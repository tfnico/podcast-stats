var _ = require('lodash-node');

var Printer = function() {
};

function endsWith(str, suffix) {
    if(str) return str.indexOf(suffix, str.length - suffix.length) !== -1;
    else return false;
}

Printer.prototype.print = function(hits, episodeNumber) {
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
}

module.exports = Printer;

