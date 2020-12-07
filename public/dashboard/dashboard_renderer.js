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

/**
 * Handles the loading test results data and calling the functions to display that data.
 * Each DAO loads its respective test results from FireStore.
 * 	e.g. growingCirclesDAO will load from the GrowingCircles document collection.
 * The DAO's are called to load data asynchronously so that the data is available
 * 	before renderDefaultCanvases() and populateDefaultTable() are called.
 *
 * The promise returned is not used, as of (Dec 6, 2020)
 * @returns {Promise<void>}
 */
async function pageRouter() {
	// TODO: This function would benefit from some sort of parallelization
	defineDAOs();
	await growingCirclesDAO.loadForDashboard();
	await symbolsDAO.loadForDashboard();
	await fullBarsDAO.loadForDashboard();
	await freeDrawDAO.loadForDashboard();
	
	renderDefaultCanvases();
	populateDefaultTable();
}

/**
 * Initializes the DAO objects.
 *
 * This function is Called by pageRouter() (which in turn, is called by Firebase auth at top).
 * 	By the time this function is called, both the dbRef and userRef variables should be defined.
 * 	The DAOs require those two to get the correct results from FireStore.
 */
function defineDAOs() {
	growingCirclesDAO = new GrowingCirclesDAO(dbRef, userRef.uid);
	symbolsDAO = new SymbolsDAO(dbRef, userRef.uid);
	fullBarsDAO = new FullBarsDAO(dbRef, userRef.uid);
	freeDrawDAO = new FreeDrawDAO(dbRef, userRef.uid);
}

/**
 * Clears the canvas (whether was empty or not). Calls each of the relevant DAOs to
 * 	draw to the canvas the test results they loaded during pageRouter(). The drawing should
 * 	look like the test result canvas(es) that are shown immediately after a user has taken a test.
 */
function renderDefaultCanvases() {
	clearCanvases();
	
	growingCirclesDAO.renderAggregate("canvasLeft", "canvasRight");
	symbolsDAO.renderAggregate("canvasLeft", "canvasRight");
	fullBarsDAO.renderAggregate("canvasLeft", "canvasRight");
}

/**
 * Fills the history table with the data as defined by the table headers.
 */
function populateDefaultTable() {
	growingCirclesDAO.populateHistoryTable("historyTable");
	symbolsDAO.populateHistoryTable("historyTable");
	fullBarsDAO.populateHistoryTable("historyTable");
	freeDrawDAO.populateHistoryTable("historyTable");
}

/**
 * Canvas Render View: Most Recent
 * 	Draws the single-most recent result of each test.
 */
function mostRecent() {
	clearCanvases();
	
	growingCirclesDAO.renderMostRecent("canvasLeft", "canvasRight");
	symbolsDAO.renderMostRecent("canvasLeft", "canvasRight");
	fullBarsDAO.renderMostRecent("canvasLeft", "canvasRight");
}

/**
 * Canvas Render View: Month Selected
 * 	Draws any results during the selected month.
 */
function monthSelect() {
	let monthSelector = document.getElementById("monthSelector");
	
	if (!monthSelector || !monthSelector.value) {
		console.log("Unable to retrieve month from selector.");
		return;
	}
	clearCanvases();
	
	growingCirclesDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
	symbolsDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
	fullBarsDAO.renderSelectedMonth(monthSelector.value, "canvasLeft", "canvasRight");
}

/**
 * Canvas Render View: Month Range
 * 	Draws any results within the range of months selected.
 */
function numberOfMonths() {
	let monthInput = document.getElementById("numberMonthsInput");
	
	if (!monthInput || !monthInput.value) {
		console.log("Unable to retrieve number of months value.");
		return;
	}
	
	clearCanvases();
	
	growingCirclesDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
	symbolsDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
	fullBarsDAO.renderMonthRange(monthInput.value, "canvasLeft", "canvasRight");
}

/**
 * Clears the canvases of any drawings. Generally is called each time the user selects
 * 	a view option and presses the "Apply" button.
 */
function clearCanvases() {
	let canvasLeft = document.getElementById("canvasLeft");
	let canvasRight = document.getElementById("canvasRight");
	let ctxLeft = canvasLeft.getContext('2d');
	let ctxRight = canvasRight.getContext('2d');
	ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
	ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
}