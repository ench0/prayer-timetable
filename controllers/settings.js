var jsonfile = require('jsonfile')
var file = __dirname+'/settings.json'

module.exports = jsonfile.readFileSync(file)