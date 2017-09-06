var express = require('express');
var router = express.Router();
var timetable = require('../controllers/timetable');
var fs = require("fs");

/* GET full API listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    
    res.end( JSON.stringify(timetable) );
});
router.get('/:month', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var month = String(req.params.month);
    result = timetable[month];
    // console.log(timetable)
    res.end( JSON.stringify(result) );
});
router.get('/:month/:day', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var month = String(req.params.month);
    var day = String(req.params.day);
    result = timetable[month][day];
    // console.log(timetable)
    res.end( JSON.stringify(result) );
});
router.get('/:month/:day/:prayer', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var month = String(req.params.month);
    var day = String(req.params.day);
    var prayer = String(req.params.prayer);
    result = timetable[month][day][prayer];
    // console.log(timetable)
    res.end( JSON.stringify(result) );
});

module.exports = router;
