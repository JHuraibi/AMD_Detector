// TODO: Swap names with "dashboard_actions.js" ?

let dbRef = firebase.firestore();
let userRef = null;
let fullBarsDAO;

firebase.auth().onAuthStateChanged(user => {
	console.log(user);
	userRef = user;
	pageRouter();
});

// ---------------------- //
// let growingCirclesDAO = new GrowingCirclesDAO(dbRef, "canvasLeft", "canvasRight");
// let symbolsDAO = new SymbolsDAO(dbRef, "canvasLeft", "canvasRight");
// let fullBarsDAO = new FullBarsDAO(dbRef, "canvasLeft", "canvasRight");
// let freeDrawDAO = new FreeDrawDAO(dbRef, "canvasLeft", "canvasRight");

// TODO: Better and more robust error handling
async function pageRouter() {
	defineDAOs();
	await fullBarsDAO.loadAll();
	
	fullBarsDAO.populateHistoryTable("historyTable");
	fullBarsDAO.populateAggregate("canvasLeft", "canvasRight");
}

// TODO: Better method with async
// NOTE: Takes about 400-600ms to recognize a user from auth() above
function checkUserStatus() {
	
	while (!userRef && maxWaitTime > 0) {
		maxWaitTime -= waitTime;
		console.log("No User. Reattempting Lookup.");
		setTimeout(null, waitTime);
	}
	
	if (maxWaitTime < 0) {
		console.log("User Lookup Timed Out");
		return false;
	}
	
	return true;
}

function defineDAOs() {
	fullBarsDAO = new fullBarsDAO(dbRef, userRef.uid);
}

// Draws SINGLE most recent result of each test to the canvases
function mostRecent() {
	// growingCirclesDAO.populateMostRecent();
	// symbolsDAO.populateMostRecent();
	fullBarsDAO.populateMostRecent("canvasLeft", "canvasRight");
}

function monthSelect() {
	let monthSelector = document.getElementById("monthSelector");
	
	// TODO: Needs a try/catch
	if (!monthSelector) {
		console.log("Unable to retrieve month from selector.")
	}
	
	fullBarsDAO.populateByMonthSelector(monthSelector.value, "canvasLeft", "canvasRight");
}

function numberOfMonths() {
	let monthInput = document.getElementById("numberMonthsInput");
	
	// TODO: Needs a try/catch
	if (!monthInput) {
		console.log("Unable to retrieve number of months value.")
	}
	
	fullBarsDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
}