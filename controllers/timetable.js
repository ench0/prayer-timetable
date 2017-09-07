var jsonfile = require('jsonfile');
const settings = require('../controllers/settings');
var file = __dirname+settings.city;

module.exports = jsonfile.readFileSync(file)