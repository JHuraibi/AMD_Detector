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
 * 	General Plan:
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


// May be possible to merge two JSONs:
// 	Just += the individual fields of each.
// 	Probably use a static function in each DAO

let dbRef = firebase.firestore();
let testResult;
let whichEyesTested;

// TODO: Refactor name and flow control
async function updateEyeSelection(userID, testName) {
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
	
	// Call static method of appropriate DAO to check which eyes were tested
	checkWhichEyesTested(testName);
	changeEyeButtons();
}

async function loadDocument(userID, testName) {
	// TODO: Why do non "foreach" methods not getting the document?
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
 * @returns {boolean}
 */
function lessThan24Hours() {
	let current = Date.now();
	let timeStamp = testResult.TimeStampMS;
	
	return (current - timeStamp) < 43200000;
}

function afterMidnight() {
	let midnight = new Date();
	let timeStamp = testResult.TimeStampMS;
	
	midnight.setHours(0);
	midnight.setMinutes(0);
	midnight.setMilliseconds(0);
	
	return timeStamp >= midnight;
}

function checkWhichEyesTested(testName) {
	whichEyesTested = {
		left: false,
		right: false
	};

	switch (testName) {
		case 'Symbols':
			whichEyesTested = SymbolsDAO.getWhichTakenResults(testResult);
			break;
		default:
			console.log("Unrecognized test name provided. Test Name: " + testName);
			break;
	}
}

function changeEyeButtons() {
	let message = document.getElementById("whichEyeStatusMessage");
	
	console.log("NOW: " + new Date(Date.now()).toString());
	console.log("OTH: " + new Date(testResult.TimeStampMS).toString());

	if (whichEyesTested.left && whichEyesTested.right) {
		hideLeftOption();
		// hideRight();
		// showLeftCheckmark();
		// showRightCheckmark();
		message.innerHTML = "Looks like you've finished both your eyes today for this test";
	}
	else if (whichEyesTested.left){
		hideLeftOption();
		// showLeftCheckmark();
		message.innerHTML = "Looks like you've finished your right eye " +
			"already today for this test. You can still take the test for your right eye.";
	}
	else if (whichEyesTested.right){
		// hideRight();
		// showLeftCheckmark();
		// showRightCheckmark();
		message.innerHTML = "Looks like you've finished your right eye " +
			"already today for this test. You can still take the test for your left eye.";
	}
}

function hideLeftOption(){
	let leftButton = document.getElementById("lefteye");
}

function hideRightOption(){
	let leftButton = document.getElementById("righteye");
}

