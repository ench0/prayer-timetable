var express = require('express');
var router = express.Router();
var timetable = require('../controllers/timetable');
var fs = require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
//   fs.readFile( __dirname + "/" + "../controllers/timetable.json", 'utf8', function (err, data) {
//     console.log( __dirname );
//     console.log( timetable );
    // console.log( data );
    // res.end( data );
// });

    res.setHeader('Content-Type', 'application/json');
    
    res.end( JSON.stringify(timetable) );
});

module.exports = router;
