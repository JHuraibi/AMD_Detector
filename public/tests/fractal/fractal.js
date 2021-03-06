// TODO: Update/add docstrings
// TODO: Add a timeout function to quit test after certain time
// TODO: Add additional instructions for how to end current eye or quit test


let timestamp;						// Will record the time the test was started (in milliseconds since Epoch)
let backgroundColor = 240;			// Greyscale color for canvas background (0:Black, 255:White)
let barFillAlpha = 0;				// Will control the bars' alpha
let opacityIncrease = 15;			// How much to incrementally increase bar opacity
let keyPressFillAlpha = 0;			// Will control the click indicator's alpha

let timer = 0;						// Frame counter
let sec = 2;						// Seconds between showing each bar
let indicatorStartTime = 0;			// Will track the current timer value when a click is registered
let indicatorDuration = 30;			// How many frames to show the indicator (60 frames is 1 second)

let xCoordinateLeft;				// LEFT EYE: X locations at the time of a click event
let yCoordinateLeft;				// LEFT EYE: Y locations at the time of a click event
let widthLeft;						// LEFT EYE: Width of final rectangle
let heightLeft;						// LEFT EYE: Height of final rectangle

let xCoordinateRight;				// RIGHT EYE: X locations at the time of a click event
let yCoordinateRight;				// RIGHT EYE: Y locations at the time of a click event
let widthRight;						// RIGHT EYE: Width of final rectangle
let heightRight;					// RIGHT EYE: Height of final rectangle

let verticalInProgress = true;		// Indicates whether bars are currently being drawn vertically or horizontally
let leftEyeTestInProgress = true;	// Indicates if bars are currently being drawn vertically or horizontally

let waitingToStart = true;			// Status indicator: Waiting for user to click "Start (X) Eye" button
let testFinished = false;			// Status indicator: Waiting for user to click "Start (X) Eye" button
// TODO: Refactor variable name
let inputUsedThisRound = false;		// Disables key presses if one was already received for current bars being shown
let iterations = 7;					// Maximum numbers of times to halve the sections

let canvasRef;						// Reference object to the DOM canvas element
let canvasSize = 700;				// Size of width and height of the canvas (in pixels)

let cX;								// Current X position of the GROUP of halves
let cY;								// Current Y position of the GROUP of halves
let cW;								// Current width of the INDIVIDUAL halves
let cH;								// Current height of the INDIVIDUAL halves


/**
 * Unhides the test canvas. Enables canvas to update via setting
 * 	waitingToStart to false. Records the current time and starts automatic looping of draw()
 * This function runs after user clicks button on instructions page.
 * 	Upon page loading, setup() and draw() both run once.
 */
function startTest() {
	canvasRef.show();
	waitingToStart = false;
	timestamp = Date.now();
	loop();
}

/**
 * Halts the automatic looping of draw(), sets up the canvas,
 * 	creates a new canvas and a reference to it, assigns an id to the
 * 	canvas DOM element, sets the starting axis, and assigns the starting position
 * 	and size values.
 */
function setup() {
	noLoop();
	canvasRef = createCanvas(canvasSize, canvasSize);
	canvasRef.id('canvasRef');
	
	currentAxis = 'x';
	cX = 0;
	cY = 0;
	cW = canvasSize / 2;
	cH = canvasSize;
	
	// canvasRef.hide();
	canvasRef.show();
	background(backgroundColor);
	drawCenterDot();
	drawStaticBorder();
}

/**
 * Main test controller. Automatically loops 60 times per second.
 *
 * If waitingToStart is true:
 * 	- Prematurely returns so that nothing is attempted to be drawn to the canvas.
 *
 * If the test is done:
 *  - Show the results.
 *  - Unhide the exit button
 *  - Halt automatic looping of draw()
 *
 * After set number of iterations:
 *  - Starts transition process for switching testing eye
 *
 * If user provides input:
 *  - Updates the drawn halves and the position variables
 *
 * Always (given not waiting to start or test done):
 *  - Draws the current halves
 *  - Draw the center dot and static canvas border
 *  - Draw the key press indicator (if keydown registered)
 *  - Increment the timer
 */
function draw() {
	if (waitingToStart) {
		// Force draw not to execute
		return;
	}
	
	background(backgroundColor);
	
	if (testFinished) {
		showResults();
		showExitButton();
		noLoop();
	}
	
	if (iterations < 0) {
		transitionToNextEye();
	}
	
	if (inputUsedThisRound) {
		updateAll();
		// switchAxis
	}
	
	// TODO: Refactor function name
	drawBar();
	drawCenterDot();
	drawKeyPressIndicator();
	drawStaticBorder();
	
	timer++;
}


