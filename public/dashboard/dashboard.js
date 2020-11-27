let dbRef = firebase.firestore();
let userRef = null;
let testDAO;

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
	await testDAO.loadAll();
	
	testDAO.populateHistoryTable("historyTable");
	testDAO.populateAggregate("canvasLeft", "canvasRight");
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
	testDAO = new TestDAO(dbRef, userRef.uid);
}

// Draws SINGLE most recent result of each test to the canvases
function mostRecent() {
	// CURRENT: most recent
	// setCanvasGradient();
	// growingCirclesDAO.populateMostRecent();
	// symbolsDAO.populateMostRecent();
	// fullBarsDAO.populateMostRecent();
	testDAO.populateMostRecent("canvasLeft", "canvasRight");
}

function byMonth() {
	// TODO: MONTH NAME PARAMETER
	testDAO.populateByMonth();
}

function customNumMonths() {
	let monthInput = document.getElementById("customMonthsInput");
	
	if (!monthInput) {
		console.log("Unable to retreive number of months value.")
	}
	
	clearCanvases();
	testDAO.populateByNumberMonths(monthInput.value, "canvasLeft", "canvasRight");
}

// TODO: DELETE!
function setCanvasGradient() {
	let canvasLeft = document.getElementById("canvasLeft");
	let canvasRight = document.getElementById("canvasRight");
	let ctxLeft = canvasLeft.getContext("2d");
	let ctxRight = canvasRight.getContext("2d");
	
	let centerX = canvasLeft.width / 2;
	let centerY = canvasLeft.height / 2;
	let outerRadius = canvasLeft.height
	// Create gradient
	let grdLeft = ctxLeft.createRadialGradient(centerX, centerY, 50, centerX, centerY, outerRadius);
	grdLeft.addColorStop(0, "#7e1111ff");
	grdLeft.addColorStop(0, "#7e11117e");
	// grdLeft.addColorStop(1, "#ffffff");
	
	let grdRight = ctxRight.createRadialGradient(centerX, centerY, 50, centerX, centerY, outerRadius);
	grdRight.addColorStop(0, "#7e1111");
	grdRight.addColorStop(1, "#ffffff");
	
	// Fill with gradient
	ctxLeft.fillStyle = grdLeft;
	ctxRight.fillStyle = grdLeft;
}