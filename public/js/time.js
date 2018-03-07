/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */
'use strict';

(function() {

    var tomorrow = 0;

    /* JAMAAH CALC */
    var jamaahCalc = function(num, time, timenext) {
        var jamaahMethodSetting = (settings.jamaahmethods).split(",")[num];
        var jamaahOffsetSetting = ((settings.jamaahoffsets).split(",")[num]).split(":");

        var jamaahOffset
        switch (jamaahMethodSetting) {
            case "afterthis":
                jamaahOffset = parseInt(jamaahOffsetSetting[0] * 60 + jamaahOffsetSetting[1]);
                break;
            case "fixed":
                jamaahOffset = (moment().month(time.get('month')).date(time.get('date')).hour(jamaahOffsetSetting[0]).minute(jamaahOffsetSetting[1])).diff(time, 'minutes');
                if (moment().month(time.get('month')).date(time.get('date')).hour(jamaahOffsetSetting[0]).minute(jamaahOffsetSetting[1]).isBefore(time)) jamaahOffset--;
                break;
            case "beforenext":
                jamaahOffset = (timenext.subtract({
                    minutes: parseInt(jamaahOffsetSetting[0] * 60 + jamaahOffsetSetting[1])
                })).diff(time, 'minutes');
                break;
            case "":
                jamaahOffset = "";
                break
        }
        return jamaahOffset;
    }

    /* PRAYER CONSTRUCTOR */
    var Prayer = function(now, num) {

        // DST settings
        var dst
        var dstcheck = moment.tz(moment().add(tomorrow, "day"), city).isDST()
        if (!dstcheck && moment().format("M") == "10") dst = -1;
        else if (dstcheck && moment().format("M") == "3") dst = 1;
        else dst = 0
        // console.log(moment().format("M"), dst, dstcheck);

        this.now = moment();
        this.num = num;
        this.name = settings.names[num];

        if (num < 5) this.nextnum = num + 1;
        else this.nextnum = 0;

        this.month = (moment().add(tomorrow, 'day').add(dst, 'hour').month()) + 1;
        this.date = (moment()).add(tomorrow, 'day').add(dst, 'hour').date();

        this.time = moment({
            hour: timetable[this.month][this.date][num][0],
            minute: timetable[this.month][this.date][num][1]
        });
        this.time = this.time.add(tomorrow, 'day').add(dst, 'hour');

        this.time2 = moment({
            hour: timetable[this.month][this.date][num][0],
            minute: timetable[this.month][this.date][num][1]
        });
        this.time2 = this.time2.add(tomorrow, 'day').add(dst, 'hour');

        this.timenext = moment({
            month: (this.time).get('month'),
            date: (this.time).get('date'),
            hour: timetable[this.month][this.date][this.nextnum][0],
            minute: timetable[this.month][this.date][this.nextnum][1]
        });

        this.disp = this.time.format("HH:mm");

        var jamaahOffset = jamaahCalc(num, this.time2, this.timenext);
        this.jamaahtime = this.time2.add(jamaahOffset, 'minutes');

        if (jamaahOffset != "") this.jamaahdisp = this.jamaahtime.format("HH:mm");
        else this.jamaahdisp = "";
    }

    /* TIMES DEFINITION */
    var times = function() {
        var now = moment(); //.tz("Europe/Dublin");

        var fajr = new Prayer(now, 0);
        var shurooq = new Prayer(now, 1);
        var dhuhr = new Prayer(now, 2);
        var asr = new Prayer(now, 3);
        var maghrib = new Prayer(now, 4);
        var isha = new Prayer(now, 5);

        var daybegin = moment().startOf('day').add(tomorrow, 'day');
        var dayend = moment().endOf('day').add(tomorrow, 'day');

        var next, current
        if (isha.jamaahtime.isBefore(moment()) && tomorrow == 0) {
            next = fajr;
            current = isha;
            tomorrow = 1;
            console.log('case 1')
        } else if (isha.time.isBefore(moment()) && tomorrow == 0) {
            next = fajr;
            current = isha;
            tomorrow = 1;
            console.log('case 2a')
        } else if (maghrib.time.isBefore(moment())) {
            next = isha;
            current = maghrib;
            tomorrow = 0;
            console.log('case 3')
        } else if (asr.time.isBefore(moment())) {
            next = maghrib;
            current = asr;
            tomorrow = 0;
            console.log('case 4')
        } else if (dhuhr.time.isBefore(moment())) {
            next = asr;
            current = dhuhr;
            tomorrow = 0;
            console.log('case 5')
        } else if (fajr.time.isBefore(moment())) {
            next = dhuhr;
            current = fajr;
            tomorrow = 0;
            console.log('case 6')
        }
        // after midnight, before fajr
        else if (moment().add(tomorrow, 'day').isBefore(fajr.time)) {
            next = fajr;
            current = isha;
            tomorrow = 0;
            console.log('case 7')
        }
        // after isha, before midnight
        else if (moment().isBefore(moment().endOf('day').add(tomorrow, 'day')) && moment().add(tomorrow, 'day').isAfter(isha.time)) {
            next = fajr;
            current = isha;
            tomorrow = 1;
            console.log('case 8')
        } else {
            next = fajr;
            current = isha;
            tomorrow = 1;
            console.log('case 9')
        }




        // calculations
        var gregorian = moment().add(tomorrow, 'day').format("dddd, D MMMM YYYY");
        var hijri = moment().add((parseInt(settings.hijrioffset) + parseInt(tomorrow)), 'day').format("iD iMMMM iYYYY");
        var hijriMonth = moment().add((parseInt(settings.hijrioffset) + parseInt(tomorrow)), 'day').format("iM");
        var hijriDay = moment().add((parseInt(settings.hijrioffset) + parseInt(tomorrow)), 'day').format("iD");
        var hijriDaysLeft = moment.duration(moment().endOf('imonth').diff(moment().add((parseInt(settings.hijrioffset) + parseInt(tomorrow)), 'day')))

        // Countdown
        var nextname
        var countdowndisp
        var timeToPrayer = moment.duration((next.time).diff(moment()), 'milliseconds').add(1, 's'); //.asMinutes();
        timeToPrayer.hours = appendZero(timeToPrayer.hours());
        timeToPrayer.minutes = appendZero(timeToPrayer.minutes());
        timeToPrayer.seconds = appendZero(timeToPrayer.seconds());

        if (timeToPrayer.hours.length > 2) {
            countdowndisp = "0:00:00";
            nextname = isha.name
        } else {
            countdowndisp = timeToPrayer.hours + ':' + timeToPrayer.minutes + ':' + timeToPrayer.seconds;
            nextname = next.name;
        }




        var output = {
            //        0     1        2      3    4        5     6    7     8
            times: [fajr, shurooq, dhuhr, asr, maghrib, isha, now, next, current],
            gregorian: gregorian,
            hijri: {date: hijri, month: hijriMonth, day: hijriDay, left: hijriDaysLeft},
            countdowndisp: countdowndisp,
            nextname: nextname
        }

        return (output)
    }
    times();

    /* TIME DISPLAY */
    var timeDisp = (function() {

        var def = times();

        document.getElementById("time") ? document.getElementById("time").innerHTML = moment().format("H:mm:ss") : null;
        document.getElementById("gregorian") ? document.getElementById("gregorian").innerHTML = def.gregorian : null;
        document.getElementById("hijri") ? document.getElementById("hijri").innerHTML = def.hijri.date : null;
        


        // no isha countdown if join == on
        if (settings.join == "on" && def.nextname == "isha") {
            document.getElementById("pending-name").innerHTML = " ";
            document.getElementById("timetoprayer").innerHTML = " ";
        } else {
            document.getElementById("pending-name") ? document.getElementById("pending-name").innerHTML = def.nextname : null;
            document.getElementById("timetoprayer") ? document.getElementById("timetoprayer").innerHTML = def.countdowndisp : null;
        }



        // Prayer time display
        for (var i = 0, list = settings.names; i < 6; i++) {
            var timeToJamaah = moment.duration((def.times[8].jamaahtime).diff(moment()), 'milliseconds').add(1, 's'); //.asMinutes();
            timeToJamaah.hours = appendZero(timeToJamaah.hours());
            timeToJamaah.minutes = appendZero(timeToJamaah.minutes());
            timeToJamaah.seconds = appendZero(timeToJamaah.seconds());
            // console.log(settings.join, list[i])

            // set isha to after maghrib if join == on
            if (settings.join == "on" && i == "5") {
                document.getElementById("prayer-time-" + list[i]).innerHTML = "with";
                document.getElementById("jamaah-time-" + list[i]).innerHTML = "maghrib";
            } else {
                document.getElementById("prayer-time-" + i) ? document.getElementById("prayer-time-" + i).innerHTML = def.times[i].disp : null;
                document.getElementById("jamaah-time-" + i) ? document.getElementById("jamaah-time-" + i).innerHTML = def.times[i].jamaahdisp : null;
            }

            // highlight next
            document.getElementById("row-" + i) ? document.getElementById("row-" + i).className = "row line" : null; //reset
            document.getElementById("row-" + def.times[7].num) ? document.getElementById("row-" + def.times[7].num).className = "row line next" : null;

            var starttime
            if (def.times[8]['num'] == 5 && tomorrow == 1) starttime = moment();
            else if (def.times[8]['num'] == 5 && tomorrow == 0) starttime = def.times[8].time;
            else starttime = def.times[8].time;

            if (!hidejamaah) { // if hidejamaah is not set in mobile.pug
                if ((moment().add(tomorrow, 'day')).isBetween(starttime, def.times[8].jamaahtime)) {
                    document.getElementById("pending-name") ? document.getElementById("pending-name").innerHTML = settings.preparelabel + " " + def.times[8].name + " " + settings.prayerlabel : null;
                    document.getElementById("timetoprayer") ? document.getElementById("timetoprayer").innerHTML = timeToJamaah.hours + ':' + timeToJamaah.minutes + ':' + timeToJamaah.seconds : null;
                }
            }

            if ((moment().add(tomorrow, 'day')).isBetween(moment().startOf('day'), moment().startOf('day').add(5, 's'))) {
                document.getElementById("pending-name") ? document.getElementById("pending-name").innerHTML = "Midnight" : null;
                document.getElementById("timetoprayer") ? document.getElementById("timetoprayer").innerHTML = "Time" : null;
            }
        }


        var jummuahtime = (settings.jummuahtime).split(":");

        // OVERLAYS
        if (document.getElementById("overlay")) {

            // Taraweeh Prayer
            if ((def.hijri.month == '9') &&
                ((moment().isBetween(moment({
                        hour: '0',
                        minute: '00'
                    }), moment({
                        hour: '0',
                        minute: '35'
                    }))) ||
                    (moment().isBetween(moment({
                        hour: '23',
                        minute: '15'
                    }), moment({
                        hour: '23',
                        minute: '59',
                        second: '59'
                    }))))
                //  (((moment().isBetween(moment({hour: def.isha.jamaahtime.format('H'), minute: def.isha.jamaahtime.format('m')}), moment().endOf('day').add(35, 'minutes')))))
            ) {
                //   console.log("ramadan time")    
                document.getElementById("overlay").style = "background:rgba(0,0,0,.85);z-index:1000;";
                document.getElementById("overlay").innerHTML = "Taraweeh Prayer<br/>" + moment().format('iDD iMMMM iYYYY') + "<br/>" + moment().format('DD MMMM YYYY');
            }
            // Friday Prayer
            else if ((moment().format("d") == '5') &&
                (moment().isBetween(moment({
                    hour: jummuahtime[0],
                    minute: jummuahtime[1]
                }), moment({
                    hour: jummuahtime[0],
                    minute: [jummuahtime[1]]
                }).add(1, 'h')))
            ) {
                //   console.log("jummuah time")    
                document.getElementById("overlay").style = "background:rgba(0,0,0,.85);z-index:1000;";
                document.getElementById("overlay").innerHTML = settings.jummuahlabel + "<br/>" + moment().format('iDD iMMMM iYYYY') + "<br/>" + moment().format('DD MMMM YYYY');
            } else {
                // console.log("not the time")
                document.getElementById("overlay").style = "background: rgba(0,0,0,0);z-index:-9";
                document.getElementById("overlay").textContent = "";
            }
        }

        // Ramadan countdown
        if (def.hijri.month == "8" && def.hijri.day != "30") {
            if (document.getElementById("ramadan")) {
                document.getElementById("ramadan").style = "display: inline;";
                document.getElementById("ramadan").innerHTML = " | " + def.hijri.left.humanize() + " " + settings.ramadancountdownlabel;
            }
        }

    });

    // timeDisp();

    var myInt = setInterval(function() {
        timeDisp()
    }, 1000);


    function appendZero(unit) {
        var unit
        if (unit < 10) unit = '0' + unit;
        else unit = unit;
        return unit;
    }

}());