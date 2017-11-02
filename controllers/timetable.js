'use strict';

const jsonfile = require('jsonfile');
const settings = require('../controllers/settings');
const file = __dirname+'/cities'+settings.city;

module.exports = jsonfile.readFileSync(file)