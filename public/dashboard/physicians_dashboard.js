// TODO: Move file locaiton to "physicians" directory?

let dbRef = firebase.firestore();
let patientUID = null;
let patientGrowingCirclesDAO;
let patientSymbolsDAO;
let patientFullBarsDAO;
let patientFreeDrawDAO;

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
	
	await patientGrowingCirclesDAO.loadAll();
	await patientSymbolsDAO.loadAll();
	await patientFullBarsDAO.loadAll();
	await patientFreeDrawDAO.loadAll();
	
	renderDefaultView();
	populateHistoryTable();
}

function renderDefaultView() {
	patientGrowingCirclesDAO.populateAggregate("canvasLeft", "canvasRight");
	patientSymbolsDAO.populateAggregate("canvasLeft", "canvasRight");
	patientFullBarsDAO.populateAggregate("canvasLeft", "canvasRight");
}

function populateHistoryTable() {
	patientGrowingCirclesDAO.populateHistoryTable("historyTable");
	patientSymbolsDAO.populateHistoryTable("historyTable");
	patientFullBarsDAO.populateHistoryTable("historyTable");
	patientFreeDrawDAO.populateHistoryTable("historyTable");
}

function defineDAOs() {
	patientGrowingCirclesDAO = new GrowingCirclesDAO(dbRef, patientUID);
	patientSymbolsDAO = new SymbolsDAO(dbRef, patientUID);
	patientFullBarsDAO = new FullBarsDAO(dbRef, patientUID);
	patientFreeDrawDAO = new FreeDrawDAO(dbRef, patientUID);
}

function mostRecent() {
	patientGrowingCirclesDAO.populateMostRecent("canvasLeft", "canvasRight");
	patientSymbolsDAO.populateMostRecent("canvasLeft", "canvasRight");
	patientFullBarsDAO.populateMostRecent("canvasLeft", "canvasRight");
}

function monthSelect() {
	let monthSelector = document.getElementById("monthSelector");
	
	// TODO: Needs a try/catch
	if (!monthSelector) {
		console.log("Unable to retrieve month from selector.")
	}
	
	patientGrowingCirclesDAO.populateByMonthSelector(monthSelector.value, "canvasLeft", "canvasRight");
	patientSymbolsDAO.populateByMonthSelector(monthSelector.value, "canvasLeft", "canvasRight");
	patientFullBarsDAO.populateByMonthSelector(monthSelector.value, "canvasLeft", "canvasRight");
}

function numberOfMonths() {
	let monthInput = document.getElementById("numberMonthsInput");
	
	// TODO: Needs a try/catch
	if (!monthInput) {
		console.log("Unable to retrieve number of months value.")
	}
	
	patientGrowingCirclesDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
	patientSymbolsDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
	patientFullBarsDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
}