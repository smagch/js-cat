var EventEmitter = require('events').EventEmitter
  , async = require('async')
  , readFile = require('./util').readFile
  , extname = require('path').extname
  ;

function JscatEvent(options) {
  this.events = {};
  if (options) {
    var self = this;
    Object.keys(options).forEach(function (key) {
      self.on(key, options[key]);
    });
  }
  return this;
}

JscatEvent.prototype.on = function (key, callback) {
  if (!this.events[key]) this.events[key] = [];
  this.events[key].push(callback);
  return this;
};

JscatEvent.prototype.namespace = function (val) {
  if ('string' !== typeof val) val = val.toString();
  this.namespace = val;
  return this;
};

// @param {String} key - read|each|join
// @param {String} path
// @return {Array}
JscatEvent.prototype.getEvents = function (key, path) {
  var ext = extname(path)
    , ns = ':' + this.namespace;

  return [].concat( // 1. key.extension:namespace
            ((ns && this.events[key + ext + ns]) || [])
          ).concat( // 2. key.extension
            (this.events[key + ext] || [])
          ).concat( // 3. key:namespace
            ((ns && this.events[key + ns]) || [])
          ).concat(  // 4. key
            (this.events[key] || [])
          );
};

JscatEvent.prototype.fireRead = function (filePath, next) {
  var events = this.getEvents('read', filePath)
    , length = events.length;

  // first events
  if (!length) {
    readFile(filePath, next);
    return this;
  }

  async.reduce(events, filePath, function (buffer, fn, callback) {
    fn.call(null, filePath, function (err, content) {
      if (err) return callback(err);
      // if content has been returned, throw error and interapt reduce
      if (content) return callback('hit', content);
      // if no content, call next event callback
      callback(null, filePath);
    });
  }, function (err, result) {
    if (err && err !== 'hit') return next(err);
    if (result) return next(null, result);
    // if result is null, fallback by default read
    readFile(filePath, next);
  });
  return this;
};

// data = {path: '', content: ''};
// @param data {Object}
// @param next {Function}
JscatEvent.prototype.fireEach = function (data, next) {
  var events = this.getEvents('each', data.path);
  if (!events.length) return next(null, data.content);
  // apply event by step
  async.reduce(events, data.content, function (buffer, fn, callback) {
    fn.call(null, buffer, function (err, retBuffer, stop) {
      if (err) return callback(err);
      // if stop is true, pass error and stop reduce
      if (stop) return callback('stop', retBuffer);
      callback(null, retBuffer);
    });
  }, function (err, result) {
    if (err && err !== 'stop') return next(err);
    next(null, result);
  });

  return this;
};

JscatEvent.prototype.fireJoin = function (files, next) {
  var events = this.getEvents('join', next);
  if (events.length) {
    events[0].call(null, files, next);
  } else {
    // if no event, join with "\n"
    next(null, files.join('\n'));
  }
  return this;
};

module.exports = JscatEvent;