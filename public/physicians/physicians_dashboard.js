let dbRef = firebase.firestore();
let patientUID = null;
let patientGrowingCirclesDAO;
let patientSymbolsDAO;
let patientFullBarsDAO;
let patientFreeDrawDAO;

function setPatientUID(id) {
	if (!id) {
		console.log("Patient UID provided empty/invalid.");
		return false;
	}
	
	patientUID = id;
	return true;
}

// TODO: Better and more robust error handling
async function pageRouter() {
	defineDAOs();
	
	await patientGrowingCirclesDAO.loadForDashboard();
	await patientSymbolsDAO.loadForDashboard();
	await patientFullBarsDAO.loadForDashboard();
	await patientFreeDrawDAO.loadForDashboard();
	
	renderDefaultCanvases();
	renderDefaultTable();
}

function defineDAOs() {
	patientGrowingCirclesDAO = new GrowingCirclesDAO(dbRef, patientUID);
	patientSymbolsDAO = new SymbolsDAO(dbRef, patientUID);
	patientFullBarsDAO = new FullBarsDAO(dbRef, patientUID);
	patientFreeDrawDAO = new FreeDrawDAO(dbRef, patientUID);
	
	patientGrowingCirclesDAO.isPhysician = true;
	patientSymbolsDAO.isPhysician = true;
	patientFullBarsDAO.isPhysician = true;
	patientFreeDrawDAO.isPhysician = true;
}

function renderDefaultCanvases() {
	clearCanvases();
	
	patientGrowingCirclesDAO.renderAggregate("canvasLeft", "canvasRight");
	patientSymbolsDAO.renderAggregate("canvasLeft", "canvasRight");
	patientFullBarsDAO.renderAggregate("canvasLeft", "canvasRight");
}

function renderDefaultTable() {
	patientGrowingCirclesDAO.populateHistoryTable("historyTable");
	patientSymbolsDAO.populateHistoryTable("historyTable");
	patientFullBarsDAO.populateHistoryTable("historyTable");
	patientFreeDrawDAO.populateHistoryTable("historyTable");
}

function mostRecent() {
	clearCanvases();
	
	patientGrowingCirclesDAO.renderMostRecent("canvasLeft", "canvasRight");
	patientSymbolsDAO.renderMostRecent("canvasLeft", "canvasRight");
	patientFullBarsDAO.renderMostRecent("canvasLeft", "canvasRight");
}

function monthSelect() {
	let monthSelector = document.getElementById("monthSelector");
	
	// TODO: Needs a try/catch
	if (!monthSelector || !monthSelector.value) {
		console.log("Unable to retrieve month from selector.");
		return;
	}
	clearCanvases();
	
	patientGrowingCirclesDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
	patientSymbolsDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
	patientFullBarsDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
}

function numberOfMonths() {
	let monthInput = document.getElementById("numberMonthsInput");
	
	// TODO: Needs a try/catch
	if (!monthInput || !monthInput.value) {
		console.log("Unable to retrieve number of months value.");
		return;
	}
	
	clearCanvases();
	
	patientGrowingCirclesDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
	patientSymbolsDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
	patientFullBarsDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
}

function clearCanvases() {
	let canvasLeft = document.getElementById("canvasLeft");
	let canvasRight = document.getElementById("canvasRight");
	let ctxLeft = canvasLeft.getContext('2d');
	let ctxRight = canvasRight.getContext('2d');
	ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
	ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
}
