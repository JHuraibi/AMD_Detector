// dbRef and user are set within detailed_view.html
// TODO: Refactor and clean once its working

class DashboardInjector {
	constructor(dbRef) {
		this.dbRef = dbRef;
		this.userRef = null;
		// this.docRefData = null;
		this.docRefData = null;
		this.docRefData = null;
		this.docID = null;
		
		console.log("CONSTRUCTOR");
	}
	
	updateInfo(userRef, testID) {
		this.userRef = userRef;
		this.docID = testID;
		
		console.log("userRef : " + this.userRef.uid);
		console.log("docID: " + this.docID);
		console.log("INFO UPDATED");
		
		// console.log("[From updateInfo()] DB: " + dbRef.toString());
		// console.log("[From updateInfo()] userRef: " + userRef.uid);
		// this.retrieveDocument();
	}
	
	canvasHelper(testName) {
		if (!this.dbRef) {
			console.log("EMPTY DB REFERENCE");
		}
		
		console.log("Test Name: " + testName);
		
		this.dbRef
			.collection("TestResults")
			.doc(this.userRef.uid)
			.collection(testName)
			.doc(this.docID)
			.get()
			.then(function (doc) {
				if (doc.exists) {
					console.log("DOC FOUND");
					console.log("Time: " + doc.data().TimeStampMS);
					this.docRefData = doc.data();
					this.router(testName, doc);
				}
				else {
					console.log("Failed to load document");
				}
			})
			.catch(function (error) {
				console.log("Error getting document:", error);
			});
		
		this.router(testName, this.docRefData);
	}
	
	// CURRENT: Custom object. Converter.
	// https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
	dataConverter() {
	
	}
	
	/**
	 * Acts as a router that to the correct canvas drawing function
	 * 	 based off of the test name that was passed in.
	 * @param testName
	 * @param doc
	 */
	router(testName, doc) {
		// console.log("Test Name: " + testName);
		this.setDateSubtitle(doc.data().TimeStampMS);
		
		switch (testName) {
			default:
				console.log("[DashboardInjector.js router()] ERROR ");
				break;
			
			case "growing_circles":
				console.log("Growing Circles");
				
				this.setTestNameTitle("Growing Circles");
				// this.redrawGrowingCircles(doc);
				break;
			
			case "symbols":
				console.log("Symbols");
				
				this.setTestNameTitle("Symbols");
				// this.redrawSymbols(doc);
				break;
			
			case "full_bars":
				console.log("Full Bars");
				
				this.setTestNameTitle("Full Bars");
				this.redrawFullBars(doc);
				break;
			
			case "fractal":
				console.log("Fractal");
				
				this.setTestNameTitle("Fractal");
				// this.redrawFractal(doc);
				break;
		}
	}
	
	// TODO: Make all the test names in Firestore have the same formatting
	// NOTE: The single dash and space characters are here so that
	//			if this function fails to return a test name to
	//			the header, the header then won't look incomplete.
	//			(See the testTitle <h3> in detailed_view.html).
	setTestNameTitle(testName) {
		let title = document.getElementById('testTitle');
		let postfix = " - " + testName;
		
		title.innerText = title.innerText + postfix;
	}
	
	setDateSubtitle(milliseconds) {
		if (!this.docRef) {
			console.log("The earlier document lookup was unsuccessful.")
			return;
		}
		
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
		
		return dateString + " at " + hoursString + ":" + minutesString + postfix;
	}
	
