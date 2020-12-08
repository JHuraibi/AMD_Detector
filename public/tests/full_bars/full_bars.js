//--------------------------------------------------------------------------------------------------------------------//
// NOTE: This test is implemented using P5.js
// P5.js Reference: https://p5js.org/reference/
//
// NOTE: P5.js's fill() can be called at any point and sets the color (and optionally opacity) for EVERYTHING
// 			drawn to the canvas. So all new objects will be drawn in the same color until another fill() call is made.
//			This applies to only P5-related function calls and drawing,
//					e.g. Does NOT apply for showLeftResults() and showRightResults()
//
// NOTE: Upon the HTML page loading, setup() and draw() both run once automatically.
//--------------------------------------------------------------------------------------------------------------------//

let canvasRef;						// Reference object to the DOM canvas element
let timestamp;						// Will record the time the test was started (in milliseconds since Epoch)
let backgroundColor = 240;			// Greyscale color for canvas background (0:Black, 255:White)
let barFillAlpha = 0;				// Will control the bars' alpha
let opacityIncrease = 15;			// How much to incrementally increase bar opacity
let clickFillAlpha = 0;				// Will control the click indicator's alpha

let timer = 0;						// Frame counter
let sec = 2;						// Seconds between showing each bar
let indicatorStartTime = 0;			// Akin to a stopwatch for the click indicator
let indicatorDuration = 65;			// How many frames to show the indicator (60 frames is 1 second)

let posQueue = [];					// Holds the randomly-shuffled locations to draw the bars
let currentPos = 0;					// X or Y coordinate value to draw the next bar at
let currentAxis = 0;				// X or Y axis to draw the next bar on

let xLocationLeft = [];				// LEFT EYE: X locations at the time of a click event
let yLocationLeft = [];				// LEFT EYE: Y locations at the time of a click event
let xLocationRight = [];			// RIGHT EYE: X locations at the time of a click event
let yLocationRight = [];			// RIGHT EYE: Y locations at the time of a click event

// let numBars = 40;					// How many bars to draw
let numBars = 4;			// !! FOR TESTING/FOR BRIEF INSTRUCTIONAL VIDEO

// let barW;							// How thick each bar will be (is a function of numbers of bars vs canvas size)
let barW = 20;				// !! FOR TESTING
let canvasSize = 700;				// Size of width and height of the canvas (in pixels)

let clickUsedThisRound = false;		// Disables click if one was already received for current bar being shown
let verticalInProgress = true;		// Indicates whether bars are currently being drawn vertically or horizontally
let leftEyeInProgress = true;		// Indicates if the left eye test is being ran
let rightEyeInProgress = false;		// Indicates if the right eye test is being ran
let doNotTestLeft = false;			// Disables the left eye test in event user chooses only to test their right eye
let doNotTestRight = false;			// Disables the right eye test in event user chooses only to test their right eye

let waitingToStart = true;			// Status indicator: Waiting for user to click "Start <X> Eye" button
let testFinished = false;			// Status indicator: Testing complete


/**
 * Sets up the boolean variables to control only a left eye test.
 * Unhides the canvas.
 */
function setupForLeftEyeOnly() {
	leftEyeInProgress = true;
	doNotTestLeft = false;
	doNotTestRight = true;
	canvasRef.show();
}

/**
 * Sets up the boolean variables to control only a right eye test.
 * Unhides the canvas.
 */
function setupForRightEyeOnly() {
	leftEyeInProgress = false;
	rightEyeInProgress = true;
	doNotTestLeft = true;
	doNotTestRight = false;
	canvasRef.show();
}

/**
 * Sets up the boolean variables to control both a left and right eye test.
 * Unhides the canvas.
 */
function setupForBothEyes() {
	leftEyeInProgress = true;
	rightEyeInProgress = false;
	doNotTestLeft = false;
	doNotTestRight = false;
	canvasRef.show();
}

/**
 *
 * Hides the "Start Test" button. Records the current time and fills
 * 	the position queue. Starts automatic looping of draw(). Hides the
 * "Start Test" button. This function runs after user clicks button on instructions page.
 */
