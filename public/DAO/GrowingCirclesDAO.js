class GrowingCirclesDAO {
	
	/**
	 * Constructor for the GrowingCirclesDAO
	 * @param db			- Reference to Firestore
	 * @param userID		- User's Firebase Auth UID
	 */
	constructor(db, userID) {
		this.db = db;
		this.userID = userID;
		this.docList = [];
		this.canvasSize = 700;								// TODO: Set this dynamically
		this.detailedViewTimeStamp = 0;						// Milliseconds. 0 == (1, 1, 1970)
		this.isPhysician = false;
		
		// The decimal array values below are equal to 20, 45, and 95% opacity levels respectively
		// The maximum value for the alpha component of an RGBA color in hex is FF, which is 255 in decimal.
		// e.g. [Hex F3 == Dec 243]
		// 			(243 / 255) -> 95%
		//			(F3 / FF)   -> 95%
		this.alphaLevels = ["33", "73", "F3"];
	}
	
	// TODO: Determine how to handle a test that was taken but had empty fields
	/**
	 * Updates the referenced whichEyesRecord JSON parameter according to whether
	 * 	the dataJSON parameter's data indicates the left or right eye has test results saved.
	 * Only updates for true values. Leaves the false values as-in.
	 * @param whichEyesRecord 	- JSON indicating which eyes were tested
	 * @param dataJSON			- Firestore document data
	 * @returns {*}
	 */
	static checkWhichEyes(whichEyesRecord, dataJSON) {
		if (dataJSON.XLocationsLeft.length) {
			whichEyesRecord.left = true;
		}
		
		if (dataJSON.XLocationsRight.length) {
			whichEyesRecord.right = true;
		}
	}

	/**
	 * Loads all documents within the GrowingCircles Firestore subcollection of TestResults
	 * 	for the currently logged-in user. Saves the ID and data of the documents
	 * 	to the object instance.
	 * @returns {Promise<void>}
	 */
	async loadForDashboard() {
		await this.db
			.collection("TestResults")
			.doc(this.userID)
			.collection("GrowingCircles")
			.orderBy("TimeStampMS", "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let extractedDoc = this.extractor(doc.id, doc.data());
					this.docList.push(extractedDoc);
				});
			});
		
		// this.manualAdd();	// This breaks as of (11/27/2020) due to missing fields in FireStore document
	}

	/**
	 * Loads the single document whose ID is specified by the testID parameter.
	 * Uses the canvas reference parameters to render the single document's results.
	 * NOTE: The "_this" variable maintains a reference to the calling object from
	 * 	within the anonymous function in the then() block.
	 * @param testID				- ID of Firestore document
	 * @param canvasLeft			- Reference to DOM of left canvas
	 * @param canvasRight			- Reference to DOM of right canvas
	 * @returns {Promise<void>}
	 */
	async loadForDetailedView(testID, canvasLeft, canvasRight) {
		let _this = this;

		await this.db
			.collection("TestResults")
			.doc(this.userID)
			.collection("GrowingCircles")
			.doc(testID)
			.get()
			.then(function (doc) {
				if (!doc) {
					console.log("Document not found. ID: " + testID);
					return;
				}

				_this.detailedViewTimeStamp = doc.data().TimeStampMS;	// Used for subtitle on detailed_view.html
			
				if (doc.data().Tested == "left") {
					let ctxLeft = canvasLeft.getContext('2d');
					_this.drawToCanvas(ctxLeft, doc.data().XLocationsLeft, doc.data().YLocationsLeft, doc.data().ZLocationsLeft);
				}
				else if (doc.data().Tested == "right") {
					let ctxRight = canvasRight.getContext('2d');
					_this.drawToCanvas(ctxRight, doc.data().XLocationsRight, doc.data().YLocationsRight, doc.data().ZLocationsRight);
				}
				else {
					// Else case uses document structures that predate commit 8f2d548
					let ctxLeft = canvasLeft.getContext('2d');
					let ctxRight = canvasRight.getContext('2d');
					_this.drawToCanvas(ctxLeft, doc.data().XLocationsLeft,
						doc.data().YLocationsLeft, doc.data().ZLocationsLeft);
					_this.drawToCanvas(ctxRight, doc.data().XLocationsRight,
						doc.data().YLocationsRight, doc.data().ZLocationsRight);
				}
			});
	}

	/**
	 * 	!! TESTING ONLY - Clones the first Firestore doc retrieved and uploads it back to Firestore
	 */
	manualAdd() {
		if (!this.docList[0]) {
			console.log("MANUAL ADD - Index 0 empty");
			return;
		}
		this.db.collection("TestResults")
			.doc(this.userID)
			.collection("GrowingCircles")
			.add(this.docList[0])
			.then(() => {
				console.log("Manual document added.");
			});
	}
	
	/**
	 * This function accomplishes two functions:
	 * 	1. Extract the relevant data we need from the Firestore document
	 * 	2. Store the information locally as a true JSON (as compared with Firestore's
	 * 		document that is technically only SIMILAR to a JSON)
	 * NOTE: Due to the way the Growing Circles test results are generated, if conditions were
	 * 		required to load the data properly dependent on which eyes were tested.
	 * NOTE: The field names of parameter "data" need to match documents of the GrowingCircles subcollection.
	 * @param id			- Firestore document ID
	 * @param data			- Data of a Firestore document
	 * @returns {{TestName: *, YLocationsRight: [], ZLocationsRight: [], TimeStampMS: *,
	 * 				id: *, Tested: (string), XLocationsRight: []}
	 * 				|
	 * 			 {TestName: *, ZLocationsLeft: [], XLocationsLeft: [], YLocationsLeft: [], TimeStampMS: *,
	 * 				id: *, Tested: (string)}
	 * 				|
	 * 			 {TestName: *, YLocationsRight: [], ZLocationsLeft: [], XLocationsLeft: [], YLocationsLeft: [],
	 * 				ZLocationsRight: [], TimeStampMS: *, id: *, XLocationsRight: []}}
	 */
	extractor(id, data) {
		
		if (data.Tested == "left") {
			//Test Results for left eye
			return {
				id: id,
				TestName: data.TestName,
				TimeStampMS: data.TimeStampMS,
				XLocationsLeft: data.XLocationsLeft,
				YLocationsLeft: data.YLocationsLeft,
				ZLocationsLeft: data.ZLocationsLeft,
				Tested: data.Tested,
			}
		}
		else if (data.Tested == "right") {
			//Test Results for right eye
			return {
				id: id,
				TestName: data.TestName,
				TimeStampMS: data.TimeStampMS,
				XLocationsRight: data.XLocationsRight,
				YLocationsRight: data.YLocationsRight,
				ZLocationsRight: data.ZLocationsRight,
				Tested: data.Tested,
			}
		}
		else {
			//Test Results for Both eyes
			return {
				id: id,
				TestName: data.TestName,
				TimeStampMS: data.TimeStampMS,
				XLocationsLeft: data.XLocationsLeft,
				XLocationsRight: data.XLocationsRight,
				YLocationsLeft: data.YLocationsLeft,
				YLocationsRight: data.YLocationsRight,
				ZLocationsLeft: data.ZLocationsLeft,
				ZLocationsRight: data.ZLocationsRight,
			}
		}
	}

	/**
	 * Iterates through the documents loaded from Firestore and translates them to
	 * 	rows in the history table.
	 * @param targetTableID		- ID of the history DOM table
	 */
	populateHistoryTable(targetTableID) {
		if (!this.userID) {
			console.log("User ID is null");
			return;
		}
		
		for (let i = 0; i < this.docList.length; i++) {
			let doc = this.docList[i];
			let timeStamp = doc.TimeStampMS;
			this.addRowToTable(doc.id, timeStamp, targetTableID);
		}
	}

	/**
	 * Attaches the constructed row to the target history table. The row is created by
	 * 	generating HTML DOM elements that constitutes a row of the table and attaches
	 * @param docID				- Firestore document ID
	 * @param timeStamp			- Timestamp of document (i.e. test result) in milliseconds
	 * @param targetTableID		- ID of history DOM table
	 */
	addRowToTable(docID, timeStamp, targetTableID) {
		let testName = "Growing Circles";
		let time = this.formatDate(timeStamp);
		let urlOfDetailedView = this.URIBuilder(docID);
		
		// ID of which table to put the data into (HTML Attribute ID)
		let tableBody = document.getElementById(targetTableID);
		
		// Table Row
		let row = document.createElement("tr");
		
		// Table Columns
		let columnTestName = document.createElement("td");
		let columnTime = document.createElement("td");
		let columnID = document.createElement("td");
		
		// Will be a child of columnURL so we can add hyperlink
		let linkForDetailedView = document.createElement("a");
		
		// Text to be put in the Columns
		let textTestName = document.createTextNode(testName);
		let textTime = document.createTextNode(time);
		let textID = document.createTextNode("Details");
		
		// Set href attribute for link to test
		linkForDetailedView.appendChild(textID);
		linkForDetailedView.setAttribute("href", urlOfDetailedView);
		
		// Put the Text into their respective Columns
		columnTestName.appendChild(textTestName);
		columnTime.appendChild(textTime);
		columnID.appendChild(linkForDetailedView);
		
		// Add each the Columns to the Row
		row.appendChild(columnTestName);
		row.appendChild(columnTime);
		row.appendChild(columnID);
		
		// Add the Row to the Table
		tableBody.appendChild(row);
	}

	/**
	 * Render default view to the canvas(es).
	 * Uses the 3 most-recent documents to render test results where the newer the document
	 * 	(i.e. test results), the dark the color is ("darker" refers to a higher opacity/alpha).
	 * @param leftCanvasID		- ID of the left canvas
	 * @param rightCanvasID		- ID of the right canvas
	 */
	renderAggregate(leftCanvasID, rightCanvasID) {
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		let alphaIndex = 0;
		
		let max = this.docList.length;

        if (max < 3) {
            alphaIndex = (3 - (max + 1)); // (max + 1) to compensate for index vs length
        }

		for (let i = 0; i < 3 && i < max; i++) {
			let doc = this.docList[i];
			ctxLeft.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			ctxRight.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			
			if (doc.Tested == "left") {
				this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			}
			else if (doc.Tested == "right") {
				this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			}
			else {
				this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
				this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			}
			
			alphaIndex++;
			if (alphaIndex > 3) {
				alphaIndex = 3;
				console.log("Warning: Alpha Index Exceeded 3 Iterations.");
			}
		}
	}

	/**
	 * Renders the single most recent document to the canvas(es).
	 * @param leftCanvasID		- ID of the left canvas
	 * @param rightCanvasID		- ID of the right canvas
	 */
	renderMostRecent(leftCanvasID, rightCanvasID) {
		if (!this.docList[0]) {
			console.log("First document (most recent) empty.")
			return;
		}
		
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		
		ctxLeft.fillStyle = "#f47171";
		ctxRight.fillStyle = "#f47171";
		
		let doc = this.docList[0];
		if (doc.Tested == "left") {
			this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
		}
		else if (doc.Tested == "right") {
			this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
		}
		else {
			this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
		}
	}
	
	/**
	 * Renders to the canvas(es) any documents that are dated within the selected month.
	 * @param month				- The selected month (integer, where 1 == January)
	 * @param leftCanvasID		- Left canvas ID
	 * @param rightCanvasID		- Right canvas ID
	 */
	renderSelectedMonth(month, leftCanvasID, rightCanvasID) {
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		
		ctxLeft.fillStyle = "#f47171";
		ctxRight.fillStyle = "#f47171";
		
		let dateStringEarliest = month + " 1 2020";
		let dateStringLatest;
		
		if (+month === 12) {
			// Handle December as chosen start month
			dateStringLatest = "1 1 2021";
		}
		else {
			dateStringLatest = (+month + 1) + " 1 2020";
		}
		
		let msEarliest = (new Date(dateStringEarliest)).getTime();
		let msLatest = (new Date(dateStringLatest)).getTime();
		
		// !! NOTE: docList[] is sorted in descending order by TimeStampMS
		//       So the earlier date (smallest millisecond) is closer to the end of the array
		let startIndex = this.setIndex(msLatest);
		let endIndex = this.setIndex(msEarliest);
		
		// TODO: Check for off-by-one
		for (let i = startIndex; i <= endIndex; i++) {
			let doc = this.docList[i];
			
			if (doc.Tested == "left") {
				this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			}
			else if (doc.Tested == "right") {
				this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			}
			else {
				this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
				this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			}
		}
	}
	
	/**
	 * Renders to the canvas(es) any documents that are dated within the month
	 * 	range provided.
	 * @param monthsBack		- How many months back from the current month to use
	 * @param leftCanvasID		- Left canvas ID
	 * @param rightCanvasID		- Right canvas ID
	 */
	renderMonthRange(monthsBack, leftCanvasID, rightCanvasID) {
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		
		ctxLeft.fillStyle = "#f47171";
		ctxRight.fillStyle = "#f47171";
		
		let current = (new Date).getMonth();
		let ms = this.monthMSHelper(current, monthsBack);
		let index = this.setIndex(ms);
		
		for (let i = 0; i < index; i++) {
			let doc = this.docList[i];
			if (doc.Tested == "left") {
				this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			}
			else if (doc.Tested == "right") {
				this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			}
			else {
				this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
				this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			}
		}
	}
	
	/**
	 * Draws the circles to the canvas at the coordinates specified by xPos and yPos, with a diameter of zPos
	 * 	parameters, via the canvas context ctx parameter.
	 * @param ctx				- 2D context of the canvas to draw to (either left or right)
	 * @param xPos				- X coordinates of the circles to draw
	 * @param yPos				- Y coordinates of the circles to draw
	 * @param zPos				- Diameter of the circles to draw
	 */
	drawToCanvas(ctx, xPos, yPos, zPos) {
		if (!ctx) {
			console.log("Invalid Canvas Context.");
			return;
		}
		for (var i = 0; i < yPos.length; i++) {
			
			if (isNaN(xPos[i]) || isNaN(yPos[i]) || isNaN(zPos[i])) {
				// This check here makes the populateX functions cleaner by removing checks there
				console.log("z: " + zPos[i]);
				console.log("y: " + yPos[i]);
				console.log("x: " + xPos[i]);
				console.log("One of more locations NaN");
				return;
			}
			
			/* console.log("Not NaN z: " + zPos);
			console.log("Not NaN y: " + yPos);
			console.log("Not NaN x: " + xPos); */
			
			let ratio = ctx.canvas.width / this.canvasSize;
			let x = xPos[i] * ratio;
			let y = yPos[i] * ratio;
			let z = zPos[i] * ratio;
			
			ctx.beginPath();
			ctx.arc(x, y, z, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	
	/**
	 * Builds a URI that contains key value pairs for the test's name and document ID
	 * NOTE: The TEST_NAME value has to match Firestore's collection name exactly
	 * NOTE: URI's are relative to dashboard.html OR physiciansDash.html. NOT this DAO file.
	 * 	From physiciansDash.html
	 * 		./physiciansDetailedDash.html
	 * 	From dashboard.html
	 * 		./detailed_view.html
	 * @param docID				- ID of Firestore document
	 * @returns {string}
	 */
	URIBuilder(docID) {
		let uri = new URLSearchParams();
		uri.append("TEST_NAME", "GrowingCircles");
		uri.append("TEST_ID", docID);
		
		if (this.isPhysician) {
			// When user is a physician, userID is their patient's ID
			uri.append("PATIENT_ID", this.userID);
			return "./physicianDetailedView.html?" + uri.toString();
		}
		else {
			return "./detailed_view.html?" + uri.toString();
		}
	}
	
	/**
	 * Helper function to position the iterator at the index  in the doclist
	 * 	array in which the milliseconds is equal to or greater than the
	 * 	ms parameter. This is useful for retrieving only the documents that
	 * 	fall within a date range.
	 * @param ms			- Milliseconds of the date to move the iterator to
	 * @returns {number}
	 */
	setIndex(ms) {
		let length = this.docList.length;
		let i = 0;
		
		// CHECK: Remove "or equal"?
		while (this.docList[i].TimeStampMS >= ms && i < length - 1) {
			i++;
		}
		
		return i;
	}
	
	/**
	 * Formats the milliseconds parameter into a human readable date string.
	 * @param milliseconds			- Milliseconds of the date to convert
	 * @returns {string}
	 */
	formatDate(milliseconds) {
		return (new Date(milliseconds)).toDateString();
	}
	
	/**
	 * Returns the milliseconds of the specified date.
	 * @param current			- Current month (integer)
	 * @param number			- How many months to go back
	 * @returns {number}
	 */
	monthMSHelper(current, number) {
		// !! TODO: ERROR HANDLING
		let year = 2020;
		if (current - number < 0) {
			year = year - 1;
		}
		
		let month = (current + (11 - number)) % 12;
		
		return Date.UTC(year, month, 1);
	}
	
}// class [ GrowingCirclesDAO ]