function keyPressed() {
	if (inputUsedThisRound || waitingToStart || testFinished) {
		return;
	}
	
	if (keyCode === ENTER) {
		recordCurrentResults();
		transitionToNextEye();
		// return;	// CHECK: Needed?
	}
	
	if (keyCode === BACKSPACE) {
		transitionToNextEye();
	}
	
	if (keyCode === ESCAPE) {
		// TODO: Show quit confirmation
		noLoop();
		showExitButton();
		
		// Below function is defined in fractal.html.
		// It hides the button to upload to Firestore.
		updateFirebaseButtons();
	}
	
	// CHECK: Extract into separate functions?
	if (currentAxis === 'x') {
		if (keyCode === LEFT_ARROW) {
			console.log("X Axis - KeyPress: LEFT ARROW");
			cH = cH / 2;
			currentAxis = 'y';
			iterations--;
		}
		else if (keyCode === RIGHT_ARROW) {
			console.log("X Axis - KeyPress: RIGHT ARROW");
			cH = cH / 2;
			cX = cX + cW;
			currentAxis = 'y';
			iterations--;
		}
		else {
			console.log("KeyPress Other: " + keyCode);
		}
	}
	else if (currentAxis === 'y') {
		if (keyCode === UP_ARROW) {
			console.log("Y Axis - KeyPress: UP ARROW");
			cW = cW / 2;
			currentAxis = 'x';
			iterations--;
		}
		else if (keyCode === DOWN_ARROW) {
			console.log("Y Axis - KeyPress: UP ARROW");
			currentAxis = 'x';
			cW = cW / 2;
			cY = cY + cH;
			iterations--;
		}
		else {
			console.log("Y Axis - KeyPress Other: " + keyCode);
		}
	}
	
	// TODO: Move these two into if/else
	indicatorStartTime = timer;
	keyPressFillAlpha = 255;
	
	return false; // prevent any default behaviour (P5.js reference recommendation)
}

/**
 * Incrementally increases the Alpha (opacity) of the bar fill color. This will
 * 		create an animation that makes it look like a single bar is fading in.
 * 		Maximum alpha/opacity value is 255.
 */
function updateOpacity() {
	barFillAlpha += opacityIncrease;
	
	if (barFillAlpha > 255) {
		barFillAlpha = 255;
	}
}

function drawBar() {
	if (waitingToStart || testFinished) {
		return;
	}
	
	// !! CRITICAL: Staring at these colors produced visual artifacts
	//					when they move. Look into grayscale or other.
	// Orange: 			"rgb(240, 90, 40)"
	// Light Orange:	"rgb(238, 149, 120)"
	
	// Red-Orange: 		"rgb(200, 80, 67)"
	// Light Red-Orange "rgb(202, 129, 122)"
	
	// Blue: 			"rgb(27, 160, 150)"
	// Light Blue:		"rgb(88, 164, 158)"
	
	// Green: 			"rgb(68, 201, 114)"
	// Light Green: 	"rgb(114, 207, 146)"
	
	// Very Light Green: "rgb(147, 255, 145)"
	// Very Light Red: "rgb(255, 145, 147)"
	// Very Light Blue: "rgb(145, 147, 255)"
	
	noStroke();
	updateOpacity();
	
	if (currentAxis === 'x') {
		// fill(200, 80, 67, barFillAlpha);		// Orange
		// fill(202, 129, 122, barFillAlpha);	// Light Orange
		fill(255, 145, 147, barFillAlpha);		// Light Red
		rect(cX, cY, cW, cH);
		
		// fill(68, 201, 114, barFillAlpha);	// Green
		// fill(114, 207, 146, barFillAlpha);	// Light Green
		fill(147, 255, 145, barFillAlpha);		// Very Light Green
		rect(cX + cW, cY, cW, cH);
	}
	else if (currentAxis === 'y') {
		// fill(200, 80, 67, barFillAlpha);		// Orange
		// fill(202, 129, 122, barFillAlpha);	// Light Orange
		fill(255, 145, 147, barFillAlpha);		// Light Red
		rect(cX, cY, cW, cH);
		
		// fill(68, 201, 114, barFillAlpha);	// Green
		// fill(114, 207, 146, barFillAlpha);	// Light Green
		fill(147, 255, 145, barFillAlpha);		// Very Light Green
		rect(cX, cY + cH, cW, cH);
	}
	else {
		// Uncomment below if needed for debugging
		// console.log("drawBar called when currentAxis not 'X' or 'Y'");
	}
}

/**
 * Fires off the events that occur every n-seconds (n set by "sec" variable)
 */
