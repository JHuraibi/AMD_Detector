class FreeDrawDAO {
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
	
	// NOTE: The JSON returned needs to match the FireStore document structure for FullBars
	extractor(id, data) {
		return {
			id: id,
			TestName: data.TestName,
			TimeStampMS: data.TimeStampMS,
			ImageData: data.ImageData,
		}
	}
	
	// TODO: Update away from using non-local doc?
	drawToCanvas(doc, canvasID) {
		if (!doc) {
			console.log("FireStore document provided was null.");
			return;
		}
		
		let canvas = document.getElementById(canvasID);
		
		if (!canvas) {
			console.log("Left Canvas DOM not found.");
			return;
		}
		
		let drawingData = doc.data().ImageData;
		
		let ctxLeft = canvas.getContext('2d');
		let ratio = canvas.width / this.canvasSize;
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
				this.line(ctxLeft, x, y, pX, pY, w);
			}
		}
		
		this.drawStaticAxes(ctxLeft, canvas.width, canvas.width);
	}
	
	line(ctx, x, y, pX, pY, w) {
		ctx.beginPath();
		ctx.lineWidth = w;
		ctx.lineCap = "round";
		ctx.moveTo(x, y);
		ctx.lineTo(pX, pY);
		ctx.stroke();
	}
	
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
	
	// CHECK: How can I make this more modular for different tables?
	populateHistoryTable(targetTableID) {
		if (!userRef) {
			console.log("User is null");
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
		
		// Uncomment below line to add time of day
		// return dateString + " at " + hoursString + ":" + minutesString + postfix;
		return dateString;
	}
	
}// class [ FreeDrawDAO ]
