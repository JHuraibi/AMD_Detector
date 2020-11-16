// TODO: Update docstrings
let canvasSize = 600;
let timestamp;

let backgroundColor = 100;

let canvasEmpty = true;
let brushActive = false;

let slider;
let sliderSizeIndicator;
let currentSliderValue;

let uploadBtn;
let exitBtn;

let drawing = [];
let redoRecord = [];
// let redo = {};
let actions = [];
let actionCounter;

// TODO: Draw single horizontal and vertical axis
function setup() {
	createCanvas(canvasSize, canvasSize);
	background(backgroundColor);
	stroke(255);
	timestamp = Date.now();
	
	slider = document.getElementById("brushSizeSlider");
	sliderSizeIndicator = document.getElementById("sliderSizeIndicator");
	sliderSizeIndicator.innerText = "Brush Size: " + slider.value;
	currentSliderValue = slider.value;
	
	uploadBtn = document.getElementById("uploadBtn");
	exitBtn = document.getElementById("exitBtn");
}

function draw() {
	if (brushActive) {
		stroke(255);
		strokeWeight(slider.value);
		// line(mouseX, mouseY, pmouseX, pmouseY);
		saveLine(mouseX, mouseY, pmouseX, pmouseY, slider.value);
		
		// checkCursorBounds();		// See note
	}
	
	if (drawing.length) {
		// console.log("Length: " + drawing.length);
		stroke(255);
		for (let i = 0; i < drawing.length; i++) {
			let segment = drawing[i];
			strokeWeight(segment.w);
			line(segment.x, segment.y, segment.pX, segment.pY);
			
			// console.log("X: " + segment.x);
		}
	}
	
	updateSliderIndicator();
	drawStaticAxes();
	drawStaticBorder();
}


function saveLine(x, y, pX, pY, w) {
	let line = {
		x: x,
		y: y,
		pX: pX,
		pY: pY,
		w: w
	}
	
	drawing.push(line);
}

function mousePressed() {
	let clickedInCanvas =
		mouseX > 0 && mouseX < width
		&& mouseY > 0 && mouseY < height;
	
	if (clickedInCanvas) {
		brushActive = true;
		actionCounter = drawing.length;
	}
	
	if (clickedInCanvas && canvasEmpty) {
		canvasEmpty = false;
		actionCounter = drawing.length;
		enableUpload();
	}
}

function mouseReleased() {
	brushActive = false;
	actions.push(drawing.length - actionCounter);
}

// NOTE: Enable this to have brush stop drawing if cursor goes out
//  	of canvas while it is drawing a line that started IN the canvas
// function checkCursorBounds() {
// 	if (mouseX < 0 || mouseX > width
// 		|| mouseY < 0 || mouseY > height) {
// 		brushActive = false;
// 	}
// }

function keyPressed() {
	// 90 === 'z'
	// 122 === 'Z'
	if (keyIsDown(CONTROL) && (keyIsDown(90) || keyIsDown(122))) {
		let removalIndex = drawing.length - actions.pop();
		
		recordLast(removalIndex);
		
		drawing.splice(removalIndex, drawing.length);
		clear();
		background(backgroundColor);
	}
	else if (keyIsDown(CONTROL) && (keyIsDown(89) || keyIsDown(121))) {
		redo();
		console.log("REDO RECORD LENGTH: " + redoRecord.length);
	}
	
	return false; // prevent any default behaviour (P5.js reference recommendation)
}

/**
 * Same functionality as pressing CTRL+Z (which is handled by keyPressed())
 */
function undo() {
	let removalIndex = drawing.length - actions.pop();
	
	recordLast(removalIndex);
	
	drawing.splice(removalIndex, drawing.length);
	clear();
	background(backgroundColor);
}

function recordLast(index) {
	redoRecord = [];
	for (let i = index; i < drawing.length; i++) {
		redoRecord.push(drawing[i]);
	}
	
	console.log("RECORD LENGTH: " + redoRecord.length);
}

function redo() {
	for (let i = 0; i < redoRecord.length; i++) {
		drawing.push(redoRecord[i]);
	}
	redoRecord = [];
	// let removalIndex = drawing.length - actions.pop();
	// drawing.splice(removalIndex, drawing.length);
	// clear();
	// background(backgroundColor);
}

function updateSliderIndicator() {
	if (currentSliderValue !== slider.value) {
		sliderSizeIndicator.innerText = "Brush Size: " + slider.value;
	}
}

function drawStaticAxes() {
	noFill();
	strokeWeight(2);
	stroke(0);
	line(width / 2, 0, width / 2, height);
	line(0, height / 2, width, height / 2);
}

function drawStaticBorder() {
	noFill();
	strokeWeight(10);
	stroke(0);
	rect(0, 0, width, height);
}

// !! NOTE: Button is declared in free_draw.html
function clearCanvas() {
	drawing.splice(0, drawing.length);
	clear();
	background(backgroundColor);
	disableUpload();
	
	canvasEmpty = true;
}

function enableUpload() {
	uploadBtn.style.display = "block";
	exitBtn.innerText = "Exit without Upload";
}

function disableUpload() {
	uploadBtn.style.display = "none";
	exitBtn.innerText = "Exit";
}

function getFreeDrawResults() {
	return {
		"TestName": "free_draw",
		"TimeStampMS": timestamp,
		"TestCanvasSize": canvasSize,
		"ImageData": drawing,
	}
}