// TODO: Swap names with "dashboard_actions.js" ?

let dbRef = firebase.firestore();
let userRef = null;
let growingCirclesDAO;
let symbolsDAO;
let fullBarsDAO;
let freeDrawDAO;

firebase.auth().onAuthStateChanged(user => {
	console.log(user);
	userRef = user;
	pageRouter();
});

// TODO: Better and more robust error handling
async function pageRouter() {
	defineDAOs();
	await growingCirclesDAO.loadForDashboard();
	await symbolsDAO.loadForDashboard();
	await fullBarsDAO.loadForDashboard();
	await freeDrawDAO.loadForDashboard();
	
	renderDefaultCanvases();
	renderDefaultTable();
}

function renderDefaultTable() {
	growingCirclesDAO.populateHistoryTable("historyTable");
	symbolsDAO.populateHistoryTable("historyTable");
	fullBarsDAO.populateHistoryTable("historyTable");
	freeDrawDAO.populateHistoryTable("historyTable");
}

function renderDefaultCanvases() {
	clearCanvases();
	
	growingCirclesDAO.renderAggregate("canvasLeft", "canvasRight");
	symbolsDAO.renderAggregate("canvasLeft", "canvasRight");
	fullBarsDAO.renderAggregate("canvasLeft", "canvasRight");
}

function defineDAOs() {
	growingCirclesDAO = new GrowingCirclesDAO(dbRef, userRef.uid);
	symbolsDAO = new SymbolsDAO(dbRef, userRef.uid);
	fullBarsDAO = new FullBarsDAO(dbRef, userRef.uid);
	freeDrawDAO = new FreeDrawDAO(dbRef, userRef.uid);
}

function mostRecent() {
	clearCanvases();
	
	growingCirclesDAO.renderMostRecent("canvasLeft", "canvasRight");
	symbolsDAO.populateMostRecent("canvasLeft", "canvasRight");
	fullBarsDAO.renderMostRecent("canvasLeft", "canvasRight");
}

function monthSelect() {
	let monthSelector = document.getElementById("monthSelector");
	
	// TODO: Needs a try/catch
	if (!monthSelector || !monthSelector.value) {
		console.log("Unable to retrieve month from selector.");
		return;
	}
	clearCanvases();
	
	growingCirclesDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
	symbolsDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
	fullBarsDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
}

function numberOfMonths() {
	let monthInput = document.getElementById("numberMonthsInput");
	
	// TODO: Needs a try/catch
	if (!monthInput || !monthInput.value) {
		console.log("Unable to retrieve number of months value.");
		return;
	}
	
	clearCanvases();
	
	growingCirclesDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
	symbolsDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
	fullBarsDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
}

function clearCanvases() {
	let canvasLeft = document.getElementById("canvasLeft");
	let canvasRight = document.getElementById("canvasRight");
	let ctxLeft = canvasLeft.getContext('2d');
	let ctxRight = canvasRight.getContext('2d');
	ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
	ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
}