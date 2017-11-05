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

const cityfile = './public/db/city.js'
const settingsfile = './public/db/settings.js'


// check browser city file
if (fs.existsSync(cityfile) && fs.statSync(cityfile).size>0) {
    console.log("#####city file ok#####")
    console.log("city file size: "+fs.statSync(cityfile).size)
}
else {
    console.log("#####pass write#####")
    fs.writeFileSync(cityfile, timetabledef)
}

// check browser settings file
if (fs.existsSync(settingsfile) && fs.statSync(settingsfile).size>0) {
    console.log("#####settings file ok#####")
    console.log("settings file size: "+fs.statSync(settingsfile).size)
}
else {
    console.log("#####pass write#####")
    fs.writeFileSync(settingsfile, settingsdef)
}



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
    console.log("settings")
  res.render('timetable', { title: 'Timetable', settings: settings, timetabledef: timetabledef, settingsdef: settingsdef });
});



// MOBILE ROUTES
router.get('/mobile', function(req, res, next) {

  if (req.cookies.mobset) var mobset = req.cookies.mobset
  else mobset = ['', '', '', '#ccc', '/img/paper.png', '']
  res.render('mobile', { title: 'Timetable', settings: settings, mobset:mobset, timetabledef: timetabledef, settingsdef: settingsdef, body: req.body });
  
});

router.post('/mobile', function(req, res, next) {
 
  res.cookie('mobset', [req.body.analogue || '', req.body.jamaah || '', req.body.arabic || '', req.body.themecol || '#ccc', req.body.themeimg || '/img/paper.png', 'cookies agree'], { maxAge: 31556952000, httpOnly: false })//.send('Cookie is set');
  res.redirect('/mobile')

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
