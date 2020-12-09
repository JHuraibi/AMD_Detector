// TODO: This file vs Amsler.js ?

const AmslerQuestions = document.querySelector('.AmslerQuestions');
var sec1Checkbox = document.getElementById("sec1Checkbox");
var sec2Checkbox = document.getElementById("sec2Checkbox");
var sec3Checkbox = document.getElementById("sec3Checkbox");
var sec4Checkbox = document.getElementById("sec4Checkbox");
var sec1Questions = document.getElementById("qSec1");
var sec2Questions = document.getElementById("qSec2");
var sec3Questions = document.getElementById("qSec3");
var sec4Questions = document.getElementById("qSec4");

sec1Checkbox.addEventListener("click", s1);
sec2Checkbox.addEventListener("click", s2);
sec3Checkbox.addEventListener("click", s3);
sec4Checkbox.addEventListener("click", s4);
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
	var dataToWrite = resultsJSON();
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
				// window.location.replace("../../tests/free_draw/free_draw.html");
				window.location.replace("showQuestions.html");
			}, 2000);
		});
});

function s1() {
	if (sec1Checkbox.checked === true) {
		sec1Questions.style.display = "inline-block";
	}
	else {
		sec1Questions.style.display = "none";
	}
}

function s2() {
	if (sec2Checkbox.checked === true) {
		sec2Questions.style.display = "inline-block";
	}
	else {
		sec2Questions.style.display = "none";
	}
}

function s3() {
	if (sec3Checkbox.checked === true) {
		sec3Questions.style.display = "inline-block";
	}
	else {
		sec3Questions.style.display = "none";
	}
}

function s4() {
	if (sec4Checkbox.checked === true) {
		sec4Questions.style.display = "inline-block";
	}
	else {
		sec4Questions.style.display = "none";
	}
}


function resultsJSON() {
	let timestamp = Date.now();
	let sec1Answers = templateJSON();
	let sec2Answers = templateJSON();
	let sec3Answers = templateJSON();
	let sec4Answers = templateJSON();
	
	if (sec1Checkbox.checked === true) {
		sec1Answers = {
			checked: true,
			distortion: extractBool(AmslerQuestions.S1_Q1.value),
			holes: extractBool(AmslerQuestions.S1_Q2.value),
			corners: extractBool(AmslerQuestions.S1_Q3.value),
			concerns: AmslerQuestions.S1_Concerns.value,
		}
	}
	
	if (sec2Checkbox.checked === true) {
		sec2Answers = {
			checked: true,
			distortion: extractBool(AmslerQuestions.S2_Q1.value),
			holes: extractBool(AmslerQuestions.S2_Q2.value),
			corners: extractBool(AmslerQuestions.S2_Q3.value),
			concerns: AmslerQuestions.S2_Concerns.value,
		}
	}
	
	if (sec3Checkbox.checked === true) {
		sec3Answers = {
			checked: true,
			distortion: extractBool(AmslerQuestions.S3_Q1.value),
			holes: extractBool(AmslerQuestions.S3_Q2.value),
			corners: extractBool(AmslerQuestions.S3_Q3.value),
			concerns: AmslerQuestions.S3_Concerns.value,
		}
	}
	
	if (sec4Checkbox.checked === true) {
		sec4Answers = {
			checked: true,
			distortion: extractBool(AmslerQuestions.S4_Q1.value),
			holes: extractBool(AmslerQuestions.S4_Q2.value),
			corners: extractBool(AmslerQuestions.S4_Q3.value),
			concerns: AmslerQuestions.S4_Concerns.value,
		}
	}
	
	return {
		"TestName": "AmslerGrid",
		"TimeStampMS": timestamp,
		"Eye": AmslerQuestions.q1.value,
		"Section1": sec1Answers,
		"Section2": sec2Answers,
		"Section3": sec3Answers,
		"Section4": sec4Answers,
	}
}

async function getUid() {
	await firebase.auth().onAuthStateChanged(user => {
		if (user) {
			id = user.uid;
		}
	});
}

// NOTE: Returns a filled-in generic JSON. FireStore needs the data fields present,
//  but does not necessarily need those fields to have any values.
function templateJSON() {
	return {
		checked: false,
		distortion: false,
		holes: false,
		corners: false,
		concerns: "",
	}
}

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
	});
}