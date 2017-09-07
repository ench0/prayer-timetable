/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */

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


(function(){

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
  output = [fajr, shurooq, dhuhr, asr, maghrib, isha, now, next, current]
//   output = {
      
//     // fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha,
//     // now: now, next: next, current: current
//   }
  

  return (output)
}
times();

/* TIME DISPLAY */
var timeDisp = (function() {

  var def = times();

	var gregorian = moment().add(tomorrow, 'day').format("dddd, D MMMM YYYY");
	var hijri = moment().add((settings.hijrioffset + tomorrow), 'day').format("iD iMMMM iYYYY");

	document.getElementById("time").innerHTML = moment().format("H:mm:ss");
	document.getElementById("date").innerHTML = gregorian + "<br />" + hijri;

  // Countdown
  timeToPrayer = moment.duration((def[7].time).diff(moment()), 'milliseconds').add(1, 's');//.asMinutes();
  timeToPrayer.hours = appendZero(timeToPrayer.hours());
  timeToPrayer.minutes = appendZero(timeToPrayer.minutes());
  timeToPrayer.seconds = appendZero(timeToPrayer.seconds());
  if (timeToPrayer.hours.length > 2) {var countdowndisp = "0:00:00"; var nextname = def[5].name} else {var countdowndisp = timeToPrayer.hours + ':' + timeToPrayer.minutes + ':' + timeToPrayer.seconds;var nextname = def[7].name;}
  // no isha countdown if join == on
  if (settings.join == "on" && def.next.name == "isha") {
    document.getElementById("pending-name").innerHTML = " ";
    document.getElementById("timetoprayer").innerHTML = " ";
  }
  else {
    document.getElementById("pending-name").innerHTML = nextname;
    document.getElementById("timetoprayer").innerHTML = countdowndisp;
  }



	// Prayer time display
	// for(i=0,list=["fajr","shurooq","dhuhr","asr","maghrib","isha"];i<6;i++){
    for(i=0,list=settings.names;i<6;i++){
            timeToJamaah = moment.duration((def[8].jamaahtime).diff(moment()), 'milliseconds').add(1, 's');//.asMinutes();
        timeToJamaah.hours = appendZero(timeToJamaah.hours());
        timeToJamaah.minutes = appendZero(timeToJamaah.minutes());
        timeToJamaah.seconds = appendZero(timeToJamaah.seconds());
        // console.log(settings.join, list[i])

        // set isha to after maghrib if join == on
        if (settings.join == "on" && i == "5" ) {
        document.getElementById("prayer-time-"+list[i]).innerHTML = "with";
        document.getElementById("jamaah-time-"+list[i]).innerHTML = "maghrib";
        }
        else {
            document.getElementById("prayer-time-"+i).innerHTML = def[i].disp;
            document.getElementById("jamaah-time-"+i).innerHTML = def[i].jamaahdisp;
        }

        // highlight next
        document.getElementById("row-"+i).className = "row line";//reset
        document.getElementById("row-"+def[7].num).className = "row line next";

        if (def[8]['num'] == 5 && tomorrow == 1) var starttime = moment(); else if (def[8]['num'] == 5 && tomorrow == 0) var starttime = def[8].time; else var starttime = def[8].time;
        if ((moment().add(tomorrow, 'day')).isBetween(starttime, def[8].jamaahtime))
        {
        document.getElementById("pending-name").innerHTML = settings.preparelabel + " " + def[8].name + " " + settings.prayerlabel;
            document.getElementById("timetoprayer").innerHTML = timeToJamaah.hours + ':' + timeToJamaah.minutes + ':' + timeToJamaah.seconds;
        }
        if ((moment().add(tomorrow, 'day')).isBetween(moment().startOf('day'), moment().startOf('day').add(5, 's')))
        {
        document.getElementById("pending-name").innerHTML = "Midnight";
            document.getElementById("timetoprayer").innerHTML = "Time";
        }
	}


  var jummuahtime = (settings.jummuahtime).split(":");

  // Taraweeh Prayer
  if ( (moment().format("iM") == '9') &&
       ((moment().isBetween(moment({hour: '0', minute: '00'}), moment({hour: '0', minute: '35'}))) ||
       (moment().isBetween(moment({hour: '23', minute: '15'}), moment({hour: '23', minute: '59', second: '59'}))))
      //  (((moment().isBetween(moment({hour: def.isha.jamaahtime.format('H'), minute: def.isha.jamaahtime.format('m')}), moment().endOf('day').add(35, 'minutes')))))
  ) {
    //   console.log("ramadan time")    
	  document.getElementsByClassName("overlay")[0].style = "background:rgba(0,0,0,.85);z-index:1000;";
	  document.getElementsByClassName("overlay")[0].innerHTML = "Taraweeh Prayer<br/>"+moment().format('iDD iMMMM iYYYY')+"<br/>"+moment().format('DD MMMM YYYY');
    // document.getElementById('overlay').getElementsByTagName('div').innerHTML = "dd"
  }
  // Friday Prayer
  else if ( (moment().format("d") == '5') &&
       (moment().isBetween(moment({hour: jummuahtime[0], minute: jummuahtime[1]}), moment({hour: jummuahtime[0], minute: [jummuahtime[1]]}).add(1, 'h')))
  ) {
    //   console.log("jummuah time")    
	  document.getElementsByClassName("overlay")[0].style = "background:rgba(0,0,0,.85);z-index:1000;";
	  document.getElementsByClassName("overlay")[0].innerHTML = settings.jummuahlabel+"<br/>"+moment().format('iDD iMMMM iYYYY')+"<br/>"+moment().format('DD MMMM YYYY');
  }
  else {
    // console.log("not the time")
    document.getElementsByClassName("overlay")[0].style = "background: rgba(0,0,0,0);z-index:-9";
	document.getElementsByClassName("overlay")[0].textContent = "";
  }

  // no overlay on main
  if (document.getElementById("main")) {
    var targetDiv = document.getElementById("main").getElementsByClassName("overlay")[0];
    targetDiv.style = "background:rgba(255,255,255,0)";
  }
  // console.log((moment().format("d")));


  // Ramadan countdown
  var hijriMonth = moment().format("iM");
  var hijriDay = moment().format("iD");
  // console.log(hijriMonth);
  if (hijriMonth == "8" && hijriDay != "30")
  {
    document.getElementById("ramadan").style = "display: table-row;";
    document.getElementById("ramadan").innerHTML = "<div class='content'>"+moment.duration(moment().endOf('imonth').diff(moment())).humanize()+" until Ramadan</div>";
  }

    // setTimeout(function(){timeDisp()}, 1000);

});

// timeDisp();

var myVar = setInterval(function(){ timeDisp() }, 1000);



function appendZero(unit) {
  if (unit < 10) var unit = '0'+unit;
  else var unit = unit;
  return unit;
}

}());
