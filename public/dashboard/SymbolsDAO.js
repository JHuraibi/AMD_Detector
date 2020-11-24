class SymbolsDAO {
	constructor(dbRef, leftCanvasID, rightCanvasID) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		this.leftCanvas = document.getElementById(leftCanvasID);
		this.rightCanvas = document.getElementById(rightCanvasID);
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 600;
		
		// These values are equal to 20, 45, and 95% opacity levels respectively
		// Max alpha in hex is FF or 255 in decimal
		// e.g. [Hex F3 == Dec 243]
		// 			(243 / 255) -> 95%
		//			(F3 / FF)   -> 95%
		this.alphaLevels = ["33", "73", "F3"];
		this.leftAlphaIndex = 0;
		this.rightAlphaIndex = 0;
		this.useAlpha = false;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	populateAggregate() {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		this.useAlpha = true;
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("Symbols")
			.orderBy("TimeStampMS", "desc")
			.limit(3)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.drawLeftToCanvas(doc);
					this.drawRightToCanvas(doc);
				});
			})
			.then(() => {
				// Once DB query and drawing are complete, reset variables specific to populateAggregate()
				this.useAlpha = false;
				this.leftAlphaIndex = 0;
				this.rightAlphaIndex = 0;
			});
	}
	
	populateMostRecent() {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("Symbols")
			.orderBy("TimeStampMS", "desc")
			.limit(1)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.drawLeftToCanvas(doc);
					this.drawRightToCanvas(doc);
				});
			});
	}
	
	// !! TODO: Error handling (especially getting values from Firebase)
	// !! TODO: Refactor to make reading easier
	// NOTE: Font size was hardcoded to 35px in symbols_test.js. So rectangle w = 35 and h = 35
	drawLeftToCanvas(doc) {
		if (!doc) {
			console.log("FireStore document provided was null.");
			return;
		}
		
		if (!this.leftCanvas) {
			console.log("Left Canvas DOM not found.");
			return;
		}
		
		let leftResultSymbols = doc.data().LeftResultsSymbols;
		let xPositions = doc.data().LeftXLocations;
		let yPositions = doc.data().LeftYLocations;
		
		let ctxLeft = this.leftCanvas.getContext('2d');
		let ratio = this.leftCanvas.width / this.hardCodedCanvasSize;
		let w = 35;
		let h = 35;
		let r = w / 6;
		
		if (this.useAlpha) {
			let alpha = this.getNextLeftAlpha();
			ctxLeft.fillStyle = "#f47171" + alpha;
		}
		
		if (leftResultSymbols) {
			for (let i = 0; i < xPositions.length; i++) {
				let x = xPositions[i] * ratio;
				let y = yPositions[i] * ratio;

				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctxLeft, x, y, w, h, r);
			}
		}
	}
	
	drawRightToCanvas(doc) {
		if (!doc) {
			console.log("FireStore document provided was null.");
			return;
		}
		
		if (!this.rightCanvas) {
			console.log("Right Canvas DOM not found.");
			return;
		}
		
		let rightResultSymbols = doc.data().RightResultsSymbols;
		let xPositions = doc.data().RightXLocations;
		let yPositions = doc.data().RightYLocations;
		
		let ctxRight = this.rightCanvas.getContext('2d');
		let ratio = this.rightCanvas.width / this.hardCodedCanvasSize;
		let w = 35;
		let h = 35;
		let r = w / 6;
		
		if (this.useAlpha) {
			let alpha = this.getNextRightAlpha();
			ctxRight.fillStyle = "#f47171" + alpha;
		}
		
		if (rightResultSymbols) {
			for (let i = 0; i < xPositions.length; i++) {
				let x = xPositions[i] * ratio;
				let y = yPositions[i] * ratio;
				
				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctxRight, x, y, w, h, r);
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
	
	// CHECK: How can I make this more modular for different tables?
	populateHistoryTable(targetTableID) {
		if (!userRef) {
			console.log("[SymbolsDAO: populateFullBarsTable] - User is null");
			return;
		}
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("Symbols")
			.orderBy("TimeStampMS", "desc")
			.limit(3)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let timeStamp = doc.data().TimeStampMS;
					this.addRowToTable(doc.id, timeStamp, targetTableID);
				});
			});
	}
	
	// TODO: Refactor function name to match other DAO's
	// TODO: Refactor variable names below to be more readable
	addRowToTable(docID, timeStamp, targetTableID) {
		let testName = "Symbols";
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
	
	// !! NOTE: URI's are relative to dashboard.html. NOT this DAO file.
	// !! NOTE: The TEST_NAME key's value has to match Firestore's document exactly
	//			e.g.
	//			[CORRECT] 	urlOfDetailedView == ./dashboard/detailed_view.html
	//			[INCORRECT] urlOfDetailedView == ./detailed_view.html
	URIBuilder(docID) {
		let uri = new URLSearchParams();
		uri.append("TEST_NAME", "Symbols");
		uri.append("TEST_ID", docID);
		return "./dashboard/detailed_view.html?" + uri.toString();
	}
	
	formatDate(milliseconds) {
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
		
		// return dateString + " at " + hoursString + ":" + minutesString + postfix;
		return dateString;
	}
	
	// TODO: Can replace this.useAlpha?
	// TODO: Refactor name
	getNextLeftAlpha() {
		let alpha = this.alphaLevels[this.leftAlphaIndex];
		this.leftAlphaIndex++;
		
		if (this.leftAlphaIndex > 3) {
			this.leftAlphaIndex = 0;
			console.log("Warning: Left Alpha Index Exceeded 3 Iterations.");
		}
		
		return alpha;
	}
	
	// TODO: Can replace this.useAlpha?
	// TODO: Refactor name
	getNextRightAlpha() {
		let alpha = this.alphaLevels[this.rightAlphaIndex];
		this.rightAlphaIndex++;
		
		if (this.rightAlphaIndex > 3) {
			this.rightAlphaIndex = 0;
			console.log("Warning: Right Alpha Index Exceeded 3 Iterations.");
		}
		
		return alpha;
	}
	
}// class [ SymbolsDAO ]
