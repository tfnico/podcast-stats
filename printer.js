var _ = require('lodash-node');

var Printer = function() {
};

function endsWith(str, suffix) {
    if(str) return str.indexOf(suffix, str.length - suffix.length) !== -1;
    else return false;
}

function bytesToMB(bytes){
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

Printer.prototype.print = function(hits, episodeNumber) {
    //Filter out for episode number if provided
    var episodeHits;
    if(episodeNumber){
        episodeHits = _.filter(hits, function(line){
            return endsWith(line.url, episodeNumber+".mp3");
        });
    } else {
        episodeHits = _.filter(hits, function(line){
            return endsWith(line.url, ".mp3");
        });
    }

    var grouped = _.groupBy(episodeHits, function(line){
        return line.url;
    });

    var bytesPerEpisode = _.mapValues(grouped, function(episodeHits){
        return bytesToMB(_.reduce(episodeHits, function(sum, b) {
            return sum+b.bytes;
        },0));
    });
    console.log("TRAFFIC PER EPISODE");
    console.log(bytesPerEpisode);
}

module.exports = Printer;