function updateAll() {
	loadNextBarPos();
	inputUsedThisRound = false;
	barFillAlpha = 0;
}

// CHECK: Probably unneeded
// function switchToYAxis(whichSide) {
// 	cH = cH / 2;
//
// 	if (whichSide === "right") {
// 		cX = cX + cW;
// 	}
// }
//
// function switchToXAxis(whichSide) {
// 	cW = cW / 2;
//
// 	if (whichSide === "down") {
// 		cY = cY + cH;
// 	}
// }


/**
 * Incrementally decreases the Alpha (opacity) of the click indicator fill color. This will
 * 	create an animation that makes it look like the indicator is fading out.
 * 	Minimum alpha/opacity value is 0.
 * Fading out will start once timer has n-frames have passed. Where indicatorDuration is
 *  the number of frames and 60 frames is 1 second.
 */
function fadeOutIndicator() {
	if (timer - indicatorStartTime > indicatorDuration) {
		keyPressFillAlpha -= opacityIncrease;
	}
	
	if (keyPressFillAlpha < 0) {
		keyPressFillAlpha = 0;
	}
}

/**
 * Draws a blue center dot when a click is registered.
 * Alpha/opacity is controlled by fadeOutIndicator.
 */
function drawKeyPressIndicator() {
	fadeOutIndicator();
	
	// Blue: "#2846BE"
	fill(40, 70, 190, keyPressFillAlpha);
	
	noStroke();
	ellipse(width / 2, height / 2, 13);
	
	fill(0, 255);
}

/**
 * Records the current values and positions of the halves.
 */
function recordCurrentResults() {
	let fullWidth = cW;
	let fullHeight = cH;
	
	if (currentAxis === 'x') {
		fullWidth = cW * 2;
	}
	else {
		fullHeight = cH * 2;
	}
	
	if (leftEyeTestInProgress) {
		xCoordinateLeft = cX;
		yCoordinateLeft = cY;
		widthLeft = fullWidth;
		heightLeft = fullHeight;
	}
	else {
		xCoordinateRight = cX;
		yCoordinateRight = cY;
		widthRight = fullWidth;
		heightRight = fullHeight;
	}
}

// TODO: Refactor to more intuitive method name (maybe reset()?)
function transitionToNextEye() {
	if (!leftEyeTestInProgress) {
		testFinished = true;
		return;
	}
	
	currentAxis = 'x';
	cX = 0;
	cY = 0;
	cW = canvasSize / 2;
	cH = canvasSize;
	
	iterations = 7;
	indicatorStartTime = 0;
	
	leftEyeTestInProgress = false;
	waitingToStart = true;
	
	canvasRef.hide();
	document.getElementById("rightEyeInstruct").style.display = "block";
}


/**
 * Draws a black dot at the center of canvas.
 */
function drawCenterDot() {
	fill(0);
	noStroke();
	ellipse(canvasSize / 2, canvasSize / 2, 13);
}

/**
 * Draws an outline around the canvas.
 */
function drawStaticBorder() {
	noFill();
	strokeWeight(10);
	stroke(0);
	rect(0, 0, width, height);
}

/**
 * Draws the bars that were clicked during the Left eye test.
 */
function showResults() {
	let xL = xCoordinateLeft;
	let yL = yCoordinateLeft;
	let wL = widthLeft;
	let hL = heightLeft;
	
	let xR = xCoordinateRight;
	let yR = yCoordinateRight;
	let wR = widthRight;
	let hR = heightRight;
	
	noStroke();
	fill(240, 90, 40, 50);
	rect(xL, yL, wL, hL);
	
	fill(240, 90, 40, 50);
	rect(xR, yR, wR, hR);
}

/**
 * Once the test is finished, this function will un-hide the buttons that
 *    allow the user to choose to upload their results to their database or exit.
 *
 * A "fade-in" method is used to gradually increase the opacity of the buttons
 *    instead of simply turning them on. The opacity is going from 0% to 100% at increments
 *    of 1% that occurs every n-milliseconds as defined by fadeInSpeed.
 */
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

/**
 * Formats the relevant results data into a JSON.
 */
function getFractalResults() {
	return {
		"TestName": "fractal",
		"TimeStampMS": timestamp,
		"TestCanvasSize": canvasSize,
		"LeftXCoordinate": xCoordinateLeft,
		"LeftYCoordinate": yCoordinateLeft,
		"LeftWidth": widthLeft,
		"LeftHeight": heightLeft,
		"RightXCoordinate": xCoordinateRight,
		"RightYCoordinate": yCoordinateRight,
		"RightWidth": widthRight,
		"RightHeight": heightRight,
	}
}