// // The program is meant to randomly display symbols on the canvas
// // If the user sees "+" press "a"
// // If the user sees "-" press "s"
// // If the user sees "x" press "x"
// // If the user sees "÷" press "d"
// // Any error in pressing the wrong key should be flagged and displayed after the test is conducted
// // JS code
// ------------------------------------------------------------------------------------------------------------------ //

let timestamp = Date.now();

//Bool values for tests that are in progress
var rightEyeInProgress;
var leftEyeInProgress;
var bothREyeinProgress;
var bothLEyeInProgress;

//Html elements: Using 2 Canvases
// Three Buttons Both eye, Right, and Left. Exit buttons as well
var canvas = document.getElementById('canvas1');
var canvas2 = document.getElementById("canvas2");
var rightBtn = document.getElementById("rightBtn");
var leftBtn = document.getElementById("leftBtn");
var bothBtn = document.getElementById("bothBtn");
var nextEye = document.getElementById("nextEye");
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');
let exitBtns = document.getElementById('exitTestBtns');

// Canvas Sizing
var size = 700;
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
// End of Canvas Sizing


//Speed of test
var speed = 3000;
var id;
var db = firebase.firestore();
getUid();
async function getUid() {
	
	await firebase.auth().onAuthStateChanged(user => {
		if (user) {
			id = user.uid;
			console.log(id);
			db.collection("users").doc(user.uid)
				.get()
				.then(doc => {
					let newgrowingspeed = (doc.data().testSpeeds);
					speed = newgrowingspeed * 1000;
				});
		}
	});
}

// Function to see if User pressed the wrong key 
window.addEventListener('keydown', function (e) {

	// key variable
	var key = e.key;
	key = key.toLowerCase();

	if (key === 's') {
		console.log("KeyPress: S"); 		// If key pressed is s
		sKey();
	}
	else if (key === 'a') {
		console.log("KeyPress: A"); 		// If a key is pressed
		aKey();
	}
	else if (key === 'd') {
		console.log("KeyPress: D");			// If d key is pressed
		dKey();
	}
	else if (key === 'x') {
		console.log("KeyPress: X"); 		// If x key is pressed
		xKey();
	}
	else {
		console.log("KeyPress: Other");
	}
});
//End of Function

//Placing black dot in the center before the test so user can focus on center dot
blackDot();

// Variables:
// X, Y for random placement of symbols
//Variables labeled with a "result" show user the mistakes when pressing wrong key
// Symbols is array for random symbols
var x, y;
var symbols = ["+", "-", "x", "÷"];
var rightResultX = [];
var rightResultY = [];
var leftResultX = [];
var leftResultY = [];
var rightResultsSymbols = [];
var leftResultsSymbols = [];

// index to capture result
var t = 0;
var t2 = 0;

