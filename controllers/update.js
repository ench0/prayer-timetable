var shell = require('shelljs');
var path = require('path')

var cd = "cd " + path.join(__dirname, "../");

exports.github = function(req, res, next) {

  shell.exec(cd);
  var message = shell.exec('git pull');
  shell.exec('pm2 restart www');

  res.render('update', { title: 'Update', message: message });
}