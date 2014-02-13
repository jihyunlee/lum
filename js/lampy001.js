var out = 0;

//Variables
var wakeUp;
var bedTime;
var napTime;

var napModeOn = false;
var quickNap = 0;
var napDur = 8;

var wakeRoutine = 0;
var bedRoutine = 0;

function setup(){
	//Start Clock
	setInterval(tick, 1000);

	//Default - Values
	wak_h = 8;
	wak_m = 0;

	bed_h = 21;
	bed_m = 15;

	nap_h = 18;
	nap_m = 24;

	formatDisplay();
}

function animationNight() {
        $('#stars').animate({'opacity':1}, 5000,function(){
            $('#moon').animate({'top':'30%','opacity':1}, 5000, function(){
                $('#sstar').animate({'opacity':1}, 300);
                $('#sstar').animate({
                    'backgroundPosition':'0px 0px','top':'15%', 'opacity':0
                }, 500,function(){
                    $('#back').animate({'opacity':1}, 3000);
                });
            });
        });
        $('#night').animate({'opacity':0.8}, 20000);

}
function animationDay() {
    $('#sun_red').animate({'top':'96%','opacity':0.8}, 12000);
    $('#sky').animate({'backgroundColor':'#4F0030'}, 18000);
    $('#clouds').animate({'backgroundPosition':'1000px 0px','opacity':0}, 30000);
}

function getStatus(h,m) {
	var status = "";
	if(h == localStorage.getItem('wakeUpTime_h') && m == localStorage.getItem('wakeUpTime_m')) {
		status = "Wake Up";
		animationDay();
	} else if(h == localStorage.getItem('sleepingTime_h') && m == localStorage.getItem('sleepingTime_m')) {
		status = "Bed Time";
		animationNight();
	} else if(h == localStorage.getItem('nappingTime_h') && m == localStorage.getItem('nappingTime_m')) {
		status = "Nap Time";
	}

	return status;
}

function tick(){
	//SCHEDULE
	wakeUp = formatTime(wak_h,wak_m);
	bedTime = formatTime(bed_h,bed_m);
	napTime = formatTime(nap_h,nap_m);

	//RTC
	var now = new Date();
	h = now.getHours();
	m = now.getMinutes();
	s = now.getSeconds();

	out = formatTime(h,m);

	clock.innerHTML = out;

//	lampStatus.innerHTML = getStatus(h,m);

	checkMySchedule();
}

function checkMySchedule(){
	var napCheck = document.getElementById("napCheck");
	if(napCheck == null) return;
	
	napModeOn = napCheck.checked;

	if(quickNap != true){
		var status = lampStatus.innerHTML;

		if(out === wakeUp || wakeRoutine == 1){
			status = "Wake Up";
		}
		if(napModeOn == true && out === napTime){
			status = "Nap Time1";
			napModeOn = false;
			document.getElementById("napCheck").checked = false;
			setTimeout(function(){lampStatus.innerHTML = "Normal Mode";}, napDur);
		}
		if (out >= bedTime || bedRoutine == 1){
			status = "Bed Time";
		}
		else if (out > wakeUp && out < bedTime && out != napTime){
			status = "Normal Mode";	
		}
		lampStatus.innerHTML = status;
		
	} else {
		napRoutine(napDur);
	}

	//napRoutine();
	console.log(napModeOn);
	console.log(napTime);
}

function napRoutine(delay){
	quickNap = 1;
	lampStatus.innerHTML = "Nap Time2";
	setTimeout(function(){quickNap = 0}, delay*1000);
}

function myTimer(h, m, myStatus){
	var timer = h + ":" + m;
	if( timer == out){
		console.log(myStatus);
		lampStatus.innerHTML = myStatus;
	}
}

function myDelay(delay, thisStatus, newStatus){
	lampStatus.innerHTML = newStatus;
	setTimeout(changeStatus(), delay);
	function changeStatus(){
		lampStatus.innerHTML = thisStatus;
	}
}

//Display
function formatDisplay(){

	var wakeUpTime_h = document.getElementById("wakeUpTime_h");
	if(wakeUpTime_h) wakeUpTime_h.value = formatForDisplay(wak_h);
	var wakeUpTime_m = document.getElementById("wakeUpTime_m");
	if(wakeUpTime_m) wakeUpTime_m.value = formatForDisplay(wak_m);

	var sleepingTime_h = document.getElementById("sleepingTime_h");
	if(sleepingTime_h) sleepingTime_h.value = formatForDisplay(bed_h);
	var sleepingTime_m = document.getElementById("sleepingTime_m");
	if(sleepingTime_m) sleepingTime_m.value = formatForDisplay(bed_m);

	var nappingTime_h =	document.getElementById("nappingTime_h");
	if(nappingTime_h) nappingTime_h.value = formatForDisplay(nap_h);
	var nappingTime_m = document.getElementById("nappingTime_m");
	if(nappingTime_m) nappingTime_m.value = formatForDisplay(nap_m);
}

function changeTime(name, id, val){

	if(id == "wakeUpTime_h"){
		wak_h = val;
		document.getElementById(id).value = val;
		localStorage.setItem('wakeUpTime_h',val);
		console.log(wak_h);
	}
	if(id == "wakeUpTime_m"){
		wak_m = val;
		document.getElementById(id).value = val;
		localStorage.setItem('wakeUpTime_m',val);
		console.log(wak_m);
	}

	if(id == "sleepingTime_h"){
		bed_h = val;
		document.getElementById(id).value = val;
		console.log(bed_h);
		localStorage.setItem('sleepingTime_h',val);
	}
	if(id == "sleepingTime_m"){
		bed_h = val;
		document.getElementById(id).value = val;
		localStorage.setItem('sleepingTime_m',val);
		console.log(bed_m);
	}

	if(id == "nappingTime_h"){
		nap_h = val;
		document.getElementById(id).value = val;
		localStorage.setItem('nappingTime_h',val);
		console.log(nap_h);
	}
	if(id == "nappingTime_m"){
		nap_m = val;
		document.getElementById(id).value = val;
		localStorage.setItem('nappingTime_m',val);
		console.log(nap_m);
	}
	if(id == "napDuration"){
		napDur = val;
		document.getElementById(id).value = val;
		console.log(napDur);
	}

	checkMySchedule();
	tick();
}

function lockTime(){
	document.getElementsByName("timeInput")[0].readOnly=true;
	document.getElementsByName("timeInput")[1].readOnly=false;
	document.getElementsByName("timeInput")[2].readOnly=false;
}

function formatForDisplay(n){
	if (n <= 9){
		n = "0" + n;
	}
	return n;
}

function formatTime(h,m){
	output = formatForDisplay(h) + ":" + formatForDisplay(m);
	return output;
}

