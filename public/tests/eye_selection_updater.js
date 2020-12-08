/**
 * The new functionality within aims to check if a user has already taken a certain test previously, but within the
 * 	current day. The goal is to have the eye selection options (HTML button elements) to update accordingly.
 * Some reasons/scenarios for this implementing this are:
 * 		a. Update the buttons so that the user cannot retake the same test for the same eye in 1 day
 * 		b. Update the buttons such that a user can take a test for one eye and return
 * 			later to take the same test but only have the option to take the remaining eye
 * 		c. Give a visual way of letting the user checking by adding a checkmark or other
 * 			visual indicator that the user has indeed already taken the partical test
 * 			they are attempting to (re)take.
 *
 * 	General Layout:
 *  [1] Load document
 *  [2] Check doc is LESS THAN 24 hours old
 * 		No:  Return
 * 		Yes: Continue
 *  [3] Check if document is BEFORE midnight of the current day
 * 		No:  Return
 * 		Yes: Continue
 *  [4] Process the test result's data to determine which eye(s) has data
 *  [5] Update buttons accordingly which eyes have been completed:
 * 		[Left Eye only]
 * 			- Disable button for left eye, show a checkmark
 * 		[Right Eye only]
 * 			- Disable button for right eye, show a checkmark
 * 		[Both Eyes taken]
 * 			- Disable both buttons, show two checkmarks and also a message explaining
 * 			 that the user has already fully completed the test for the current day
 */

let dbRef = firebase.firestore();
let testResult;
let whichEyesTested;

/**
 * Functionality controller. Uses gate-style if()'s to check if the user has taken the test in
 * 	question within the last 24 hours. The if conditions are ordered to become more specific in
 * 	likelihood in an attempt to be more efficient (See "General Layout" above).
 * @param userID
 * @param testName
 * @returns {Promise<void>}
 */
async function updateEyeSelection(userID, testName) {
	// TODO: Refactor name and flow control
	await loadDocument(userID, testName);
	
	if (!testResult) {
		console.log("No document loaded");
		return;
	}
	else if (!testResult.TimeStampMS) {
		console.log("Error retrieving timestamp of loaded document");
		return;
	}
	
	if (!lessThan24Hours()) {
		console.log("Last Test Result older than 24 hours.");
		return;
	}
	
	if (!afterMidnight()) {
		console.log("Last Results older than midnight of today.");
		return;
	}
	
	checkWhichEyesTested(testName);
	updateEyeButtons();
	displayLastTestTime();
}

/**
 * Loads the single most-recent test result to record of the current user and the specified
 * 	test to get its timestamp.
 * @param userID
 * @param testName
 * @returns {Promise<void>}
 */
async function loadDocument(userID, testName) {
	// !! CRITICAL: Needs to check the TWO most-recent documents
	// TODO: Why do non "foreach" methods not get the document?
	await dbRef.collection("TestResults")
		.doc(userID)
		.collection(testName)
		.orderBy("TimeStampMS", "desc")
		.limit(1)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				testResult = doc.data();
			});
		});
}

/**
 * 1 Hour 	==  3 600 000 ms
 * 12 Hours == 43 200 000 ms
 * 24 Hours == 86 400 000 ms
 * @returns {boolean}
 */
function lessThan24Hours() {
	let current = Date.now();
	let timeStamp = testResult.TimeStampMS;
	
	return (current - timeStamp) < 86400000;
}

/**
 * Uses a new Date object to get the current date. Then sets the hour, minute, seconds,
 * 	and milliseconds to 0 to get the current day's midnight in milliseconds
 * 	(i.e. 00:00:00:00 HH:MM:SS:MsMs)
 * Returns true if the test result's timestamp is equal to or after this midnight value.
 * @returns {boolean}
 */
function afterMidnight() {
	let midnight = new Date();
	let timeStamp = testResult.TimeStampMS;
	
	midnight.setHours(0);
	midnight.setMinutes(0);
	midnight.setSeconds(0);
	midnight.setMilliseconds(0);
	
	return timeStamp >= midnight;
}

/**
 * Uses a static method in the DAO to check which eye has testing result data.
 * 	The DAO returns the results of its check as a JSON that was initialized to false.
 * @param testName
 */
function checkWhichEyesTested(testName) {
	whichEyesTested = {
		left: false,
		right: false
	};
	
	switch (testName) {
		case 'Symbols':
			whichEyesTested = SymbolsDAO.getWhichTakenResults(testResult);
			console.log("Symbols");
			break;
		default:
			console.log("Unrecognized test name provided. Test Name: " + testName);
			break;
	}
}

/**
 * Updates the HTML elements on the testing page to reflect what eye(s) were
 * 	found to already have been completed during the current day. The local
 * 	JSON "whichEyesTested" records which eyes were determined to be complete.
 * 		i.e.
 * 			whichEyesTested.left is true  --> left eye was found to be tested
 * 			whichEyesTested.right is true --> right eye was found to tested
 *
 * 	Left and Right Complete:
 * 		- Disable all 3 eye selection buttons
 * 		- Show check marks under all 3 buttons
 * 		- Display message that says both eyes complete
 *
 * 	Left Complete:
 * 		- Disable Left eye and Both eye selection buttons
 * 		- Show check marks under Left eye and Both buttons
 * 		- Display message that says the left has already been complete
 * 		- Display message that says the user may still test the right
 * 			eye if they wish
 *
 *	Right complete
 *		- Disable Right eye and Both eye selection buttons
 * 		- Show check marks under Right eye and Both buttons
 * 		- Display message that says the right has already been complete
 * 		- Display message that says the user may still test the left
 * 			eye if they wish
 *
 * 	Neither complete:
 * 		- Take no action. Simple console out for acknowledgement.
 */
function updateEyeButtons() {
	let message = document.getElementById("whichEyeStatusMessage");
	
	if (whichEyesTested.left && whichEyesTested.right) {
		document.getElementById("lefteye").disabled = true;
		document.getElementById("botheyes").disabled = true;
		document.getElementById("righteye").disabled = true;
		
		document.getElementById("leftCheckmark").visibility = "visible";
		document.getElementById("rightCheckmark").visibility = "visible";
		document.getElementById("bothCheckmark").visibility = "visible";
		
		document.getElementById("whichEyeStatusMessage").innerHTML =
			"Looks like you've finished both your eyes today for this test!";
	}
	else if (whichEyesTested.left) {
		document.getElementById("lefteye").disabled = true;
		document.getElementById("botheyes").disabled = true;
		
		document.getElementById("leftCheckmark").style.visibility = "visible";
		
		message.innerHTML = "Looks like you've finished your left eye " +
			"already today for this test. You can still take the test for your right eye.";
	}
	else if (whichEyesTested.right) {
		document.getElementById("righteye").disabled = true;
		document.getElementById("botheyes").disabled = true;
		
		document.getElementById("rightCheckmark").style.visibility = "visible";
		
		message.innerHTML = "Looks like you've finished your right eye " +
			"already today for this test. You can still take the test for your left eye.";
	}
	else {
		console.log("No results for either eye found for the current day.");
	}
}

/**
 * Simple time to text converter to display the time of the last test result to the
 * 	eye selection window for the user.
 * Timezone currently hard-coded to US East
 */
function displayLastTestTime() {
	let time = (new Date(testResult.TimeStampMS)).toLocaleTimeString("en-US", {timeZone: "America/New_York"});
	document.getElementById("lastTestTime").innerHTML =
		"Last Test Taken at: " + time;
}