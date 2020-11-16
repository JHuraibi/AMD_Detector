var tableBody = document.getElementById('currentList');
var tableBodySearch = document.getElementById('searchList');
var title = document.getElementById('title');
var docList = [];
var db = firebase.firestore();
var query = document.getElementById('query');
var searchWarning = document.getElementById('searchWarning');
document.getElementById("searchbtn").addEventListener("click", search);

getDocs();
loadAll();


async function getDocs() {
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
function addRow(data, targetTableID, id, type) {
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

async function search() {
	if (query.value.length < 3) {
		console.log("Less than 3");
		searchWarning.style.visibility = "visible";
		return;
	}
	
	searchWarning.style.visibility = "hidden";
    let input = query.value.toLowerCase();
    title.innerHTML = "Search Results For " + query.value;
    var splitInput = input.split(" ");


    var tableHeaderRowCount = 1;
    var rowCount = tableBodySearch.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableBodySearch.deleteRow(tableHeaderRowCount);
    }

    for (var i = 0; i < splitInput.length; i++) {

        var found = false;

        await db.collection("users").where("type", "==", "physician").where("firstlower", "==", splitInput[i])
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    let docData = doc.data();
                    let docID = doc.id;
                    addRow(docData, tableBodySearch, docID, "add");
                    found = true;
                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        if (found == true) {
            console.log("Query found in firstnames. Breaking.")
            break;
        }

        await db.collection("users").where("type", "==", "physician").where("lastlower", "==", splitInput[i])
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    let docData = doc.data();
                    let docID = doc.id;
                    addRow(docData, tableBodySearch, docID, "add");
                    found = true;
                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        if (found == true) {
            console.log("Query found in lastnames. Breaking.")
            break;
        }
    }

    await db.collection("users").where("type", "==", "physician").where("locationlower", "==", input)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let docData = doc.data();
                let docID = doc.id;
                addRow(docData, tableBodySearch, docID, "add");
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });


    await db.collection("users").where("type", "==", "physician").where("titlelower", "==", input)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let docData = doc.data();
                let docID = doc.id;
                addRow(docData, tableBodySearch, docID, "add");
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function loadAll() {
    db.collection("users").where("type", "==", "physician")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let docData = doc.data();
                let docID = doc.id;
                addRow(docData, tableBodySearch, docID, "add");
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function addPhysician(docID) {

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

            } else
                console.log("Request already sent");

        });

}

function update(data, docs) {
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

async function deletePhysician(docID) {

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
    var url=location.href.split("/").slice(-1) + "";
    if(url.startsWith("instructions_page.html", 0)){
      window.location = '../index.html';
    }else
      window.location = '../index.html'; 
});

