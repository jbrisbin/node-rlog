var sys = require('sys');
var util = require('util')
var optparse = require('./optparse');
var db = require('riak-js').getClient({debug:false});

var options = {
  bucket: null,
  level: 'debug,info,warn,error',
  regex: false
};

var SWITCHES = [
  ['-d', '--debug', 'Show DEBUG level and up log lines'],
  ['-i', '--info', 'Show INFO level and up log lines'],
  ['-w', '--warn', 'Show WARN level and up log lines'],
  ['-e', '--error', 'Show ERROR level log lines'],
  ['-b', '--bucket BUCKET', 'The log bucket to look in'],
  ['-r', '--regex REGEX', 'A regular expression to apply to log lines'],
  ['-h', '--help', 'Print this help']
];
var parser = new optparse.OptionParser(SWITCHES);
parser.banner = 'Usage: rlog [options]';

parser.on('help', function() {
  console.log(parser.toString());
});
parser.on('bucket', function(name, value) {
  options.bucket = value;
});
parser.on('regex', function(name, value) {
  options.regex = value;
});
parser.on('debug', function() {
  options.level = 'debug,info,warn,error';
});
parser.on('info', function() {
  options.level = 'info,warn,error';
});
parser.on('warn', function() {
  options.level = 'warn,error';
});
parser.on('error', function() {
  options.level = 'error';
});
parser.parse(process.argv);

var mapFunc = function(v, b, arg) {
  var data = v.values[0].data;
  var meta = v.values[0].metadata;
  if (new RegExp("(.*)" + meta['X-Riak-Meta']['X-Riak-Meta-Level'] + "(.*)").test(arg.level)) {
    //ejsLog('/tmp/mapred.log', 'arg: ' + JSON.stringify(arg));
    if (!arg.regex || new RegExp(arg.regex).test(data)) {
      return [
        [v.key, meta['X-Riak-Meta']['X-Riak-Meta-Level'], data]
      ];
    }
  }
  return [];
}

if (options.bucket) {
  db.add(options.bucket)
      .map(mapFunc, {level: options.level, regex: options.regex})
      .run(function(err, data) {
    if (err) {
      console.log("ERROR: " + err.message);
    } else {
      for (i in data.sort(function(x, y) {
        if (x[0] > y[0]) {
          return 1;
        } else if (x[0] < y[0]) {
          return -1;
        } else {
          return 0;
        }
      })) {
        var date = new Date(parseInt(data[i][0])).toISOString();
        console.log(date, "[" + data[i][1].toUpperCase() + "]", data[i][2]);
      }
    }
  });
}