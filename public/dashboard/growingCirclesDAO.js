class GrowingCirclesDAO {
	constructor(dbRef, leftCanvasID, rightCanvasID) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		this.leftCanvas = document.getElementById(leftCanvasID);
		this.rightCanvas = document.getElementById(rightCanvasID);
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 700;
		
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
			.collection("GrowingCircles")
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
			.collection("GrowingCircles")
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
	
	// !! TODO: Refactor to make reading easier
	drawLeftToCanvas(doc) {
		if (!doc) {
			console.log("FireStore document provided was null.");
			return;
		}
		
		if (!this.leftCanvas) {
			console.log("Left Canvas DOM not found.");
			return;
		}
		
		let ctxLeft = this.leftCanvas.getContext('2d');
		
		let xPositions = doc.data().XLocationsLeft;
		let yPositions = doc.data().YLocationsLeft;
		let zPositions = doc.data().ZLocationsLeft;
		
		let ratio = this.leftCanvas.width / this.hardCodedCanvasSize;
		
		if (this.useAlpha) {
			let alpha = this.getNextLeftAlpha();
			ctxLeft.fillStyle = "#f47171" + alpha;
		}
		
		for (let i = 0; i < xPositions.length; i++) {
			let x = xPositions[i] * ratio;
			let y = yPositions[i] * ratio;
			let z = zPositions[i] * ratio;
			
			ctxLeft.beginPath();
			ctxLeft.arc(x, y, z, 0, Math.PI * 2);
			ctxLeft.fill();
		}
	}
	
	drawRightToCanvas(doc) {
		if (!doc) {
			console.log("FireStore document provided was null.");
			return;
		}
		
		if (!this.leftCanvas) {
			console.log("Left Canvas DOM not found.");
			return;
		}
		
		let ctxRight = this.rightCanvas.getContext('2d');
		
		let xPositions = doc.data().XLocationsRight;
		let yPositions = doc.data().YLocationsRight;
		let zPositions = doc.data().ZLocationsRight;
		
		// CHECK: Using leftCanvas width sufficient?
		let ratio = this.rightCanvas.width / this.hardCodedCanvasSize;
		
		if (this.useAlpha) {
			let alpha = this.getNextRightAlpha();
			ctxRight.fillStyle = "#f47171" + alpha;
		}
		
		for (let i = 0; i < xPositions.length; i++) {
			let x = xPositions[i] * ratio;
			let y = yPositions[i] * ratio;
			let z = zPositions[i] * ratio;
			
			ctxRight.beginPath();
			ctxRight.arc(x, y, z, 0, Math.PI * 2);
			ctxRight.fill();
		}
	}
	
	populateHistoryTable(targetTableID) {
		if (!userRef) {
			console.log("[GrowingCirclesDAO: populateGrowingCirclesTable] - User is null");
			return;
		}
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("GrowingCircles")
			.orderBy("TimeStampMS", "desc")
			.limit(3)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let timeStamp = doc.data().TimeStampMS;
					this.addRowToTableGC(doc.id, timeStamp, targetTableID);
				});
			});
	}
	
	// TODO: Update with actual method for detailed view
	// TODO: Refactor variable names below to be more readable
	addRowToTableGC(docID, timeStamp, targetTableID) {
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
	
	// !! NOTE: URI's are relative to dashboard.html. NOT this DAO file.
	// !! NOTE: The TEST_NAME key's value has to match Firestore's document exactly
	//			e.g.
	//			[CORRECT] 	urlOfDetailedView == ./dashboard/detailed_view.html
	//			[INCORRECT] urlOfDetailedView == ./detailed_view.html
	URIBuilder(docID) {
		let uri = new URLSearchParams();
		uri.append("TEST_NAME", "GrowingCircles");
		uri.append("TEST_ID", docID);
		return "./dashboard/detailed_view.html?" + uri.toString();
	}
	
	formatDate(milliseconds) {
		let date = new Date(milliseconds);
		
		let dateString = date.toDateString();
		let hoursString = date.getUTCHours();
		let minutesString = date.getUTCMinutes();
		let postfix = hoursString > 11 ? "PM" : "AM";
		
		if (hoursString === 0) {
			hoursString = 12;
		}
		
		minutesString = minutesString < 10 ? "0" + minutesString : minutesString;
		hoursString = hoursString % 12;
		
		// Uncomment below line to add time of day
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
	
}// class [ FirebaseDAO ]