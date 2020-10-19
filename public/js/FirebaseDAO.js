class FirebaseDAO {
	constructor(dbRef) {
		this.dbRef = dbRef;
		this.userRef = null;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	drawFullBars(containerID, sizeRef) {
		if (!userRef) {
			console.log("[FirebaseDAO: drawFullBars] - User is null");
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
	
	// !! TODO: Refactor to make reading easier
	populateCanvas(containerID, sizeRef, doc) {
		let parent = document.getElementById(containerID);
		
		let newDivContainer = document.createElement("div");
		let newCanvas = document.createElement("canvas");
		let caption = document.createElement("p");
		
		let xLocations = doc.data().XLocations;
		let yLocations = doc.data().YLocations;
		let timeStamp = doc.data().TimeStampMS;
		
		let barW = 10;
		let ctx = newCanvas.getContext('2d');
		
		ctx.globalAlpha = 0.5;
		
		for (let i = 0; i < xLocations.length; i++) {
			let xPos = xLocations[i];
			ctx.fillStyle = "#460046";
			ctx.fillRect(xPos, 0, barW + 10, 100);
		}
		
		for (let i = 0; i < yLocations.length; i++) {
			let yPos = xLocations[i];
			ctx.fillStyle = "#460046";
			ctx.fillRect(0, yPos, 100 + 20, barW);
		}
		
		let dateTakenMsg = "Date Taken: " + this.formatDate(timeStamp);
		let captionTextNode = document.createTextNode(dateTakenMsg);
		
		caption.appendChild(captionTextNode);
		
		newDivContainer.appendChild(newCanvas);
		newDivContainer.appendChild(caption);
		
		parent.appendChild(newDivContainer);
	}
	
	// CHECK: How can I make this more modular for different tables?
	populateFullBarsTable(targetTableID) {
		if (!userRef) {
			console.log("[FirebaseDAO: populateFullBarsTable] - User is null");
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
					
					console.log("TimeStamp: " + timeStamp);
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
	
	formatDate(ms) {
		console.log("FORMAT DATE");
		let date = new Date(ms);
		
		let dateString = date.toDateString();
		let hoursString = date.getUTCHours();
		let minutesString = date.getUTCMinutes();
		let timeModifier = "";
		
		if (hoursString > 12) {
			hoursString %= hoursString;
			timeModifier = "PM";
		}
		else {
			timeModifier = "AM";
		}
		
		if (hoursString == 0) {
			hoursString = "12";
		}
		
		return dateString + " at " + hoursString + ":" + minutesString + timeModifier;
	}
	
}// class [ FirebaseDAO ]
