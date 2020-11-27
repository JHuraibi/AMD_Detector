class TestDAO {
	constructor(dbRef, userID) {
		this.dbRef = dbRef;
		this.userID = userID;
		this.docList = [];
		
		// !! TODO: This value to be dynamically set
		this.canvasSize = 800;
		
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
	
	async loadAll() {
		await this.dbRef
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
	}
	
	// NOTE: The JSON returned needs to match the FireStore document structure for FullBars
	extractor(id, data) {
		return {
			id: id,
			TestName: data.TestName,
			TimeStampMS: data.TimeStampMS,
			LeftXLocations: data.LeftXLocations,
			LeftYLocations: data.LeftYLocations,
			RightXLocations: data.LeftXLocations,
			RightLocations: data.LeftYLocations,
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
			this.addRowToTableGC(doc.id, timeStamp, targetTableID);
		}
	}
	
	// TODO: Update with actual method for detailed view
	// TODO: Refactor variable names below to be more readable
	addRowToTableGC(docID, timeStamp, targetTableID) {
		let testName = "Full Bars [TEST]";
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
	
	populateAll(leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		let alphaIndex = 0;
		
		this.docList.forEach((doc) => {
			ctxLeft.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			ctxRight.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
			this.drawToCanvas(ctxLeft, doc.LeftXLocations, doc.LeftYLocations);
			this.drawToCanvas(ctxRight, doc.RightXLocations, doc.RightYLocations);
			
			alphaIndex++;
			if (alphaIndex > 3) {
				alphaIndex = 3;
				console.log("Warning: Alpha Index Exceeded 3 Iterations.");
			}
		})
	}
	
	populateAggregate(leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		
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
	
	populateByMonth(monthName) {
		let dateString = monthName + " 1, 2020";
		// let index = this.setIndex();
		console.log("Milliseconds: " + Date.parse(dateString));
	}
	
	populateByNumberMonths(months, leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		// CURRENT: Drawing last X number of months to canvses
		let earliestDay = monthName + " 1, 2020";
		console.log("Milliseconds: " + Date.parse(dateString));
		// setIndex(Date.parse(dateString));
		//
		// let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		// let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		// let alphaIndex = 0;
		//
		// let max = this.docList.length;
		// for (let i = 0; i < 3 && i < max; i++) {
		// 	let doc = this.docList[i];
		// 	ctxLeft.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
		// 	ctxRight.fillStyle = "#f47171" + this.alphaLevels[alphaIndex];
		//
		// 	this.drawToCanvas(ctxLeft, doc.LeftXLocations, doc.LeftYLocations);
		// 	this.drawToCanvas(ctxRight, doc.RightXLocations, doc.RightYLocations);
		// }
	}
	
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
	
	// !! NOTE: URI's are relative to dashboard.html. NOT this DAO file.
	//		e.g.
	//		[CORRECT] 	urlOfDetailedView == ./dashboard/detailed_view.html
	//		[INCORRECT] urlOfDetailedView == ./detailed_view.html
	// !! NOTE: The TEST_NAME key's value has to match Firestore's document exactly
	URIBuilder(docID) {
		let uri = new URLSearchParams();
		uri.append("TEST_NAME", "GrowingCircles");
		uri.append("TEST_ID", docID);
		return "./dashboard/detailed_view.html?" + uri.toString();
	}
	
	setIndex(ms) {
		let index = 0;
		let i = 0;
		
		while (this.docList[i].TimeStampMS < ms) {
			i++;
		}
		
		return i;
	}
	
	checkBeforeDate() {
	
	}
	
	alphaCreator(num) {
		let n = 255 / num;
	}
	
	formatDate(milliseconds) {
		let date = new Date(milliseconds);
		let timezoneOffset = -5;	// UTC -5:00
		
		let dateString = date.toDateString();
		let hoursString = +date.getUTCHours() + timezoneOffset;
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
	
}// class [ FirebaseDAO ]