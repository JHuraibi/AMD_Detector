class FreeDrawDAO {
	constructor(dbRef, leftCanvasID, rightCanvasID) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		this.leftCanvas = document.getElementById(leftCanvasID);
		this.rightCanvas = document.getElementById(rightCanvasID);
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 600;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	drawToCanvas(doc) {
		if (!doc) {
			console.log("FireStore document provided was null.");
			return;
		}
		
		if (!this.leftCanvas) {
			console.log("Left Canvas DOM not found.");
			return;
		}
		
		let drawingData = doc.data().ImageData;
		
		let ctxLeft = this.leftCanvas.getContext('2d');
		let ratio = this.leftCanvas.width / this.hardCodedCanvasSize;
		// let ratio = 2;
		
		if (drawingData) {
			console.log("CHECKPOINT3");
			
			for (let i = 0; i < drawingData.length - 1; i++) {
				let line = drawingData[i];
				
				let x = line.x * ratio;
				let y = line.y * ratio;
				let pX = line.pX * ratio;
				let pY = line.pY * ratio;
				let w = line.w * ratio;
				
				// Draw shape as a line with stroke thickness 'w' and rounded end caps
				this.line(ctxLeft, x, y, pX, pY, w);
			}
		}
	}
	
	line(ctx, x, y, pX, pY, w) {
		ctx.beginPath();
		ctx.lineWidth = w;
		ctx.lineCap = "round";
		ctx.moveTo(x, y);
		ctx.lineTo(pX, pY);
		ctx.stroke();
	}
	
	// CHECK: How can I make this more modular for different tables?
	populateHistoryTable(targetTableID) {
		if (!userRef) {
			console.log("[FreeDrawDAO: populateFullBarsTable] - User is null");
			return;
		}
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("FreeDraw")
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
	
	// TODO: Refactor textID name
	// TODO: Refactor variable names below to be more readable
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
	
	// !! NOTE: URI's are relative to dashboard.html. NOT this DAO file.
	// !! NOTE: The TEST_NAME key's value has to match Firestore's document exactly
	//			e.g.
	//			[CORRECT] 	urlOfDetailedView == ./dashboard/detailed_view.html
	//			[INCORRECT] urlOfDetailedView == ./detailed_view.html
	URIBuilder(docID) {
		let uri = new URLSearchParams();
		uri.append("TEST_NAME", "FreeDraw");
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
	
}// class [ FullBarsDAO ]
