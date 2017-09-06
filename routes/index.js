const express = require('express');
const router = express.Router();
const settings = require('../controllers/settings');
const admin = require('../controllers/admin');
const update = require('../controllers/update');
const timedef = "var settings="+JSON.stringify(settings);


const auth = require('http-auth');
var basic = auth.basic({
    realm: "Admin Area",
    file: __dirname + "/user.pass"
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ICCI Timetable' });
});
router.get('/timetable', function(req, res, next) {
  res.render('timetable', { title: 'Timetable', settings: settings, timedef: timedef });
});
router.get('/mobile', function(req, res, next) {
  res.render('mobile', { title: 'Timetable', settings: settings, timedef: timedef });
});


/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/admin', auth.connect(basic), admin.admin_get);

/* POST request for creating Genre. */
router.post('/admin', auth.connect(basic), admin.admin_post);

router.get('/update', auth.connect(basic), update.github);

router.get('/view', admin.view);

module.exports = router;



// app.get('/admin', auth.connect(basic), (req, res) => {
//     res.send(`Hello from admin area - ${req.user}!`);
// });