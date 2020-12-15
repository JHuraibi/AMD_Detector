class FullBarsDAO {
	
	/**
	 * Constructor for the FullBarsDAO
	 * @param db			- Reference to Firestore
	 * @param userID		- User's Firebase Auth UID
	 */
	constructor(db, userID) {
		this.db = db;
		this.userID = userID;
		this.docList = [];
		this.canvasSize = 800;								// TODO: Set this dynamically
		this.detailedViewTimeStamp = 0;						// Milliseconds. 0 == (1, 1, 1970)
		this.isPhysician = false;
		
		// The decimal array values below are equal to 20, 45, and 95% opacity levels respectively
		// The maximum value for the alpha component of an RGBA color in hex is FF, which is 255 in decimal
		// e.g. [Hex F3 == Dec 243]
		// 			(243 / 255) -> 95%
		//			(F3 / FF)   -> 95%
		this.alphaLevels = ["33", "73", "F3"];
	}
	
	/**
	 * Updates the referenced whichEyesRecord JSON parameter according to whether
	 * 	the dataJSON parameter's data indicates the left or right eye has test results saved.
	 * Only updates for true values. Leaves the false values as-in.
	 * @param whichEyesRecord 	- JSON indicating which eyes were tested
	 * @param dataJSON 			- Firestore document data
	 * @returns {*}
	 */
	static checkWhichEyes(whichEyesRecord, dataJSON) {
		// TODO: Determine how to handle a test that was taken but had empty fields
		if (dataJSON.LeftXLocations.length || dataJSON.LeftYLocations.length) {
			whichEyesRecord.left = true;
		}
		
		if (dataJSON.RightXLocations.length || dataJSON.RightYLocations.length) {
			whichEyesRecord.right = true;
		}
	}
	
	/**
	 * Loads all documents within the FullBars Firestore subcollection of TestResults
	 * 	for the currently logged-in user. Saves the ID and data of the documents
	 * 	to the object instance.
	 * @returns {Promise<void>}
	 */
	async loadForDashboard() {
		await this.db
			.collection("TestResults")
			.doc(this.userID)
			.collection("FullBars")
			.orderBy("TimeStampMS", "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let extractedDoc = this.extractor(doc.id, doc.data());
					this.docList.push(extractedDoc);
				});
			});
		
		// this.manualAdd();
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
			.collection("FullBars")
			.doc(testID)
			.get()
			.then(function (doc) {
				if (!doc) {
					console.log("Document not found. ID: " + testID);
					return;
				}
				_this.detailedViewTimeStamp = doc.data().TimeStampMS; 	// Used for subtitle on detailed_view.html
				
				let ctxLeft = canvasLeft.getContext('2d');
				let ctxRight = canvasRight.getContext('2d');
				_this.drawToCanvas(ctxLeft, doc.data().LeftXLocations, doc.data().LeftYLocations);
				_this.drawToCanvas(ctxRight, doc.data().RightXLocations, doc.data().RightYLocations);
			});
		
	}

	/**
	 * 	!! TESTING ONLY - Clones the first Firestore doc retrieved and uploads it back to Firestore
	 */
	manualAdd() {
		this.db.collection("TestResults")
			.doc(this.userID)
			.collection("FullBars")
			.add(this.docList[0])
			.then(() => {
				console.log("Manual document added.");
			});
	}
	
	/**
	 * 	 * This function accomplishes two functions:
	 * 	1. Extract the relevant data we need from the Firestore document
	 * 	2. Store the information locally as a true JSON (as compared with Firestore's
	 * 		document that is technically only SIMILAR to a JSON)
	 * NOTE: The field names of parameter "data" need to match documents of the FullBars subcollection
	 * @param id			- Firestore document ID
	 * @param data			- Data of a Firestore document
	 * @returns {{TestName: *, RightYLocations: [], TimeStampMS: *, LeftXLocations: [],
	 * 				RightXLocations: [], id: *, LeftYLocations: []}}
	 */
	extractor(id, data) {
		return {
			id: id,
			TestName: data.TestName,
			TimeStampMS: data.TimeStampMS,
			LeftXLocations: data.LeftXLocations,
			LeftYLocations: data.LeftYLocations,
			RightXLocations: data.RightXLocations,
			RightYLocations: data.RightYLocations,
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
		let testName = "Full Bars";
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
		if(max < 3){
			alphaIndex = (3 - (max + 1)); // (max + 1) to compensate for index vs length
		}

		for (let i = 0; i < 3 && i < max; i++) {
			let doc = this.docList[i];
			ctxLeft.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			ctxRight.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			
			this.drawToCanvas(ctxLeft, doc.LeftXLocations, doc.LeftYLocations);
			this.drawToCanvas(ctxRight, doc.RightXLocations, doc.RightYLocations);
			
			alphaIndex++;
			if (alphaIndex > 2) {
				alphaIndex = 2;
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
		this.drawToCanvas(ctxLeft, doc.LeftXLocations, doc.LeftYLocations);
		this.drawToCanvas(ctxRight, doc.RightXLocations, doc.RightYLocations);
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
			
			this.drawToCanvas(ctxLeft, doc.LeftXLocations, doc.LeftYLocations);
			this.drawToCanvas(ctxRight, doc.RightXLocations, doc.RightYLocations);
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
			
			this.drawToCanvas(ctxLeft, doc.LeftXLocations, doc.LeftYLocations);
			this.drawToCanvas(ctxRight, doc.RightXLocations, doc.RightYLocations);
		}
	}
	
	/**
	 * Draws bars to the canvas at the coordinates specified by xPositions and yPositions
	 * 	parameters, via the canvas context ctx parameter.
	 * @param ctx				- 2D context of the canvas to draw to (either left or right)
	 * @param xPositions		- X coordinates of the items to draw
	 * @param yPositions		- Y coordinates of the items to draw
	 */
	drawToCanvas(ctx, xPositions, yPositions) {
		if (!ctx) {
			console.log("Invalid Canvas Context.");
			return;
		}
		
		let ratio = ctx.canvas.width / this.canvasSize;
		let barL = ctx.canvas.width;
		let barW = 10;
		let r = (barW / 2) / 1.5;		// !! MAXIMUM radius is half the bar's thickness
		
		if (xPositions) {
			xPositions.forEach((xPos) => {
				let x = xPos * ratio;
				let y = 0;
				let w = barW;
				let h = barL;
				
				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctx, x, y, w, h, r);
			});
		}
		
		if (yPositions) {
			yPositions.forEach((yPos) => {
				let x = 0;
				let y = yPos * ratio;
				let w = barL;
				let h = barW;
				
				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctx, x, y, w, h, r);
			});
		}
	}
	
	/**
	 * Helper function to draw the bar as a rectangle with rounded corners.
	 * @param ctx		- 2D context of the canvas to draw to (either left or right)
	 * @param x			- X coordinate
	 * @param y			- Y coordinate
	 * @param w			- How wide to draw the square
	 * @param h			- How high to draw the square
	 * @param r			- Corner radius
	 */
	roundedRectangle(ctx, x, y, w, h, r) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();
		
		ctx.fill();
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
		uri.append("TEST_NAME", "FullBars");
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

}// class [ FullBarsDAO ]