var counter = 0;
var refreshTimeout = settings.refresh * 1000 * 60;
screenRefresh(counter);//start immediately

var count = function(){
	// clearInterval(interval);
	// console.log("count! "+"refreshTimeout: "+refreshTimeout+"counter: "+counter);
	counter ++;
	screenRefresh(counter);
	if (counter > 9) counter = 0;
}

interval = setInterval(count, refreshTimeout);
// setInterval(interval(), refreshTimeout);


function screenRefresh(counter) {

	if (counter > 9) counter = 0;

	// console.log("screenRefresh! "+"refreshTimeout: "+refreshTimeout+"counter: "+counter);

	document.getElementById("refresh").style = "display:block;";
	var message = settings.refreshmessage;

	var elem = document.getElementById("refresh");   
	var pos = -100;
	var id = setInterval(frame, 36);

 	document.getElementById("message-text").innerHTML = message;


	function frame() {
		if (pos == 2100) {
		clearInterval(id);
		document.getElementById("refresh").style = "display:none;";
		} else {
		pos++; 
		elem.style.top = pos + 'px';
		//   elem.style.left = pos + 'px'; 
		}
	}
};