function startTest() {
	document.getElementById("startTestBtn").style.display = "none";
	
	canvasRef.show();
	waitingToStart = false;
	timestamp = Date.now();
	fillPositionQueue();
	loop();
}

/**
 * Similar to startTest().
 * Hides the right eye prompt div (id="nextEye").
 * 	Unhides the test canvas. Enables canvas to update via
 * 	setting waitingToStart to false. Fills the position queue.
 * 	And finally, starts automatic looping of draw().
 */
function startRightTest() {
	document.getElementById("nextEye").style.display = "none";
	
	canvasRef.show();
	waitingToStart = false;
	fillPositionQueue();
	loop();
}

/**
 * Halts the automatic looping of draw(), sets up the canvas,
 * 	creates a new canvas and a reference to it,
 * 	calculates the width of the bars to be drawn, fills the position queue,
 * 	and hides the canvas until user is ready to start (unhidden by startTest()).
 * Runs once upon page loading.
 */
function setup() {
	// canvasRef = createCanvas(canvasSize, canvasSize);
	canvasRef = createCanvas(canvasSize, canvasSize);
	canvasRef.id('canvasRef');
	
	// barW = canvasSize / numBars;
	currentAxis = 'x';
	
	// numBars needs to be a multiple of 2
	if (numBars % 2 !== 0) {
		numBars--;
	}
	
	background(backgroundColor);
	drawCenterDot();
	drawStaticBorder();
	canvasRef.hide();
	
	noLoop();
}

/**
 * Main test controller. Automatically loops 60 times per second.
 * If waitingToStart is true:
 * 	- Prematurely returns so that nothing is attempted to be drawn to the canvas.
 *
 * Every n-seconds (n set by the "sec" variable)
 *  - Updates relevant items (See updateAll() docstring)
 *
 * Always (given not waiting to start or test done):
 * 	- Draw the current bar
 *  - Draw the static center dot and static canvas border
 *  - Draw the click indicator (if click registered)
 *  - Increment the timer
 */
function draw() {
	if (waitingToStart) {
		// Force draw() not to put anything onto the canvas
		return;
	}
	
	if (timer % (60 * sec) === 0) {
		updateAll();
	}
	
	background(backgroundColor);
	drawBar();
	drawCenterDot();
	drawClickIndicator();
	drawStaticBorder();
	
	timer++;
}

/**
 * Handles mouse click events.
 *
 * If a user already clicked for the current bar,
 * 	the test is waiting to start, OR the test is done:
 *  - Take no action.
 *
 * If the click was a mouse click other than a left click:
 * 	- Take no action.
 *
 * If leftEyeInProgress is TRUE:
 *  - Record the location of the currently-shown bar.
 *
 * If leftEyeInProgress is FALSE:
 *  - Record the location of the currently-shown bar.
 *
 * Always:
 *  - Set clickUsedThisRound to true
 *  - Set indicatorStartTime to true
 *  - Set the click indicators opacity to 255 (i.e. 100% opacity)
 */
function mousePressed() {
	if (clickUsedThisRound || waitingToStart || testFinished) {
		return;
	}
	
	if (mouseButton !== LEFT) {
		return;
	}
	
	if (leftEyeInProgress) {
		if (currentAxis === 'x') {
			xLocationLeft.push(currentPos);
			console.log("CLICK: Left X [[ VALUE: " + currentPos + " ]]");
		}
		else {
			yLocationLeft.push(currentPos);
			console.log("CLICK: Left Y [[ VALUE: " + currentPos + " ]]");
		}
	}
	else {
		if (currentAxis === 'x') {
			xLocationRight.push(currentPos);
			console.log("CLICK: Right X [[ VALUE: " + currentPos + " ]]");
		}
		else {
			yLocationRight.push(currentPos);
			console.log("CLICK: Right Y [[ VALUE: " + currentPos + " ]]");
		}
	}
	
	clickUsedThisRound = true;
	
	indicatorStartTime = timer;
	clickFillAlpha = 255;
}

