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

/**
 * Sets up canvas, records the current time, sets up brush size slider reference,
 * 	records slider's current value, and sets up upload and exit button group references.
 */
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

/**
 * Main program controller. Automatically loops 60 times per second.
 * If the brush is active:
 * 	Draws a new line from the previous mouse cursor location
 * 	to the current mouse cursor location. Sends the coordinates
 * 	of the new line and brush size of the line to saveLine().
 * Always:
 * 	Updates the click indicator and draws the static grid axes and canvas border.
 */
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

/**
 * Saves the attributes of the most-recently drawn line. The two coordinate
 * 	points ((x, y) and (pX, pY)) are the start and end points of a line
 * 	segment. W is simply the thickness of the line segment (value is set
 * 	by the slider).
 * @param x		X-coordinate of the most-recently drawn line
 * @param y     Y-coordinate of the most-recently drawn line
 * @param pX	X-coordinate of the PREVIOUSLY drawn line
 * @param pY	Y-coordinate of the PREVIOUSLY drawn line
 * @param w		Width (stroke weight) of the line
 */
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

/**
 * Handles mouse down press events. If the cursor was within the bounds
 * 	of the canvas when the down press was registered, sets the brush to
 * 	active. If canvas was empty, updates the webpage's buttons by calling
 * 	enableUpload().
 */
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

/**
 * Handles mouse up release events. Disables the brush.
 */
function mouseReleased() {
	brushActive = false;
}

/**
 * Disables the brush if the cursor goes out of the bounds of the canvas
 * 	while the user is drawing a line.
 */
function checkCursorBounds() {
	// NOTE: Enable this by commenting out the return statement.
	return;

	if (mouseX < 0 || mouseX > width
		|| mouseY < 0 || mouseY > height) {
		brushActive = false;
	}
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
	disableUpload();

	canvasEmpty = true;
}

/**
 * Does the opposite complimentary actions of disableUpload().
 * Unhides the button to upload to FireStore. Updates the exit button text
 *	to say "Exit without Upload" to reflect that the canvas is no longer blank.
 * This function is called whenever the canvas is blank and the user draws their
 * 	first line or their first line after clearing the canvas.
 */
function enableUpload() {
	uploadBtn.style.display = "block";
	exitBtn.innerText = "Exit without Upload";
}

/**
 * Does the opposite complimentary actions of enableUpload().
 * Hides the button to upload to FireStore. Updates the exit button
 *  to say "Exit" to reflect that the canvas is empty.
 */
function disableUpload() {
	uploadBtn.style.display = "none";
	exitBtn.innerText = "Exit";
}

/**
 * Exports the results of the test as a JSON object. Used to send the results
 * 	to FireStore.
 * @returns {{TestName: string, TestCanvasSize: *, ImageData: *, TimeStampMS: *}}
 */
function getFreeDrawResults() {
	return {
		"TestName": "free_draw",
		"TimeStampMS": timestamp,
		"TestCanvasSize": canvasSize,
		"ImageData": drawing,
	}
}