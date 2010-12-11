var util = require('util');

var Log = function(bucket) {

  var db = require('riak-js').getClient({debug:false});
  var bucketName = bucket || 'node-rlog';

  function formatMsg(msg) {
    var _msg = [];
    for (i in msg) {
      if (typeof msg[i] === 'object') {
        _msg.push(util.inspect(msg[i]));
      } else {
        _msg.push(msg[i]);
      }
    }
    return _msg.join(' ');
  }

  function now() {
    return new Date().getTime();
  }

  function save(level, msg) {
    db.save(bucketName, now(), msg, { level: level });
  }

  return {
    debug: function() {
      save('debug', formatMsg(arguments));
    },
    info: function() {
      save('info', formatMsg(arguments));
    },
    warn: function() {
      save('warn', formatMsg(arguments));
    },
    error: function() {
      save('error', formatMsg(arguments));
    }
  }
}

module.exports = {
  getLogger: function(b) {
    return new Log(b);
  }
}