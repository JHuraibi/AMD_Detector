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
 *	CRITICAL: UPDATE
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
// let testResult;
let testResults = [];
let newerResult;
let olderResult;
let whichEyesTested;

/**
 * @param userID
 * @param testName
 * @returns {Promise<void>}
 */
async function updateEyeSelection(userID, testName) {
	// TODO: Refactor name and flow control
	await loadDocuments(userID, testName);
	
	if (!newerResult && !olderResult) {
		console.log("No documents loaded");
		return;
	}
	else if (!newerResult.TimeStampMS || !olderResult.TimeStampMS) {
		console.log("Error retrieving timestamps of loaded documents.");
		return;
	}
	
	checkTestsTakenToday();
	checkWhichEyesTested(testName);
	updateEyeButtons();
	displayLastTestTime();
}

async function loadDocuments(userID, testName) {
	await dbRef.collection("TestResults")
		.doc(userID)
		.collection(testName)
		.orderBy("TimeStampMS", "desc")
		.limit(2)
		.get()
		.then((querySnapshot) => {
			// TODO: May require a size() call
			querySnapshot.forEach((doc) => {
				saveResult(doc.data());
			})
		});
}

function saveResult(data) {
	if (!newerResult) {
		newerResult = data;
	}
	else if (!olderResult) {
		olderResult = data;
	}
	else {
		console.log("Issues loading documents. newer and older variables both occupied.")
	}
}

// TODO: Rename
function checkTestsTakenToday() {
	if (afterMidnight(newerResult.TimeStampMS)) {
		testResults.push(newerResult);
		console.log("Newer today. Time: (" + time(newerResult.TimeStampMS) + ")");
	}
	
	if (afterMidnight(olderResult.TimeStampMS)) {
		testResults.push(olderResult);
		console.log("Older today. Time: (" + time(olderResult.TimeStampMS) + ")");
	}
}

function time(ms) {
	return new Date(ms).toLocaleTimeString("en-US", {timeZone: "America/New_York"});
}

/**
 * Uses a new Date object to get the current date. Then sets the hour, minute, seconds,
 * 	and milliseconds to 0 to get the current day's midnight in milliseconds
 * 	(i.e. 00:00:00:00 HH:MM:SS:MsMs)
 * Returns true if the test result's timestamp is equal to or after this midnight value.
 * @returns {boolean}
 */
function afterMidnight(timestamp) {
	let midnight = new Date();
	let timeStamp = timestamp;
	
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
	
	let staticDAO;
	switch (testName) {
		case 'Symbols':
			// whichEyesTested = SymbolsDAO.getWhichTakenResults(testResult);
			staticDAO = SymbolsDAO;
			console.log("Symbols");
			break;
		default:
			console.log("Unrecognized test name provided. Test Name: " + testName);
			break;
	}
	
	testResults.forEach((result) => {
		staticDAO.getWhichTakenResults(whichEyesTested, result);
	});
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
		
		document.getElementById("leftCheckmark").style.visibility = "visible";
		document.getElementById("rightCheckmark").style.visibility = "visible";
		document.getElementById("bothCheckmark").style.visibility = "visible";
		
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
	let message = "Last Test(s) Taken at:";
	let newerTime;
	let olderTime;
	
	// First if() should be redundant if this function executes at all
	if (testResults[0]) {
		newerTime = (new Date(newerResult.TimeStampMS)).toLocaleTimeString("en-US", {timeZone: "America/New_York"});
		message = message + ("</br>" + newerTime);
	}
	
	if (testResults[1]) {
		olderTime = (new Date(olderResult.TimeStampMS)).toLocaleTimeString("en-US", {timeZone: "America/New_York"});
		message = message + ("</br>" + olderTime);
	}
	
	document.getElementById("lastTestTime").innerHTML = message;
}
