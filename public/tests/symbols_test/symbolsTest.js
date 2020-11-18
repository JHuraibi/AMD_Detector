// // The program is meant to randomly display symbols on the canvas 
// // If the user sees "+" press "a"
// // If the user sees "-" press "s"
// // If the user sees "x" press "x"
// // If the user sees "÷" press "d"
// // Any error in pressing the wrong key should be flagged and displayed after the test is conducted
// // JS code
// //

let timestamp = Date.now();


//Bool values for tests that are in progress
var rightEyeInProgress;
var leftEyeInProgress;
var bothREyeinProgress;
var bothLEyeInProgress;

//Html elements
var canvas = document.getElementById('canvas1');
var canvas2 = document.getElementById("canvas2");
var rightBtn = document.getElementById("rightBtn");
var leftBtn = document.getElementById("leftBtn");
var bothBtn = document.getElementById("bothBtn");
var nexteyebtn = document.getElementById("nexttestbtn");
var nextEye = document.getElementById("nextEye");
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');
let exitBtns = document.getElementById('exitTestBtns');

//Canvas Sizing
var size = 600;
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

//Speed of test
var speed = 3000;
var id;
var db = firebase.firestore();
getUid();
async function getUid() {
	//let user = await firebase.auth().currentUser;
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

window.addEventListener('keydown', function (e) {

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

// initalizing canvas
c.fillStyle = "White";
c.fillRect(0, 0, 600, 600);
blackDot();

// Variable
var x, y;
var symbols = ["+", "-", "x", "÷"];
var rightResultX = [];
var rightResultY = [];
var leftResultX = [];
var leftResultY = [];
var rightResultsSymbols = [];
var leftResultsSymbols = [];

// Not displaying second canvas
canvas2.style.display = "none";


// index to capture result
var t = 0;
var t2 = 0;

// if the key pressed is not a capture the result for the next 4 functions
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
			console.log("")
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
			console.log("")
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
			console.log("")
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
			console.log("")
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
			console.log("")
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
			console.log("")
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
			console.log("")
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
			console.log("")
		}


	}

}

// function to hide display buttons
nexteyebtn.style.display = "none";
nextEye.style.display = "none";
function hideBtns() {
	rightBtn.style.display = "none";
	leftBtn.style.display = "none";
	bothBtn.style.display = "none";
}


//function to clear canvas
function clearCanvas() {
	c.clearRect(0, 0, 600, 600);
	c.fillStyle = "White";
	c.fillRect(0, 0, 600, 600);

	// Canvas 2
	c2.clearRect(0, 0, 600, 600);
	c2.fillStyle = "White";
	c2.fillRect(0, 0, 600, 600);
}

//Function have black dot in the center
function blackDot() {
	c.fillStyle = "black";
	c.beginPath();
	c.arc(300, 300, 4, 0, Math.PI * 2);
	c.fill();
	// Canvas 2
	c2.fillStyle = "black";
	c2.beginPath();
	c2.arc(300, 300, 4, 0, Math.PI * 2);
	c2.fill();
}

// indexing random symbols
var r;
var r2;

// Function to randomly place random symbol in the canvas
function randomSymbol() {
	r = Math.floor(Math.random() * 4);
	r2 = Math.floor(Math.random() * 4);
	x = Math.floor(Math.random() * 580);
	y = Math.floor(Math.random() * 580);
	


	if (rightEyeInProgress) {
		c.beginPath();
		c.fillStyle = "red";
		c.font = "40px Arial";
		c.fillText(symbols[r], x, y);
	}
	if (leftEyeInProgress) {
		console.log("In the else c2 random symbols")
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

//Right eye option
function rightOption() {
	hideBtns();
	rightEyeInProgress = true;
	bothREyeinProgress = false;
	leftEyeInProgress = false;
	if (rightEyeInProgress) {
		rightEyeTest();

	}

}

function leftOption() {

	hideBtns();
	leftEyeInProgress = true;
	rightEyeInProgress = false;
	bothREyeinProgress = false;
	if (leftEyeInProgress) {
		leftEyeTest();
	}



}
function bothOption() {

	hideBtns();
	bothREyeinProgress = true;
	rightEyeInProgress = false;
	leftEyeInProgress = false;
	if (bothREyeinProgress) {
		rightEyeTest();
	}



}

// Vaariable representing iterations
var i = 0;

function rightEyeTest() {



	if (rightEyeInProgress) {
		console.log("Right eye test");
		blackDot();
		if (i < 5) {
			clearCanvas();
			blackDot();
			randomSymbol();
			i++;
			setTimeout(rightEyeTest, speed);
			// setTimeout(test1, 1000);	// !! FOR TESTING
			
		}
		else {

			rightResults();
		}
	}
	if (bothREyeinProgress) {
		console.log("both eye test");
		blackDot();
		if (i < 5) {
			clearCanvas();
			blackDot();
			randomSymbol();
			i++;
			setTimeout(rightEyeTest, speed);
			// setTimeout(test1, 1000);	// !! FOR TESTING
		}
		else {

			nexttest();
		}

	}

}

function nexttest() {
	// TODO: canvas2 is shifting to left between switching (might be display attr)
	canvas.style.display = "none";
	canvas2.style.display = "none";


	nextEye.style.display = "inline-block";
	nexteyebtn.style.display = "inline-block";
	bothREyeinProgress = false;
	bothLEyeInProgress= true;

}


// Representing left eye iterations
var a = 0;

function leftEyeTest() {

	canvas.style.display = "none";
	canvas2.style.display = "inline-block";

	// console.log("Test2");
	if (leftEyeInProgress) {
		if (a < 5) {
			// console.log("In test 2 loop");
			clearCanvas();
			blackDot();
			randomSymbol();
			a++;
			setTimeout(leftEyeTest, speed);
			
			// setTimeout(test2, 1000);	// !! FOR TESTING
		}
		else{
		leftResults();
		}
	}

	if (bothLEyeInProgress) {
		nextEye.style.display = "none";
		nexteyebtn.style.display = "none";
		exitBtns.style.display = "none";
		if (a < 5) {
			// console.log("In test 2 loop");
			clearCanvas();
			blackDot();
			randomSymbol();
			a++;
			setTimeout(leftEyeTest, speed);
			// setTimeout(test2, 1000);	// !! FOR TESTING
		}
		else
		{
			console.log("I'm in the both results else")
			bothResults();
		}


	}
}

var j;
var j2;

// Results for tests shows 1 canvas'
// blue represents right eye
// orange represents left eye
// function to show the erros after test is conducted
function bothResults() {

	// console.log("Result Symbols: " + resultsSymbols);

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
		console.log("In loop of c2 results ");
		c2.fillStyle = "orange";
		c2.font = "35 px Arial";
		c2.fillText(leftResultsSymbols[j2], leftResultX[j2], leftResultY[j2]);

	}
	showExitButton();
}

//Right Eye Results
function rightResults() {
	console.log("Reading from right results");
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

function leftResults() {
	canvas.style.display = "none";
	canvas2.style.display = "inline-block";
	clearCanvas();
	blackDot();
	for (j2 = 0; j2 < leftResultsSymbols.length; j2++) {
		console.log("In loop of c2 results ");
		c2.fillStyle = "orange";
		c2.font = "35 px Arial";
		c2.fillText(leftResultsSymbols[j2], leftResultX[j2], leftResultY[j2]);

	}
	showExitButton();


}


function showExitButton() {

	exitBtns.style.display = "inline-block";
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