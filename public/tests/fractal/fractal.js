// TODO: Update docstrings
// TODO: Add pause or confirmation before switching eyes
// TODO: When drawing the results at the end, the first Left Y is black

let timestamp;						// Will record the time the test was started (in milliseconds since Epoch)
let backgroundColor = 220;			// Greyscale color for canvas background (0:Black, 255:White)
let barFillAlpha = 0;				// Will control the bars' alpha
let opacityIncrease = 15;			// How much to incrementally increase bar opacity
let keyPressFillAlpha = 0;				// Will control the click indicator's alpha

let timer = 0;						// Frame counter
let sec = 2;						// Seconds between showing each bar
let indicatorStartTime = 0;			// Will track the current timer value when a click is registered
let indicatorDuration = 65;			// How many frames to show the indicator (60 frames is 1 second)

let posQueue = [];					// Holds the randomly-shuffled locations to draw the bars


let xLocationLeft = [];				// LEFT EYE: X locations at the time of a click event
let yLocationLeft = [];				// LEFT EYE: Y locations at the time of a click event
let xLocationRight = [];			// RIGHT EYE: X locations at the time of a click event
let yLocationRight = [];			// RIGHT EYE: Y locations at the time of a click event

// let numBars = 40;					// How many bars to draw
// let barW;							// How thick each bar will be (is a function of numbers of bars vs canvas size)
let canvasSize = 800;				// Size of width and height of the canvas (in pixels)

let verticalInProgress = true;		// Indicates whether bars are currently being drawn vertically or horizontally
let leftEyeTestInProgress = true;	// Indicates if bars are currently being drawn vertically or horizontally

let waitingToStart = true;			// Status indicator: Waiting for user to click "Start (X) Eye" button
let testFinished = false;			// Status indicator: Waiting for user to click "Start (X) Eye" button

let canvasRef;						// Reference object to the DOM canvas element

let inputReceived = false;		// Disables click if one was already received for current bar being shown

// NOTE: Testing out using 'c' instead of 'current'
let currentAxis = 'x';
let cX = 0;
let cY = 0;
let cW = canvasSize / 2;
let cH = canvasSize;

/**
 * Note: This function runs after user clicks button on instructions page.
 * 	Upon page loading, setup() and draw() both run once.
 */
function startTest() {
	// CURRENT: Line 51 is undefined
	console.log("START");
	canvasRef.show();
	waitingToStart = false;
	loop();
}

/**
 * Runs once upon page loading.
 * Sets up the canvas, sets background color, initializes the positions queue,
 * 	and records current time.
 */
function setup() {
	// canvasRef = createCanvas(canvasSize, canvasSize);
	canvasRef = createCanvas(800, 800);
	canvasRef.id('canvasRef');
	timestamp = Date.now();
	
	currentAxis = 'x';
	
	canvasRef.hide();
	console.log("SETUP");
	noLoop();
}

/**
 * Runs 60 times each second. Is the main game controller.
 * drawStaticGrid: Draws the grid (called first so other items can be drawn on top of it)
 *
 * If the test IS NOT done:
 * 		- Updates the next bar position every n-seconds. (n set by "sec" variable)
 * 		- Draws the bar.
 * 		- Increment the timer counter.
 *
 * If test IS done:
 * 		- Show results by drawing bars at the positions that were clicked.
 *
 * If transition is TRUE:
 * 		- Wait for the user to click the button before next test round.
 *
 * Always:
 * 		- Draw the center black dot.
 * 		- Draw the border around the canvas.
 */
function draw() {
	if (waitingToStart) {
		// Force draw not to execute
		return;
	}
	background(backgroundColor);
	
	if (testFinished) {
		showLeftResults();
		showRightResults();
		showExitButton();
		noLoop();
	}
	
	if (inputReceived) {
		updateAll();
		// switchAxis
	}
	
	drawBar();
	drawCenterDot();
	drawKeyPressIndicator();
	drawStaticBorder();
	
	timer++;
}


function keyPressed() {
	if (waitingToStart || inputReceived || testFinished) {
		return;
	}
	
	// CHECK: Might be easier to just use leftEyeTestInProgress to set JSON value
	if (leftEyeTestInProgress) {
		if (currentAxis === 'x') {
			
			
			if (keyCode === LEFT_ARROW) {
				console.log("X Axis - KeyPress: LEFT ARROW");
				cH = cH / 2;
				currentAxis = 'y';
			}
			else if (keyCode === RIGHT_ARROW) {
				console.log("X Axis - KeyPress: RIGHT ARROW");
				cH = cH / 2;
				cX = cX + cW;
				currentAxis = 'y';
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
			}
			else if (keyCode === DOWN_ARROW) {
				console.log("Y Axis - KeyPress: UP ARROW");
				currentAxis = 'x';
				cW = cW / 2;
				cY = cY + cH;
			}
			else {
				console.log("Y Axis - KeyPress Other: " + keyCode);
			}
		}
	}
	else {
	
	}
	
	indicatorStartTime = timer;
	keyPressFillAlpha = 255;
	
	return false; // prevent any default behaviour (P5.js reference recommendation)
}