// // !! TODO: Update docstring for the two different methods
// /**
//  * Fill Method #1
//  * Fills posQueue[] with the locations to draw the lines.
//  * To keep two bars from being drawn in the same place:
//  *    The width of the canvas is divided by number of bars. Each bar
//  *    is drawn at increments of this interval.
//  * posQueue is given values sequentially (1, 2, 3, ... numBars),
//  *    so it needs to be shuffled randomly to make the locations
//  *    of the bars random
//  */
// function fillPositionQueue() {
// 	let interval = (canvasSize / numBars);
//
// 	for (let i = 0; i < numBars; i++) {
// 		posQueue[i] = interval * i;
// 	}
//
// 	posQueue = shuffle(posQueue);
// }

/**
 * Fill Method #2
 * Fills posQueue[] with the locations to draw the lines.
 * To keep two bars from being drawn in the same place:
 *    The width of the canvas is divided by number of bars. Each bar
 *    is drawn at increments of this interval.
 * posQueue is given values sequentially (1, 2, 3, ... numBars),
 *    so it needs to be shuffled randomly to make the locations
 *    of the bars random
 */
function fillPositionQueue() {
	let interval = canvasSize / (numBars + 1);
	// console.log("[[ FILLING POS QUEUE ]]");
	for (let i = 0; i < numBars; i++) {
		posQueue[i] = interval * (i + 1);
		// console.log("[[ i: " + (i + 1) + " ]]");
	}

	posQueue = shuffle(posQueue);
}

/**
 * Incrementally increases the opacity of the bars fill color. This will
 * 		create an animation that makes it look as if the bar is fading in.
 * 		Maximum alpha/opacity value is 255.
 * 			i.e. Opacity 255 == 100%
 */
function updateOpacity() {
	barFillAlpha += opacityIncrease;
	
	if (barFillAlpha > 255) {
		barFillAlpha = 255;
	}
	
	fill(0, barFillAlpha);
}


/**
 * Draws a basic rectangle with its top-left corner drawn at currentPos. Whether drawn vertically or
 *    horizontally is controlled by currentAxis.
 *    When currentAxis === X:
 *        - currentPos is the position on the x-axis where to draw the next bar
 *        - Draw a rectangle that starts at x=currentPos and y=0,
 *            with width=barW, and length=height of the canvas
 *    When currentAxis === Y:
 *        - currentPos is the position on the y-axis where to draw the next bar
 *        - Draw a rectangle that starts at x=0 and y=currentPos,
 *            with width=width of the canvas, and length=barW
 */
function drawBar() {
	if (waitingToStart || testFinished) {
		return;
	}
	
	fill(0);
	noStroke();
	
	updateOpacity();
	
	if (currentAxis === 'x') {
		rect(currentPos, 0, barW, height);
	}
	else if (currentAxis === 'y') {
		rect(0, currentPos, width, barW);
	}
	else {
		// Uncomment below line if needed for debugging
		// console.log("drawBar called when currentAxis not 'X' or 'Y'");
	}
}

/**
 * Fires off the events that should occur every n-seconds of the test (n set by "sec" variable)
 */
function updateAll() {
	loadNextBarPos();
	clickUsedThisRound = false;
	barFillAlpha = 0;
}

/**
 * If the test is not done: gets the next position to draw the bar at.
 * 	If the position queue is empty, calls updateBarStatus().
 */
function loadNextBarPos() {
	// CHECK: Move contents to updateAll() ?
	if (!posQueue.length) {
		updateBarStatus();
	}
	
	if (!testFinished) {
		currentPos = Math.round(posQueue.pop());
	}
}

// TODO: Refactor function name
/**
 * Handles events to run when the position queue is/becomes empty. Flow control
 * 	is determined by which eye is currently being tested and also by
 * 	which eye(s) the user opted to test.
 * [1] Left Eye
 * 		- [A] Vertical Bars are done. Move on to horizontal bars.
 * 		- [B] Horizontal bars are done. Move to right eye (if user opted to test right eye).
 * 		- [C] Horizontal bars are done and user opted not to test right eye. Test is done.
 * [2] Right Eye
 * 		- [A] Vertical Bars are done. Move on to horizontal bars.
 * 		- [B] Horizontal bars are done. Test is done.
 */
