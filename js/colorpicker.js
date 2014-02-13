var canvas = $("canvas")[0];
var context = canvas.getContext("2d");
var outerRadius = 95;
var innerRadius = 75;
var bgHSL = {
	h:0, 
	s:100, 
	l:70
};

function drawBackground(HSL) {
	bgHSL = HSL;
	document.body.style.backgroundColor = "hsl("+bgHSL.h+","+bgHSL.s+"%,"+bgHSL.l+"%)";
}

function drawCircleExterior(radius) {
	context.beginPath();
	context.arc(0,0,radius,0,2*Math.PI,false);
	//context.arc(0,0,radius,startAngle*(Math.PI/180),(startAngle + parseFloat(360/255))*(Math.PI/180),false);
	context.closePath();

	context.lineWidth = 2;
	context.strokeStyle = 'white';
	context.stroke();
}

function drawBrightnessRing() {
	context.rotate(180*(Math.PI/180));
		
	startColor = 0;
	startAngle= 0

	for (i=0;i<255;i++) {
		context.fillStyle = "hsl("+startColor+", 100%, 50%)";
		context.strokeStyle = "hsl("+startColor+", 100%, 50%)";

		context.beginPath();
		context.moveTo(0,0);
		context.arc(0,0,innerRadius,startAngle*(Math.PI/180),(startAngle + parseFloat(360/255))*(Math.PI/180),false);
		context.lineTo(0,0);
		context.stroke();
		context.closePath();
		context.fill();

		startAngle = startAngle + parseFloat(360/255);
		startColor = startColor + parseFloat(360/255);
	}

	drawCircleExterior(innerRadius);
}

function drawColorPicker() {
		
	//Reset the canvas
	context.restore();
	context.save();
	context.clearRect(0,0,canvas.width,canvas.height);
	
	context.translate(canvas.width/2,canvas.height/2);
	context.rotate(90*(Math.PI/180));

	var scale = 1;
	var startColor = 0 + (1-scale)/2*100;
	var startAngle = 0 + (1-scale)/2*360;

	for (i=0; i<255*scale; i++) {
		
		context.fillStyle = "hsl("+bgHSL.h+","+bgHSL.s+"%,"+startColor+"%)";
		context.strokeStyle = "hsl("+bgHSL.h+","+bgHSL.s+"%,"+startColor+"%)";

		context.beginPath();
		context.moveTo(0,0);
		context.arc(0,0,outerRadius,startAngle*(Math.PI/180),(startAngle + parseFloat(360/255))*(Math.PI/180),false);
		context.lineTo(0,0);
		context.stroke();
		context.closePath();
		context.fill();

		startAngle = startAngle + parseFloat(360/255);

		// if(startAngle > 180) 
		// 	startColor = startColor-parseFloat(100/255);
		// else
		startColor = startColor + parseFloat(100/255);	
	}

	drawCircleExterior(outerRadius);

	drawBrightnessRing();
}

function drawCursor(x, y) {
	// var img = document.getElementById("cursor");
	// img.crossOrigin = 'anonymous';
	// console.log(img);
	// //context.drawImage(img,x,y);       
	// img.src='cursor.gif';

	var image = new Image();
	image.crossOrigin = 'anonymous';
		image.onload = function() {
		context.drawImage(image,x,y);
	}

    image.src = 'images/cursor.gif';
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    var HSL = {h:0, s:0, l:0};

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    HSL.h = Math.floor(h * 360);
    HSL.s = Math.floor(s * 100);
    HSL.l = Math.floor(l * 100);

    return HSL;
}

$('#myCanvas').mousemove(function(e) {
	var pos = findPos(this);
	var x = e.pageX - pos.x;
	var y = e.pageY - pos.y;

	var p = context.getImageData(x, y, 1, 1).data; 
	if(p[0]==255 && p[1]==255 && p[2]==255) return;

	var HSL = rgbToHsl(p[0],p[1],p[2]);
	var dist = Math.sqrt((x -= canvas.width/2) * x + (y -= canvas.height/2) * y);
	if(dist < innerRadius) {
		drawColorPicker();
		drawBackground(HSL);
	} else if(dist < outerRadius) {
		drawBackground(HSL);
	} 

	//drawCursor(x,y);
});

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	drawBackground(bgHSL);
	drawColorPicker();
}

(function() {
	 // resize the canvas to fill browser window dynamically
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
})();


