class GrowingCirclesDAO {
	constructor(dbRef) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 700;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	drawGrowingCircles(leftCanvasID, rightCanvasID, sizeRef) {
		if (!userRef) {
			console.log("[GrowingCirclesDAO: growingCircles] - User is null");
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
					this.populateAggregate(leftCanvasID, rightCanvasID, sizeRef, doc);
				});
			});
	}
	
	// !! TODO: Refactor to make reading easier
	populateAggregate(leftCanvasID, rightCanvasID, sizeRef, doc) {
		let leftCanvas = document.getElementById(leftCanvasID);
		let rightCanvas = document.getElementById(rightCanvasID);
		
		let ctxLeft = leftCanvas.getContext('2d');
		let ctxRight = rightCanvas.getContext('2d');
		
		let xLocationsLeft = doc.data().XLocationsLeft;
		let yLocationsLeft = doc.data().YLocationsLeft;
		let zLocationsLeft = doc.data().ZLocationsLeft;
		let xLocationsRight = doc.data().XLocationsRight;
		let yLocationsRight = doc.data().YLocationsRight;
		let zLocationsRight = doc.data().ZLocationsRight;
		
		let ratio = sizeRef / this.hardCodedCanvasSize;
		
		// CHECK: Alpha Needed?
		// ctxLeft.globalAlpha = 0.5;
		// ctxRight.globalAlpha = 0.5;
		ctxLeft.fillStyle = "red";
		ctxRight.fillStyle = "red";
		
		for (let i = 0; i < xLocationsLeft.length; i++) {
			let x = xLocationsLeft[i] * ratio;
			let y = yLocationsLeft[i] * ratio;
			let z = zLocationsLeft[i] * ratio;
			
			ctxLeft.beginPath();
			ctxLeft.arc(x, y, z, 0, Math.PI * 2);
			ctxLeft.fill();
		}
		
		for (let i = 0; i < xLocationsRight.length; i++) {
			let x = xLocationsRight[i] * ratio;
			let y = yLocationsRight[i] * ratio;
			let z = zLocationsRight[i] * ratio;
			
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
					this.addRowToTableGC(timeStamp, targetTableID);
					
					// console.log("TimeStamp: " + timeStamp);
				});
			});
	}
	
	// TODO: Refactor variable names below to be more readable
	addRowToTableGC(timeStamp, targetTableID) {
		let testName = "Growing Circles";
		let time = this.formatDate(timeStamp);
		let urlOfTest = "../tests/instructions_page.html?growing_circles";
		
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
		
		// Prototype 2 edit
		// return dateString + " at " + hoursString + ":" + minutesString + postfix;
		return dateString;
	}
	
}// class [ FirebaseDAO ]