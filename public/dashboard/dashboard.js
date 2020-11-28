// TODO: Swap names with "dashboard_actions.js" ?

let dbRef = firebase.firestore();
let userRef = null;
let growingCirclesDAO;
let symbolsDAO;
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
	await growingCirclesDAO.loadAll();
	await symbolsDAO.loadAll();
	await fullBarsDAO.loadAll();
	
	growingCirclesDAO.populateHistoryTable("historyTable");
	growingCirclesDAO.populateAggregate("canvasLeft", "canvasRight");
	symbolsDAO.populateHistoryTable("historyTable");
	symbolsDAO.populateAggregate("canvasLeft", "canvasRight");
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
	growingCirclesDAO = new GrowingCirclesDAO(dbRef, userRef.uid);
	symbolsDAO = new SymbolsDAO(dbRef, userRef.uid);
	fullBarsDAO = new FullBarsDAO(dbRef, userRef.uid);
}

// Draws SINGLE most recent result of each test to the canvases
function mostRecent() {
	// symbolsDAO.populateMostRecent();
	growingCirclesDAO.populateMostRecent("canvasLeft", "canvasRight");
	symbolsDAO.populateMostRecent("canvasLeft", "canvasRight");
	fullBarsDAO.populateMostRecent("canvasLeft", "canvasRight");
}

function monthSelect() {
	let monthSelector = document.getElementById("monthSelector");
	
	// TODO: Needs a try/catch
	if (!monthSelector) {
		console.log("Unable to retrieve month from selector.")
	}
	
	growingCirclesDAO.populateByMonthSelector(monthSelector.value, "canvasLeft", "canvasRight");
	symbolsDAO.populateByMonthSelector(monthSelector.value, "canvasLeft", "canvasRight");
	fullBarsDAO.populateByMonthSelector(monthSelector.value, "canvasLeft", "canvasRight");
}

function numberOfMonths() {
	let monthInput = document.getElementById("numberMonthsInput");
	
	// TODO: Needs a try/catch
	if (!monthInput) {
		console.log("Unable to retrieve number of months value.")
	}
	
	growingCirclesDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
	symbolsDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
	fullBarsDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
}