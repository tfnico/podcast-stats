var moment = require('moment');

var Parser = function() {
};

Parser.prototype.parse = function(text) {

    var hits = [];

    // Break up the file into lines.
    var lines = text.split('\n');

    lines.forEach(function(line) {
        if(line.length > 0){
            var hit = {};

            var parts = line.split(' ');
            var ip = parts[0];
            hit.ip = ip;
            // -
            // -
            var date = parts[3]; // [03/Dec/2013:07:54:16
            if(date){
                hit.date = moment(date, "DD/MMM/YYYY:HH:mm:ss", "en");
            } else console.log("no date here",line.length);
            // timezone]
            // "GET
            var url = parts[6]; // /episodes/12.mp3
            hit.url = url;
            // HTTP"
            // 200
            // 30192
            var bytes = parseInt(parts[9]);
            hit.bytes = bytes;

            hits.push(hit);
        } //else empty line
    });
    return hits;
};

module.exports = Parser;

