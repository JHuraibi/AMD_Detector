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
			mostRecent();
			break;
		case "monthSelector":
			monthSelect();
			break;
		case "numberMonths":
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
	disabler(monthSelector);
	disabler(numberMonthsInput);
	monthSelector.style.backgroundColor = "";		// Additional style edit on top of disabler()'s
	numberMonthsInput.style.backgroundColor = "";	// Additional style edit on top of disabler()'s
	
	numberMonthsInput.value = "";
	defaultRadio.checked = true;
	
	// Redraw Default (function definition in dashboard_renderer.js)
	renderDefaultCanvases();
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