var EventEmitter = require('events').EventEmitter
  , util = require('util')
  , async = require('async')
  ;

function JscatEvent () {
  this.events = {};
  return this;
}

JscatEvent.prototype.on = function(key, callback) {
  if (!this.events[key]) {
    this.events[key] = [];
  }
  this.events[key].push(callback);
};

JscatEvent.prototype.fire = function(key, content, next) {
  var events = this.events[key];
  if (!events) {
    return next(null, content);
  }
  // call evnet by step
  async.reduce(events, content, function(buffer, fn, callback) {

    fn.call(null, buffer, callback);

  }, next);
};


module.exports = JscatEvent;