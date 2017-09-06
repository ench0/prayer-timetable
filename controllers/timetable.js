var jsonfile = require('jsonfile')
var file = __dirname+'/timetable.json'

module.exports = jsonfile.readFileSync(file)