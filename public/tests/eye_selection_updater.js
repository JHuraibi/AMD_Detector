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
 * 	General Explanation of Process:
 *  [1] Load two most recent documents (if exist)
 *  [2] Check whether the two documents are before or after midnight of the current day
 *  [3] Utilize a static method to the appropriate DAO to check the test results
 *  	and whether they include left, right, or both eye data points
 *  [4] Update buttons accordingly which eyes have been completed across
 *  	either a single, or both test results loaded from Step 1:
 * 		[Left Eye only completed]
 * 			- Disable button for left eye, show a checkmark
 * 		[Right Eye only completed]
 * 			- Disable button for right eye, show a checkmark
 * 		[Both Eyes completed]
 * 			- Disable both buttons, show two checkmarks and also a message explaining
 * 			 that the user has already fully completed the test for the current day
 */

let dbRef = firebase.firestore();
let testResults = [];
let mostRecentResult;
let secondMostRecentResult;
let whichEyesTested;

/**
 * @param userID
 * @param testName
 * @returns {Promise<void>}
 */
async function updateEyeSelection(userID, testName) {
	// TODO: Refactor name and flow control
	await loadDocuments(userID, testName);
	
	if (!mostRecentResult && !secondMostRecentResult) {
		console.log("No documents loaded");
		return;
	}
	
	if ((mostRecentResult && !mostRecentResult.TimeStampMS) ||
		(secondMostRecentResult && !secondMostRecentResult.TimeStampMS)) {
		console.log("Error retrieving timestamps of loaded documents.");
		return;
	}
	
	checkIfResultsFromToday();
	checkWhichEyesTested(testName);
	updateEyeButtons();
	displayLastTestTime();
}

/**
 * Loads the two most-recent documents from the FireStore collection that
 * 	corresponds to the testName parameter.
 * @param userID
 * @param testName
 * @returns {Promise<void>}
 */
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

/**
 * Stores the passed-in data to either of the two variables.
 * If the user has take the test in question two or more times,
 * 	then both mostRecentResult and secondMostRecentResult should
 * 	be populated with data.
 * Assignment is controlled by checking whether mostRecentResult
 * 	is null or not.
 * 	If yes:
 * 		Store data into mostRecentResult
 *  If no:
 *  	Store data into the next variable, secondMostRecentResult
 *
 * NOTE: If this function is called when both mostRecent and secondMostRecent
 *   are not null, there are too many documents being queried from Firestore
 *   or the variables are not null beforehand.
 * NOTE: parameter "data" is the .data() component of a Firestore
 * 	document.
 * @param data
 */
function saveResult(data) {
	if (!mostRecentResult) {
		mostRecentResult = data;
	}
	else if (!secondMostRecentResult) {
		secondMostRecentResult = data;
	}
	else {
		console.log("Issues loading documents. Containment variables both already occupied.");
	}
}

/**
 * If the test is valid and occurred at or after midnight, record it by pushing it to
 * 	the local testResults array.
 */
function checkIfResultsFromToday() {
	if (afterMidnight(mostRecentResult.TimeStampMS)) {
		testResults.push(mostRecentResult);
	}
	
	if (afterMidnight(secondMostRecentResult.TimeStampMS)) {
		testResults.push(secondMostRecentResult);
	}
}

/**
 * Uses a new Date object to get the current date. Then sets the hour, minute, seconds,
 * 	and milliseconds to 0 to get the current day's midnight in milliseconds
 * 	(i.e. 00:00:00:00 HH:MM:SS:MsMs)
 * 		Returns true if:
 * 			- Valid timestamp was provided
 * 			- Timestamp is equal to or greater than midnight of the current day
 * 		Returns false if:
 * 			- Invalid timestamp or no timestamp provided.
 * 			- Timestamp was less than midnight of the current day
 * @returns {boolean}
 */
