const file = __dirname+'/settings.json'
const fs = require('fs');
const stats = fs.statSync(file)

var defsettings = '{"title": "Welcome","refresh": "180","hijrioffset": "0","body": "The Prophet (PBUH) said, He who observes fasting during the month of Ramadan with Faith while seeking its reward from Allah, will have his past sins forgiven.","announcement": "Annuncement","jummuahtime": "13:15","join": "off","jamaahmethods": "afterthis,,fixed,afterthis,afterthis,afterthis","jamaahoffsets": "0:15,,13:0,0:15,0:5,0:30","refreshmessage": "Welcome!","language": "en","themecol": "#cee3ed","themeimg": "/img/marble.png","jummuahlabel": "Jummuah time","names": [  "fajr",  "shurooq",  "dhuhr",  "asr",  "maghrib",  "isha"]}';


console.log("#####start#####")
if (fs.existsSync(file) && stats.size>0) {
    console.log("file size: "+stats.size);
    console.log("#####suze#####")
    
}
else {
    console.log("#####else#####");


    fs.writeFileSync(file, defsettings); 
}

console.log("#####finish#####")

const jsonfile = require('jsonfile')

module.exports = jsonfile.readFileSync(file);;
