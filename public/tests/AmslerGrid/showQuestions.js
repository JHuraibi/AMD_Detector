let testResult;
var sect1 = document.getElementById("Sec1");
var sect2 = document.getElementById("Sec2");
var sect3 = document.getElementById("Sec3");
var sect4 = document.getElementById("Sec4");

async function loadAll(userRef) {
	let db = firebase.firestore();
	await db
		.collection("TestResults")
		.doc(userRef.uid)
		.collection("AmslerGrid")
		.orderBy("TimeStampMS", "desc")
		.limit(1)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				testResult = doc.data();
			});
		});
	
	if (testResult) {
		displayResults();
	}
}

//Function to check if each question from each sections is answered and what the answer is
function displayResults() {
	if (testResult.Eye === "right") {
		document.getElementById("TestEye").innerHTML = "Right Eye";
		
	}
	else if (testResult.Eye === "left") {
		document.getElementById("TestEye").innerHTML = "Left Eye";
	}
	else {
		console.log("Eye selection loaded was neither left nor right. Loaded: " + testResult.Eye);
	}
	
	if (testResult.Section1.checked) {
		document.getElementById("Sec1").style.display = "inherit";
		fillSectionOne();
	}
	
	if (testResult.Section2.checked) {
		document.getElementById("Sec2").style.display = "inherit";
		fillSectionTwo();
	}
	
	if (testResult.Section3.checked) {
		document.getElementById("Sec3").style.display = "inherit";
		fillSectionThree();
	}
	
	if (testResult.Section4.checked) {
		document.getElementById("Sec4").style.display = "inherit";
		fillSectionFour();
	}
}

function fillSectionOne() {
	if (testResult.Section1.distortion) {
		document.getElementById("Sec1Q1").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section1.holes) {
		document.getElementById("Sec1Q2").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section1.corners) {
		document.getElementById("Sec1Q3").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section1.concerns != "") {
		document.getElementById("Sec1Concerns").innerHTML = "Answered: " + testResult.Section1.concerns;
	}
}

function fillSectionTwo() {
	if (testResult.Section2.distortion) {
		document.getElementById("Sec2Q1").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section2.holes) {
		document.getElementById("Sec2Q2").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section2.corners) {
		document.getElementById("Sec2Q3").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section1.concerns != "") {
		document.getElementById("Sec2Concerns").innerHTML = "Answered: " + testResult.Section2.concerns;
	}
}

function fillSectionThree() {
	if (testResult.Section3.distortion) {
		document.getElementById("Sec3Q1").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section3.holes) {
		document.getElementById("Sec3Q2").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section3.corners) {
		document.getElementById("Sec3Q3").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section3.concerns != "") {
		document.getElementById("Sec3Concerns").innerHTML = "Answered: " + testResult.Section3.concerns;
	}
}

function fillSectionFour() {
	if (testResult.Section4.distortion) {
		document.getElementById("Sec4Q1").innerHTML = "Answered: Yes";
	}
	if (testResult.Section4.holes) {
		document.getElementById("Sec4Q2").innerHTML = "Answered: Yes";
	}
	if (testResult.Section4.corners) {
		document.getElementById("Sec4Q3").innerHTML = "Answered: Yes";
	}
	
	if (testResult.Section4.concerns != "") {
		document.getElementById("Sec4Concerns").innerHTML = "Answered: " + testResult.Section4.concerns;
	}
}
