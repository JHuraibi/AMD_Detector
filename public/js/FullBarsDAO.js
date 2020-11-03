class FullBarsDAO {
	constructor(dbRef) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 800;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	drawFullBars(leftCanvasID, rightCanvasID, sizeRef) {
		if (!userRef) {
			console.log("[FullBarsDAO: drawFullBars] - User is null");
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
					this.populateAggregate(leftCanvasID, rightCanvasID, sizeRef, doc);
				});
			});
	}
	
	// TODO: Refactor to make reading easier (perhaps split the two canvases to two functions)
	populateAggregate(leftCanvasID, rightCanvasID, sizeRef, doc) {
		let leftCanvas = document.getElementById(leftCanvasID);
		let rightCanvas = document.getElementById(rightCanvasID);
		
		if (!leftCanvas || !rightCanvas){
			if (!leftCanvas){
				console.log("LEFT Canvas - null");
			}
			
			if (!rightCanvas){
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
		
		let ratio = sizeRef / this.hardCodedCanvasSize;
		
		// CHECK: Alpha Needed?
		let barW = 10;
		// ctxLeft.globalAlpha = 0.5;
		// ctxRight.globalAlpha = 0.5;
		ctxLeft.fillStyle = "red";
		ctxRight.fillStyle = "red";
		
		if (xLocationsLeft) {
			// Left Eye - X
			for (let i = 0; i < xLocationsLeft.length; i++) {
				let x = xLocationsLeft[i] * ratio;
				ctxLeft.fillRect(x, 0, barW + 10, ctxLeft.canvas.width);
			}
		}
		
		if (yLocationsLeft) {
			// Left Eye - Y
			for (let i = 0; i < yLocationsLeft.length; i++) {
				let y = yLocationsLeft[i] * ratio;
				ctxLeft.fillRect(0, y, ctxLeft.canvas.width, barW);
			}
		}
		
		if (xLocationsRight) {
			// Right Eye - X
			for (let i = 0; i < xLocationsRight.length; i++) {
				let x = xLocationsRight[i] * ratio;
				ctxRight.fillRect(x, 0, barW, ctxRight.canvas.width);
			}
		}
		
		if (yLocationsRight) {
			// Right Eye - Y
			for (let i = 0; i < yLocationsRight.length; i++) {
				let y = yLocationsRight[i] * ratio;
				ctxRight.fillRect(0, y, ctxRight.canvas.width, barW);
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
