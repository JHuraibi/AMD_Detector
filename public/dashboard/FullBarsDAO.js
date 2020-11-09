class FullBarsDAO {
	constructor(dbRef) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 800;
		this.useAlpha = false;
		
		// These values are equal to 20, 45, and 95% opacity levels respectively
		// Max alpha in hex is FF or 255 in decimal
		// e.g. [Hex F3 == Dec 243]
		// 			(243 / 255) -> 95%
		//			(F3 / FF)   -> 95%
		this.alphaLevels = ["33", "73", "F3"];
		this.aIndex = 0;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	populateAggregate(leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("[FullBarsDAO: drawFullBars] - User is null");
			return;
		}
		this.useAlpha = true;
		this.aIndex = 0;
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("FullBars")
			.orderBy("TimeStampMS", "desc")
			.limit(3)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.drawToCanvas(leftCanvasID, rightCanvasID, doc);
				});
			})
			.then(() => {
				// Once DB query and drawing are complete, reset variables specific to populateAggregate()
				this.useAlpha = false;
				this.aIndex = 0;
			});
	}
	
	populateMostRecent(leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("[FullBarsDAO: drawFullBars] - User is null");
			return;
		}
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("FullBars")
			.orderBy("TimeStampMS", "desc")
			.limit(1)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.drawToCanvas(leftCanvasID, rightCanvasID, doc);
				});
			});
	}
	
	// TODO: Refactor to make reading easier (perhaps split the two canvases to two functions)
	drawToCanvas(leftCanvasID, rightCanvasID, doc) {
		let leftCanvas = document.getElementById(leftCanvasID);
		let rightCanvas = document.getElementById(rightCanvasID);
		
		if (!leftCanvas || !rightCanvas) {
			if (!leftCanvas) {
				console.log("LEFT Canvas - null");
			}
			
			if (!rightCanvas) {
				console.log("RIGHT Canvas - null");
			}
			
			return;
		}
		
		let ctxLeft = leftCanvas.getContext('2d');
		let ctxRight = rightCanvas.getContext('2d');
		
		let xLocationsLeft = doc.data().LeftXLocations;
		let yLocationsLeft = doc.data().LeftYLocations;
		let xLocationsRight = doc.data().RightXLocations;
		let yLocationsRight = doc.data().RightYLocations;
		
		// CHECK: Using leftCanvas width sufficient?
		let ratio = leftCanvas.width / this.hardCodedCanvasSize;
		let barW = 10;
		// !! MAXIMUM radius is half the bar's thickness. Hence the (barW / 2) THEN additional "/ 1.5"
		let cornerR = (barW / 2) / 1.5;
		
		if (this.useAlpha) {
			let alpha = this.alphaLevels[this.aIndex];
			ctxLeft.fillStyle = "#f47171" + alpha;
			ctxRight.fillStyle = "#f47171" + alpha;
			this.aIndex++;
		}
		
		if (xLocationsLeft) {
			// Left Eye - X
			for (let i = 0; i < xLocationsLeft.length; i++) {
				let x = xLocationsLeft[i] * ratio;
				let y = 0;
				let w = barW;
				let h = ctxLeft.canvas.width;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxLeft.beginPath();
				ctxLeft.moveTo(x + tl, y);
				ctxLeft.arcTo(x + w, y, x + w, y + h, tr);
				ctxLeft.arcTo(x + w, y + h, x, y + h, br);
				ctxLeft.arcTo(x, y + h, x, y, bl);
				ctxLeft.arcTo(x, y, x + w, y, tl);
				ctxLeft.closePath();
				
				ctxLeft.fill();
			}
		}
		
		if (yLocationsLeft) {
			// Left Eye - Y
			for (let i = 0; i < yLocationsLeft.length; i++) {
				let y = yLocationsLeft[i] * ratio;
				let x = 0;
				let w = ctxRight.canvas.width;
				let h = barW;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxLeft.beginPath();
				ctxLeft.moveTo(x + tl, y);
				ctxLeft.arcTo(x + w, y, x + w, y + h, tr);
				ctxLeft.arcTo(x + w, y + h, x, y + h, br);
				ctxLeft.arcTo(x, y + h, x, y, bl);
				ctxLeft.arcTo(x, y, x + w, y, tl);
				ctxLeft.closePath();
				
				ctxLeft.fill();
			}
		}
		
		if (xLocationsRight) {
			// Right Eye - X
			for (let i = 0; i < xLocationsRight.length; i++) {
				let x = xLocationsRight[i] * ratio;
				let y = 0;
				let w = barW;
				let h = ctxLeft.canvas.width;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxRight.beginPath();
				ctxRight.moveTo(x + tl, y);
				ctxRight.arcTo(x + w, y, x + w, y + h, tr);
				ctxRight.arcTo(x + w, y + h, x, y + h, br);
				ctxRight.arcTo(x, y + h, x, y, bl);
				ctxRight.arcTo(x, y, x + w, y, tl);
				ctxRight.closePath();
				
				ctxRight.fill();
			}
		}
		
		if (yLocationsRight) {
			// Right Eye - Y
			for (let i = 0; i < yLocationsRight.length; i++) {
				let y = yLocationsRight[i] * ratio;
				let x = 0;
				let w = ctxRight.canvas.width;
				let h = barW;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxRight.beginPath();
				ctxRight.moveTo(x + tl, y);
				ctxRight.arcTo(x + w, y, x + w, y + h, tr);
				ctxRight.arcTo(x + w, y + h, x, y + h, br);
				ctxRight.arcTo(x, y + h, x, y, bl);
				ctxRight.arcTo(x, y, x + w, y, tl);
				ctxRight.closePath();
				
				ctxRight.fill();
			}
		}
	}
	
	// CHECK: How can I make this more modular for different tables?
	populateHistoryTable(targetTableID) {
		if (!userRef) {
			console.log("[FullBarsDAO: populateFullBarsTable] - User is null");
			return;
		}
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("FullBars")
			.orderBy("TimeStampMS", "desc")
			.limit(3)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let timeStamp = doc.data().TimeStampMS;
					this.addRowToTableFullBars(doc.id, timeStamp, targetTableID);
				});
			});
	}

	// TODO: Refactor variable names below to be more readable
	addRowToTableFullBars(docID, timeStamp, targetTableID) {
		let testName = "Full Bars";
		let time = this.formatDate(timeStamp);
		let urlOfDetailedView = this.URIBuilder(docID);
		let urlOfTest = "../tests/instructions_page.html?full_bars";
		
		// ID of which table to put the data into (HTML Attribute ID)
		let tableBody = document.getElementById(targetTableID);
		
		// Table Row
		let row = document.createElement("tr");
		
		// Table Columns
		let columnTestName = document.createElement("td");
		let columnTime = document.createElement("td");
		let columnID = document.createElement("td");
		let columnURL = document.createElement("td");
		
		// Children of columnID and columnURL are hyperlinks
		let linkForDetailedView = document.createElement("a");
		let linkForURL = document.createElement("a");
		
		// Text to be put in the Columns
		let textTestName = document.createTextNode(testName);
		let textTime = document.createTextNode(time);
		let textID = document.createTextNode("Details");
		let textURL = document.createTextNode("Take This Test");
		
		// Set href attribute for links
		linkForDetailedView.appendChild(textID);
		linkForDetailedView.setAttribute("href", urlOfDetailedView);
		linkForURL.appendChild(textURL);
		linkForURL.setAttribute("href", urlOfTest);
		
		// Put the Text into their respective Columns
		columnTestName.appendChild(textTestName);
		columnTime.appendChild(textTime);
		columnID.appendChild(linkForDetailedView);
		columnURL.appendChild(linkForURL);
		
		// Add each the Columns to the Row
		row.appendChild(columnTestName);
		row.appendChild(columnTime);
		row.appendChild(columnID);
		row.appendChild(columnURL);
		
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
		uri.append("TEST_NAME", "FullBars");
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
		
		// return dateString + " at " + hoursString + ":" + minutesString + postfix;
		return dateString;
	}
	
}// class [ FullBarsDAO ]
