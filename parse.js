var fs = require('fs');
var Parser = require('./parser');
var Printer = require('./printer');

//Arguments
var node = process.argv[0];// node
var dir = process.argv[1];
var episodeNumber = process.argv[2];

var parser = new Parser();
var printer = new Printer();


// Read the contents of the file into memory.
fs.readFile('nginx/access.log', function (err, logData) {

    // If an error occurred, throwing it will
    // display the exception and end our app.
    if (err) throw err;

    // logData is a Buffer, convert to string.
    var text = logData.toString();

    var hits = parser.parse(text);

    printer.print(hits, episodeNumber);
});

