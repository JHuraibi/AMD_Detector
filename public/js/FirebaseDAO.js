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
					console.log("URL to Test: " + doc.data().url);
				});
			});
	}

	addRowToTestTable(data, targetTableID) {
		// Data received from the database
		var testName = data.testName;
		var time = data.date;
		var score = data.score;
		var urlToTest = data.url;

		// Where to print the table
		var tableBody = document.getElementById(targetTableID);

		// Table Row
		var row = document.createElement("tr");

		// Table Columns
		var columnTestName = document.createElement("td");
		var columnTime = document.createElement("td");
		var columnScore = document.createElement("td");
		var columnURL = document.createElement("td");

		// Child of URL Column so we can add hyperlink
		var linkForURL = document.createElement("a");

		// Text to be put in the Columns
		var textTestName = document.createTextNode(testName);
		var textTime = document.createTextNode(time);
		var textScore = document.createTextNode(score);
		var textURL = document.createTextNode("Retake Test");

		// Set href attribute for link to test
		linkForURL.appendChild(textURL);
		linkForURL.setAttribute("href", urlToTest);

		// Put the Text in the Columns
		columnTestName.appendChild(textTestName);
		columnTime.appendChild(textTime);
		columnScore.appendChild(textScore);
		columnURL.appendChild(linkForURL);

		// Add the Columns to the Row
		row.appendChild(columnTestName);
		row.appendChild(columnTime);
		row.appendChild(columnScore);
		row.appendChild(columnURL);

		// Add the Row to the Table
		tableBody.appendChild(row);
	}

}// class [ FirebaseDAO ]
