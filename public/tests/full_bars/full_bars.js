let numBars = 4;
let queue = [];
let timer = 0;
let barW = 20;
let current = 0;
let sec = 60;
let xLocations = [];
let yLocations = [];
let clickPos = 0;

let endGame = false;
let xDone = false;

function setup() {
	createCanvas(1000, 1000);
	background(150);
	initializeQueue();
}

function draw() {
	if (!endGame) {
		background(150);
		timer++;
		drawBar();

		if (timer % (1.5 * sec) == 0) {
			nextBar();
		}
	}
	else {
		background(240);
		drawAllBars();
	}
}

function mousePressed() {
	if (!xDone) {
		if (xLocations[clickPos] != current) {
			xLocations[clickPos] = current;
			clickPos++;
		}
	}
	else {
		if (yLocations[clickPos] != current) {
			yLocations[clickPos] = current;
			clickPos++;
		}
	}
}

function drawBar() {
	let c = barW;
	noStroke();

	if (!xDone) {
		fill(70, 0, 0);
		rect(current, 0, barW, height);
	}
	else {
		fill(0, 0, 70);
		rect(0, current, width, barW);
	}
}

function drawAllBars() {
	let numClickedX = xLocations.length;
	let numClickedY = yLocations.length;

	let c = barW;

	for (let i = 0; i < numClickedX; i++) {
		let x = xLocations[i];
		noStroke();
		fill(70, 0, 70, 50);
		rect(x, 0, barW, height);
	}

	for (let i = 0; i < numClickedY; i++) {
		let y = yLocations[i];
		noStroke();
		fill(70, 0, 70, 50);
		rect(0, y, width, barW);
	}
}

function initializeQueue() {
	for (let i = 0; i < numBars; i++) {
		queue[i] = (width / numBars) * i;
	}

	queue = shuffle(queue);
}

function nextBar() {
	if (queue.length <= 0 && xDone == false) {
		console.log("Queue Empty");
		clickPos = 0;
		initializeQueue();
		xDone = true;
		console.log("X DONE");
	}
	else if (queue.length <= 0 && xDone == true) {
		endGame = true;
		console.log("Y DONE");
	}

	current = queue.pop();
}