	// TODO: Refactor!!
	redrawFullBars(doc) {
		let leftCanvas = document.getElementById("detailedCanvasLeft");
		let rightCanvas = document.getElementById("detailedCanvasRight");
		
		if (!leftCanvas || !rightCanvas) {
			if (!leftCanvas) {
				console.log("DashboardInjector: LEFT Canvas - null");
			}
			
			if (!rightCanvas) {
				console.log("DashboardInjector: RIGHT Canvas - null");
			}
			
			return;
		}
		
		let ctxLeft = leftCanvas.getContext('2d');
		let ctxRight = rightCanvas.getContext('2d');
		
		let xLocationsLeft = doc.data().LeftXLocations;
		let yLocationsLeft = doc.data().LeftYLocations;
		let xLocationsRight = doc.data().RightXLocations;
		let yLocationsRight = doc.data().RightYLocations;
		
		// CHECK: Using leftCanvas width sufficient?
		let ratio = leftCanvas.width / 800;
		let barW = 10;
		// !! MAXIMUM radius is half the bar's thickness. Hence the (barW / 2) THEN additional "/ 1.5"
		let cornerR = (barW / 2) / 1.5;
		
		ctxLeft.fillStyle = "rgba(0, 0, 0, 50)";
		ctxRight.fillStyle = "rgba(0, 0, 0, 50)";
		
		if (xLocationsLeft) {
			// Left Eye - X
			for (let i = 0; i < xLocationsLeft.length; i++) {
				let x = xLocationsLeft[i] * ratio;
				let y = 0;
				let w = barW;
				let h = ctxLeft.canvas.width;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxLeft.beginPath();
				ctxLeft.moveTo(x + tl, y);
				ctxLeft.arcTo(x + w, y, x + w, y + h, tr);
				ctxLeft.arcTo(x + w, y + h, x, y + h, br);
				ctxLeft.arcTo(x, y + h, x, y, bl);
				ctxLeft.arcTo(x, y, x + w, y, tl);
				ctxLeft.closePath();
				
				ctxLeft.fill();
			}
		}
		
		if (yLocationsLeft) {
			// Left Eye - Y
			for (let i = 0; i < yLocationsLeft.length; i++) {
				let y = yLocationsLeft[i] * ratio;
				let x = 0;
				let w = ctxRight.canvas.width;
				let h = barW;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxLeft.beginPath();
				ctxLeft.moveTo(x + tl, y);
				ctxLeft.arcTo(x + w, y, x + w, y + h, tr);
				ctxLeft.arcTo(x + w, y + h, x, y + h, br);
				ctxLeft.arcTo(x, y + h, x, y, bl);
				ctxLeft.arcTo(x, y, x + w, y, tl);
				ctxLeft.closePath();
				
				ctxLeft.fill();
			}
		}
		
		if (xLocationsRight) {
			// Right Eye - X
			for (let i = 0; i < xLocationsRight.length; i++) {
				let x = xLocationsRight[i] * ratio;
				let y = 0;
				let w = barW;
				let h = ctxLeft.canvas.width;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxRight.beginPath();
				ctxRight.moveTo(x + tl, y);
				ctxRight.arcTo(x + w, y, x + w, y + h, tr);
				ctxRight.arcTo(x + w, y + h, x, y + h, br);
				ctxRight.arcTo(x, y + h, x, y, bl);
				ctxRight.arcTo(x, y, x + w, y, tl);
				ctxRight.closePath();
				
				ctxRight.fill();
			}
		}
		
		if (yLocationsRight) {
			// Right Eye - Y
			for (let i = 0; i < yLocationsRight.length; i++) {
				let y = yLocationsRight[i] * ratio;
				let x = 0;
				let w = ctxRight.canvas.width;
				let h = barW;
				let tl = cornerR;
				let tr = cornerR;
				let bl = cornerR;
				let br = cornerR;
				
				// Draw shape as rectangle with rounded corners
				ctxRight.beginPath();
				ctxRight.moveTo(x + tl, y);
				ctxRight.arcTo(x + w, y, x + w, y + h, tr);
				ctxRight.arcTo(x + w, y + h, x, y + h, br);
				ctxRight.arcTo(x, y + h, x, y, bl);
				ctxRight.arcTo(x, y, x + w, y, tl);
				ctxRight.closePath();
				
				ctxRight.fill();
			}
		}
	}
}









