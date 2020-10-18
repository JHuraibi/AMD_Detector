// !! NOTE: The Software Design Specification API section needs to be updated if
//				any edits are made to the JSON format or other Firebase read/write.


// CHECK: This function being used by team? Delete if no.
// May not need to pass in a db reference
function sendToFirebase(dbRef, jsonData){
	// var portableJSON = JSON.stringify(resultsJSON);
	if (dbRef == null){
		console.log("DATABASE REFERENCE - NULL");
		return;
	}

	dbRef.collection("TestJSON").add(jsonData);
}


class FirebaseDAO {
	constructor(dbRef) {
		this.db = dbRef;
	}

	populateTestTable(targetTableID) {
		this.db.collection("TestJ")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let extractedData = doc.data();
					this.addRowToTestTable(extractedData, targetTableID);

					console.log("ID: " + doc.id);
					console.log("Test Name: " + doc.data().testName);
					console.log("Time: " + doc.data().date);
					console.log("Score: " + doc.data().score);
					console.log("URL of Test: " + doc.data().url);
				});
			});
	}

	addRowToTestTable(data, targetTableID) {
		// TODO: Sort tables
		// Extract the data by using the Firestore document's field names
		var testName = data.testName;
		var time = data.date;
		var score = data.score;
		var urlOfTest = data.url;

		// ID of which table to put the data into (HTML ID)
		var tableBody = document.getElementById(targetTableID);

		// Table Row
		var row = document.createElement("tr");

		// Table Columns
		var columnTestName = document.createElement("td");
		var columnTime = document.createElement("td");
		var columnScore = document.createElement("td");
		var columnURL = document.createElement("td");

		// Will be a child of columnURL so we can add hyperlink
		var linkForURL = document.createElement("a");

		// Text to be put in the Columns
		var textTestName = document.createTextNode(testName);
		var textTime = document.createTextNode(time);
		var textScore = document.createTextNode(score);
		var textURL = document.createTextNode("Retake Test");

		// Set href attribute for link to test
		linkForURL.appendChild(textURL);
		linkForURL.setAttribute("href", urlOfTest);

		// Put the Text into their respective Columns
		columnTestName.appendChild(textTestName);
		columnTime.appendChild(textTime);
		columnScore.appendChild(textScore);
		columnURL.appendChild(linkForURL);

		// Add each the Columns to the Row
		row.appendChild(columnTestName);
		row.appendChild(columnTime);
		row.appendChild(columnScore);
		row.appendChild(columnURL);

		// Add the Row to the Table
		tableBody.appendChild(row);
	}

}// class [ FirebaseDAO ]
