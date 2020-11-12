class FullBarsDAO {
	constructor(dbRef, leftCanvasID, rightCanvasID) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		this.leftCanvas = document.getElementById(leftCanvasID);
		this.rightCanvas = document.getElementById(rightCanvasID);
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 800;
		
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
			console.log("[FullBarsDAO: drawFullBars] - User is null");
			return;
		}
		this.useAlpha = true;
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("FullBars")
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
					this.drawLeftToCanvas(doc);
					this.drawRightToCanvas(doc);
				});
			});
	}
	
	drawLeftToCanvas(doc) {
		if (!doc) {
			console.log("FireStore document provided was null.");
			return;
		}
		
		if (!this.leftCanvas) {
			console.log("Left Canvas DOM not found.");
			return;
		}
		
		let xPositions = doc.data().LeftXLocations;
		let yPositions = doc.data().LeftYLocations;
		
		let ctxLeft = this.leftCanvas.getContext('2d');
		let ratio = this.leftCanvas.width / this.hardCodedCanvasSize;
		let barL = ctxLeft.canvas.width;
		let barW = 10;
		let r = (barW / 2) / 1.5;		// !! MAXIMUM radius is half the bar's thickness
		
		if (this.useAlpha) {
			let alpha = this.getNextLeftAlpha();
			ctxLeft.fillStyle = "#f47171" + alpha;
		}
		
		if (xPositions) {
			// Left Eye - X
			for (let i = 0; i < xPositions.length; i++) {
				let x = xPositions[i] * ratio;
				let y = 0;
				let w = barW;
				let h = barL;
				
				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctxLeft, x, y, w, h, r);
			}
		}
		
		if (yPositions) {
			// Left Eye - Y
			for (let i = 0; i < yPositions.length; i++) {
				let x = 0;
				let y = yPositions[i] * ratio;
				let w = barL;
				let h = barW;
				
				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctxLeft, x, y, w, h, r);
			}
		}
	}
	
	drawRightToCanvas(doc) {
		if (!doc) {
			console.log("FireStore document provided null.");
			return;
		}
		
		if (!this.rightCanvas) {
			console.log("Right Canvas DOM not found.");
			return;
		}
		
		let xPositions = doc.data().RightXLocations;
		let yPositions = doc.data().RightYLocations;
		
		let ctxRight = this.rightCanvas.getContext('2d');
		let ratio = this.rightCanvas.width / this.hardCodedCanvasSize;
		let barL = ctxRight.canvas.width;
		let barW = 10;
		let r = (barW / 2) / 1.5;		// !! MAXIMUM radius is half the bar's thickness
		
		if (this.useAlpha) {
			let alpha = this.getNextRightAlpha();
			ctxRight.fillStyle = "#f47171" + alpha;
		}
		
		if (xPositions) {
			// Right Eye - X
			for (let i = 0; i < xPositions.length; i++) {
				let x = xPositions[i] * ratio;
				let y = 0;
				let w = barW;
				let h = barL;
				
				// Draw shape as rectangle with rounded corners
				this.roundedRectangle(ctxRight, x, y, w, h, r);
			}
		}
		
		if (yPositions) {
			// Right Eye - Y
			for (let i = 0; i < yPositions.length; i++) {
				let x = 0;
				let y = yPositions[i] * ratio;
				let w = barL;
				let h = barW;
				
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
					this.addRowToTableFullBars(timeStamp, targetTableID);
				});
			});
	}
	
	// TODO: Refactor variable names below to be more readable
	addRowToTableFullBars(timeStamp, targetTableID) {
		let testName = "Full Bars";
		let time = this.formatDate(timeStamp);
		let urlOfTest = "../tests/instructions_page.html?full_bars";
		
		// ID of which table to put the data into (HTML Attribute ID)
		let tableBody = document.getElementById(targetTableID);
		
		// Table Row
		let row = document.createElement("tr");
		
		// Table Columns
		let columnTestName = document.createElement("td");
		let columnTime = document.createElement("td");
		let columnURL = document.createElement("td");
		
		// Will be a child of columnURL so we can add hyperlink
		let linkForURL = document.createElement("a");
		
		// Text to be put in the Columns
		let textTestName = document.createTextNode(testName);
		let textTime = document.createTextNode(time);
		let textURL = document.createTextNode("Take this Test");
		
		// Set href attribute for link to test
		linkForURL.appendChild(textURL);
		linkForURL.setAttribute("href", urlOfTest);
		
		// Put the Text into their respective Columns
		columnTestName.appendChild(textTestName);
		columnTime.appendChild(textTime);
		columnURL.appendChild(linkForURL);
		
		// Add each the Columns to the Row
		row.appendChild(columnTestName);
		row.appendChild(columnTime);
		row.appendChild(columnURL);
		
		// Add the Row to the Table
		tableBody.appendChild(row);
	}
	
	
	// canvasDOMProbe() {
	// 	let leftCanvas = document.getElementById(this.leftCanvasID);
	// 	let rightCanvas = document.getElementById(this.rightCanvasID);
	// 	return document.getElementById(this.leftCanvasID)
	// 		&& document.getElementById(this.rightCanvasID);
	// }
	
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
	
}// class [ FullBarsDAO ]
