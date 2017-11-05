'use strict';

var settings = require('./settings');

var time = require('./time');
var jsonfile = require('jsonfile')
var S = require('string');
var sys = require('util')
var exec = require('child_process').exec;
const fs = require('fs-extra')

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;
const plaintextPassword = 'admin';
// pass file
const confdir = './config'
const passfile = './config/user.pass'

// admin form on GET
exports.admin_get = function(req, res, next) {
    var message = req.query.message;
    res.render('admin', { title: 'Admin', settings: settings, time: time, body: req.body, message: message });
};

// View on GET
exports.view = function(req, res, next) {
    var message = req.query.message;
    res.render('view', { title: 'View Timetable!', settings: settings, time: time, message: message });
};

// admin post
exports.admin_post = function(req, res, next) {
    
    //Check that the name field is not empty
    req.checkBody('title', 'Title required').notEmpty(); 
    
    //Trim and escape the name field. 
    // req.sanitize('body').escape();
    var body = S(req.body.body).stripTags().s;
    // req.sanitize('body').trim();
    
    //Run the validators
    var errors = req.validationErrors();
    
    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        console.log("Error!", settings)
        res.render('admin', { title: 'Admin', errors: errors, settings: settings, time: time, body: req.body, message: message });
    return;
    } 

    else {
        var message = "Sucess!";
        var settingsnew = {
            "title":req.body.title,
            "city":req.body.city,
            "refresh":req.body.refresh,
            "hijrioffset":req.body.hijrioffset,
            "body":body,
            "announcement":req.body.announcement,
            "jummuahtime": req.body.jummuahtimehour+':'+req.body.jummuahtimeminute,
            "join": req.body.join,
            "jamaahmethods":req.body.jamaahmethodfajr+",,"+req.body.jamaahmethoddhuhr+","+req.body.jamaahmethodasr+","+req.body.jamaahmethodmaghrib+","+req.body.jamaahmethodisha,
            "jamaahoffsets":req.body.jamaahoffsetfajrhour+":"+req.body.jamaahoffsetfajrminute+",,"+req.body.jamaahoffsetdhuhrhour+":"+req.body.jamaahoffsetdhuhrminute+","+req.body.jamaahoffsetasrhour+":"+req.body.jamaahoffsetasrminute+","+req.body.jamaahoffsetmaghribhour+":"+req.body.jamaahoffsetmaghribminute+","+req.body.jamaahoffsetishahour+":"+req.body.jamaahoffsetishaminute,
            "refreshmessage":req.body.refreshmessage,
            "language":req.body.language,
            "themecol":req.body.themecol,
            "themeimg":req.body.themeimg,
            "clock":req.body.clock,
            "jummuahlabel":req.body.jummuahlabel,
            "prayerlabel":req.body.prayerlabel,
            "adhanlabel":req.body.adhanlabel,
            "iqamahlabel":req.body.iqamahlabel,
            "preparelabel":req.body.preparelabel,
            "ramadancountdownlabel":req.body.ramadancountdownlabel,
            "names":[req.body.name0,req.body.name1,req.body.name2,req.body.name3,req.body.name4,req.body.name5]
        };
        
        // const file = __dirname+'/settings.json'
        const file = './config/settings.json'
        
        console.error("$$$started file write")
        
        jsonfile.writeFileSync(file, settingsnew, {spaces: 2}, function(err) {
            console.error("errors:")
            console.error(err)
            console.error("file:")
            console.error(file)
            console.error("settings:")
            console.error(settingsnew)
        })

        // BROWSER FILES
        console.log('!!!!!!!!!!!!')
        console.log(settings.city, settingsnew.city)
        console.log('!!!!!!!!!!!!')
        console.log(settings.city != settingsnew.city)
        if (settings.city != settingsnew.city) {
            console.log("New city timetable written!")
            const timetable = require('../controllers/timetable');        
            const timetabledef = "var timetable="+JSON.stringify(timetable);
            const cityfile = './public/db/city.js'
            fs.writeFileSync(cityfile, timetabledef)
        }
        
        const settingsdef = "var settings="+JSON.stringify(settings);
        const settingsfile = './public/db/settings.js'
        fs.writeFileSync(settingsfile, settingsdef)
 
        


        console.error("$$$finished file write")
        
        //restart
        function puts(error, stdout, stderr) { console.log(stdout) }
        exec("pm2 reload www", puts);

        res.redirect("/view/?message=Success! Please refresh this page to see the updated version.");
        // res.render('view', { title: 'View Timetable!', settings: settings, time: time, message: "Success! Please refresh this page to see the updated version." });
        
    }
};


// View on GET
exports.pass_get = function(req, res, next) {
    var message = req.query.message;
    res.render('pass', { title: 'Password change form', message: message });
};

exports.pass_post = function(req, res, next) {
    var message

    if (req.body.password != req.body.confirm) {
        res.render('pass', { title: 'Password change form', message: "Passwords need to match!" })
    }

    if (req.body.password == "") message = "No password provided - password reset to default!"
    var password = req.body.password || plaintextPassword

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);

    // console.log(password,hash)
    
    fs.ensureDirSync(confdir)  
    console.log("success!")
    if (!message) message = "Password changed successfully!";
    fs.writeFileSync(passfile, 'admin:'+hash)
    
    res.render('pass', { title: 'Password change form', message: message })
};
