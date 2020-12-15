class FacesDAO {
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
	
	// TODO: Determine how to handle a test that was taken but had empty fields
	/**
	 * !! Only updates true values. Leaves the false value as-in.
	 * @param whichEyesRecord
	 * @param dataJSON
	 * @returns {*}
	 */
	static checkWhichEyes(whichEyesRecord, dataJSON) {
		if (dataJSON.LeftResultsSymbols.length) {
			whichEyesRecord.left = true;
		}
		
		if (dataJSON.RightResultsSymbols.length) {
			whichEyesRecord.right = true;
		}
	}
	
	async loadForDashboard() {
		await this.db
			.collection("TestResults")
			.doc(this.userID)
			.collection("Smiley")
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
	
	async loadForDetailedView(testID, canvasLeft, canvasRight) {
		let _this = this;
		
		await this.db
			.collection("TestResults")
			.doc(this.userID)
			.collection("Smiley")
			.doc(testID)
			.get()
			.then(function(doc) {
				if (!doc) {
					console.log("Document not found. ID: " + testID);
					return;
				}
				
				_this.detailedViewTimeStamp = doc.data().TimeStampMS;	// Used for subtitle on detailed_view.html
				
				let ctxLeft = canvasLeft.getContext('2d');
				let ctxRight = canvasRight.getContext('2d');
				_this.drawToCanvas(ctxLeft, doc.data().LeftXLocations, doc.data().LeftYLocations);
				_this.drawToCanvas(ctxRight, doc.data().RightXLocations, doc.data().RightYLocations);
			});
		
	}
	
	// !! TESTING ONLY - Clones FireStore doc from existing
	manualAdd() {
		this.db.collection("TestResults")
			.doc(this.userID)
			.collection("Smiley")
			.add(this.docList[0])
			.then(() => {
				console.log("Manual document added.");
			});
	}
	
	// NOTE: The JSON returned needs to match the FireStore document structure for Smiley
	extractor(id, data) {
		return {
			id: id,
			TestName: data.TestName,
			TimeStampMS: data.TimeStampMS,
			LeftResultsSymbols: data.LeftResultsSymbols,
			LeftXLocations: data.LeftXLocations,
			LeftYLocations: data.LeftYLocations,
			RightResultsSymbols: data.RightResultsSymbols,
			RightXLocations: data.RightXLocations,
			RightYLocations: data.RightYLocations,
		}
	}
	
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
	
	// TODO: Update with actual method for detailed view
	// TODO: Refactor variable names below to be more readable
	addRowToTable(docID, timeStamp, targetTableID) {
		let testName = "Smiley";
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
	
	renderAggregate(leftCanvasID, rightCanvasID) {
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		let alphaIndex = 0;
		
		let max = this.docList.length;
		for (let i = 0; i < 3 && i < max; i++) {
			let doc = this.docList[i];
			ctxLeft.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			ctxRight.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			
			this.drawToCanvas(ctxLeft, doc.LeftXLocations, doc.LeftYLocations);
			this.drawToCanvas(ctxRight, doc.RightXLocations, doc.RightYLocations);
			
			alphaIndex++;
			if (alphaIndex > 3) {
				alphaIndex = 3;
				console.log("Warning: Alpha Index Exceeded 3 Iterations.");
			}
		}
	}
	
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
	
	drawToCanvas(ctx, xPositions, yPositions) {
		if (!ctx) {
			console.log("Invalid Canvas Context.");
			return;
		}
		
		let ratio = ctx.canvas.width / this.canvasSize;
		let w = 35;
		let h = 35;
		let r = w / 6;
		
		let xLength = xPositions.length;
		let yLength = yPositions.length;
		
		if (xPositions && yPositions && (xLength === yLength)) {
			for (let i = 0; i < xPositions.length; i++){
				let x = xPositions[i] * ratio;
				let y = yPositions[i] * ratio;
				
				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctx, x, y, w, h, r);
			}
		}
	}
	
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
	
	// !! NOTE: The TEST_NAME value has to match Firestore's collection name exactly
	// !! NOTE: URI's are relative to dashboard.html OR physiciansDash.html. NOT this DAO file.
	//	From physiciansDash.html
	//		./physiciansDetailedDash.html
	//
	//	From dashboard.html
	// 		./detailed_view.html
	URIBuilder(docID) {
		let uri = new URLSearchParams();
		uri.append("TEST_NAME", "Smiley");
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
	
	setIndex(ms) {
		let length = this.docList.length;
		let i = 0;
		
		// CHECK: Remove "or equal"?
		while (this.docList[i].TimeStampMS >= ms && i < length - 1) {
			i++;
		}
		
		return i;
	}
	
	formatDate(milliseconds) {
		return (new Date(milliseconds)).toDateString();
	}
	
	// TODO: docstring
	// TODO: Better year handling (abs, then mod 12 for number of years)
	monthMSHelper(current, number) {
		// !! TODO: ERROR HANDLING
		let year = 2020;
		if (current - number < 0) {
			year = year - 1;
		}
		
		let month = (current + (11 - number)) % 12;
		
		return Date.UTC(year, month, 1);
	}
	
}// class [ SmileyDAO ]