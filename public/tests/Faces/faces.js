// // The program is meant to randomly display emoji faces on the canvas 
// // If the user sees Smiley face press "s"
// // If the user sees Frowny face press "f"
// // Any error in pressing the wrong key should be flagged and displayed after the test is conducted
// // JS code
// //

let timestamp = Date.now();

//Bool values for tests that are in progress
var rightEyeInProgress; 					// Shows only right eye test in progress
var leftEyeInProgress;  					// Shows Left eye test in progress
var bothREyeinProgress;						// Shows both eyes test in progress
var bothLEyeInProgress;

//HTML variables:
// Two canvases for left and right eyey
// Buttons for right, left, both eye test(s) and exit button
var canvas = document.getElementById('canvas1');			// Right eye canvas
var canvas2 = document.getElementById("canvas2");			// Left eye Canvas
var rightBtn = document.getElementById("rightBtn");			// Button to initate right eye test
var leftBtn = document.getElementById("leftBtn");			// Button to initate left eye test
var bothBtn = document.getElementById("bothBtn");			// Button to intiate both eye test
var nexteyebtn = document.getElementById("nexttestbtn");	// Button to iniate next eye when user selects both eyes
var nextEye = document.getElementById("nextEye");			// To display the next eye div
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');
let exitBtns = document.getElementById('exitTestBtns');

//Sizing Canvas
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
//End of Sizing Canvas

//Function to set speed of test and get user id
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
//End of Function

//Function to flag if user isnt pressing correct key
window.addEventListener('keydown', function (e) {


	var key = e.key;
	key = key.toLowerCase();

	if (key === 's') {
		//if key pressed is s
		console.log("KeyPress: S");
		sKey();
	}
	else if (key === 'f') {
		// if f key is pressed
		console.log("KeyPress: F");
		fKey();
	}
	else {
		console.log("KeyPress: Other");
	}

});
//End of Function



// initalizing canvas
c.fillStyle = "White";
c.fillRect(0, 0, size, size);
blackDot();


//Getting Smiley and Frowny face emoji using its unicode
var frown = String.fromCodePoint(9785);
var smile = String.fromCodePoint(9786);

//Function to size Symbols to make sure they are correct
function sizingSymbols() {
	if (symbols[r] == smile) {

		c.fillStyle = "black";
		c.font = "60px Arial";
	}
	if (symbols[r] == frown) {

		c.fillStyle = "black";
		c.font = "40px Arial";
	}
	if (symbols[r2] == smile) {

		c2.fillStyle = "black";
		c2.font = "60px Arial";
	}
	if (symbols[r2] == frown) {

		c2.fillStyle = "black";
		c2.font = "40px Arial";
	}
	if (rightResultsSymbols[j] == smile) {

		c.fillStyle = "red";
		c.font = "60px Arial";
	}
	if (rightResultsSymbols[j] == frown) {

		c.fillStyle = "red";
		c.font = "40px Arial";
	}
	if (leftResultsSymbols[j2] == smile) {
		c2.fillStyle = "red";
		c2.font = "60px Arial";
	}
	if (leftResultsSymbols[j2] == frown) {

		c2.fillStyle = "red";
		c2.font = "40px Arial";
	}

}
//End of function


//Variables: symbols contains frown and smile to be displayed randomly
//Variables labeled with "result" means it is flagging the x,y coordinated to display after test
var symbols = [frown, smile];
var rightResultX = [];
var rightResultY = [];
var leftResultX = [];
var leftResultY = [];
var rightResultsSymbols = [];
var leftResultsSymbols = [];

// Not displaying second canvas
canvas2.style.display = "none";

// index to capture results using "t" index
var t = 0;
var t2 = 0;

//Function to flag incorrect key is pressed for the next 2 functions
function fKey() {
	if (rightEyeInProgress) {
		if (symbols[r] != frown) {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}
	}
	if (leftEyeInProgress) {
		if (symbols[r2] != frown) {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}
	}
	if (bothREyeinProgress) {
		if (symbols[r] != frown) {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}

	}
	else if (bothLEyeInProgress) {
		if (symbols[r2] != frown) {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}



	}


}

function sKey() {
	if (rightEyeInProgress) {
		if (symbols[r] != smile) {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;

		}
	}
	if (leftEyeInProgress) {
		if (symbols[r2] != smile) {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;

		}

	}
	if (bothREyeinProgress) {
		if (symbols[r] != smile) {
			rightResultsSymbols[t] = symbols[r];
			rightResultX[t] = x;
			rightResultY[t] = y;
			t++;
		}

	}
	else if (bothLEyeInProgress) {
		if (symbols[r2] != smile) {
			leftResultsSymbols[t2] = symbols[r2];
			leftResultX[t2] = x;
			leftResultY[t2] = y;
			t2++;
		}



	}



}
//End of function (Past 2 functions)


// function to hide display buttons
nexteyebtn.style.display = "none";
nextEye.style.display = "none";
function hideBtns() {
	rightBtn.style.display = "none";
	leftBtn.style.display = "none";
	bothBtn.style.display = "none";
}
//End of function

//function to clear canvas after each iteration
function clearCanvas() {
	c.clearRect(0, 0, size, size);
	c.fillStyle = "White";
	c.fillRect(0, 0, size, size);

	// Canvas 2
	c2.clearRect(0, 0, size, size);
	c2.fillStyle = "White";
	c2.fillRect(0, 0, size, size)
}
//End function

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

//Var for randomly selecting a symbol
var r;
var r2;

