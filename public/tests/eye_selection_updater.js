/**
 * This new function aims to check if a user has already taken a certain test previously, but within the current
 * day. Functionally, the goal is to have the eye selection options (HTML button elements) update accordingly.
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
 *  [2] Check doc is LESS THAN 12 hours old
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

// TODO: Refactor name
function updateEyeSelection(userID, testName) {
	let hasTaken = false;
	
	dbRef.collection("TestResults")
		.doc(userID)
		.collection(testName)
		.orderBy("TimeStampMS", "desc")
		.get()
		.then((querySnapshot) => {
			if (querySnapshot[0]) {
				hasTaken = checkIfToday();
				
				if (hasTaken) {
					console.log("");
					// Check which
				}
			}
		});
}

function checkIfToday() {
	return false;
}

// May be possible to merge two JSONs:
// 	Just += the individual fields of each.
// 	Probably use a static function in each DAO