// // The program is meant to randomly display symbols on the canvas 
// // If the user sees "+" press "a"
// // If the user sees "-" press "s"
// // If the user sees "x" press "x"
// // If the user sees "÷" press "d"
// // Any error in pressing the wrong key should be flagged and displayed after the test is conducted
// // JS code
// //

let timestamp = Date.now();
var testOneInProgress = true;

var canvas = document.getElementById('canvas1');
var canvas2 = document.getElementById("canvas2");
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');

var size = 500;
canvas.style.width = size + "px";
canvas.style.height = size + "px";
canvas2.style.width = size + "px";
canvas2.style.height = size + "px";

var scale = window.devicePixelRatio;
canvas.width = size * scale;
canvas.height = size * scale;
canvas2.width = size * scale;
canvas2.height = size * scale;

c.scale(scale, scale);
c2.scale(scale, scale);

window.addEventListener('keydown', function (e) {
	// WebStorm saying keyCode is deprecated. It might not work in all browsers (-Jay)
	// var key = e.keyCode;
	
	// key variable
	var key = e.key;
	key = key.toLowerCase();
	
	if (key === 's') {
		//if key pressed is s
		console.log("KeyPress: S");
		sKey();
	}
	else if (key === 'a') {
		// if a key is pressed
		console.log("KeyPress: A");
		aKey();
	}
	else if (key === 'd') {
		//if d key is pressed
		console.log("KeyPress: D");
		dKey();
	}
	else if (key === 'x') {
		// if x key is pressed
		console.log("KeyPress: X");
		xKey();
	}
	else {
		console.log("KeyPress: Other");
	}
	
});

c.fillStyle = "White";
c.fillRect(0, 0, 500, 500);

// Variable
var x, y, y2, x2;
var symbols = ["+", "-", "x", "÷"];
var resultX = [];
var resultY = [];
var resultX2 = [];
var resultY2 = [];
var resultsSymbolsOne = [];
var resultsSymbolsTwo = [];


canvas2.style.display = "none";
// index to capture result
var t = 0;
var t2 = 0;

