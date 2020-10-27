// TODO: Add pause or confirmation before switching eyes
// TODO: When drawing the results at the end, the first Left Y is black


let timestamp;					// Will record the time the test was started (in milliseconds since Epoch)
let canvasSize = 0;				// Will record the size of the canvas the test was taken at
let backgroundColor = 220;		// Greyscale color for canvas background (0:Black, 255:White)
let barFillAlpha = 0;			// Will control the bars' alpha
let opacityIncrease = 15;		// How much to incrementally increase bar opacity
let clickFillAlpha = 255;		// Will control the click indicator's alpha
let opacityDecrease = 5;		// How much to incrementally decrease click indicator opacity

let timer = 1;					// Frame counter (start at 1 to avoid "if (timer % (60 * sec) === 0)" being true)
let sec = 2;					// Seconds between showing each bar
let indicatorTimer = 0;			// Will track the current timer value when a click is registered
let indicatorDuration = 45;		// How many frames to show the indicator (60 frames is 1 second)

let posQueue = [];				// Holds the randomly-shuffled locations to draw the bars
let currentPos = 0;				// X or Y coordinate value to draw the next bar at
let currentAxis = 0;			// X or Y axis to draw the next bar on

let xLocationLeft = [];			// LEFT EYE: Clicked X locations
let yLocationLeft = [];			// LEFT EYE: Clicked Y locations
let xLocationRight = [];		// RIGHT EYE: Clicked X locations
let yLocationRight = [];		// RIGHT EYE: Clicked Y locations

let numBars = 6;				// !! numBars HAS TO BE A MULTIPLE OF 2
let barsCounter = 0;			// Used to determine when half bars are drawn (thus switch bar axis)

let clickUsedThisRound = false;

let leftEyeTestInProgress = true;
let transition = false;
let testFinished = false;


/**
 * Runs once upon page loading.
 * Sets up the canvas, sets background color, initializes the positions queue,
 * 	and records current time.
 */
function setup() {
	createCanvas(800, 800);
	fillPositionQueue();
	timestamp = Date.now();
	// !! TODO: This variable needs to be updated when dynamic canvas size is implemented
	canvasSize = 800;
	
	// NOTE: The button's label text may need to be different based on
	//		how we implement the user's option to select which eye to test
	// transitionButton = createButton('Start Left Eye');
	// transitionButton.position(width / 2, height / 2);
	// transitionButton.mousePressed(function () {
	// 	transition = false;
	// });
	//
	// transitionButton.style.display = "none";
	
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
	background(backgroundColor);
	
	if (testFinished) {
		showLeftResults();
		showRightResults();
		showExitButton();
		noLoop();
		console.log("TEST DONE");
	}
	
	if (timer % (60 * sec) === 0) {
		updateAll();
	}
	
	drawBar();
	timer++;
	
	
	drawCenterDot();
	drawClickIndicator();
	drawStaticBorder();
}

function startFirstEye() {
	
	loop();
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
	if (testFinished) {
		return;
	}
	
	if (clickUsedThisRound) {
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
	
	indicatorTimer = timer;
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
	var interval = (width / numBars);
	
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
function fadeInBar() {
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
	let barW = (width / 80);
	
	fill(0);
	noStroke();
	
	fadeInBar();
	
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
	setNextBarAxis();
	loadNextBarPos();
	clickUsedThisRound = false;
	barFillAlpha = 0;
	barsCounter++;
}

/**
 * Pops off the next coordinate from posQueue[]. This is where the next bar will be drawn.
 * If leftEyeTestInProgress is TRUE and posQueue is EMPTY:
 * 		- Refills queue with new values.
 * 		- Sets leftEyeTestInProgress to false.
 * 		- Resets barsCounter
 * If leftEyeTestInProgress is FALSE and posQueue is EMPTY:
 * 		Sets gameFinished boolean flag to true.
 * 		Exit the function.
 * Otherwise:
 * 		Set currentPos to where the next bar should be drawn (rounded to nearest whole).
 */
function loadNextBarPos() {
	if (!posQueue.length && leftEyeTestInProgress) {
		fillPositionQueue();
		transitionToNextEye();
	}
	else if (!posQueue.length && !leftEyeTestInProgress) {
		testFinished = true;
		return;
	}
	
	currentPos = Math.round(posQueue.pop());
}

/**
 * First half of bars will be drawn vertically (X-Axis).
 * Second half of bars will be drawn horizontally (Y-Axis).
 */
function setNextBarAxis() {
	let midPoint = numBars / 2;
	
	if (barsCounter > midPoint) {
		currentAxis = 'x';
	}
	else {
		currentAxis = 'y';
	}
}

function transitionToNextEye() {
	leftEyeTestInProgress = false;
	indicatorTimer = 0;
	barsCounter = 0;
	noLoop();
	
	document.getElementById("rightEye").style.display = "inherit";
}

/**
 * Wait for user to click the button to start the next eye test.
 */
function startNextTest() {
	loop();
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
 * 		create an animation that makes it look like the indicator is fading out.
 * 		Minimum alpha/opacity value is 0.
 */
function fadeOutIndicator() {
	if (timer - indicatorTimer > indicatorDuration) {
		clickFillAlpha -= opacityIncrease;
	}
	
	if (clickFillAlpha < 0) {
		clickFillAlpha = 0;
	}
	
	// Hex: "#2846be"
	fill(40, 70, 190, clickFillAlpha);
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
 *
 */
function drawClickIndicator() {
	fill('#a60019');
	fadeOutIndicator();
	
	strokeWeight(2);
	stroke(backgroundColor);
	ellipse(width / 2, height / 2, 20);
	
	fill(0, 255);
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
		
		console.log("X LOC LEFT: " + x);
	}
	
	for (let i = 0; i < numClickedY; i++) {
		let y = yLocationLeft[i];
		noStroke();
		fill(255, 194, 114, 50);
		rect(0, y, width, barW);
		
		console.log("Y LOC LEFT: " + y);
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
		
		console.log("X LOC RIGHT: " + x);
	}
	
	for (let i = 0; i < numClickedY; i++) {
		let y = yLocationRight[i];
		noStroke();
		fill(133, 114, 255, 50);
		rect(0, y, width, barW);
		
		console.log("Y LOC RIGHT: " + y);
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
	// console.log("Left-XLocations" + xLocationLeft);
	// console.log("Left-YLocations" + yLocationLeft);
	// console.log("Right-XLocations" + xLocationRight);
	// console.log("Right-YLocations" + yLocationRight);
	return {
		"TestName": "full_bars",
		"TimeStampMS": timestamp,
		"TestCanvasSize": canvasSize,
		"Left-XLocations": xLocationLeft,
		"Left-YLocations": yLocationLeft,
		"Right-XLocations": xLocationRight,
		"Right-YLocations": yLocationRight
	}
}