function updateBarStatus() {
	// [1]
	if (leftEyeInProgress) {
		// [1A]
		if (verticalInProgress) {
			console.log("LEFT: SWITCHING TO HORIZONTAL");
			fillPositionQueue();
			switchAxis();
		}
		// [1B]
		else if (!verticalInProgress && !doNotTestRight) {
			console.log("LEFT: SWITCHING TO RIGHT EYE");
			switchAxis();
			transitionToNextEye();
		}
		// [1C]
		else {
			console.log("LEFT: DONE LEFT EYE. NO RIGHT EYE");
			endOfTestHandler();
		}
	}
	// [2]
	else if (rightEyeInProgress && !doNotTestRight) {
		// [2A]
		if (verticalInProgress) {
			console.log("RIGHT: SWITCHING TO HORIZONTAL");
			fillPositionQueue();
			switchAxis();
		}
		// [2B]
		else {
			console.log("RIGHT: DONE");
			endOfTestHandler();
		}
	}
	else {
		// !! CHECK: Does reaching this final else statement indicate a syntax error?
	}
}

/**
 * Toggles the axis on which the bars are currently being drawn.
 */
function switchAxis() {
	if (currentAxis === 'x') {
		currentAxis = 'y';
		verticalInProgress = false;
	}
	else {
		currentAxis = 'x';
		verticalInProgress = true;
	}
}

// TODO: Refactor to more intuitive method name (maybe reset()?)
/**
 *
 */
function transitionToNextEye() {
	leftEyeInProgress = false;
	rightEyeInProgress = true;
	waitingToStart = true;
	
	indicatorStartTime = 0;
	canvasRef.hide();
	noLoop();
	
	document.getElementById("startTest").style.display = "none";
	document.getElementById("nextEye").style.display = "block";
}

/**
 * Draws a black dot at the center of canvas. The dot is outlined in a gray color that is the same
 * 	as the canvas' background color.
 */
function drawCenterDot() {
	fill(0);
	
	strokeWeight(2);
	stroke(backgroundColor);
	ellipse(width / 2, height / 2, 15);
}

/**
 * Draws a blue center dot when a click is registered. Opacity is updated by fadeOutIndicator().
 */
function drawClickIndicator() {
	fadeOutIndicator();
	
	// Hex: "#2846be"
	fill(40, 70, 190, clickFillAlpha);
	
	strokeWeight(2);
	stroke(backgroundColor);
	ellipse(width / 2, height / 2, 15);
	
	fill(0, 255);	// Sets canvas coloring back to black
}

/**
 * Incrementally decreases the opacity of the click indicator fill color. This will
 * 	create an animation that makes it look like the indicator is fading out.
 * 	Minimum alpha/opacity value is 0.
 * Fading out will start once timer has n-frames have passed. Where indicatorDuration is
 *  the number of frames and 60 frames is 1 second.
 */
function fadeOutIndicator() {
	if (timer - indicatorStartTime > indicatorDuration) {
		clickFillAlpha -= opacityIncrease;
	}
	
	if (clickFillAlpha < 0) {
		clickFillAlpha = 0;
	}
}

/**
 * Draws an outline around the canvas.
 */
function drawStaticBorder() {
	noFill();
	strokeWeight(4);
	stroke(0);
	rect(0, 0, width, height);
}

