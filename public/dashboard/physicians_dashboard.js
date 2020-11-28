// TODO: Swap names with "dashboard_actions.js" ?

let dbRef = firebase.firestore();
let patientUID = null;
let growingCirclesDAO;
let symbolsDAO;
let fullBarsDAO;
let freeDrawDAO;

function setPatientUID(id) {
	if (!id) {
		console.log("Patient UID provided empty/invalid.")
		return false;
	}
	
	patientUID = id;
	return true;
}

// TODO: Better and more robust error handling
async function pageRouter() {
	defineDAOs();
	await growingCirclesDAO.loadAll();
	await symbolsDAO.loadAll();
	await fullBarsDAO.loadAll();
	
	renderDefaultView();
}

function renderDefaultView() {
	
	growingCirclesDAO.populateHistoryTable("historyTable");
	growingCirclesDAO.populateAggregate("canvasLeft", "canvasRight");
	symbolsDAO.populateHistoryTable("historyTable");
	symbolsDAO.populateAggregate("canvasLeft", "canvasRight");
	fullBarsDAO.populateHistoryTable("historyTable");
	fullBarsDAO.populateAggregate("canvasLeft", "canvasRight");
	
	freeDrawDAO.populateHistoryTable("historyTable");
}

// TODO: Better method with async
// NOTE: Takes about 400-600ms to recognize a user from auth() above
function checkUserStatus() {
	
	while (!patientUID && maxWaitTime > 0) {
		maxWaitTime -= waitTime;
		console.log("Patient UID empty. Retrying...");
		setTimeout(null, waitTime);
	}
	
	if (maxWaitTime < 0) {
		console.log("User Lookup Timed Out");
		return false;
	}
	
	return true;
}

function defineDAOs() {
	growingCirclesDAO = new GrowingCirclesDAO(dbRef, patientUID);
	symbolsDAO = new SymbolsDAO(dbRef, patientUID);
	fullBarsDAO = new FullBarsDAO(dbRef, patientUID);
	freeDrawDAO = new FreeDrawDAO(dbRef, patientUID);
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