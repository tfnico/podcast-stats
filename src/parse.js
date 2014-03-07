var _ = require('lodash-node');
var async = require('async');
var fs = require('fs');
var zlib = require('zlib');
var Parser = require('./parser');
var Printer = require('./printer');

//Arguments
var node = process.argv[0];// node
var dir = process.argv[1];
var episodeNumber = process.argv[2];
var logDir = './logs/nginx/';

//Services
var parser = new Parser();
var printer = new Printer();

function endsWith(str, suffix) {
    if(str) return str.indexOf(suffix, str.length - suffix.length) !== -1;
    else return false;
}

var readHitsFromFile = function(fileName, callback){
    var filePath = logDir+fileName;
    console.log("Reading file " + filePath);
    if(endsWith(fileName, 'gz')){
        fs.readFile(filePath, function(err, buffer){
            if(!err){
                zlib.unzip(buffer, callback);
            } else throw err;
        });
    } else {
        fs.readFile(filePath, callback);
    }
};

var sendResultsToPrinter = function (err, results) {
    console.log("Sending results to printer");
    if (!err){
        var hits = _.reduce(results, function(hits,data){
            return hits.concat(parser.parse(data.toString()));
        },[]);
        printer.print(hits, episodeNumber);
    } else throw err;
};

//Read all the files and print results!
var fileNames = fs.readdirSync(logDir);
async.map(fileNames, readHitsFromFile, sendResultsToPrinter);

