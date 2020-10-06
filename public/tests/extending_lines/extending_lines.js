let timer;
let clickCounter = 0;
let clickedBars = [];
let stopGame = false;
let showResults = false;
let bars = []
let numBars = 4;
let currentBar;

let queue = []
let queCount = 0;

let showDebugMsg = false;
let tempMsgCounter = 0;

function setup() {
	createCanvas(800, 800);
	background('#dae9f6');
	timer = 0;

	for (var i = 0; i < numBars; i++) {
		bars[i] = new Bar(numBars, i);
		queue[i] = i;
	}
	currentBar = bars[i];
}

// draw() loops x60 each second
function draw() {
	if (!showResults) {
		// Test running
		showAllBars();									// Draw all the bars on the canvas
		moveNextBar();									// Move bars at fixed time interval (see fxn for timer usage)
		timer++;										// Increment the timer
	}
	else {
		// Test done running
		showClickAreas();
	}

	// Items to always be shown (game running or not)
	showCenterCircle();
	debugMsg();
}

function mousePressed() {
	clickedBars[clickCounter] = new ClickedBar(currentBar);
	clickCounter++;

	if (clickCounter > 3) {
		showResults = true;
	}

	showDebugMsg = true;
}

function showClickAreas() {
	for (var i = 0; i < clickCounter; i++) {
		clickedBars[i].show();
	}

	rectMode(CENTER);
	fill('#8f8f8f');
	rect(390, height - 60, 300, 60, 10, 10, 10, 10);
	rectMode(CORNER);

	fill('#691616');
	textSize(30);
	textFont('Verdana');
	text('Showing Results', width / 3, height - 50);
}

function showCenterCircle() {
	fill(0);
	ellipse((width / 2), (height / 2), 8, 8);
}

function showAllBars() {
	for (var i = 0; i < numBars; i++) {
		fill(52, 58, 64);
		bars[i].show();
	}
}

function moveNextBar() {
	// Every 60 increments of timer is 1 second
	// So below is moving the next bar every half second
	if (timer % 30 === 0) {
		var whichBar = feedQueue();
		bars[whichBar].move();
		currentBar = bars[whichBar];
	}
}

function feedQueue() {
	var nextBarIndex;

	if (queCount >= 4) {
		for (var i = 0; i < numBars; i++) {
			queCount[i] = i;
		}

		shuffle(queCount, true);	// TODO: arr = shuffle(arr)
		queCount = 0;
	}

	nextBarIndex = queue[queCount];
	queCount++;
	return nextBarIndex;
}

function debugMsg() {
	tempMsgCounter++;

	if (showDebugMsg) {
		fill('#9d1946');
		textSize(20);
		text('DEBUG: Clicked', 20, height - 50);
	}

	if (tempMsgCounter > 120) {
		tempMsgCounter = 0;
		showDebugMsg = false;

		fill('#dae9f6');
		noStroke();
		rect(0, height - 80, 200, 80);
	}
}