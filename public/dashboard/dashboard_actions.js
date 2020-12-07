/**
 * Fires off an action dependent upon what radio button (and options if applicable)
 * 	that updates what data is being drawn the canvas.
 */
function applyBtnRouter() {
	// jQuery to determine which radio option is selected by user (adapted from online example)
	let chosenOption = document.querySelector('input[name="viewOptions"]:checked');
	
	if (!chosenOption) {
		console.log("Checked Radio Missing");
	}
	
	let value = chosenOption.value;
	
	// Defaults to General View
	switch (value) {
		default:
			console.log("Default");
			console.log("VALUE: " + chosenOption);
			resetOptions();
			break;
		case 'generalDefault':
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

/**
 * Enables the view option components. This is called after:
 * 		1) The page is just loaded or the reset button was pressed
 * 			[AND]
 * 		2) Changing the value of any one of the radio options
 */
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

/**
 * Disables the view option components. This is called after:
 * 		1) The above function enabledBtns() has executed
 * 			[AND]
 * 		2) The "Reset" button was clicked
 */
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

/**
 * Changes components of the view options to the primary blue color.
 * Set the HTML disabled property to false.
 */
function enabler(element) {
	if (element && element.disabled) {
		element.style.backgroundColor = "#33CEFF";
		element.style.color = "#000";
		element.style.cursor = "pointer";
		element.disabled = false;
	}
}

/**
 * Changes components of the view options to a light grey color.
 * Set the HTML disabled property to true.
 */
function disabler(element) {
	if (element && !element.disabled) {
		element.style.backgroundColor = "#999999";
		element.style.color = "#000";
		element.style.cursor = "default";
		element.disabled = true;
	}
}