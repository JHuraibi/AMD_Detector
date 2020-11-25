// TODO: This file vs Amsler.js ?

const AmslerQuestions = document.querySelector('.AmslerQuestions');
document.getElementById("sp1").addEventListener("click", s1);
document.getElementById("sp2").addEventListener("click", s2);
document.getElementById("sp3").addEventListener("click", s3);
document.getElementById("sp4").addEventListener("click", s4);
var sec1Questions = document.getElementById("qSec1");
var sec2Questions = document.getElementById("qSec2");
var sec3Questions = document.getElementById("qSec3");
var sec4Questions = document.getElementById("qSec4");

sec1Questions.style.display = "none";
sec2Questions.style.display = "none";
sec3Questions.style.display = "none";
sec4Questions.style.display = "none";

var id;
getUid();

AmslerQuestions.addEventListener('submit', (e) => {
	e.preventDefault();
	
	console.log("saving to database");
	
	var db = firebase.firestore();
	var dataToWrite = jsonresults();
	// var id = firebase.auth().currentUser.uid;	// CHECK: getUID() ?
	
	// TODO: Needs error handling
	db.collection("TestResults")
		.doc(id)
		.collection("AmslerGrid")
		.add(dataToWrite)
		.then(() => {
			//uploadSuccess();
			updateFirstTest();
			setTimeout(() => {
				// Use replace() to disallow back button to come back to this page
				window.location.replace("../../home.html");
			}, 2000);
		});
});

function s1() {
	if (sec1Questions.style.display === "none") {
		sec1Questions.style.display = "inline-block";
	}
	else {
		sec1Questions.style.display = "none";
	}
}

function s2() {
	if (sec2Questions.style.display === "none") {
		sec2Questions.style.display = "inline-block";
	}
	else {
		sec2Questions.style.display = "none";
	}
}

function s3() {
	
	if (sec3Questions.style.display === "none") {
		sec3Questions.style.display = "inline-block";
	}
	else {
		sec3Questions.style.display = "none";
	}
}

function s4() {
	if (sec4Questions.style.display === "none") {
		sec4Questions.style.display = "inline-block";
	}
	else {
		sec4Questions.style.display = "none";
	}
}


// START ORIGINAL
// function jsonresults() {
// 	let timestamp = Date.now();
// 	let sections = [];
// 	if (AmslerQuestions.section1.checked == true) {
// 		sections.push("Section1");
// 	}
// 	if (AmslerQuestions.section2.checked == true) {
// 		sections.push("Section2");
// 	}
// 	if (AmslerQuestions.section3.checked == true) {
// 		sections.push("Section3");
// 	}
// 	if (AmslerQuestions.section4.checked == true) {
// 		sections.push("Section4");
// 	}
//
// 	return {
// 		"TestName": "AmslerGrid",
// 		"TimeStampMS": timestamp,
// 		"Eye": AmslerQuestions.q1.value,
// 		"Sections": sections,
// 		"Distortion": AmslerQuestions.q3.value,
// 		"Holes": AmslerQuestions.q4.value,
// 		"Corners": AmslerQuestions.q5.value,
// 		"Comments": AmslerQuestions.concerns.value,
// 	}
// }
// END ORIGINAL

// START J's Proposal
function jsonresults() {
	let timestamp = Date.now();
	let sectionOne = templateJSON();
	let sectionTwo = templateJSON();
	let sectionThree = templateJSON();
	let sectionFour = templateJSON();
	
	if (AmslerQuestions.section1.checked == true) {
		sectionOne = {
			checked: true,
			distoration: extractBool(AmslerQuestions.S1_Q1.value),
			holes: extractBool(AmslerQuestions.S1_Q2.value),
			corners: extractBool(AmslerQuestions.S1_Q3.value),
			concerns: AmslerQuestions.S1_Concerns.value,
		}
	}
	
	if (AmslerQuestions.section2.checked == true) {
		sectionTwo = {
			checked: true,
			distoration: extractBool(AmslerQuestions.S2_Q1.value),
			holes: extractBool(AmslerQuestions.S2_Q2.value),
			corners: extractBool(AmslerQuestions.S2_Q3.value),
			concerns: AmslerQuestions.S2_Concerns.value,
		}
	}
	
	if (AmslerQuestions.section3.checked == true) {
		sectionThree = {
			checked: true,
			distoration: extractBool(AmslerQuestions.S3_Q1.value),
			holes: extractBool(AmslerQuestions.S3_Q2.value),
			corners: extractBool(AmslerQuestions.S3_Q3.value),
			concerns: AmslerQuestions.S3_Concerns.value,
		}
	}
	
	if (AmslerQuestions.section4.checked == true) {
		sectionFour = {
			checked: true,
			distoration: extractBool(AmslerQuestions.S4_Q1.value),
			holes: extractBool(AmslerQuestions.S4_Q2.value),
			corners: extractBool(AmslerQuestions.S4_Q3.value),
			concerns: AmslerQuestions.S4_Concerns.value,
		}
	}
	
	return {
		"TestName": "AmslerGrid",
		"TimeStampMS": timestamp,
		"Eye": AmslerQuestions.q1.value,
		"Section1": sectionOne,
		"Section2": sectionTwo,
		"Section3": sectionThree,
		"Section4": sectionFour,
	}
}
// END J's Proposal

async function getUid() {
	await firebase.auth().onAuthStateChanged(user => {
		if (user) {
			id = user.uid;
		}
	});
}

// NOTE: Returns a filled-in generic JSON. FireStore needs the data fields presented.
//  But does not necessarily need those fields to have values or flled in with generic values.
function templateJSON(json){
	return {
		checked: false,
		distoration: false,
		holes: false,
		corners: false,
		concerns: "",
	}
}

// CHECK: Can probably be replaced by using true/false as HTML value attributes
function extractBool(value) {
	value = value.toLowerCase();	// Redundant
	
	if (value === "yes") {
		return true;
	}
	else if (value === "no") {
		return false;
	}
	else {
		console.log("Value provided was neither Yes nor No. Value: " + value.toString());
		return false;
	}
}

function updateFirstTest() {
	var db = firebase.firestore();
	db.collection("TestResults")
		.doc(id)
		.set({
			firstTest: false
		}).then(() => {
		console.log("First Test Status Updated.");
	});
}