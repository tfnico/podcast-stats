var _ = require('lodash-node');
var moment = require('moment');

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

    var sumBytes = function(sum, episode){
        return sum+episode.bytes;
    };

    var bytesSum = _.reduce(episodeHits, sumBytes, 0);
    console.log("TOTAL TRAFFIC");
    console.log(bytesToMB(bytesSum));

    var earliestHit = _.min(episodeHits, 'date');
    var latestHit = _.max(episodeHits, 'date');

    console.log("EARLIEST DATE");
    console.log(earliestHit.date.toString());

    var launchDate = earliestHit.date;

    var bytesBetweenDates = function(startDate, endDate, episodeHits){
        var hitsWithinRange = _.filter(episodeHits, function(hit){
            return hit.date.isAfter(startDate) && hit.date.isBefore(endDate);
        });
        return _.reduce(hitsWithinRange,sumBytes,0);
    }
    var oneWeekAfterLaunchDate = moment(launchDate).add('weeks',1);
    var firstWeekBytes = bytesBetweenDates(launchDate, oneWeekAfterLaunchDate, episodeHits);
    console.log("BYTES AFTER ONE WEEK");
    console.log(bytesToMB(firstWeekBytes));

    var oneMonthAfterLaunchDate = moment(launchDate).add('months',1);
    var firstMonthBytes = bytesBetweenDates(launchDate, oneMonthAfterLaunchDate, episodeHits);
    console.log("BYTES AFTER ONE MONTH");
    console.log(bytesToMB(firstMonthBytes));

    console.log("LATEST DATE");
    console.log(latestHit.date.toString());

    console.log("THAT WAS A PERIOD OF");
    console.log(earliestHit.date.from(latestHit.date, true));

}

module.exports = Printer;