/**
 * Incrementally increases the Alpha (opacity) of the bar fill color. This will
 * 		create an animation that makes it look like a single bar is fading in.
 * 		Maximum alpha/opacity value is 255.
 */
function fadeInBar() {
	barFillAlpha += opacityIncrease;
	
	if (barFillAlpha > 255) {
		barFillAlpha = 255;
	}
}

function drawBar() {
	if (waitingToStart || testFinished) {
		return;
	}
	let barColor;
	
	noStroke();
	fadeInBar();
	
	if (currentAxis === 'x') {
		// Orange: "rgb(240, 90, 40)"
		barColor = color(240, 90, 40);
		barColor.setAlpha(barFillAlpha);
		fill(barColor);
		rect(cX, cY, cW, cH);
		
		// Blue: "rgb(27, 160, 150)"
		barColor = color(27, 160, 150);
		barColor.setAlpha(barFillAlpha);
		fill(barColor);
		rect(cX + cW, cY, cW, cH);
		
		console.log("cX + cW: " + (cX + cW));
	}
	else if (currentAxis === 'y') {
		// Orange: "rgb(240, 90, 40)"
		barColor = color(240, 90, 40);
		barColor.setAlpha(barFillAlpha);
		fill(barColor);
		rect(cX, cY, cW, cH);
		
		// Blue: "rgb(27, 160, 150)"
		barColor = color(27, 160, 150);
		barColor.setAlpha(barFillAlpha);
		fill(barColor);
		rect(cX, cY + cH, cW, cH);
	}
	else {
		// Uncomment below if needed for debugging
		// console.log("drawBar called when currentAxis not 'X' or 'Y'");
	}
}

/**
 * Fires off the events that occur every n-seconds of the test (n set by "sec" variable)
 */
function updateAll() {
	loadNextBarPos();
	inputReceived = false;
	barFillAlpha = 0;
}

function switchToYAxis(whichSide) {
	cH = cH / 2;
	
	if (whichSide === "right") {
		cX = cX + cW;
	}
}

function switchToXAxis(whichSide) {
	cW = cW / 2;
	
	if (whichSide === "down") {
		cY = cY + cH;
	}
}

// TODO: Refactor to more intuitive method name (maybe reset()?)
function transitionToNextEye() {
	leftEyeTestInProgress = false;
	waitingToStart = true;
	
	indicatorStartTime = 0;
	// timer = 0;
	noLoop();
	canvasRef.hide();
	document.getElementById("rightEyeInstruct").style.display = "block";
}

/**
 * Draws a grid by using vertical/horizontal black lines.
 * The number of lines was taken from example Amsler Grid Tests.
 */
function drawStaticGrid() {
	fill(0);
	noStroke();
	
	var interval = width / 20;
	
	// Vertical grid lines
	for (let i = 0; i < 20; i++) {
		rect((i * interval), 0, 1, height);
	}
	
	// Horizontal grid lines
	for (let i = 0; i < 20; i++) {
		rect(0, (i * interval), width, 1);
	}
}

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
	
	// Hex: "#2846be"
	fill(40, 70, 190, keyPressFillAlpha);
	
	strokeWeight(2);
	stroke(backgroundColor);
	ellipse(width / 2, height / 2, 20);
	
	fill(0, 255);
}

/**
 * Draws a black dot with grey outline (that matches canvas color) at the center of canvas.
 */
function drawCenterDot() {
	fill(0);
	strokeWeight(2);
	stroke(backgroundColor);
	ellipse(width / 2, height / 2, 20);
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
function showLeftResults() {
	let numClickedX = xLocationLeft.length;
	let numClickedY = yLocationLeft.length;
	
	let barW = width / 20;
	
	for (let i = 0; i < numClickedX; i++) {
		let x = xLocationLeft[i];
		noStroke();
		fill(255, 194, 114, 50);
		rect(x, 0, barW, height);
	}
	
	for (let i = 0; i < numClickedY; i++) {
		let y = yLocationLeft[i];
		noStroke();
		fill(255, 194, 114, 50);
		rect(0, y, width, barW);
	}
}

/**
 * Draws the bars that were clicked during the Right eye test.
 */
function showRightResults() {
	let numClickedX = xLocationRight.length;
	let numClickedY = yLocationRight.length;
	
	let barW = width / 20;
	
	for (let i = 0; i < numClickedX; i++) {
		let x = xLocationRight[i];
		noStroke();
		fill(133, 114, 255, 50);
		rect(x, 0, barW, height);
	}
	
	for (let i = 0; i < numClickedY; i++) {
		let y = yLocationRight[i];
		noStroke();
		fill(133, 114, 255, 50);
		rect(0, y, width, barW);
	}
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
function getFullBarsResults() {
	return {
		"TestName": "full_bars",
		"TimeStampMS": timestamp,
		"TestCanvasSize": canvasSize,
		"LeftXLocations": xLocationLeft,
		"LeftYLocations": yLocationLeft,
		"RightXLocations": xLocationRight,
		"RightYLocations": yLocationRight
	}
}