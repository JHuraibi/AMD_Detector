let dbRef = firebase.firestore();
let patientUID = null;

let uriPassedIn;
let testName
let testID

let genericDAO;
let forFreeDraw = false;

firebase.auth().onAuthStateChanged(user => {
	console.log(user);
	patientUID = user.uid;
	pageRouter();
});

async function pageRouter() {
	getURIData();
	await defineDAO();
	setTestNameTitle(testName);
	drawResults();
}

function getURIData() {
	uriPassedIn = new URLSearchParams(window.location.search);
	testName = uriPassedIn.get("TEST_NAME");
	testID = uriPassedIn.get("TEST_ID");
}

function defineDAO() {
	if (!testName) {
		console.log("Error getting Test Name from URI.")
		return;
	}
	
	switch (testName) {
		default:
			console.log("[detailed_view] router(): Default Case");
			break;
		
		case "GrowingCircles":
			genericDAO = new GrowingCirclesDAO(dbRef, patientUID);
			break;
		
		case "Symbols":
			genericDAO = new SymbolsDAO(dbRef, patientUID);
			break;
		
		case "FullBars":
			genericDAO = new FullBarsDAO(dbRef, patientUID);
			break;
		
		case "FreeDraw":
			forFreeDraw = true;
			genericDAO = new FreeDrawDAO(dbRef, patientUID);
			break;
		
		// case "Fractal":
		// 	setTestNameTitle("Fractal");
		// 	break;
	}
}

async function drawResults() {
	let canvasLeft = document.getElementById("detailedCanvasLeft");
	let canvasRight = document.getElementById("detailedCanvasRight");
	let captions = document.getElementById("canvasCaptions");
	
	if (forFreeDraw) {
		canvasRight.style.display = "none";		// Free Draw always has only 1 canvas
		captions.style.display = "none";		// Remove the captions as well
	}
	
	await genericDAO.loadForDetailedView(testID, canvasLeft, canvasRight);
	setDateSubtitle(genericDAO.detailedViewTimeStamp);
}

// NOTE: The single dash and space characters are here so that
//			if this function fails to return a test name to
//			the header, the header then won't look incomplete.
//			(See the testTitle <h3> in detailed_view.html).
function setTestNameTitle() {
	let title = document.getElementById('testTitle');
	let postfix = "";
	
	switch (testName) {
		case "GrowingCircles":
			postfix = " - Growing Circles";
			break;
		
		case "Symbols":
			postfix = " - Symbols";
			break;
		
		case "FullBars":
			postfix = " - Full Bars";
			break;
		
		case "FreeDraw":
			postfix = " - Free Draw";
			break;
		
		default:
			console.log("Test Name Default Case. Value: " + testName);
			break;
	}
	
	title.innerText = title.innerText + postfix;
}


function setDateSubtitle(milliseconds) {
	if (!milliseconds) {
		console.log("Error getting Time Stamp from DAO");
		return;
	}
	
	let subtitleElement = document.getElementById("dateSubtitle");
	let date = new Date(milliseconds);
	let timezoneOffset = 5;	// UTC -5:00
	
	let dateString = date.toDateString();
	let hoursString = +date.getUTCHours() - timezoneOffset;
	let minutesString = date.getUTCMinutes();
	let postfix = hoursString > 11 ? "PM" : "AM";
	
	if (hoursString === 0) {
		hoursString = 12;
	}
	
	minutesString = minutesString < 10 ? "0" + minutesString : minutesString;
	hoursString = hoursString % 12;
	
	subtitleElement.innerText =
		subtitleElement.innerText + dateString + " at " +
		hoursString + ":" + minutesString + postfix;
}
