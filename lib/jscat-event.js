var EventEmitter = require('events').EventEmitter
  , async = require('async')
  , readFile = require('fs').readFile
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
  var events = this.getEvents('read', filePath);
  // first events
  if (events.length) {
    events[0].call(null, filePath, function (err, content) {
      if (err) return next(err);
      next(null, {
        path: filePath
      , content: content
      });
    });
    return this;
  }
  // if no event fallback by readfile
  readFile(filePath, function (err, content) {
    if (err) return next(err);
    next(null, {
      path: filePath
    , content: content
    });
  });
  return this;
};

JscatEvent.prototype.fireEach = function (contentObj, next) {
  var events = this.getEvents('each', contentObj.path);
  if (!events.length) return next(null, contentObj.content);
  // apply event by step
  async.reduce(events, contentObj.content, function (buffer, fn, callback) {

    fn.call(null, buffer, function (err, retBuffer, stop) {
      if (err) return callback(err);
      if (stop) return next(null, retBuffer);
      callback(null, retBuffer);
    });

  }, next);

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