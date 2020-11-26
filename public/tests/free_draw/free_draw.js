let canvasSize = 600;
let timestamp;

let backgroundColor = 220;
let strokeColor = 100;

let canvasEmpty = true;
let brushActive = false;
let leftClicked = false;
let clickDelay = 0;

let slider;
let sliderSizeIndicator;
let currentSliderValue;

let drawing = [];
let redoRecord = [];

let actions = [];
let actionCounter;

/**
 * Sets up canvas, records the current time, sets up brush size slider reference,
 * 	records slider's current value, and sets up upload and exit button group references.
 */
function setup() {
	createCanvas(canvasSize, canvasSize);
	background(backgroundColor);
	// stroke(255);
	timestamp = Date.now();
	
	slider = document.getElementById("brushSizeSlider");
	sliderSizeIndicator = document.getElementById("sliderSizeIndicator");
	sliderSizeIndicator.innerText = "Brush Size: " + slider.value;
	currentSliderValue = slider.value;
	
	noCursor();
}

/**
 * Main test controller. Automatically loops 60 times per second.
 * If the brush is active:
 * 	Draws a new line from the previous mouse cursor location
 * 	to the current mouse cursor location. Sends the coordinates
 * 	of the new line and brush size of the line to saveLine().
 * Always:
 * 	Updates the click indicator and draws the static grid axes and canvas border.
 */
function draw() {
	clear();
	background(backgroundColor);
	
	if (brushActive && leftClicked && clickDelay > 2) {
		saveLine(mouseX, mouseY, pmouseX, pmouseY, slider.value);
		checkCursorBounds();
	}
	
	if (drawing.length) {
		stroke(strokeColor);
		for (let i = 0; i < drawing.length; i++) {
			let segment = drawing[i];
			strokeWeight(segment.w);
			line(segment.x, segment.y, segment.pX, segment.pY);
			
		}
	}
	
	clickDelay++;
	updateSliderIndicator();
	drawBrushIndicator();
	drawStaticAxes();
	drawStaticBorder();
}

/**
 * Saves the attributes of the most-recently drawn line. The two coordinate
 * 	points ((x, y) and (pX, pY)) are the start and end points of a line
 * 	segment. W is simply the thickness of the line segment (value is set
 * 	by the slider). The end point of the previously drawn line becomes
 * 	the start point for the current line.
 * @param x		X-coordinate of the end point line
 * @param y     Y-coordinate of the end point line
 * @param pX	X-coordinate of the PREVIOUSLY drawn line end point, start point for new line
 * @param pY	Y-coordinate of the PREVIOUSLY drawn line end point, start point for new line
 * @param w		Width (stroke weight) of the line
 */
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

/**
 * Handles mouse down press events. If the cursor was within the bounds
 * 	of the canvas when the down press was registered, sets the brush to
 * 	active. If canvas was empty, updates the webpage's buttons by calling
 * 	enableUpload().
 */
function mousePressed() {
	if (mouseButton !== LEFT) {
		leftClicked = false;
		brushActive = false;
		return;
	}
	
	let clickedInCanvas =
		mouseX > 0 && mouseX < width
		&& mouseY > 0 && mouseY < height;
	
	if (clickedInCanvas && canvasEmpty) {
		leftClicked = true;
		brushActive = true;
		canvasEmpty = false;
		clickDelay = 0;
		actionCounter = drawing.length;
		enableUploadButtons();
	}
	else if (clickedInCanvas) {
		leftClicked = true;
		brushActive = true;
		clickDelay = 0;
		actionCounter = drawing.length;
	}
}

/**
 * Handles mouse up release events. Disables the brush.
 */
function mouseReleased() {
	if (leftClicked) {
		leftClicked = false;
		brushActive = false;
		actions.push(drawing.length - actionCounter);
	}
}

/**
 * Disables the brush if the cursor goes out of the bounds of the canvas
 * 	while the user is drawing a line. Similar mechanics as mouseReleased().
 * 	No action is needed if the brush is not active.
 */
function checkCursorBounds() {
	if (!brushActive) {
		return;
	}
	
	if (mouseX < 0 || mouseX > width
		|| mouseY < 0 || mouseY > height) {
		leftClicked = false;
		brushActive = false;
		actions.push(drawing.length - actionCounter);
	}
}

function keyPressed() {
	// 89  === 'y'
	// 121 === 'Y'
	// 90  === 'z'
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
}

function redo() {
	// TODO: Needs a prelim check before pushing to drawing[]
	for (let i = 0; i < redoRecord.length; i++) {
		drawing.push(redoRecord[i]);
	}
	redoRecord = [];
	// let removalIndex = drawing.length - actions.pop();
	// drawing.splice(removalIndex, drawing.length);
	// clear();
	// background(backgroundColor);
}

/**
 * Updates the variable that records current values of the brush slider.
 * 	If the slider's value is different than the current recorded value,
 * 	the new slider value is saved.
 */
function updateSliderIndicator() {
	if (currentSliderValue !== slider.value) {
		sliderSizeIndicator.innerText = "Brush Size: " + slider.value;
	}
}

/**
 * Draws a circle that follows the mouse cursor. Indicates both where the mouse cursor is and
 * 	the current size of the brush. This is intended to be a "preview" of what shape will be
 * 	drawn and where it will be drawn before the user clicks to actually draw.
 */
function drawBrushIndicator() {
	stroke(backgroundColor);
	strokeWeight(1);
	fill(strokeColor);
	ellipse(mouseX, mouseY, slider.value);
}

/**
 * Draws the static vertical and horizontal axes at the center of the canvas.
 */
function drawStaticAxes() {
	noFill();
	strokeWeight(2);
	stroke(0);
	line(width / 2, 0, width / 2, height);
	line(0, height / 2, width, height / 2);
}

/**
 * Draws the static border around the canvas.
 */
function drawStaticBorder() {
	noFill();
	strokeWeight(10);
	stroke(0);
	rect(0, 0, width, height);
}

/**
 * Clears any drawings on the canvas. Empties out drawings[], which is the
 * 	array that is storing the information of each line being drawn.
 */
function clearCanvas() {
	// NOTE: Button HTML element is declared in free_draw.html
	drawing.splice(0, drawing.length);
	clear();
	background(backgroundColor);
	disableUploadButtons();
	
	canvasEmpty = true;
}

/**
 * Swaps the greyscale colors of the canvas background and the brush color.
 * Since the background is not being updated during draw(), background() must be called at
 *  the end of this function to explicitly draw the new background color to the canvas.
 */
function invertColors() {
	let clicheTemp = backgroundColor;
	backgroundColor = strokeColor;
	strokeColor = clicheTemp;
	
	background(backgroundColor);
}


/**
 * Exports the results of the test as a JSON object. Used to send the results
 * 	to FireStore.
 * @returns {{TestName: string, TestCanvasSize: float, ImageData: float Array, TimeStampMS: int}}
 */
function getFreeDrawResults() {
	return {
		"TestName": "free_draw",
		"TimeStampMS": timestamp,
		"TestCanvasSize": canvasSize,
		"ImageData": drawing,
	}
}