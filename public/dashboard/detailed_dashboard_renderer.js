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

/**
 * Handles the extraction of the data put into the URI, initialization of the DAO,
 * 	setting the title, and drawing to the canvas(es).
 *
 * A single generic DAO is defined and is then initialized by a switch statement
 * 	with the case value being extracted from the URI (the URI is encoded when the
 * 	dashboard is loaded. And is specifically set in the DAOs' populateHistoryTable() ).
 * 	This is possible because each DAO has the same loadForDetailedView() function with
 * 	the same parameters (i.e. the test result Firestore document ID and the DOM IDs of the HTML
 * 	canvas element(s)). The difference is in what the DAOs draws.
 *
 * The promise returned is not used, as of (Dec 6, 2020)
 * @returns {Promise<void>}
 */
async function pageRouter() {
	getURIData();
	await defineDAO();
	setTestNameTitle(testName);
	drawResults();
}

/**
 * Extracts the information encoded into the URI (URI is encoded when the
 * 	dashboard is loaded. And is specifically set in the DAOs' populateHistoryTable() ).
 */
function getURIData() {
	uriPassedIn = new URLSearchParams(window.location.search);
	testName = uriPassedIn.get("TEST_NAME");
	testID = uriPassedIn.get("TEST_ID");
}

/**
 * Initializes the single, generic DAO object.
 */
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

		case "Smiley":
			genericDAO = new FacesDAO(dbRef, patientUID);
			break;


		// case "Fractal":
		// 	setTestNameTitle("Fractal");
		// 	break;
	}
}

/**
 * The DAO loads the single test result document from FireStore. loadForDetailedView()
 * 	will also record the timestamp of the single loaded document. This lets setDateSubtitle()
 * 	use the date at a later time.
 *
 * If the DAO is drawing results for Free Draw, the extra right canvas and the
 * 	"Left" and "Right" table captions are all hidden. Free Draw only uses 1 canvas.
 * @returns {Promise<void>}
 */
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

/**
 * Sets the title for the page (i.e. the test's name) using the extracted
 *  name from the URI.
 */
// NOTE: The single dash and space characters are here so that
//			if this function fails to return a test name to
//			the header, the header then won't look incomplete.
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

		case "Smiley":
			postfix = " - Smiley";
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

/**
 * Converts, formats, and sets the date/time subtitle.
 * @param milliseconds
 */
function setDateSubtitle(milliseconds) {
	if (!milliseconds) {
		console.log("Error getting Time Stamp from DAO");
		return;
	}

	let subtitleElement = document.getElementById("dateSubtitle");
	let date = new Date(milliseconds);
	let dateString = date.toDateString();
	let timezoneHour = date.toLocaleTimeString("en-US", { timeZone: "America/New_York" });	// IF TIME: Remove seconds

	subtitleElement.innerText =
		subtitleElement.innerText + dateString + " at " + timezoneHour;
}