var EventEmitter = require('events').EventEmitter
  , async = require('async')
  , extname = require('path').extname
  ;

function JscatEvent () {
  this.events = {};
  return this;
}

JscatEvent.prototype.on = function (key, callback) {
  if (!this.events[key]) this.events[key] = [];
  this.events[key].push(callback);
  return this;
};

JscatEvent.prototype.namespace = function(val) {
  if('string' !== typeof val) val = val.toString()
  this.namespace = val;
  return this;
};

JscatEvent.prototype.fire = function (key, contentObj, next) {
  var ext = extname(contentObj.path)
    , ns = ':' + this.namespace
    ;
  
  var events = 
        [].concat(
          // 1. key.extension:namespace
          ((ns && this.events[key + ext + ns]) || [])
        ).concat(
          // 2. key:namespace
          ((ns && this.events[key + ns]) || [])
        ).concat(
          // 3. key.extension
          (this.events[key + ext] || [])
        ).concat(
          // 4. key
          (this.events[key] || [])
        );

  if (!events.length) return next(null, contentObj.content);

  // apply event by step
  async.reduce(events, contentObj.content, function(buffer, fn, callback) {

    fn.call(null, buffer, callback);

  }, next);

  return this;
};

module.exports = JscatEvent;