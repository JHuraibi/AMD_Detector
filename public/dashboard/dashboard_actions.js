function applyBtnRouter() {
	// jQuery to determine which radio option is selected by user (adapted from online example)
	let chosenOption = document.querySelector('input[name="viewOptions"]:checked');
	
	if (!chosenOption) {
		console.log("Checked Radio Missing");
	}
	
	let value = chosenOption.value;
	// Defaults to Most Recent
	switch (value) {
		case 'aggregateDefault':
			resetOptions();
			break;
		case "mostRecent":
			clearCanvases();
			mostRecent();
			break;
		case "byMonth":
			clearCanvases();
			byMonth();
			break;
		case "byCustomMonths":
			// Retrieving of the months value done in function
			clearCanvases();
			customNumMonths();
			break;
		default:
			console.log("Default");
			console.log("VALUE: " + chosenOption);
			break;
	}
}

function enableBtns() {
	let applyBtn = document.getElementById("applyBtn");
	let resetBtn = document.getElementById("resetBtn");
	let customMonthsInput = document.getElementById("customMonthsInput");
	let customMonthsRadio = document.getElementById("customMonthsRadio");
	
	enabler(applyBtn);
	enabler(resetBtn);
	enabler(customMonthsInput);
	
	if (!customMonthsRadio.checked) {
		disabler(customMonthsInput);
	}
}

function resetOptions() {
	let applyBtn = document.getElementById("applyBtn");
	let resetBtn = document.getElementById("resetBtn");
	let customMonthsInput = document.getElementById("customMonthsInput");
	let defaultRadio = document.getElementById("defaultRadio");
	
	disabler(applyBtn);
	disabler(resetBtn);
	disabler(customMonthsInput);
	customMonthsInput.style.backgroundColor = "";	// Additional style edit on top of disabler()'s
	
	customMonthsInput.value = "";
	defaultRadio.checked = true;
	
	clearCanvases();
	
	// Redraw Default
	testDAO.populateAggregate("canvasLeft", "canvasRight");
}

function clearCanvases(){
	let canvasLeft = document.getElementById("canvasLeft");
	let canvasRight = document.getElementById("canvasRight");
	let ctxLeft = canvasLeft.getContext('2d');
	let ctxRight = canvasRight.getContext('2d');
	ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
	ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
}

function enabler(element) {
	if (element && element.disabled) {
		element.style.backgroundColor = "#33CEFF";
		element.style.color = "#000";
		element.style.cursor = "pointer";
		element.disabled = false;
	}
}

function disabler(element) {
	if (element && !element.disabled) {
		element.style.backgroundColor = "#999999";
		element.style.color = "#000";
		element.style.cursor = "default";
		element.disabled = true;
	}
}