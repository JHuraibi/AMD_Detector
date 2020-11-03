class FullBarsDAO {
	constructor(dbRef) {
		this.dbRef = dbRef;
		this.userRef = null;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	drawFullBars(containerID, sizeRef) {
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
					this.populateCanvas(containerID, sizeRef, doc);
				});
			});
	}
	
	// TODO: Refactor to make reading easier (perhaps split the two canvases to two functions)
	populateCanvas(containerID, sizeRef, doc) {
		let parent = document.getElementById(containerID);
		
		let newDivContainer = document.createElement("div");
		let leftEyeCanvas = document.createElement("canvas");
		let rightEyeCanvas = document.createElement("canvas");
		let caption = document.createElement("p");
		let ctxLeft = leftEyeCanvas.getContext('2d');
		let ctxRight = rightEyeCanvas.getContext('2d');
		
		// Prototype 2 edit
		let leftX = doc.data().LeftXLocations;
		let leftY = doc.data().LeftYLocations;
		let rightX = doc.data().RightXLocations;
		let rightY = doc.data().RightYLocations;
		
		
		let timeStamp = doc.data().TimeStampMS;
		let testCanvasSize = doc.data().TestCanvasSize;
		
		let barW = 10;
		let ratio = sizeRef / testCanvasSize;
		
		ctxLeft.globalAlpha = 0.5;
		ctxRight.globalAlpha = 0.5;
		
		// Left Eye - X
		if (leftX) {
			for (let i = 0; i < leftX.length; i++) {
				let xPos = leftX[i];
				ctxLeft.fillStyle = "#460046";
				ctxLeft.fillRect((xPos * ratio), 0, barW + 10, sizeRef);
			}
		}
		
		// Left Eye - Y
		if (leftY) {
			for (let i = 0; i < leftY.length; i++) {
				let yPos = leftY[i];
				ctxLeft.fillStyle = "#460046";
				ctxLeft.fillRect(0, (yPos * ratio), ctxLeft.canvas.width, barW);
			}
		}
		
		if (rightX) {
			// Right Eye - X
			for (let i = 0; i < rightX.length; i++) {
				let xPos = rightX[i];
				ctxRight.fillStyle = "#b86214";
				ctxRight.fillRect((xPos * ratio), 0, barW + 10, sizeRef);
			}
		}
		
		if (rightY) {
			// Right Eye - Y
			for (let i = 0; i < rightY.length; i++) {
				let yPos = rightY[i];
				ctxRight.fillStyle = "#b86214";
				ctxRight.fillRect(0, (yPos * ratio), ctxLeft.canvas.width, barW);
			}
		}
		
		
		// let dateTakenMsg = "Date Taken: " + this.formatDate(timeStamp);
		// let captionTextNode = document.createTextNode(dateTakenMsg);
		//
		// caption.appendChild(captionTextNode);
		
		// grid-area: Row#, Column#, Row Span, Column Span
		leftEyeCanvas.style.gridArea = "1 / 1 / 2 / 2";
		rightEyeCanvas.style.gridArea = "1 / 2 / 2 / 2";
		
		leftEyeCanvas.setAttribute('class', 'fullBarsCanvasStyle');
		rightEyeCanvas.setAttribute('class', 'fullBarsCanvasStyle');
		
		newDivContainer.appendChild(leftEyeCanvas);
		newDivContainer.appendChild(rightEyeCanvas);
		
		parent.appendChild(newDivContainer);
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
