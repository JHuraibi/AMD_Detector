// TODO: Update docstrings
// TODO: Add pause or confirmation before switching eyes
// TODO: When drawing the results at the end, the first Left Y is black

let timestamp;						// Will record the time the test was started (in milliseconds since Epoch)
let backgroundColor = 220;			// Greyscale color for canvas background (0:Black, 255:White)
let barFillAlpha = 0;				// Will control the bars' alpha
let opacityIncrease = 15;			// How much to incrementally increase bar opacity
let clickFillAlpha = 0;				// Will control the click indicator's alpha

let timer = 0;						// Frame counter
let sec = 2;						// Seconds between showing each bar
let indicatorStartTime = 0;			// Will track the current timer value when a click is registered
let indicatorDuration = 65;			// How many frames to show the indicator (60 frames is 1 second)

let posQueue = [];					// Holds the randomly-shuffled locations to draw the bars
let currentPos = 0;					// X or Y coordinate value to draw the next bar at
let currentAxis = 0;				// X or Y axis to draw the next bar on

let xLocationLeft = [];				// LEFT EYE: X locations at the time of a click event
let yLocationLeft = [];				// LEFT EYE: Y locations at the time of a click event
let xLocationRight = [];			// RIGHT EYE: X locations at the time of a click event
let yLocationRight = [];			// RIGHT EYE: Y locations at the time of a click event

let numBars = 40;					// How many bars to draw
let barW;							// How thick each bar will be (is a function of numbers of bars vs canvas size)
let canvasSize = 800;				// Size of width and height of the canvas (in pixels)

let clickUsedThisRound = false;		// Disables click if one was already received for current bar being shown
let verticalInProgress = true;		// Indicates whether bars are currently being drawn vertically or horizontally
let leftEyeTestInProgress = true;	// Indicates if bars are currently being drawn vertically or horizontally

let waitingToStart = true;			// Status indicator: Waiting for user to click "Start (X) Eye" button
let testFinished = false;			// Status indicator: Waiting for user to click "Start (X) Eye" button

let canvasRef;						// Reference object to the DOM canvas element

/**
 * Note: This function runs after user clicks button on instructions page.
 * 	Upon page loading, setup() and draw() both run once.
 */
function startTest() {
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
	noLoop();
	canvasRef = createCanvas(800, 800);
	canvasRef.id('canvasRef');
	timestamp = Date.now();
	
	barW = canvasSize / numBars;
	currentAxis = 'x';
	
	// numBars needs to be a multiple of 2
	if (numBars % 2 !== 0) {
		numBars--;
	}
	
	fillPositionQueue();
	
	canvasRef.hide();
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
	
	if (timer % (60 * sec) === 0) {
		updateAll();
	}
	
	drawBar();
	drawCenterDot();
	drawClickIndicator();
	drawStaticBorder();
	
	timer++;
}

/**
 * Records the location of the currently-shown bar whenever a click is registered.
 * Will handle multiple clicks for the same bar by using a boolean click listener.
 *
 * If testFinished (i.e. the test is over)
 * 		Take no action.
 *
 * If clickUsedThisRound (user already clicked this iteration)
 * 		Take no action.
 *
 * If testOneInProgress is TRUE:
 *		The user is doing the test for their LEFT eye.
 *
 * If testOneInProgress is FALSE:
 *		The user is doing the test for their RIGHT eye.
 */
function mousePressed() {
	if (waitingToStart || clickUsedThisRound || testFinished) {
		return;
	}
	
	if (leftEyeTestInProgress) {
		if (currentAxis === 'x') {
			xLocationLeft.push(currentPos);
			console.log("CLICK: Left X");
		}
		else {
			yLocationLeft.push(currentPos);
			console.log("CLICK: Left Y");
		}
	}
	else {
		if (currentAxis === 'x') {
			xLocationRight.push(currentPos);
			console.log("CLICK: Right X");
		}
		else {
			yLocationRight.push(currentPos);
			console.log("CLICK: Right Y");
		}
	}
	
	clickUsedThisRound = true;
	
	indicatorStartTime = timer;
	clickFillAlpha = 255;
}

/**
 * Fills posQueue[] with the locations to draw the lines.
 * To keep two bars from being drawn in the same place:
 *    Divide the width of the canvas by number of bars to get an interval,
 *    then draw each bar at increments of this interval.
 * posQueue is given values sequentially (1, 2, 3, ... numBars),
 *    so it needs to be shuffled randomly to make the locations
 *    of the bars random
 */
function fillPositionQueue() {
	// TODO: Don't draw bars at edges of canvas?
	let interval = (canvasSize / numBars);
	
	for (let i = 0; i < numBars; i++) {
		posQueue[i] = interval * i;
	}
	
	posQueue = shuffle(posQueue);
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
	
	fill(0, barFillAlpha);
}


/**
 * Draws a basic rectangle at currentPos. Whether drawn vertically or
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
	
	// let barW = (width / 50);
	
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
		// Uncomment below if needed for debugging
		// console.log("drawBar called when currentAxis not 'X' or 'Y'");
	}
}

/**
 * Fires off the events that occur every n-seconds of the test (n set by "sec" variable)
 */
function updateAll() {
	loadNextBarPos();
	clickUsedThisRound = false;
	barFillAlpha = 0;
}

function loadNextBarPos() {
	if (!posQueue.length) {
		updateBarStatus();
	}
	
	if (!testFinished) {
		currentPos = Math.round(posQueue.pop());
	}
}

// CHECK: Consider alternative if/else replacement:
//			toggleVerticalHorizontal() {vertical = !vertical; horizontal = !horizontal;}
//				if (leftEye && vertical) {toggle(); switchAxis();}
//				if (leftEye && !vertical) {toggle(); transition();}
//				if (rightEye && vertical) {toggle(); switchAxis();}
//				if (rightEye && !vertical) {toggle(); endTest();}
/**
 * Handles events to run when the position queue becomes empty.
 * [1] Left Eye
 * 		- [A] Vertical Bars are done. Move on to horizontal bars.
 * 		- [B] Horizontal bars are done. Move to right eye.
 * [2] Right Eye
 * 		- [A] Vertical Bars are done. Move on to horizontal bars.
 * 		- [B] Horizontal bars are done. Test is done.
 */
function updateBarStatus() {
	// [1]
	if (leftEyeTestInProgress) {
		// [1A]
		if (verticalInProgress) {
			fillPositionQueue();
			switchAxis();
		}
		// [1B]
		else {
			fillPositionQueue();
			switchAxis();
			transitionToNextEye();
		}
	}
	// [2]
	else {
		// [2A]
		if (verticalInProgress) {
			fillPositionQueue();
			switchAxis();
		}
		// [2B]
		else {
			testFinished = true;
		}
	}
}

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
		clickFillAlpha -= opacityIncrease;
	}
	
	if (clickFillAlpha < 0) {
		clickFillAlpha = 0;
	}
}

/**
 * Draws a blue center dot when a click is registered.
 * Alpha/opacity is controlled by fadeOutIndicator.
 */
function drawClickIndicator() {
	fadeOutIndicator();
	
	// Hex: "#2846be"
	fill(40, 70, 190, clickFillAlpha);
	
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