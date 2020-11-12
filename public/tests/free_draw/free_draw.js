// TODO: Update docstrings
let canvasRef;

let backgroundColor = 100;
let timestamp;

let canvasEmpty = true; // TODO: Rename!
let brushActive = false;
let currentSliderValue = 4;

let slider;
let sliderSizeIndicator;

let uploadBtn;
let exitBtn;


function setup() {
	// canvasRef = createCanvas(600, 600);
	// canvasRef.mousePressed(changeGray);
	
	createCanvas(600, 600);
	background(backgroundColor);
	stroke(255);
	timestamp = Date.now();
	
	slider = document.getElementById("brushSizeSlider");
	currentSliderValue = slider.value;
	
	sliderSizeIndicator = document.getElementById("sliderSizeIndicator");
	updateSliderValue(slider.value);
	
	uploadBtn = document.getElementById("uploadBtn");
	exitBtn = document.getElementById("exitBtn");
}

function draw() {
	if (brushActive) {
		stroke(255);
		strokeWeight(slider.value);
		line(mouseX, mouseY, pmouseX, pmouseY);
	}
	
	if (currentSliderValue !== slider.value) {
		updateSliderValue(slider.value);
	}
	
	drawStaticBorder();
}

function updateSliderValue(updatedValue) {
	currentSliderValue = updatedValue;
	sliderSizeIndicator.innerText = "Brush Size: " + currentSliderValue;
}

function mousePressed() {
	brushActive = true;
	
	let clickedInCanvas =
		mouseX > 0 && mouseX < width
		&& mouseY > 0 && mouseY < height;
	
	if (canvasEmpty && clickedInCanvas) {
		canvasEmpty = false;
		showButtons();
	}
}

function mouseReleased() {
	brushActive = false;
}

function drawStaticBorder() {
	noFill();
	strokeWeight(10);
	stroke(0);
	rect(0, 0, width, height);
}

// !! NOTE: Button is declared in free_draw.html
function clearCanvas() {
	clear();
	background(backgroundColor);
	hideButtons();
	
	canvasEmpty = true;
}

function showButtons() {
	uploadBtn.style.display = "block";
	exitBtn.innerText = "Exit without Upload";
}

function hideButtons() {
	uploadBtn.style.display = "none";
	exitBtn.innerText = "Exit";
}