// if the key pressed is not a capture the result for the next 4 functions
function aKey() {
	if (testOneInProgress) {
		if (symbols[r] != "+") {
			resultsSymbolsOne[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "+") {
			resultsSymbolsTwo[t2] = symbols[r2];
			resultX2[t2] = x;
			resultY2[t2] = y;
			t2++;
			
		}
		
	}
	
	
}

function sKey() {
	if (testOneInProgress) {
		if (symbols[r] != "-") {
			resultsSymbolsOne[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "-") {
			resultsSymbolsTwo[t2] = symbols[r2];
			resultX2[t2] = x;
			resultY2[t2] = y;
			t2++;
			
		}
		
	}
	
	
}

function xKey() {
	if (testOneInProgress) {
		if (symbols[r] != "x") {
			resultsSymbolsOne[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "x") {
			resultsSymbolsTwo[t2] = symbols[r2];
			resultX2[t2] = x;
			resultY2[t2] = y;
			t2++;
			
		}
		
	}
	
	
}

function dKey() {
	if (testOneInProgress) {
		if (symbols[r] != "÷") {
			resultsSymbolsOne[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "÷") {
			resultsSymbolsTwo[t2] = symbols[r2];
			resultX2[t2] = x;
			resultY2[t2] = y;
			t2++;
			console.log("")
		}
		
	}
	
}


//function to clear canvas
function clearCanvas() {
	c.clearRect(0, 0, 500, 500);
	c.fillStyle = "White";
	c.fillRect(0, 0, 500, 500);
	
	// Canvas 2
	c2.clearRect(0, 0, 500, 500);
	c2.fillStyle = "White";
	c2.fillRect(0, 0, 500, 500);
}

//Function have black dot in the center
function blackDot() {
	c.fillStyle = "black";
	c.beginPath();
	c.arc(250, 250, 4, 0, Math.PI * 2);
	c.fill();
// Canvas 2
	c2.fillStyle = "black";
	c2.beginPath();
	c2.arc(250, 250, 4, 0, Math.PI * 2);
	c2.fill();
}

var r;
var r2;

// Function to randomly place random symbol in the canvas
function randomSymbol() {
	r = Math.floor(Math.random() * 4);
	r2 = Math.floor(Math.random() * 4);
	x = Math.floor(Math.random() * 500);
	y = Math.floor(Math.random() * 500);
	
	if (testOneInProgress) {
		c.beginPath();
		c.fillStyle = "red";
		c.font = "40px Arial";
		c.fillText(symbols[r], x, y);
	}
	else {
		console.log("In the else c2 random symbols")
		// Canvas 2
		c2.beginPath();
		c2.fillStyle = "red";
		c2.font = "40px Arial";
		c2.fillText(symbols[r2], x, y);
	}
	
}

// Vaariable representing iterations
var i = 0;

function test1() {
	
	console.log("test 1");
	blackDot();
	if (i < 5) {
		clearCanvas();
		blackDot();
		randomSymbol();
		i++;
		setTimeout(test1, 3000);
		// setTimeout(test1, 1000);	// !! FOR TESTING
	}
	else {
		console.log("Going to next test");
		nexttest();
	}
	
}

function nexttest() {
	// TODO: canvas2 is shifting to left between switching (might be display attr)
	canvas.style.display = "none";
	canvas2.style.display = "inline-block";
	
	var startTest1 = document.getElementById("start_test1");
	var startTest2 = document.getElementById("start_test2");
	
	startTest1.style.display = "none";
	startTest2.style.display = "inherit";
	
	testOneInProgress = false;
}

var a = 0;

function test2() {
	
	// console.log("Test2");
	if (a < 5) {
		// console.log("In test 2 loop");
		clearCanvas();
		blackDot();
		randomSymbol();
		a++;
		setTimeout(test2, 3000);
		// setTimeout(test2, 1000);	// !! FOR TESTING
	}
	else results();
}

var j;
var j2;

// Results for tests shows 1 canvas'
// blue represents right eye
// orange represents left eye
// function to show the erros after test is conducted
function results() {
	
	// console.log("Result Symbols: " + resultsSymbols);
	
	// TODO: The two canvases are being stacked on top of each other
	canvas.style.display = "inline-block";
	canvas2.style.display = "none";
	clearCanvas();
	blackDot();
	
	for (j = 0; j < resultsSymbolsOne.length; j++) {
		c.fillStyle = "blue";
		c.font = "35 px Arial";
		c.fillText(resultsSymbolsOne[j], resultX[j], resultY[j]);
		// console.log("Result: " + resultsSymbolsOne[j]);
		// console.log("X: " + resultX[j]);
		// console.log("Y: " + resultY[j]);
	}
	// Im a comment
	for (j2 = 0; j2 < resultsSymbolsTwo.length; j2++) {
		console.log("In loop of c2 results ");
		c.fillStyle = "orange";
		c.font = "35 px Arial";
		c.fillText(resultsSymbolsTwo[j2], resultX2[j2], resultY2[j2]);
		// console.log("Result 2: " + resultsSymbolsTwo[j2]);
		// console.log("X2: " + resultX[j2]);
		// console.log("Y2: " + resultY[j2]);
	}
}

function showExitButton() {
	let exitBtns = document.getElementById('exitTestBtns');
	let fadeInSpeed = 1;
	
	exitBtns.style.display = "inherit";
	exitBtns.style.opacity = 0.0;
	
	let fadeIn = setInterval(function () {
		if (exitBtns.style.opacity < 1.0) {
			
			// Needs the plus sign before "exitBtns"
			exitBtns.style.opacity = +exitBtns.style.opacity + 0.01;
		}
		else {
			// Clear the current timer and exit
			clearInterval(fadeIn);
		}
	}, fadeInSpeed);
}

// Update value names
function getSymbolsResults() {
	return {
		"TestName": "symbols",
		"TimeStampMS": timestamp,
		"LeftXLocations": leftResultX,
		"LeftYLocations": leftResultY,
		"LeftResultsSymbols": leftResultsSymbols,
		"RightXLocations": rightResultX,
		"RightYLocations": rightResultY,
		"RightResultsSymbols": rightResultsSymbols
	}
}