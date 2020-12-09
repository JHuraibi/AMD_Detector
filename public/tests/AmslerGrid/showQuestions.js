
let testResult;
var sect1 = document.getElementById("Sec1");
var sect2 = document.getElementById("Sec2");
var sect3 = document.getElementById("Sec3");
var sect4 = document.getElementById("Sec4");





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
	answerToSecOne();
	// this.manualAdd();
};


//Function to check if each question from each sections is answered and what the answer is
function answerToSecOne() {
	console.log("hi");
	if(testResult.Eye = "right")
	{
		document.getElementById("TestEye").innerHTML = "Right Eye";

	}
	else if(testResult.Eye = "left")
	{
		document.getElementById("TestEye").innerHTML = "Left Eye";
	}

	if (testResult.Section1.checked) {
		
		if (testResult.Section1.distortion) {
			document.getElementById("Sec1Q1").innerHTML = "Yes";
		}
		else {
			document.getElementById("Sec1Q1").innerHTML = "No";
		}
		if (testResult.Section1.holes) {
			document.getElementById("Sec1Q2").innerHTML = "Yes";
		}
		else {
			document.getElementById("Sec1Q2").innerHTML = "No";
		}
		if (testResult.Section1.corners) {
			document.getElementById("Sec1Q3").innerHTML = "Yes";
		}
		else {
			document.getElementById("Sec1Q3").innerHTML = "No";
		}
		if(testResult.Section1.concerns != "")
		{
			document.getElementById("Sec1Concerns").innerHTML = testResult.Section1.concerns;

		}
	}
	else
	{
		sect1.style.display = "none";
	}


if (testResult.Section2.checked) {
		
	if (testResult.Section2.distortion) {
		document.getElementById("Sec2Q1").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec2Q1").innerHTML = "No";
	}
	if (testResult.Section2.holes) {
		document.getElementById("Sec2Q2").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec2Q2").innerHTML = "No";
	}
	if (testResult.Section2.corners) {
		document.getElementById("Sec2Q3").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec2Q3").innerHTML = "No";
	}
	if(testResult.Section1.concerns != "")
	{
		document.getElementById("Sec2Concerns").innerHTML = testResult.Section2.concerns;

	}
}
else
{
	sect2.style.display = "none";
}


if (testResult.Section3.checked) {
		
	if (testResult.Section3.distortion) {
		document.getElementById("Sec3Q1").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec3Q1").innerHTML = "No";
	}
	if (testResult.Section3.holes) {
		document.getElementById("Sec3Q2").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec3Q2").innerHTML = "No";
	}
	if (testResult.Section3.corners) {
		document.getElementById("Sec3Q3").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec3Q3").innerHTML = "No";
	}
	if(testResult.Section3.concerns != "")
	{
		document.getElementById("Sec3Concerns").innerHTML = testResult.Section3.concerns;

	}
}
else
{
	sect3.style.display = "none";
}

if (testResult.Section4.checked) {
		
	if (testResult.Section4.distortion) {
		document.getElementById("Sec4Q1").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec4Q1").innerHTML = "No";
	}
	if (testResult.Section4.holes) {
		document.getElementById("Sec4Q2").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec4Q2").innerHTML = "No";
	}
	if (testResult.Section4.corners) {
		document.getElementById("Sec4Q3").innerHTML = "Yes";
	}
	else {
		document.getElementById("Sec4Q3").innerHTML = "No";
	}
	if(testResult.Section4.concerns != "")
	{
		document.getElementById("Sec4Concerns").innerHTML = testResult.Section4.concerns;

	}
}
else
{
	sect4.style.display = "none";
}


}