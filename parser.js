var Parser = function() {
};

Parser.prototype.parse = function(text) {

    var hits = [];

    // Break up the file into lines.
    var lines = text.split('\n');

    lines.forEach(function(line) {
        var hit = {};

        var parts = line.split(' ');
        var ip = parts[0];
        hit.ip = ip;
        // -
        // -
        // [date
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
    });
    return hits;
};

module.exports = Parser;

