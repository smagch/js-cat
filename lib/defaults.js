var exec = require('child_process').exec;

exports['read.js:compress'] = function (srcPath, callback) {
  console.error('js read compress');
  // uitl.isMinified
  exec('uglifyjs ' + srcPath, function (err, stdout, stderr) {
    callback(err, stdout);
  });
};

exports['each.js'] = function (content, callback) {
  console.error('js each');
  callback(null, content);
  // TODO return false to stop chane
};

exports['join.js'] = function (files, callback) {
  console.error('js join');
  callback(null, files.join(';\n\n\n'));
};

//exports['join'] = function (files, callback) {
  
//};