function afterMidnight(timestamp) {
	// TODO: Null check probably better in calling function
	if (!timestamp) {
		console.log("No timestamp");
		return false;
	}
	
	let midnight = new Date();
	let timeStamp = timestamp;
	
	midnight.setHours(0);
	midnight.setMinutes(0);
	midnight.setSeconds(0);
	midnight.setMilliseconds(0);
	
	return timeStamp >= midnight;
}

/**
 * Uses a static method in the corresponding DAO to check which eye has testing result data.
 * The DAO returns the result of its by updating the values of the whichEyesTested JSON
 * 	that was initialized to false beforehand.
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
			staticDAO = SymbolsDAO;
			console.log("SymbolsDAO used.");
			break;
		case 'Smiley':
			staticDAO = FacesDAO;
			console.log("FacesDAO used.");
			break;
		case 'GrowingCircles':
			staticDAO = GrowingCirclesDAO;
			console.log("GrowingCirclesDAO used.");
			break;
		
		default:
			console.log("Unrecognized test name provided. Test Name: " + testName);
			break;
	}
	
	// TODO: Would be cleaner to ditch testResults all together
	testResults.forEach((result) => {
		staticDAO.checkWhichEyes(whichEyesTested, result);
	});
}

/**
 * Updates the HTML elements on the testing page to reflect what eye(s) were
 * 	found to already have been completed during the current day. The local
 * 	JSON "whichEyesTested" records which eyes were determined to be complete.
 * 		i.e.
 * 			whichEyesTested.left is true  --> left eye was found to be tested
 * 			whichEyesTested.right is true --> right eye was found to tested
 *	All
 *		- Unhide the relevant table rows
 *
 * 	Left and Right Complete:
 * 		- Disable all 3 eye selection buttons
 * 		- Show check marks under all 3 buttons
 * 		- Display message that says both eyes complete
 * 		- Unhide the last table row with the button to return to the home page
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
		unhideRows();
		document.getElementById("trHomeButton").style.display = "table-row";
		
		document.getElementById("lefteye").disabled = true;
		document.getElementById("botheyes").disabled = true;
		document.getElementById("righteye").disabled = true;
		document.getElementById("leftCheckmark").style.visibility = "visible";
		document.getElementById("rightCheckmark").style.visibility = "visible";
		document.getElementById("bothCheckmark").style.visibility = "visible";
		
		document.getElementById("whichEyeStatusMessage").innerHTML =
			"Looks like you've finished both your eyes today for this test!";
		
		document.getElementById("returnHome").style.display = "inherit";
	}
	else if (whichEyesTested.left) {
		unhideRows();
		
		document.getElementById("lefteye").disabled = true;
		document.getElementById("botheyes").disabled = true;
		document.getElementById("leftCheckmark").style.visibility = "visible";
		
		message.innerHTML = "Looks like you've finished your left eye " +
			"already today for this test. You can still take the test for your right eye.";
	}
	else if (whichEyesTested.right) {
		unhideRows();
		
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
 * Unhides the table row HTML elements that are required for any of the
 * 	if/else cases of the updateEyeButtons() function (minus the final else).
 */
function unhideRows(){
	document.getElementById("trCheckmarks").style.display = "table-row";
	document.getElementById("trMessage").style.display = "table-row";
	document.getElementById("trLastDates").style.display = "table-row";
}

/**
 * Simple time to text converter to display the time of the last test result to the
 * 	eye selection window for the user.
 * Timezone currently hard-coded to US East
 */
function displayLastTestTime() {
	let message = "Last Test(s) Taken Today at:";
	let newerTime;
	let olderTime;
	
	// Printer older result first (if exist)
	if (testResults[1]) {
		olderTime = (new Date(secondMostRecentResult.TimeStampMS)).toLocaleTimeString("en-US", {timeZone: "America/New_York"});
		message = message + ("</br>" + olderTime);
	}

	if (testResults[0]) {
		newerTime = (new Date(mostRecentResult.TimeStampMS)).toLocaleTimeString("en-US", {timeZone: "America/New_York"});
		message = message + ("</br>" + newerTime);
	}
	
	document.getElementById("lastTestTime").innerHTML = message;
}
