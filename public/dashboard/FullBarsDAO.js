class FullBarsDAO {
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
		
		// this.manualAdd();
	}
	
	// !! TESTING ONLY - Clones FireStore doc from existing
	manualAdd() {
		this.dbRef.collection("TestResults")
			.doc(this.userID)
			.collection("FullBars")
			.add(this.docList[0])
			.then(() => {
				console.log("Manual document added.");
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
	
	populateAll(leftCanvasID, rightCanvasID) {
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
	
	// TODO: RENAME
	populateAggregate(leftCanvasID, rightCanvasID) {
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
	
	populateMostRecent(leftCanvasID, rightCanvasID) {
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
	
	populateByMonthSelector(month, leftCanvasID, rightCanvasID) {
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
	
	populateByNumberMonths(monthsBack, leftCanvasID, rightCanvasID) {
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
		uri.append("TEST_NAME", "FullBars");
		uri.append("TEST_ID", docID);
		return "./dashboard/detailed_view.html?" + uri.toString();
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
	
	monthName(number) {
		if (number < 0 || number > 12) {
			console.log("Month number invalid. Number: " + number);
			return "January";
		}
		
		let months = [
			"January", "February", "March",
			"April", "May", "June",
			"July", "August", "September",
			"October", "November", "December"
		];
		
		return months[number];
	}
	
}// class [ FullBarsDAO ]