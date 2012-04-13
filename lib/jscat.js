exports.version = '0.0.0';

var JscatEvent = require('./jscat-event');

var events = new JscatEvent();
events
  // excute when extension is .js
  .on('each.js', function (content, next) {
    console.log('---called each.js----');
    //content = '---each event----\n\n' + content + '---each event----end\n\n';
    next(null, content);
  })
  // excute in any extension and namespace
  .on('each', function (content, next) {
    console.log('---called each----');
    next(null, content);
  })
  // excute when production flag is set
  .on('each:production', function (content, next) {
    console.log('---called each---:production');
    next(null, content);
  })
  // excute when extension is js and flag is production
  .on('each.js:production', function (content, next) {
    console.log('---called each---:production.js');
    next(null, content);
  })
  //.append('.js:development', function(content, next) {})
  //.prepend('.js:development', function(content, next) {})
;

module.exports = events;

// {
//   "each.js": function() {
//     
//   },
//   "each:hgoe": function() {
//   
//   }
// }