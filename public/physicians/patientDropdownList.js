/*
	On the physicians dashboard, the drop down menu is dynamically created here. We get the user's
	set of patients and create a value in drop menu for each patient. 
*/

let dropDown = document.getElementById("patientList");
let patients = [];

(function () {

	firebase.auth().onAuthStateChanged(user => {
		if (user) {
			let id = user.uid;
			db.collection("users").doc(id)
				.get()
				.then(doc => {
					let array = doc.data().patients;

					for (var i = 0; i < array.length; i++) {
						db.collection("users").doc(array[i])
							.get()
							.then(doc => {
								let patient3 = {
									id: doc.id,
									firstName: doc.data().firstname,
									lastName: doc.data().lastname,
								}
								patients.push(patient3);
								console.log("Pushing patient " + i);
								dropdown();
							});
					}
				});
		}
	});
}());


function dropdown() {
	for (let i = 0; i < patients.length; i++) {
		let p = patients[i];
		let a = document.createElement("a");
		let patientName = document.createTextNode(p.firstName + " " + p.lastName);

		a.appendChild(patientName);
		a.setAttribute("href", URIBuilder(p));

		dropDown.appendChild(a);
	}

}

// !! TODO: Dont put patient name in URL with UID
function URIBuilder(p) {
	let uri = new URLSearchParams();
	uri.append("DATA", "True");
	uri.append("PATIENT_ID", p.id);
	uri.append("FIRST", p.firstName);
	uri.append("LAST", p.lastName);
	return "./physiciansDash.html?" + uri.toString();
}