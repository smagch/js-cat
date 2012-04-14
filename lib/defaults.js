var exec = require('child_process').exec;

exports['read.js:compress'] = function (srcPath, next) {
  // balk if srcPath is like *min.js
  if (/min\.js$/.test(srcPath)) return next();
  exec('uglifyjs ' + srcPath, next);
};

// exports['each.js'] = function (content, callback) {
//   callback(null, content);
//   // third argument stop: true to stop chain
//   // callback(null, content, true)
// };

exports['join.js'] = function (files, next) {
  next(null, files.join(';\n\n\n'));
};