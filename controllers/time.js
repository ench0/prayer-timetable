/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */
'use strict';

var moment = require('moment');
var hijri = require('moment-hijri');
moment.tz = require('moment-timezone');
var timetable = require('./timetable');
var settings = require('./settings');


if (settings.language == "nl") {
    var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
    var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

    var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
    var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;


    moment.locale('nl', {
        months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortWithDots;
            } else if (/-MMM-/.test(format)) {
                return monthsShortWithoutDots[m.month()];
            } else {
                return monthsShortWithDots[m.month()];
            }
        },

        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,

        weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
        weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
        weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD-MM-YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'over %s',
            past : '%s geleden',
            s : 'een paar seconden',
            m : 'één minuut',
            mm : '%d minuten',
            h : 'één uur',
            hh : '%d uur',
            d : 'één dag',
            dd : '%d dagen',
            M : 'één maand',
            MM : '%d maanden',
            y : 'één jaar',
            yy : '%d jaar'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal : function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    moment.locale('nl');
}


var tomorrow = 0;

/* JAMAAH CALC */
var jamaahCalc = function(num, time, timenext){
  var jamaahMethodSetting = (settings.jamaahmethods).split(",")[num];
	var jamaahOffsetSetting = ((settings.jamaahoffsets).split(",")[num]).split(":");

	switch (jamaahMethodSetting) {
		case "afterthis": jamaahOffset = parseInt(jamaahOffsetSetting[0]*60 + jamaahOffsetSetting[1]); break;
		case "fixed":
      var jamaahOffset = (moment().month(time.get('month')).date(time.get('date')).hour(jamaahOffsetSetting[0]).minute(jamaahOffsetSetting[1])).diff(time, 'minutes');
      if (moment().month(time.get('month')).date(time.get('date')).hour(jamaahOffsetSetting[0]).minute(jamaahOffsetSetting[1]).isBefore(time)) jamaahOffset --;
      break;
    case "beforenext": jamaahOffset = (timenext.subtract({minutes: parseInt(jamaahOffsetSetting[0]*60 + jamaahOffsetSetting[1])})).diff(time, 'minutes'); break;
    case "": jamaahOffset = ""; break
	}
  return jamaahOffset;
}

/* PRAYER CONSTRUCTOR */
var Prayer = function(now, num) {

  this.now = moment();
  this.num = num;
  this.name = settings.names[num];
  
  if (num < 5) this.nextnum = num + 1; else this.nextnum = 0;

  this.month = (moment().add(tomorrow, 'day').month())+1;
  this.date = (moment()).add(tomorrow, 'day').date();

  this.time = moment({hour: timetable[this.month][this.date][num][0], minute: timetable[this.month][this.date][num][1]});
  this.time = this.time.add(tomorrow, 'day');

  this.time2 = moment({hour: timetable[this.month][this.date][num][0], minute: timetable[this.month][this.date][num][1]});
  this.time2 = this.time2.add(tomorrow, 'day');

  this.timenext = moment({month: (this.time).get('month'), date: (this.time).get('date'), hour: timetable[this.month][this.date][this.nextnum][0], minute: timetable[this.month][this.date][this.nextnum][1]});

  this.disp = this.time.format("HH:mm");

  var jamaahOffset = jamaahCalc(num, this.time2, this.timenext);
  this.jamaahtime = this.time2.add(jamaahOffset, 'minutes');

  if (jamaahOffset != "") this.jamaahdisp = this.jamaahtime.format("HH:mm"); else this.jamaahdisp = "";
}

var times = function() {
  var now = moment();//.tz("Europe/Dublin");

  var fajr = new Prayer(now, 0);
  var shurooq = new Prayer(now, 1);
  var dhuhr = new Prayer(now, 2);
  var asr = new Prayer(now, 3);
  var maghrib = new Prayer(now, 4);
  var isha = new Prayer(now, 5);

	var daybegin = moment().startOf('day').add(tomorrow, 'day');
	var dayend = moment().endOf('day').add(tomorrow, 'day');

//   console.log(moment().add(1, 'day').isBetween(isha.time, dayend))

// console.log(moment().add(1, 'day'))


  if (isha.jamaahtime.isBefore(moment()) && tomorrow == 0) {
    var next = fajr; var current = isha; tomorrow = 1;
    // console.log("opt00");
  }
  else if (isha.time.isBefore(moment())) {
    var next = fajr; var current = isha; tomorrow = 0;
    // console.log("opt01");
  }
  else if (maghrib.time.isBefore(moment())) {
    var next = isha; var current = maghrib; tomorrow = 0;
    // console.log("opt02", current);
  }
  else if (asr.time.isBefore(moment())) {
    var next = maghrib; var current = asr; tomorrow = 0;
    // console.log("opt03");
  }
  else if (dhuhr.time.isBefore(moment())) {
    var next = asr; var current = dhuhr; tomorrow = 0;
    // console.log("opt04");
  }
  else if (fajr.time.isBefore(moment())) {
    var next = dhuhr; var current = fajr; tomorrow = 0;
    // console.log("opt05");
  }
  // after midnight, before fajr
  else if (moment().add(tomorrow, 'day').isBefore(fajr.time)) {
    var next = fajr; var current = isha; tomorrow = 0;
    // console.log("opt06");
  }
  // after isha, before midnight
  else if (moment().isBefore(moment().endOf('day').add(tomorrow, 'day')) &&  moment().add(tomorrow, 'day').isAfter(isha.time)) {
    var next = fajr; var current = isha; tomorrow = 1;
    // console.log("opt07");
  }
  else {
    var next = fajr; var current = isha; tomorrow = 1;
    // console.log("opt09");
  }

//          0     1        2      3    4        5     6    7     8
const output = [fajr, shurooq, dhuhr, asr, maghrib, isha, now, next, current]
//   output = {
      
//     // fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha,
//     // now: now, next: next, current: current
//   }
  

  return (output)
}

var times = times();

function appendZero(unit) {
  if (unit < 10) var unit = '0'+unit;
  else var unit = unit;
  return unit;
}

// console.log(times.jamaahOffsetHour)
module.exports = times;