function endOfTestHandler() {
	document.getElementById("resultsLabels").style.display = "inherit";
	testFinished = true;
	showExitButton();
	canvasRef.hide();
	noLoop();
	
	let ratioToTestCanvas = 0.5;
	let canvasLeft = document.getElementById("leftResultsCanvas");
	let canvasRight = document.getElementById("rightResultsCanvas");
	
	let ctxLeft = setupResultCanvas(canvasLeft, ratioToTestCanvas);
	let ctxRight = setupResultCanvas(canvasRight, ratioToTestCanvas);
	
	if (!doNotTestLeft) {
		showLeftResults(ctxLeft, ratioToTestCanvas);
	}
	
	if (!doNotTestRight) {
		showRightResults(ctxRight, ratioToTestCanvas);
	}
	
	drawResultCenterDot(ctxLeft, ratioToTestCanvas);
	drawResultCenterDot(ctxRight, ratioToTestCanvas);
}

function setupResultCanvas(canvas, ratio) {
	canvas.style.display = "inline-block";
	
	let resultCanvasSize = canvasSize * ratio;
	let ctx = canvas.getContext('2d');
	
	ctx.canvas.width = resultCanvasSize;
	ctx.canvas.height = resultCanvasSize;
	
	return ctx;
}

function drawResultCenterDot(ctx, ratio) {
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.arc(ctx.canvas.width / 2, ctx.canvas.width / 2, (15 / 2) * ratio, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Test finished: Draws the bars that were clicked during the Left eye test.
 */
function showLeftResults(ctx, ratio) {
	if (!ctx) {
		console.log("Invalid Left Canvas Context.");
		return;
	}
	
	let numClickedX = xLocationLeft.length;
	let numClickedY = yLocationLeft.length;
	
	let barL = ctx.canvas.width;
	let r = (barW / 2) / 10;		// !! MAXIMUM radius is half the bar's thickness. r is arbitrary
	ctx.fillStyle = "rgba(255, 194, 114, 0.5)";		// Light Yellow, 50% opacity
	
	for (let i = 0; i < numClickedX; i++) {
		let xPos = xLocationLeft[i];
		let x = xPos * ratio;
		let y = 0;
		let w = barW;
		let h = barL;
		
		// Draw shape as rectangle with rounded corners
		roundedRectangle(ctx, x, y, w, h, r);
	}
	
	for (let i = 0; i < numClickedY; i++) {
		let yPos = yLocationLeft[i];
		let x = 0;
		let y = yPos * ratio;
		let w = barL;
		let h = barW;
		
		// Draw shape as rectangle with rounded corners
		roundedRectangle(ctx, x, y, w, h, r);
	}
}

/**
 * Test finished: Draws the bars that were clicked during the Right eye test.
 */
function showRightResults(ctx, ratio) {
	if (!ctx) {
		console.log("Invalid Right Canvas Context.");
		return;
	}
	
	let numClickedX = xLocationRight.length;
	let numClickedY = yLocationRight.length;
	
	let barL = ctx.canvas.width;
	let r = (barW / 2) / 10;		// !! MAXIMUM radius is half the bar's thickness. r is arbitrary
	ctx.fillStyle = "rgba(133,114,255,0.5)";		// Light Purple, 50% opacity
	
	for (let i = 0; i < numClickedX; i++) {
		let xPos = xLocationRight[i];
		let x = xPos * ratio;
		let y = 0;
		let w = barW;
		let h = barL;
		
		// Draw shape as rectangle with rounded corners
		roundedRectangle(ctx, x, y, w, h, r);
	}
	
	for (let i = 0; i < numClickedY; i++) {
		let yPos = yLocationRight[i];
		let x = 0;
		let y = yPos * ratio;
		let w = barL;
		let h = barW;
		
		// Draw shape as rectangle with rounded corners
		roundedRectangle(ctx, x, y, w, h, r);
	}
}

// Similar to FullBarsDAO
function roundedRectangle(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
	
	ctx.fill();
}

/**
 * Once the test is finished, this function will unhide the buttons that
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
 * Exports the results of the test as a JSON object. Used to send the results
 * 	to FireStore.
 */
function getFullBarsResults() {
	return {
		"TestName": "full_bars",
		"TimeStampMS": timestamp,
		"TestCanvasSize": canvasSize,
		"LeftXLocations": xLocationLeft,
		"LeftYLocations": yLocationLeft,
		"RightXLocations": xLocationRight,
		"RightYLocations": yLocationRight,
	}
}