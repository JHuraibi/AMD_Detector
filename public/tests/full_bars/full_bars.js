let numBars = 4;
let queue = [];
let timer = 0;
let xClickLocations = [];
let yClickLocations = [];
let clickPos = 0;

let gameFinished = false;
let xBarsDone = false;

let sec = 2;					// Seconds between showing each bar
let currentPos = 0;				// X or Y value to draw the next bar at

function setup() {
	createCanvas(800, 800);
	background(150);
	initializeQueue();
}

// Would a router switch statement be easier to read?
function draw() {
	background(150);

	drawStaticGrid();				// Draw first so other items can be drawn on top of it

	if (!gameFinished) {

		if (timer % (60 * sec) === 0) {
			loadNextBar();
		}

		drawBar();
		timer++;
	}
	else {
		drawClickedBars();
	}

	drawCenterDot();				// Draw center dot last so it is always visible (i.e. nothing drawn over it)
	drawStaticBorder();				// ^^ Same with the border.
}

function mousePressed() {
	if (!xBarsDone) {
		if (xClickLocations[clickPos] !== currentPos) {
			xClickLocations[clickPos] = currentPos;
			clickPos++;
		}
	}
	else {
		if (yClickLocations[clickPos] !== currentPos) {
			yClickLocations[clickPos] = currentPos;
			clickPos++;
		}
	}
}

function drawStaticBorder() {
	noFill();
	strokeWeight(10);
	stroke(0);
	rect(0, 0, width, height);
}

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

function drawCenterDot() {
	fill(0);
	strokeWeight(2);
	stroke(255);
	ellipse(width / 2, height / 2, 20);
}

function drawBar() {
	fill(0);

	let barW = width / 20;
	noStroke();

	if (!xBarsDone) {
		rect(currentPos, 0, barW, height);
	}
	else {
		rect(0, currentPos, width, barW);
	}
}

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

function initializeQueue() {
	console.log("Queue Empty. Repopulating.");

	for (let i = 0; i < numBars; i++) {
		queue[i] = (width / numBars) * i;
	}

	queue = shuffle(queue);
}

function loadNextBar() {
	if (queue.length <= 0) {
		if (xBarsDone === false) {
			initializeQueue();
			clickPos = 0;
			xBarsDone = true;

			console.log("Vertical Bars (x) DONE");
		}
	}
	else if (queue.length <= 0) {
		if (xBarsDone === true) {
			console.log("Horizontal Bars (Y) DONE");
			gameFinished = true;
		}
	}

	currentPos = queue.pop();
}