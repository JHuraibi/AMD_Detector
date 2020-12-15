class FreeDrawDAO {
	
	/**
	 * Constructor for the FreeDrawDAO
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
	}

	/**
	 * Loads all documents within the FreeDraw Firestore subcollection
	 * 	for the currently logged-in user. Saves the ID and data of the documents
	 * 	to the object instance.
	 * @returns {Promise<void>}
	 */
	async loadForDashboard() {
		await this.db
			.collection("TestResults")
			.doc(this.userID)
			.collection("FreeDraw")
			.orderBy("TimeStampMS", "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let extractedDoc = this.extractor(doc.id, doc.data());
					this.docList.push(extractedDoc);
				});
			});
	}

	/**
	 * Loads the single document whose ID is specified by the testID parameter.
	 * Uses the canvas reference parameters to render the single document's results.
	 * NOTE: The "_this" variable maintains a reference to the calling object from
	 * 	within the anonymous function in the then() block.
	 * NOTE: The right canvas is not used. In fact, it is disabled and hidden before this function
	 * 	is even called. The FreeDraw test only has a single canvas-worth of data.
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
			.collection("FreeDraw")
			.doc(testID)
			.get()
			.then(function(doc) {
				if (!doc) {
					console.log("Document not found. ID: " + testID);
					return;
				}
				
				_this.detailedViewTimeStamp = doc.data().TimeStampMS;	// Used for subtitle on detailed_view.html
				
				let ctxLeft = canvasLeft.getContext('2d');
				_this.drawToCanvas(ctxLeft, doc.data().ImageData);
			});
		
	}

	/**
	 * This function accomplishes two functions:
	 * 	1. Extract the relevant data we need from the Firestore document
	 * 	2. Store the information locally as a true JSON (as compared with Firestore's
	 * 		document that is technically only SIMILAR to a JSON)
	 * NOTE: The field names of parameter "data" need to match documents of the FreeDraw subcollection
	 * @param id			- Firestore document ID
	 * @param data			- Data of a Firestore document
	 * @returns {{TestName: *, ImageData: *, TimeStampMS: *, id: *}}
	 */
	extractor(id, data) {
		return {
			id: id,
			TestName: data.TestName,
			TimeStampMS: data.TimeStampMS,
			ImageData: data.ImageData,
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
	 * 	it to the existing history table seleton
	 * @param docID				- Firestore document ID
	 * @param timeStamp			- Timestamp of document (i.e. test result) in milliseconds
	 * @param targetTableID		- ID of history DOM table
	 */
	addRowToTable(docID, timeStamp, targetTableID) {
		let testName = "Free Draw";
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
		
		// Children of columnID and columnURL are hyperlinks
		let linkForDetailedView = document.createElement("a");
		
		// Text to be put in the Columns
		let textTestName = document.createTextNode(testName);
		let textTime = document.createTextNode(time);
		let textID = document.createTextNode("Details");
		
		// Set href attribute for links
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
	 * Renders the contents of the drawingData parameter to the canvas
	 * 	via the ctx parameter context variable.
	 * @param ctx					- 2D context of the canvas to draw to
	 * @param drawingData			- Data to draw the line segments and their width
	 */
	drawToCanvas(ctx, drawingData) {
		if (!ctx) {
			console.log("Left Canvas DOM not found.");
			return;
		}
		
		let ratio = ctx.canvas.width / this.canvasSize;
		// let ratio = 2;
		
		if (drawingData) {
			for (let i = 0; i < drawingData.length - 1; i++) {
				let line = drawingData[i];
				
				let x = line.x * ratio;
				let y = line.y * ratio;
				let pX = line.pX * ratio;
				let pY = line.pY * ratio;
				let w = line.w * ratio;
				
				// Draw shape as a line with stroke thickness 'w' and rounded end caps
				this.line(ctx, x, y, pX, pY, w);
			}
		}
		
		this.drawStaticAxes(ctx, ctx.canvas.width, ctx.canvas.width);
	}

	/**
	 * Draws a line segment with:
	 * 	- Start point (x, y),
	 * 	- End point (pX, pY)
	 * 	- A width/thickness of w
	 * @param ctx		- 2D context of the canvas to draw to
	 * @param x			- Start point X coordinate
	 * @param y			- Start point Y coordinate
	 * @param pX		- End point X coordinate
	 * @param pY		- End point Y coordinate
	 * @param w			- Line segment width
	 */
	line(ctx, x, y, pX, pY, w) {
		ctx.beginPath();
		ctx.lineWidth = w;
		ctx.lineCap = "round";
		ctx.moveTo(x, y);
		ctx.lineTo(pX, pY);
		ctx.stroke();
	}

	/**
	 * Draws the unchanging vertical and horizontal centers lines to the canvas.
	 * @param ctx		- 2D context of the canvas to draw to
	 * @param w			- Width of canvas
	 * @param h			- Height of canvas
	 */
	drawStaticAxes(ctx, w, h) {
		ctx.lineWidth = 2;
		
		ctx.beginPath();
		ctx.moveTo(w / 2, 0);
		ctx.lineTo(w / 2, h);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(0, h / 2);
		ctx.lineTo(w, h / 2);
		ctx.stroke();
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
		uri.append("TEST_NAME", "FreeDraw");
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
	 * Formats the milliseconds parameter into a human readable date string.
	 * @param milliseconds			- Milliseconds of the date to convert
	 * @returns {string}
	 */
	formatDate(milliseconds) {
		return (new Date(milliseconds)).toDateString();
	}
	
}// class [ FreeDrawDAO ]
