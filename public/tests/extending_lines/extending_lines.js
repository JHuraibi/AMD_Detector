var timer;
var clickCounter = 0;
var clickedBars = [];
var stopGame = false;
var showResults = false;
var bars = []
var numBars = 4;
var currentBar;

var queue = []
var queCount = 0;

var windowPercent = 0.8;

var showDebugMsg = false;
var tempMsgCounter = 0;

var flashy = 0;

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

// draw() x60 per second
function draw() {
	if (!showResults) {
		showAllBars();
		oneSecondUpdate();
		timer++;
	}
	else {
		showClickAreas();
	}

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

function oneSecondUpdate() {
	if (timer % 30 === 0) {
		var whichBar = feedQueue();
		bars[whichBar].move();
		currentBar = bars[whichBar];
	}
}

function feedQueue() {
	var nextBar;

	if (queCount >= 4) {
		for (var i = 0; i < numBars; i++) {
			queCount[i] = i;
		}

		shuffle(queCount, true);
		queCount = 0;
	}

	nextBar = queue[queCount];
	queCount++;
	return nextBar;
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