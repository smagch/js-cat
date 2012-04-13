var async = require('async')
  , mkdirp = require('mkdirp')
  , dirname = require('path').dirname
  , writeFile = require('fs').writeFile
  ;

exports.writeTo = function (outPath, content, callback) {
  async.waterfall([
    // mkdirp
    function (next) {
      mkdirp(dirname(outPath), 755, function (err) {
        if (err) return next(err);
        next();
      });
    }
    // writeFile
  , function (next) {
      writeFile(outPath, content, function (err) {
        if (err) return next(err);
        next();
      });
    }
  ], callback);
};