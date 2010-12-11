# Remote Logging for Node.js and Riak

When working in a environment that could easily scale out horizontally to many servers,
it often becomes necessary to manage logging in some aggregate way. This package for
[Node.js](http://nodejs.org/) gives Node applications the ability to log to a central
Riak server. It also provides a command-line utility for displaying those logs,
including filtering based on log level and regular expression searching.

### Installation

    git clone https://github.com/jbrisbin/node-rlog.git
    npm install ./node-rlog

### Usage

To use it in your Node.js application, do the following:

    var rlog = require('node-rlog');
    var log = rlog.getLogger('bucketname');
    ...
    log.debug('This is a debug line: ', myobj, myobj2);

When you want to view your log files, use the 'noderlog' command line utility:

    noderlog -b bucketname

A list of the options available to the noderlog utility can be output by passing a '-h':

    noderlog -h
    Usage: rlog [options]

    Available options:
      -d, --debug           Show DEBUG level and up log lines
      -i, --info            Show INFO level and up log lines
      -w, --warn            Show WARN level and up log lines
      -e, --error           Show ERROR level log lines
      -b, --bucket BUCKET   The log bucket to look in
      -r, --regex REGEX     A regular expression to apply to log lines
      -h, --help            Print this help

To limit the output to a particular log level, use the options for that level.

    noderlog -b bucketname -i

If you want to search your log output based on a regular expression, pass it using '-r':

    noderlog -b bucketname -r "^startswith"

This utility is licensed under the Apache 2.0 license:

http://www.apache.org/licenses/LICENSE-2.0.html