// Next 4 functions capture any mistake the user made at iteration t and display at the end of the test
// Four functions for each key pressed
function aKey() {
	if (rightEyeInProgress) {
		if (symbols[r] != "+") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	
	if (leftEyeInProgress) {
		if (symbols[r2] != "+") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
	
	if (bothREyeinProgress) {
		if (symbols[r] != "+") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;

		}
	}
	else if (bothLEyeInProgress) {
		if (symbols[r2] != "+") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
}

function sKey() {
	if (rightEyeInProgress) {
		if (symbols[r] != "-") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	
	if (leftEyeInProgress) {
		if (symbols[r2] != "-") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
	
	if (bothREyeinProgress) {
		if (symbols[r] != "-") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	else if (bothLEyeInProgress) {
		if (symbols[r2] != "-") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
}

function xKey() {
	if (rightEyeInProgress) {
		if (symbols[r] != "x") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	
	if (leftEyeInProgress) {
		if (symbols[r2] != "x") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
	
	if (bothREyeinProgress) {
		if (symbols[r] != "x") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	else if (bothLEyeInProgress) {
		if (symbols[r2] != "x") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
}

function dKey() {
	if (rightEyeInProgress) {
		if (symbols[r] != "÷") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	
	if (leftEyeInProgress) {
		if (symbols[r2] != "÷") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
	
	if (bothREyeinProgress) {
		if (symbols[r] != "÷") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;

		}

	}
	else if (bothLEyeInProgress) {
		if (symbols[r2] != "÷") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
}
// End of functions that capture mistakes


//function to clear canvas after each iteration
function clearCanvas() {
	c.clearRect(0, 0, size, size);
	c.fillStyle = "White";
	c.fillRect(0, 0, size, size);

	// Canvas 2
	c2.clearRect(0, 0, size, size);
	c2.fillStyle = "White";
	c2.fillRect(0, 0, size, size);
}
// End of Function


//Function have black dot in the center after each iteration
function blackDot() {
	c.fillStyle = "black";
	c.beginPath();
	c.arc(size / 2, size / 2, 6.5, 0, Math.PI * 2);
	c.fill();
	// Canvas 2
	c2.fillStyle = "black";
	c2.beginPath();
	c2.arc(size / 2, size / 2, 6.5, 0, Math.PI * 2);
	c2.fill();
}
//End of function

// Variables for indexing random symbols for Test not results
var r;
var r2;

// Function to randomly place random symbol in the canvas
function randomSymbol() {
	r = Math.floor(Math.random() * 4);
	r2 = Math.floor(Math.random() * 4);
	x = Math.floor(Math.random() * size);
	y = Math.floor(Math.random() * size);

	if (rightEyeInProgress) {
		c.beginPath();
		c.fillStyle = "red";
		c.font = "40px Arial";
		c.fillText(symbols[r], x, y);
	}
	
	if (leftEyeInProgress) {
		// Canvas 2
		c2.beginPath();
		c2.fillStyle = "red";
		c2.font = "40px Arial";
		c2.fillText(symbols[r2], x, y);
	}
	
	if (bothREyeinProgress) {
		c.beginPath();
		c.fillStyle = "red";
		c.font = "40px Arial";
		c.fillText(symbols[r], x, y);
	}
	else if (bothLEyeInProgress) {
		c2.beginPath();
		c2.fillStyle = "red";
		c2.font = "40px Arial";
		c2.fillText(symbols[r2], x, y);
	}
}
//End of Function


//Function for right eye test only
function rightOption() {
	eyeSelector.style.display = "none";
	canvas.style.display = "inherit";
	rightEyeInProgress = true;
	bothREyeinProgress = false;
	leftEyeInProgress = false;
	
	if (rightEyeInProgress) {
		rightEyeTest();
	}
}
// End of Function

//Function of left eye test only
function leftOption() {
	eyeSelector.style.display = "none";
	canvas.style.display = "inherit";
	leftEyeInProgress = true;
	rightEyeInProgress = false;
	bothREyeinProgress = false;
	
	if (leftEyeInProgress) {
		leftEyeTest();
	}
}
//End of function

//Function to test both eyes
function bothOption() {
	eyeSelector.style.display = "none";
	canvas.style.display = "inherit";
	bothREyeinProgress = true;
	rightEyeInProgress = false;
	leftEyeInProgress = false;
	
	if (bothREyeinProgress) {
		rightEyeTest();
	}
}
//End of Function


// Vaariable representing iterations for right eye test(s)
var i = 0;

//Function to test right eye for Right eye only test and Right eye portion of both eye test
function rightEyeTest() {
	if (rightEyeInProgress) {
		blackDot();
		if (i < 5) {
			clearCanvas();
			blackDot();
			randomSymbol();
			i++;
			setTimeout(rightEyeTest, speed);
		}
		else {
			rightResults();
		}
	}
	
	if (bothREyeinProgress) {
		blackDot();
		if (i < 5) {
			clearCanvas();
			blackDot();
			randomSymbol();
			i++;
			setTimeout(rightEyeTest, speed);
		}
		else {
			nexttest();
		}
	}
}
//End of Function

//Function for Both eye test to transition to next eye
function nexttest() {
	canvas.style.display = "none";
	canvas2.style.display = "none";
	nextEye.style.display = "inline-block";
	
	bothREyeinProgress = false;
	bothLEyeInProgress = true;
}
//End of Function

// Representing iterations for Left eye test(s)
var a = 0;

// Function to test left eye for Left eye only test and left portion of both eye test
function leftEyeTest() {

	canvas.style.display = "none";
	canvas2.style.display = "inline-block";

	if (leftEyeInProgress) {
		if (a < 5) {
			clearCanvas();
			blackDot();
			randomSymbol();
			a++;
			setTimeout(leftEyeTest, speed);
		}
		else {
			leftResults();
		}
	}

	if (bothLEyeInProgress) {
		nextEye.style.display = "none";
		exitBtns.style.display = "none";
		if (a < 5) {
			clearCanvas();
			blackDot();
			randomSymbol();
			a++;
			setTimeout(leftEyeTest, speed);
		}
		else {
			bothResults();
		}
	}
}
//End of Function

var j;
var j2;
// Results for tests shows 1 canvas'
// blue represents right eye
// orange represents left eye
// function to show the erros after test is conducted for both eyes
function bothResults() {

	// TODO: The two canvases are being stacked on top of each other
	canvas.style.display = "inline-block";
	canvas2.style.display = "inline-block";
	clearCanvas();
	blackDot();

	for (j = 0; j < rightResultsSymbols.length; j++) {
		c.fillStyle = "blue";
		c.font = "35 px Arial";
		c.fillText(rightResultsSymbols[j], rightResultX[j], rightResultY[j]);

	}

	for (j2 = 0; j2 < leftResultsSymbols.length; j2++) {
		c2.fillStyle = "orange";
		c2.font = "35 px Arial";
		c2.fillText(leftResultsSymbols[j2], leftResultX[j2], leftResultY[j2]);
	}
	showExitButton();
}
//End of function

//Function to display right eye results
function rightResults() {
	canvas.style.display = "inline-block";
	canvas2.style.display = "none";
	
	clearCanvas();
	blackDot();

	for (j = 0; j < rightResultsSymbols.length; j++) {
		c.fillStyle = "blue";
		c.font = "35 px Arial";
		c.fillText(rightResultsSymbols[j], rightResultX[j], rightResultY[j]);

	}
	showExitButton();
}
//End of function

//Function to display left eye results
function leftResults() {
	canvas.style.display = "none";
	canvas2.style.display = "inline-block";
	clearCanvas();
	blackDot();
	
	for (j2 = 0; j2 < leftResultsSymbols.length; j2++) {
		c2.fillStyle = "orange";
		c2.font = "35 px Arial";
		c2.fillText(leftResultsSymbols[j2], leftResultX[j2], leftResultY[j2]);
	}
	
	showExitButton();
}
//End of function

//Function to let user exit and save results
function showExitButton() {

	exitBtns.style.display = "inline-block"; // why two?
	let fadeInSpeed = 1;

	exitBtns.style.display = "inherit"; // why two?
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
//End of Function


// Function to get results to send to db
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
//End of function