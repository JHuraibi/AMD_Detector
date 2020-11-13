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
		line(mouseX, mouseY, pmouseX, pmouseY);
		saveLine(mouseX, mouseY, pmouseX, pmouseY, slider.value);
		
		// checkCursorBounds();		// See note
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
		w: slider.value
	}
	
	drawing.push(line)
}


function mousePressed() {
	let clickedInCanvas =
		mouseX > 0 && mouseX < width
		&& mouseY > 0 && mouseY < height;
	
	if (clickedInCanvas) {
		brushActive = true;
	}
	
	if (clickedInCanvas && canvasEmpty) {
		canvasEmpty = false;
		enableUpload();
	}
}

function mouseReleased() {
	brushActive = false;
}

// NOTE: Enable this to have brush stop drawing if cursor goes out
//  	of canvas while it is drawing a line that started IN the canvas
// function checkCursorBounds() {
// 	if (mouseX < 0 || mouseX > width
// 		|| mouseY < 0 || mouseY > height) {
// 		brushActive = false;
// 	}
// }

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