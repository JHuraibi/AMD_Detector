/**
 * 		myPhysicians has the following features:
 * 			1. getDocs() - Loads all the physicians this user has added
 * 			2. addRow() - Populates the selected tables with the information given
 * 			3. loadAll() - Loads all the physicians listed in the database
 * 			4. search() - searches the database for physicians by name, location, and specialty. 
 * 			5. saveToLocal() - locally saves the physicians for easy sub-string searching
 * 			6. addPhysician() - Sends an request to the chosen physician to be added
 * 			7. deletePhysician() - lets the user remove their physician, which will also remove the user from the physicians patient list
 */


var tableBody = document.getElementById('currentList');
var tableBodySearch = document.getElementById('searchList');
var title = document.getElementById('title');
var docList = [];
var db = firebase.firestore();
var query = document.getElementById('query');
var searchWarning = document.getElementById('searchWarning');
let localPhysicians = [];
document.getElementById("searchbtn").addEventListener("click", search);

getDocs();
loadAll();


async function getDocs() {													//Loads users current list of added doctors
	//let user = await firebase.auth().currentUser;
	await firebase.auth().onAuthStateChanged(user => {
		if (user) {
			id = user.uid;
			db.collection("users").doc(user.uid)
				.get()
				.then(doc => {
					docList = doc.data().physicians;
					
					for (var i = 0; i < docList.length; i++) {
						db.collection("users").doc(docList[i])
							.get()
							.then(doc => {
								let docData = doc.data();
								let docID = doc.id;
								addRow(docData, tableBody, docID, "users");
							});
					}
				});
			
		}
		
	});
}


// TODO: Refactor variable names below to be more readable
function addRow(data, targetTableID, id, type) {							//Adds the physicians information to the specified table
	let name = data.firstname + " " + data.lastname;
	let speciality = data.title;
	let work = data.location;
	
	// Table Row
	let row = document.createElement("tr");
	
	// Table Columns
	let columnName = document.createElement("td");
	let columnSpeciality = document.createElement("td");
	let columnUWork = document.createElement("td");
	let columnAction = document.createElement("td");
	
	// Will be a child of columnAction so we can add hyperlink
	//let linkForURL = document.createElement("a");
	var button = document.createElement('button');
	button.type = 'button';
	button.className = "btn btn-secondary my-2";
	if (type == "users") {
		button.innerHTML = 'Delete';
	}
	else {
		button.innerHTML = 'Add';
	}
	
	button.onclick = function () {
		if (type == "users") {
			//delete this physician
			var r = confirm("You are about to delete this physician. Are you sure? This cannot be reversed, and you must re-add your doctor.")
			if (r == true) {
				deletePhysician(id);
			}
		}
		else {
			//add this physician
			addPhysician(id);
			button.innerHTML = "Requested";
		}
	};
	
	// Text to be put in the Columns
	let textName = document.createTextNode(name);
	let textSpeciality = document.createTextNode(speciality);
	let textWork = document.createTextNode(work);
	
	// Put the Text into their respective Columns
	columnName.appendChild(textName);
	columnSpeciality.appendChild(textSpeciality);
	columnUWork.appendChild(textWork);
	columnAction.appendChild(button);
	
	// Add each the Columns to the Row
	row.appendChild(columnName);
	row.appendChild(columnSpeciality);
	row.appendChild(columnUWork);
	row.appendChild(columnAction);
	
	// Add the Row to the Table
	targetTableID.appendChild(row);
}

async function search() {													//Seacrh method used in the "All Physicians" section
	if (query.value.length < 3) {
		console.log("Less than 3");
		searchWarning.innerText = "Searches must be three (3) or more characters.";
		searchWarning.style.visibility = "visible";
		return;
	}
	
	if (query.value.length > 256) {
		console.log("Less than 3");
		searchWarning.innerText = "Search too long. Must be 256 or less characters.";
		searchWarning.style.visibility = "visible";
		return;
	}
	
	searchWarning.style.visibility = "hidden";
	title.innerHTML = "Search Results For: " + query.value;
	var splitInput = query.value.split(" ");
	
	var tableHeaderRowCount = 1;
	var rowCount = tableBodySearch.rows.length;
	for (var i = tableHeaderRowCount; i < rowCount; i++) {
		tableBodySearch.deleteRow(tableHeaderRowCount);
	}
	// NOTE: JSON Structure
	// 			id: docID
	// 			email: doc.email
	// 			firstname: doc.firstname
	// 			lastname: doc.lastname
	// 			location: doc.location
	// 			title: doc.title
	for (let i = 0; i < splitInput.length; i++) {
		if (splitInput[i].length < 3) {
			console.log("Substring \"" + splitInput[i] + "\" too short. Skipping.");
			continue;
		}
		
		let searchTerm = splitInput[i].toLowerCase();
		let found = false;
		
		for (let j = 0; j < localPhysicians.length; j++) {
			let p = localPhysicians[j];
			
			if (p.title.toLowerCase().includes(searchTerm)) {
				console.log("Query found in title (speciality). Breaking from Inner.");
				addRow(p, tableBodySearch, p.id, "add");
				found = true;
				continue;
			}
			
			if (p.lastname.toLowerCase().includes(searchTerm)) {
				console.log("Query found in lastnames. Breaking from Inner.");
				addRow(p, tableBodySearch, p.id, "add");
				found = true;
				continue;
			}
			
			if (p.firstname.toLowerCase().includes(searchTerm)) {
				console.log("Query found in firstnames. Breaking from Inner.");
				addRow(p, tableBodySearch, p.id, "add");
				found = true;
				continue;
			}
			
			if (p.location.toLowerCase().includes(searchTerm)) {
				console.log("Query found in location. Breaking from Inner.");
				addRow(p, tableBodySearch, p.id, "add");
				found = true;
				// continue;	// Continue not needed. Kept to show it was intentionally left out.
			}
		}
	}
	
}

