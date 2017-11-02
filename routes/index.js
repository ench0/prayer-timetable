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
const confdir = './config'
const passfile = './config/user.pass'



// check user pass file
if (fs.existsSync(passfile) && fs.statSync(passfile).size>0) {
  console.log("#####pass file ok#####")
  console.log("pass file size: "+fs.statSync(passfile).size)
}
else {
  console.log("#####pass write#####")
  fs.ensureDirSync(confdir)    
  fs.writeFileSync(passfile, 'admin:$2a$10$XNuKAWZ6Qx/pXnYGkRT67OKJ8RlVTHdOZOw6nIC0CNg5Y1JbJy2r6')
}



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

// Password form
router.get('/admin/password', auth.connect(basic), admin.pass_get);

// password post
router.post('/admin/password', auth.connect(basic), admin.pass_post);

router.get('/update', auth.connect(basic), update.github);

router.get('/reboot', auth.connect(basic), update.reboot);

router.get('/view', admin.view);


module.exports = router;
