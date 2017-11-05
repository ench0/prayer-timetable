'use strict';

// const file = __dirname+'/settings.json'
const file = './config/settings.json'
const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const dir = './config'

const defsettings = '{"title": "Islamic Centre","city": "/dublin.json","refresh": "180","hijrioffset": "0","body": "This is a hadith text or similar. Use multiple lines if needed","announcement": "This is an announcement","jummuahtime": "13:15","join": "off","jamaahmethods": "afterthis,,fixed,afterthis,afterthis,afterthis","jamaahoffsets": "0:15,,13:0,0:15,0:5,0:30","refreshmessage": "Welcome!","language": "en","themecol": "#cee3ed","themeimg": "/img/marble.png","clock": "digital","jummuahlabel": "Jummuah time","prayerlabel": "Prayer","adhanlabel": "Adhan","iqamahlabel": "Iqamah","preparelabel": "Prepare for", "ramadancountdownlabel": "until Ramadan","names": [  "fajr",  "shurooq",  "dhuhr",  "asr",  "maghrib",  "isha"]}'

console.log("#####start#####")
console.log(fs.existsSync(file))

if (!fs.existsSync(file)) {
    console.log("#####config check#####")
    fs.ensureDirSync(dir)    
    fs.writeFileSync(file, defsettings)
}
else if (fs.existsSync(file) && fs.statSync(file).size>0) {
    console.log("#####size#####")
    console.log("file size: "+fs.statSync(file).size)
}
else {
    console.log("#####config write#####")
    fs.ensureDirSync(dir)    
    fs.writeFileSync(file, defsettings)
}

console.log("#####finish#####")


module.exports = jsonfile.readFileSync(file)