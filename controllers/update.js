var shell = require('shelljs');

exports.github = function(req, res, next) {

  shell.exec('cd /srv/www/islamireland.ie/present');
  var message = shell.exec('git pull');
  shell.exec('pm2 restart www');
  
  res.render('update', { title: 'Update', message: message });
}