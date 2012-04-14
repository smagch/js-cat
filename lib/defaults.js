var exec = require('child_process').exec;

exports['read.js:compress'] = function (srcPath, callback) {
  // uitl.isMinified
  exec('uglifyjs ' + srcPath, function (err, stdout, stderr) {
    callback(err, stdout);
  });
};

// exports['each.js'] = function (content, callback) {
//   callback(null, content);
//   // third argument stop: true to stop chain
//   // callback(null, content, true)
// };

exports['join.js'] = function (files, callback) {
  callback(null, files.join(';\n\n\n'));
};