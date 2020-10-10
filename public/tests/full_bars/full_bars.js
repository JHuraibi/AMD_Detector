let numBars = 6;
let posQueue = [];
let timer = 0;
let xClickLocations = [];
let yClickLocations = [];
let clickCount = 0;

let gameFinished = false;
let xBarsDone = false;

let currentPos = 0;				// X or Y value to draw the next bar at
let sec = 2;					// Seconds between showing each bar

// let barW = ...;				// TODO: Implement this variable once a grid size is agreed on

/**
 * Runs only once.
 * Sets up the canvas, sets background color, and initializes the positions queue.
 */
function setup() {
	createCanvas(800, 800);
	background(150);
	initializeQueue();
}

/**
 * Runs 60 times each second. Is the main game controller.
 * drawStaticGrid: Draws the grid (called first so other items can be drawn on top of it)
 *
 * If the game IS NOT done:
 * 		Updates the next bar position every n-seconds. (n set by "sec" variable)
 * 		Draws the bar.
 * 		Increment the timer counter.
 *
 * If game IS done:
 * 		[This is for debugging. Results probably won't immediately be shown to user after test]
 * 		Show results by drawing the bars that were clicked.
 *
 * 	Always done:
 * 		Draw the center black dot.
 * 		Draw the border around the canvas.
 */
function draw() {
	// TODO: Would a router-style switch statement be easier to read?
	background(150);

	drawStaticGrid();

	if (!gameFinished) {

		if (timer % (60 * sec) === 0) {
			loadNextBarPos();
		}

		drawBar();
		timer++;
	}
	else {
		drawClickedBars();
	}

	drawCenterDot();
	drawStaticBorder();
}

/**
 * Records the location of the currently-shown bar whenever a click is registered.
 * Will handle multiple clicks for the same bar by using clickCount as index to
 *	check that the most current array index is not the same as the current bar.
 *
 * If xBarsDone is FALSE:
 * 		This means vertical bars are being shown, so add location to xClickLocations[].
 *
 * If xBarsDone is TRUE:
 * 		This means horizontal bars are being shown, so add location to yClickLocations[].
 */
function mousePressed() {
	// TODO: May be safer to wrap within "if (!gameFinished)"
	if (!xBarsDone) {
		if (xClickLocations[clickCount] !== currentPos) {
			xClickLocations[clickCount] = currentPos;
			clickCount++;
		}
	}
	else {
		if (yClickLocations[clickCount] !== currentPos) {
			yClickLocations[clickCount] = currentPos;
			clickCount++;
		}
	}
}

/**
 * Loads posQueue[] with the locations to draw the lines.
 * To keep two bars from being drawn in the same place:
 * 	Divide the width of the canvas by number of bars to get an interval,
 * 	then draw each bar at increments of this interval.
 * posQueue is given values sequentially (1, 2, 3, ... numBars),
 * 	so it needs to be shuffled randomly to make the locations
 * 	of the bars random
 */
function initializeQueue() {
	// TODO: Don't draw bars at edges of canvas?
	var interval = (width / numBars);

	for (let i = 0; i < numBars; i++) {
		posQueue[i] = interval * i;
	}

	posQueue = shuffle(posQueue);
}

function drawBar() {
	fill(0);

	let barW = (width / 20) / 4;
	noStroke();

	if (!xBarsDone) {
		rect(currentPos, 0, barW, height);
	}
	else {
		rect(0, currentPos, width, barW);
	}
}

/**
 * Pops off the next coordinate from posQueue[]. This is where the next bar will be drawn.
 * If posQueue is empty and xBarsDone is TRUE: Reloads queue with new values. Resets clickCount.
 * If posQueue is empty and xBarsDone is FALSE: Sets gameFinished flag to true.
 */
function loadNextBarPos() {
	if (posQueue.length <= 0) {
		if (xBarsDone === false) {
			initializeQueue();
			clickCount = 0;
			xBarsDone = true;

			console.log("Vertical Bars (x) DONE");
		}
	}
	else if (posQueue.length <= 0) {
		if (xBarsDone === true) {
			console.log("Horizontal Bars (Y) DONE");
			gameFinished = true;
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