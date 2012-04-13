exports.version = '0.0.0';

var JscatEvent = require('./jscat-event');

var events = new JscatEvent();
events.on('each', function(content, next) {
  console.log('---each event----\n\n');
  console.log(content);
  console.log('---each event----end\n\n');
  next(null, content);
});

module.exports = events;
