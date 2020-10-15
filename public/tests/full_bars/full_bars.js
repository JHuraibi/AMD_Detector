let numBars = 2; // VALUE 2 FOR TESTING

let posQueue = [];				// Holds the randomly-shuffled locations to draw the bars
let currentPos = 0;				// X or Y value to draw the next bar at

let xClickLocations = [];
let yClickLocations = [];
let validClickCount = 0;

let barFillAlpha = 0;			// Will control the alpha
let opacityIncrease = 15;		// How much to increase the opacity

let timer = 0;
let sec = 2;					// Seconds between showing each bar

let testFinished = false;
let xBarsDone = false;

let timestamp;					// Will record the time the test was started (in milliseconds since Epoch)


/**
 * Runs only once.
 * Sets up the canvas, sets background color, initializes the positions queue, and records current time.
 */
function setup() {
	createCanvas(800, 800);
	fillPositionQueue();
	timestamp = Date.now();
}

/**
 * Runs 60 times each second. Is the main game controller.
 * drawStaticGrid: Draws the grid (called first so other items can be drawn on top of it)
 *
 * If the game IS NOT done:
 *        Updates the next bar position every n-seconds. (n set by "sec" variable)
 *        Draws the bar.
 *        Increment the timer counter.
 *
 * If game IS done:
 *        [This is for debugging. Results probably won't immediately be shown to user after test]
 *        Show results by drawing the bars that were clicked.
 *
 * Always:
 *        Draw the center black dot.
 *        Draw the border around the canvas.
 */
function draw() {
	// TODO: Move the items within "else" below to their own function
	background(220);

	// drawStaticGrid();	// Grid

	if (!testFinished) {

		if (timer % (60 * sec) === 0) {
			loadNextBarPos();
			barFillAlpha = 0;
		}

		drawBar();
		timer++;
	}
	else {
		drawClickedBars();
		noLoop();
		showExitButton();
	}

	drawCenterDot();
	drawStaticBorder();
}

/**
 * Records the location of the currently-shown bar whenever a click is registered.
 * Will handle multiple clicks for the same bar by using validClickCounter as index to
 *    check that the most current array (xClickLocations or yClickLocations) index is
 *    not the same as the current bar. If the bar IS new, save its coordinate
 *    value and increment validClickCounter.
 *
 * If testFinished (i.e. the test is over)
 * 		Take no action if the user clicks.
 *
 * If xBarsDone is FALSE:
 *		This means vertical bars are still being shown, so add locations when clicked to xClickLocations.
 *
 * If xBarsDone is TRUE:
 *		This means horizontal bars are being shown, so add locations when clicked to yClickLocations.
 */
function mousePressed() {
	if (testFinished) {
		return;
	}

	if (!xBarsDone) {
		if (xClickLocations[validClickCount] !== currentPos) {
			xClickLocations[validClickCount] = currentPos;
			validClickCount++;
		}
	}
	else {
		if (yClickLocations[validClickCount] !== currentPos) {
			yClickLocations[validClickCount] = currentPos;
			validClickCount++;
		}
	}
}

/**
 * Loads posQueue[] with the locations to draw the lines.
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
 * Increases the Alpha (opacity) of the bar fill color. This will create
 * an animation illusion that makes it look like a single bar is fading in.
 */
function fadeIn() {
	barFillAlpha += opacityIncrease;

	if (barFillAlpha > 255) {
		barFillAlpha = 255;
	}

	fill(0, barFillAlpha);
}

/**
 * Draws a basic rectangle at currentPos. Whether drawn vertically or
 * 	horizontally is controlled by xBarsDone.
 * 	When xBarsDone is FALSE:
 * 		- currentPos is the position on the x-axis where to draw the next bar
 * 		- Draw a rectangle that starts at x=currentPos and y=0,
 * 			with width=barW, and length=height of the canvas
 * 	When xBarsDone is TRUE:
 * 		- currentPos is the position on the y-axis where to draw the next bar
 * 		- Draw a rectangle that starts at x=0 and y=currentPos,
 * 			with width=width of the canvas, and length=barW
 */
function drawBar() {
	fill(0);

	let barW = (width / 20) / 4;
	noStroke();

	fadeIn();

	if (!xBarsDone) {
		rect(currentPos, 0, barW, height);
	}
	else {
		rect(0, currentPos, width, barW);
	}
}

/**
 * Pops off the next coordinate from posQueue[]. This is where the next bar will be drawn.
 * If xBarsDone is TRUE and posQueue is EMPTY: Fills queue with new values. Resets clickCount. Sets xBarDone to true.
 * If xBarsDone is FALSE and posQueue is EMPTY: Sets gameFinished boolean flag to true. Exit the function.
 * Otherwise: Set currentPos to the value where the next bar should be drawn.
 */
function loadNextBarPos() {
	// TODO: Refactor (mainly how/where currentPos pops values)
	if (!xBarsDone) {
		if (!posQueue.length) {
			console.log("Vertical Bars (x) DONE");
			fillPositionQueue();
			validClickCount = 0;
			xBarsDone = true;
		}
	}
	else if (xBarsDone) {
		if (!posQueue.length) {
			console.log("Horizontal Bars (Y) DONE");
			testFinished = true;
			return;
		}
	}

	currentPos = posQueue.pop();
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
 * Draws a black dot with white outline at the center of canvas.
 */
function drawCenterDot() {
	fill(0);
	strokeWeight(2);
	stroke(255);
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
 * Debugging. Draws the bars that were clicked.
 */
function drawClickedBars() {
	let numClickedX = xClickLocations.length;
	let numClickedY = yClickLocations.length;

	let barW = width / 20;

	for (let i = 0; i < numClickedX; i++) {
		let x = xClickLocations[i];
		noStroke();
		fill(70, 0, 70, 50);
		rect(x, 0, barW, height);
	}

	for (let i = 0; i < numClickedY; i++) {
		let y = yClickLocations[i];
		noStroke();
		fill(70, 0, 70, 50);
		rect(0, y, width, barW);
	}
}

/**
 * Once the test is finished, this function will un-hide the buttons that
 * 	allow the user to choose to upload their results to their database or exit.
 *
 * A "fade-in" method is used to gradually increase the opacity of the buttons
 * 	instead of simply turning them on. The opacity is going from 0% to 100% at increments
 * 	of 1% that occurs every n-milliseconds as defined by fadeInSpeed.
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
			print(exitBtns.style.opacity);
		}
		else {
			// Clear the current timer and exit
			clearInterval(fadeIn);
		}
	}, fadeInSpeed);
}

/**
 * Formats the relevant data into a JSON.
 * @returns {{TestName: string, XLocations: [], TimeStampMS: Number, YLocations: []}}
 */
function getFullBarsResults() {
	return {
		"TestName": "full_bars",
		"TimeStampMS": timestamp,
		"XLocations": xClickLocations,
		"YLocations": yClickLocations
	}
}