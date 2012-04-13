exports.version = '0.0.0';

var JscatEvent = require('./jscat-event');

var events = new JscatEvent();
events.on('each', function(content, next) {
  content = '---each event----\n\n' + content + '---each event----end\n\n';
  next(null, content);
});

module.exports = events;
