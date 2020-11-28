class GrowingCirclesDAO {
	constructor(dbRef, userID) {
		this.dbRef = dbRef;
		this.userID = userID;
		this.docList = [];
		
		// !! TODO: This value to be dynamically set
		this.canvasSize = 700;
		
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
			.collection("GrowingCircles")
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
			.doc(userRef.uid)
			.collection("GrowingCircles")
			.add(this.docList[0])
			.then(() => {
				console.log("Manual document added.");
			});
	}
	
	// NOTE: The JSON returned needs to match the FireStore document structure for GrowingCircles
	extractor(id, data) {
		return {
			id: id,
			TestName: data.TestName,
			TimeStampMS: data.TimeStampMS,
			XLocationsLeft: data.LeftXLocations,
			XLocationsRight: data.XLocationsRight,
			YLocationsLeft: data.YLocationsLeft,
			YLocationsRight: data.YLocationsLeft,
			ZLocationsLeft: data.ZLocationsLeft,
			ZLocationsRight: data.ZLocationsRight
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
			this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			
			alphaIndex++;
			if (alphaIndex > 3) {
				alphaIndex = 3;
				console.log("Warning: Alpha Index Exceeded 3 Iterations.");
			}
		})
	}
	
	// TODO: RENAME
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
			
			this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
			
			alphaIndex++;
			if (alphaIndex > 3) {
				alphaIndex = 3;
				console.log("Warning: Alpha Index Exceeded 3 Iterations.");
			}
		}
	}
	
	populateMostRecent(leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		
		if (!this.docList[0]) {
			console.log("First document (most recent) empty.")
			return;
		}
		
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		
		ctxLeft.fillStyle = "#f47171";
		ctxRight.fillStyle = "#f47171";
		
		let doc = this.docList[0];
		this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
		this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
	}
	
	populateByMonthSelector(month, leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		
		ctxLeft.fillStyle = "#f47171";
		ctxRight.fillStyle = "#f47171";
		
		let dateStringStart = month + " 1 2020";
		let dateStringEnd;
		
		if (month === 12) {
			dateStringEnd = "1 1 2020";
		}
		else {
			dateStringEnd = (+month + 1) + " 1 2020";
		}
		
		let msStart = (new Date(dateStringStart)).getTime();
		let msEnd = (new Date(dateStringEnd)).getTime();
		// console.log("START: " + msStart);
		// console.log("END: " + msEnd);
		
		let startI = this.setStartIndex(msStart);
		let endI = this.setEndIndex(msEnd);
		
		// TODO: Check for off-by-one
		for (let i = startI; i < endI; i++) {
			let doc = this.docList[i];
			
			this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight)
		}
	}
	
	populateByNumberMonths(monthsBack, leftCanvasID, rightCanvasID) {
		if (!userRef) {
			console.log("User is null");
			return;
		}
		
		let ctxLeft = document.getElementById(leftCanvasID).getContext('2d');
		let ctxRight = document.getElementById(rightCanvasID).getContext('2d');
		
		ctxLeft.fillStyle = "#f47171";
		ctxRight.fillStyle = "#f47171";
		
		let current = (new Date).getMonth();
		let ms = this.monthMSHelper(current, monthsBack);
		let index = this.setStartIndex(ms);
		
		for (let i = 0; i < index; i++) {
			let doc = this.docList[i];
			
			this.drawToCanvas(ctxLeft, doc.XLocationsLeft, doc.YLocationsLeft, doc.ZLocationsLeft);
			this.drawToCanvas(ctxRight, doc.XLocationsRight, doc.YLocationsRight, doc.ZLocationsRight);
		}
	}
	
	drawToCanvas(ctx, xPos, yPos, zPos) {
		if (!ctx) {
			console.log("Invalid Canvas Context.");
			return;
		}
		
		let ratio = ctx.canvas.width / this.canvasSize;
		xPos = xPos * ratio;
		yPos = yPos * ratio;
		zPos = zPos * ratio;
		
		ctx.beginPath();
		ctx.arc(xPos, yPos, zPos, 0, Math.PI * 2);
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
	
	setStartIndex(ms) {
		let length = this.docList.length;
		let i = 0;
		
		while (this.docList[i].TimeStampMS > ms && i < length - 1) {
			i++;
		}
		
		return i;
	}
	
	// !! CRITICAL: MAKE SURE CORRECT
	setEndIndex(ms) {
		let i = this.docList.length - 1;
		
		while (this.docList[i].TimeStampMS < ms && i > 0) {
			i--;
		}
		
		return i;
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
	
}// class [ FirebaseDAO ]