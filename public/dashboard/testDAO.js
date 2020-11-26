class TestDAO {
	constructor(dbRef, userID) {
		this.dbRef = dbRef;
		this.userID = userID;
		this.docList = [];
	}
	
	async loadAll() {
		console.log("START LOAD ALL");
		await this.dbRef
			.collection("TestResults")
			.doc(this.userID)
			.collection("FullBars")
			.orderBy("TimeStampMS", "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					// CURRENT: Not saving the docs correctly. Length is 0
					let extractedDoc = this.extractor(doc.id, doc.data());
					this.docList.push(extractedDoc);
					console.log("Extracted Doc: " + extractedDoc);
				});
			});
			// .then(() => {
			// 	console.log("LoadAll - DONE");
			// 	return true;
			//
		// });
	}
	
	// NOTE: The JSON returned needs to match the structure of the FireStore documents for FullBars
	extractor(id, data){
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
		console.log("Length: " + this.docList.length);
		for (let i = 0; i < this.docList.length; i++){
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
	
	// !! NOTE: URI's are relative to dashboard.html. NOT this DAO file.
	// !! NOTE: The TEST_NAME key's value has to match Firestore's document exactly
	//			e.g.
	//			[CORRECT] 	urlOfDetailedView == ./dashboard/detailed_view.html
	//			[INCORRECT] urlOfDetailedView == ./detailed_view.html
	URIBuilder(docID) {
		let uri = new URLSearchParams();
		uri.append("TEST_NAME", "GrowingCircles");
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
	
}// class [ FirebaseDAO ]