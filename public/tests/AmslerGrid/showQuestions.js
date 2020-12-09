// var db = firebase.firestore();

let testResult;


async function loadAll(userRef) {
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
	answerToQOne();
	// this.manualAdd();
};

function insert(data) {
	// doc.data().Section1.concerns;
	document.getElementById('q1').placeholder = data.AmslerQuestions.q1.value;
	document.getElementById('sq1').placeholder = data.sec1Answers;
	document.getElementById('sq2').placeholder = data.sec2Answers;
	document.getElementById('sq3').placeholder = data.sec3Answers;
	document.getElementById('sq4').placeholder = data.sec4Answers;
	
	
}

function answerToQOne() {
	console.log("hi");
	
	if (testResult.Section1) {
		document.getElementById("testQ").innerHTML = "Yes";
	}
	else {
		document.getElementById("testQ").innerHTML = "No";
	}
}

