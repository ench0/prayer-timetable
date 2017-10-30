const express = require('express');
const router = express.Router();
const settings = require('../controllers/settings');
const timetable = require('../controllers/timetable');
const admin = require('../controllers/admin');
const update = require('../controllers/update');
const timetabledef = "var timetable="+JSON.stringify(timetable);
const settingsdef = "var settings="+JSON.stringify(settings);

const auth = require('http-auth');

const fs = require('fs-extra')
const dir = './config'
const file = './config/user.pass'
fs.ensureDirSync(dir)    
fs.writeFileSync(file, 'admin:$apr1$acefXgWp$YP1nTuvv2wo9wXxQ.cXvs1')

const basic = auth.basic({
    realm: "Admin Area",
    // file: __dirname + "/user.pass"
    file: "./config/user.pass"
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: settings.title });
});
router.get('/timetable', function(req, res, next) {
  res.render('timetable', { title: 'Timetable', settings: settings, timetabledef: timetabledef, settingsdef: settingsdef });
});
router.get('/mobile', function(req, res, next) {
  res.render('mobile', { title: 'Timetable', settings: settings, timetabledef: timetabledef, settingsdef: settingsdef });
});


/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/admin', auth.connect(basic), admin.admin_get);

/* POST request for creating Genre. */
router.post('/admin', auth.connect(basic), admin.admin_post);

router.get('/update', auth.connect(basic), update.github);

router.get('/reboot', auth.connect(basic), update.reboot);

router.get('/view', admin.view);

module.exports = router;