function loadAll() {														//Loads all the physicians registered on the website
	db.collection("users").where("type", "==", "physician")
		.get()
		.then(function (querySnapshot) {
			querySnapshot.forEach(function (doc) {
				let docData = doc.data();
				let docID = doc.id;
				addRow(docData, tableBodySearch, docID, "add");
				saveToLocal(doc.id, doc.data());
			});
		})
		.then(testPrint)
		.catch(function (error) {
			console.log("Error getting documents: ", error);
		});
	
	
}

function saveToLocal(docID, data) {											//Locally saves the physician for easy sub searching
	let newPhysician = {	
		id: docID,
		email: data.email,
		firstname: data.firstname,
		lastname: data.lastname,
		location: data.location,
		title: data.title,
	};
	
	localPhysicians.push(newPhysician);
}

function testPrint() {
	console.log("TEST PRINT");
	for (let i = 0; i < localPhysicians.length; i++) {
		let physician = localPhysicians[i];
		console.log("Name: " + physician.firstname);
	}
}

function addPhysician(docID) {												//Sends a pateint request to the physician selected
	
	var id = firebase.auth().currentUser.uid;
	db.collection("users").doc(docID)
		.get()
		.then(doc => {
			let array = doc.data().patientRequests;
			var check = false;
			for (var i = 0; i < array.length; i++) {
				if (array[i] == id) {
					check = true;
					break;
				}
				console.log(array[i]);
			}
			if (check == false) {
				array.push(id);
				db.collection("users").doc(docID).update({
					patientRequests: array
				})
					.then(function () {
						console.log("Request successfully written!");
					})
					.catch(function (error) {
						console.error("Error writing document: ", error);
					});
				
			}
			else
				console.log("Request already sent");
			
		});
	
}

function update(data, docs) {												//updates user information
	var id = firebase.auth().currentUser.uid;
	db.collection("users").doc(id).update({
		firstname: data.firstname,
		lastname: data.lastname,
		birthday: data.birthday,
		email: data.email,
		physicians: docs,
		testSpeeds: data.testSpeeds
	})
		.then(function () {
			console.log("Document successfully written!");
			location.reload();
		})
		.catch(function (error) {
			console.error("Error writing document: ", error);
		});
}

async function deletePhysician(docID) {										//Delete physician from both the patient and physicians database
	
	await firebase.auth().onAuthStateChanged(user => {
		if (user) {
			let id = user.uid;
			db.collection("users").doc(id)
				.get()
				.then(doc => {
					let docs = doc.data().physicians;
					const index = docs.indexOf(docID);
					docs.splice(index, 1);
					
					
					db.collection("users").doc(id).update({
						physicians: docs
					})
						.then(function () {
							console.log("Doctor successfully deleted!");
							
							//delete from docs side
							db.collection("users").doc(docID)
								.get()
								.then(doc => {
									let array2 = doc.data().patients;
									const index2 = array2.indexOf(id);
									array2.splice(index2, 1);
									
									
									db.collection("users").doc(docID).update({
										patients: array2
									})
										.then(function () {
											console.log("patient deleted from docs side");
											//location.reload();
										})
										.catch(function (error) {
											console.error("Error deleting patient from docs side: ", error);
										});
									
								});
						})
						.catch(function (error) {
							console.error("Error deleting doctor: ", error);
						});
					
				});
		}
	});
	
}

const signOut = document.querySelector('.sign-out');

// sign out
signOut.addEventListener('click', () => {
	firebase.auth().signOut()
		.then(() => console.log('signed out'));
	var url = location.href.split("/").slice(-1) + "";
	if (url.startsWith("instructions_page.html", 0)) {
		window.location = '../index.html';
	}
	else
		window.location = '../index.html';
});

