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

var nexteye = document.getElementById('nextEye');
var strt1 = document.getElementById('start_test1');
var strt2 = document.getElementById('start_test2');
var canvas = document.getElementById('canvas1');
var canvas2 = document.getElementById("canvas2");
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');

var size = 750;
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
c.fillRect(0, 0, 750, 750);

// Variable
var x, y, y2, x2;
var symbols = ["+", "-", "x", "÷"];
var rightResultX = [];
var rightResultY = [];
var leftResultX = [];
var leftResultY = [];
var rightResultsSymbols = [];
var leftResultsSymbols = [];

// Not displaying second canvas
canvas2.style.display = "none";
nexteye.style.display = "none";

// index to capture result
var t = 0;
var t2 = 0;

// if the key pressed is not a capture the result for the next 4 functions
function aKey() {
	if (testOneInProgress) {
		if (symbols[r] != "+") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	else {
		if (symbols[r2] != "+") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
}

function sKey() {
	if (testOneInProgress) {
		if (symbols[r] != "-") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;

		}
	}
	else {
		if (symbols[r2] != "-") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;

		}

	}


}

function xKey() {
	if (testOneInProgress) {
		if (symbols[r] != "x") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;

		}
	}
	else {
		if (symbols[r2] != "x") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;

		}

	}


}

function dKey() {
	if (testOneInProgress) {
		if (symbols[r] != "÷") {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			righResultY[t] = y;
			t++;

		}
	}
	else {
		if (symbols[r2] != "÷") {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
			console.log("")
		}

	}

}


//function to clear canvas
function clearCanvas() {
	c.clearRect(0, 0, 750, 750);
	c.fillStyle = "White";
	c.fillRect(0, 0, 750, 750);

	// Canvas 2
	c2.clearRect(0, 0, 750, 750);
	c2.fillStyle = "White";
	c2.fillRect(0, 0, 750, 750);
}

//Function have black dot in the center
function blackDot() {
	c.fillStyle = "black";
	c.beginPath();
	c.arc(375, 375, 4, 0, Math.PI * 2);
	c.fill();
	// Canvas 2
	c2.fillStyle = "black";
	c2.beginPath();
	c2.arc(375, 375, 4, 0, Math.PI * 2);
	c2.fill();
}

var r;
var r2;

// Function to randomly place random symbol in the canvas
function randomSymbol() {
	r = Math.floor(Math.random() * 4);
	r2 = Math.floor(Math.random() * 4);
	x = Math.floor(Math.random() * 750);
	y = Math.floor(Math.random() * 750);

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

function rightEyeTest() {

	strt1.style.display = "none";
	console.log("test 1");
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
		console.log("Going to next test");
		nexttest();
	}

}

function nexttest() {
	// TODO: canvas2 is shifting to left between switching (might be display attr)
	canvas.style.display = "none";
	canvas2.style.display = "none";

	var startTest1 = document.getElementById("start_test1");
	var startTest2 = document.getElementById("start_test2");

	startTest1.style.display = "none";
	// startTest2.style.display = "inline-block";
	nexteye.style.display = "block";

	testOneInProgress = false;
}

var a = 0;

function leftEyeTest() {

	canvas2.style.display = "inline-block";
	nexteye.style.display = "none";
	// console.log("Test2");
	if (a < 5) {
		// console.log("In test 2 loop");
		clearCanvas();
		blackDot();
		randomSymbol();
		a++;
		setTimeout(leftEyeTest, speed);
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
	canvas2.style.display = "inline-block";
	clearCanvas();
	blackDot();

	for (j = 0; j < rightResultsSymbols.length; j++) {
		c.fillStyle = "blue";
		c.font = "35 px Arial";
		c.fillText(rightResultsSymbols[j], rightResultX[j], rightResultY[j]);
		// console.log("Result: " + resultsSymbolsOne[j]);
		// console.log("X: " + resultX[j]);
		// console.log("Y: " + resultY[j]);
	}
	// Im a comment
	for (j2 = 0; j2 < leftResultsSymbols.length; j2++) {
		console.log("In loop of c2 results ");
		c2.fillStyle = "orange";
		c2.font = "35 px Arial";
		c2.fillText(leftResultsSymbols[j2], leftResultX[j2], leftResultY[j2]);
		// console.log("Result 2: " + resultsSymbolsTwo[j2]);
		// console.log("X2: " + resultX[j2]);
		// console.log("Y2: " + resultY[j2]);
	}
	showExitButton();
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