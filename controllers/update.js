var shell = require('shelljs');
var path = require('path')

var cd = "cd " + path.join(__dirname, "../");

exports.github = function(req, res, next) {

  shell.exec(cd);
  var message = shell.exec('git pull');
//   shell.exec('pm2 reload www');

  res.render('update', { title: 'Update', message: message });
}

exports.reboot = function(req, res, next) {
    
      shell.exec(cd);
      var message = shell.exec('sudo reboot');
    
      res.render('reboot', { title: 'Reboot', message: message });
}