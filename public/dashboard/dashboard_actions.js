function applyBtnRouter() {
	// jQuery to determine which radio option is selected by user (adapted from online example)
	let chosenOption = document.querySelector('input[name="viewOptions"]:checked');
	
	if (!chosenOption) {
		console.log("Checked Radio Missing");
	}
	
	let value = chosenOption.value;
	
	// Defaults to Aggregate View
	switch (value) {
		default:
			console.log("Default");
			console.log("VALUE: " + chosenOption);
			resetOptions();
			break;
		case 'aggregateDefault':
			resetOptions();
			break;
		case "mostRecent":
			clearCanvases();
			mostRecent();
			break;
		case "monthSelector":
			clearCanvases();
			monthSelect();
			break;
		case "numberMonths":
			clearCanvases();
			numberOfMonths();
			break;
	}
}

function enableBtns() {
	let applyBtn = document.getElementById("applyBtn");
	let resetBtn = document.getElementById("resetBtn");
	let monthSelectorRadio = document.getElementById("monthSelectorRadio");
	let numberMonthsRadio = document.getElementById("numberMonthsRadio");
	
	let monthSelector = document.getElementById("monthSelector");
	let numberMonthsInput = document.getElementById("numberMonthsInput");
	
	enabler(applyBtn);
	enabler(resetBtn);
	enabler(monthSelector);
	enabler(numberMonthsInput);
	
	if (!monthSelectorRadio.checked) {
		disabler(monthSelector);
	}
	if (!numberMonthsRadio.checked) {
		disabler(numberMonthsInput);
	}
}

function resetOptions() {
	let applyBtn = document.getElementById("applyBtn");
	let resetBtn = document.getElementById("resetBtn");
	let defaultRadio = document.getElementById("defaultRadio");
	
	let monthSelector = document.getElementById("monthSelector");
	let numberMonthsInput = document.getElementById("numberMonthsInput");
	
	disabler(applyBtn);
	disabler(resetBtn);
	disabler(numberMonthsInput);
	monthSelector.style.backgroundColor = "";		// Additional style edit on top of disabler()'s
	numberMonthsInput.style.backgroundColor = "";	// Additional style edit on top of disabler()'s
	
	monthSelector.value = ""; // CHECK: Does anything?
	numberMonthsInput.value = "";
	defaultRadio.checked = true;
	
	clearCanvases();
	
	// Redraw Default
	testDAO.populateAggregate("canvasLeft", "canvasRight");
}

function clearCanvases() {
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