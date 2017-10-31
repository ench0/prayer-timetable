/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */
'use strict';

if (settings.language == "nl") {
    const monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
    const monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

    const monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
    const monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;


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

let tomorrow = 0;

/* JAMAAH CALC */
const jamaahCalc = function(num, time, timenext){
  const jamaahMethodSetting = (settings.jamaahmethods).split(",")[num];
	const jamaahOffsetSetting = ((settings.jamaahoffsets).split(",")[num]).split(":");

  let jamaahOffset
	switch (jamaahMethodSetting) {
		case "afterthis": jamaahOffset = parseInt(jamaahOffsetSetting[0]*60 + jamaahOffsetSetting[1]); break;
		case "fixed":
      jamaahOffset = (moment().month(time.get('month')).date(time.get('date')).hour(jamaahOffsetSetting[0]).minute(jamaahOffsetSetting[1])).diff(time, 'minutes');
      if (moment().month(time.get('month')).date(time.get('date')).hour(jamaahOffsetSetting[0]).minute(jamaahOffsetSetting[1]).isBefore(time)) jamaahOffset --;
      break;
    case "beforenext": jamaahOffset = (timenext.subtract({minutes: parseInt(jamaahOffsetSetting[0]*60 + jamaahOffsetSetting[1])})).diff(time, 'minutes'); break;
    case "": jamaahOffset = ""; break
	}
  return jamaahOffset;
}

/* PRAYER CONSTRUCTOR */
const Prayer = function(now, num) {

  let dst
  let dstcheck = moment.tz(moment(), "Europe/Dublin").isDST()
  if (!dstcheck && moment().format("M") == "10" ) dst = -1;
  else if (dstcheck && moment().format("M") == "3" ) dst = 1;
  else dst = 0
  // console.log(moment().format("M"), dst, dstcheck);
  
  this.now = moment();
  this.num = num;
  this.name = settings.names[num];
  
  if (num < 5) this.nextnum = num + 1; else this.nextnum = 0;

  this.month = (moment().add(tomorrow, 'day').add(dst, 'hour').month())+1;
  this.date = (moment()).add(tomorrow, 'day').add(dst, 'hour').date();

  this.time = moment({hour: timetable[this.month][this.date][num][0], minute: timetable[this.month][this.date][num][1]});
  this.time = this.time.add(tomorrow, 'day').add(dst, 'hour');

  this.time2 = moment({hour: timetable[this.month][this.date][num][0], minute: timetable[this.month][this.date][num][1]});
  this.time2 = this.time2.add(tomorrow, 'day').add(dst, 'hour');

  this.timenext = moment({month: (this.time).get('month'), date: (this.time).get('date'), hour: timetable[this.month][this.date][this.nextnum][0], minute: timetable[this.month][this.date][this.nextnum][1]});

  this.disp = this.time.format("HH:mm");

  const jamaahOffset = jamaahCalc(num, this.time2, this.timenext);
  this.jamaahtime = this.time2.add(jamaahOffset, 'minutes');

  if (jamaahOffset != "") this.jamaahdisp = this.jamaahtime.format("HH:mm"); else this.jamaahdisp = "";
}

const times = function() {
  let now = moment();//.tz("Europe/Dublin");

  let fajr = new Prayer(now, 0);
  let shurooq = new Prayer(now, 1);
  let dhuhr = new Prayer(now, 2);
  let asr = new Prayer(now, 3);
  let maghrib = new Prayer(now, 4);
  let isha = new Prayer(now, 5);

	let daybegin = moment().startOf('day').add(tomorrow, 'day');
	let dayend = moment().endOf('day').add(tomorrow, 'day');

//   console.log(moment().add(1, 'day').isBetween(isha.time, dayend))

// console.log(moment().add(1, 'day'))

  let next, current
  if (isha.jamaahtime.isBefore(moment()) && tomorrow == 0) {
    next = fajr; current = isha; tomorrow = 1;
    // console.log("opt00");
  }
  else if (isha.time.isBefore(moment())) {
    next = fajr; current = isha; tomorrow = 0;
    // console.log("opt01");
  }
  else if (maghrib.time.isBefore(moment())) {
    next = isha; current = maghrib; tomorrow = 0;
    // console.log("opt02", current);
  }
  else if (asr.time.isBefore(moment())) {
    next = maghrib; current = asr; tomorrow = 0;
    // console.log("opt03");
  }
  else if (dhuhr.time.isBefore(moment())) {
    next = asr; current = dhuhr; tomorrow = 0;
    // console.log("opt04");
  }
  else if (fajr.time.isBefore(moment())) {
    next = dhuhr; current = fajr; tomorrow = 0;
    // console.log("opt05");
  }
  // after midnight, before fajr
  else if (moment().add(tomorrow, 'day').isBefore(fajr.time)) {
    next = fajr; current = isha; tomorrow = 0;
    // console.log("opt06");
  }
  // after isha, before midnight
  else if (moment().isBefore(moment().endOf('day').add(tomorrow, 'day')) &&  moment().add(tomorrow, 'day').isAfter(isha.time)) {
    next = fajr; current = isha; tomorrow = 1;
    // console.log("opt07");
  }
  else {
    next = fajr; current = isha; tomorrow = 1;
    // console.log("opt09");
  }

//          0     1        2      3    4        5     6    7     8
  let output = [fajr, shurooq, dhuhr, asr, maghrib, isha, now, next, current]
//   output = {
      
//     // fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha,
//     // now: now, next: next, current: current
//   }
  

  return (output)
}
times();

/* TIME DISPLAY */
const timeDisp = (function() {

  let def = times();

	let gregorian = moment().add(tomorrow, 'day').format("dddd, D MMMM YYYY");
	let hijri = moment().add((settings.hijrioffset + tomorrow), 'day').format("iD iMMMM iYYYY");

	document.getElementById("time").innerHTML = moment().format("H:mm:ss");
	document.getElementById("date").innerHTML = gregorian + "<br />" + hijri;

  // Countdown
  let nextname
  let countdowndisp
  let timeToPrayer = moment.duration((def[7].time).diff(moment()), 'milliseconds').add(1, 's');//.asMinutes();
  timeToPrayer.hours = appendZero(timeToPrayer.hours());
  timeToPrayer.minutes = appendZero(timeToPrayer.minutes());
  timeToPrayer.seconds = appendZero(timeToPrayer.seconds());
  if (timeToPrayer.hours.length > 2) {countdowndisp = "0:00:00"; nextname = def[5].name} else {countdowndisp = timeToPrayer.hours + ':' + timeToPrayer.minutes + ':' + timeToPrayer.seconds;nextname = def[7].name;}
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
    for(let i=0,list=settings.names;i<6;i++){
        let timeToJamaah = moment.duration((def[8].jamaahtime).diff(moment()), 'milliseconds').add(1, 's');//.asMinutes();
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

        let starttime
        if (def[8]['num'] == 5 && tomorrow == 1) starttime = moment(); else if (def[8]['num'] == 5 && tomorrow == 0) starttime = def[8].time; else starttime = def[8].time;
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


  const jummuahtime = (settings.jummuahtime).split(":");

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
    const targetDiv = document.getElementById("main").getElementsByClassName("overlay")[0];
    targetDiv.style = "background:rgba(255,255,255,0)";
  }
  // console.log((moment().format("d")));


  // Ramadan countdown
  let hijriMonth = moment().format("iM");
  let hijriDay = moment().format("iD");
  // console.log(hijriMonth);
  if (hijriMonth == "8" && hijriDay != "30")
  {
    document.getElementById("ramadan").style = "display: inline;";
    document.getElementById("ramadan").innerHTML = " | " + moment.duration(moment().endOf('imonth').diff(moment())).humanize()+" until Ramadan";
  }

    // setTimeout(function(){timeDisp()}, 1000);

});

// timeDisp();

const myInt = setInterval(function(){ timeDisp() }, 1000);



function appendZero(unit) {
  let untit
  if (unit < 10) unit = '0'+unit;
  else unit = unit;
  return unit;
}

}());