// Function to randomly place random symbol in the canvas
function randomSymbol() {
	r = Math.floor(Math.random() * 2);
	r2 = Math.floor(Math.random() * 2);
	x = Math.floor(Math.random() * size);
	y = Math.floor(Math.random() * size);
	
	if (rightEyeInProgress) {
		sizingSymbols();
		c.beginPath();
		c.fillText(symbols[r], x, y);

	}
	if (leftEyeInProgress) {
		console.log("In the else c2 random symbols")
		// Canvas 2
		sizingSymbols();
		c2.beginPath();
		c2.fillText(symbols[r2], x, y);
	}
	if (bothREyeinProgress) {
		sizingSymbols();
		c.beginPath();
		c.fillText(symbols[r], x, y);

	}
	else if (bothLEyeInProgress) {
		sizingSymbols();
		c2.beginPath();
		c2.fillText(symbols[r2], x, y);

	}

}
//End of Function

//Function to test right eye only
function rightOption() {
	hideBtns();
	rightEyeInProgress = true;
	bothREyeinProgress = false;
	leftEyeInProgress = false;
	if (rightEyeInProgress) {
		rightEyeTest();

	}
}
//End of function

//Function to test left eye only
function leftOption() {

	hideBtns();
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

	hideBtns();
	bothREyeinProgress = true;
	rightEyeInProgress = false;
	leftEyeInProgress = false;
	if (bothREyeinProgress) {
		rightEyeTest();
	}



}
//End of function



// Vaariable representing iterations for right eye
var i = 0;

//Function to test right eye for Right eye only test or right eye test portion of both tests
function rightEyeTest() {

	if (rightEyeInProgress) {
		console.log("Right eye test");
		blackDot();
		if (i < 8) {
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
		if (i < 8) {
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
//End of funtion

//Function to Transition for both eye test
function nexttest() {
	// TODO: canvas2 is shifting to left between switching (might be display attr)
	canvas.style.display = "none";
	canvas2.style.display = "none";

	nextEye.style.display = "inline-block";
	nexteyebtn.style.display = "inline-block";
	bothREyeinProgress = false;
	bothLEyeInProgress = true;




}
//End of function

//Variable iteration for left eye test
var a = 0;

//Function for left eye only test or left eye portion of both eye test
function leftEyeTest() {

	canvas.style.display = "none";
	canvas2.style.display = "inline-block";

	// console.log("Test2");
	if (leftEyeInProgress) {
		if (a < 8) {
			// console.log("In test 2 loop");
			clearCanvas();
			blackDot();
			randomSymbol();
			a++;
			setTimeout(leftEyeTest, speed);

			// setTimeout(test2, 1000);	// !! FOR TESTING
		}
		else {
			leftResults();
		}
	}

	if (bothLEyeInProgress) {
		console.log("In Left both if statement")
		console.log(a);
		nextEye.style.display = "none";
		nexteyebtn.style.display = "none";
		exitBtns.style.display = "none";
		if (a < 8) {
			// console.log("In test 2 loop");
			clearCanvas();
			blackDot();
			randomSymbol();
			a++;
			setTimeout(leftEyeTest, speed);
			// setTimeout(test2, 1000);	// !! FOR TESTING
			console.log("End of the if statement for both left")
		}
		else {
			console.log("I'm in the both results else")
			bothResults();
		}


	}
}
//En of function

//Iterations for results
var j;
var j2;


// blue represents right eye
// orange represents left eye
// function to show the errors after test is conducted for both eyes
function bothResults() {

	// console.log("Result Symbols: " + resultsSymbols);

	// TODO: The two canvases are being stacked on top of each other
	canvas.style.display = "inline-block";
	canvas2.style.display = "inline-block";
	clearCanvas();
	blackDot();

	for (j = 0; j < rightResultsSymbols.length; j++) {
		sizingSymbols();
		c.fillText(rightResultsSymbols[j], rightResultX[j], rightResultY[j]);

	}

	for (j2 = 0; j2 < leftResultsSymbols.length; j2++) {
		console.log("In loop of c2 results ");
		sizingSymbols();
		c2.fillText(leftResultsSymbols[j2], leftResultX[j2], leftResultY[j2]);

	}
	showExitButton();
}
//End of function

//Right Eye test Results
function rightResults() {
	console.log("Reading from right results");
	canvas.style.display = "inline-block";
	canvas2.style.display = "none";
	clearCanvas();
	blackDot();

	for (j = 0; j < rightResultsSymbols.length; j++) {
		 sizingSymbols();
		c.fillText(rightResultsSymbols[j], rightResultX[j], rightResultY[j]);

	}
	showExitButton();


}
//End of Function

//left eye test results
function leftResults() {
	canvas.style.display = "none";
	canvas2.style.display = "inline-block";
	clearCanvas();
	blackDot();
	for (j2 = 0; j2 < leftResultsSymbols.length; j2++) {
		console.log("In loop of c2 results ");
		sizingSymbols();
		c2.fillText(leftResultsSymbols[j2], leftResultX[j2], leftResultY[j2]);

	}
	showExitButton();


}
//End of function

//Function for user to exit or save results
function showExitButton() {

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
//End of Function


// Function to save results to db
function getFacesResults() {
	return {
		"TestName": "Smiley",
		"TimeStampMS": timestamp,
		"LeftXLocations": leftResultX,
		"LeftYLocations": leftResultY,
		"LeftResultsSymbols": leftResultsSymbols,
		"RightXLocations": rightResultX,
		"RightYLocations": rightResultY,
		"RightResultsSymbols": rightResultsSymbols
	}
}