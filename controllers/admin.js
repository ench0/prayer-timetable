var settings = require('./settings');
var time = require('./time');
var jsonfile = require('jsonfile')
var S = require('string');
var sys = require('util')
var exec = require('child_process').exec;

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
                "jummuahlabel":req.body.jummuahlabel,
                "names":[req.body.name0,req.body.name1,req.body.name2,req.body.name3,req.body.name4,req.body.name5]
            };
        
        var file = __dirname+'/settings.json'
        
        console.error("$$$started file write")
        
        jsonfile.writeFile(file, settingsnew, {spaces: 2}, function(err) {
            console.error("errors:")
            console.error(err)
            console.error("file:")
            console.error(file)
            console.error("settings:")
            console.error(settingsnew)
        })
        // jsonfile.writeFileSync(file, settingsnew, {spaces: 2})


        console.error("$$$finished file write")
        
        //restart
        function puts(error, stdout, stderr) { console.log(stdout) }
        exec("pm2 reload www", puts);

        // res.redirect("/view/?message=Sucess!");
        res.render('view', { title: 'View Timetable!', settings: settings, time: time, message: "Success!" });
        
    }
};