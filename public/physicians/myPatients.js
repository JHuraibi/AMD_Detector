/*
    myPatients.js has the following features:
        1. getCurrent() - Loads the physicians curreent list of patients and sends to addRow
        2. checkForRequests() - Loads the physicians current patient request list and changes title of requests to match number of requests
        3. getRequests() - Loads the physicians current list of patient requests and sends to addRow
        4. addRow() - adds rows of patient information to their respected tables
        5. acceptUser() - lets physician accept a pateint requests and updates the databases
        6. rejectUser() - lets physician reject a patient requests and updates request list
*/

var tableBody = document.getElementById('currentList');
var requestListTable = document.getElementById('requestList');
var title = document.getElementById('title');
var db = firebase.firestore();

checkForRequests();
getCurrent();


async function checkForRequests() {                                 //updates the title page based on requests

    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let id = user.uid;
            db.collection("users").doc(id)
                .get()
                .then(doc => {
                    let array = doc.data().patientRequests;
                    if (array.length > 0) {
                        title.innerHTML = "Patient Requests (" + array.length + ")";
                    }
                    getRequests(array);
                });
        }
    });
}

function getRequests(array) {                                       //loads the users requesting this doc

    for (var i = 0; i < array.length; i++) {
        db.collection("users").doc(array[i])
            .get()
            .then(doc => {
                let pData = doc.data();
                addRow(pData, "new", doc.id);
            });
    }
}


function addRow(data, type, userID) {                              //adds the rows to their corresponding tables
    let name = data.firstname + " " + data.lastname;
    let birthday = data.birthday;

    // Table Row
    let row = document.createElement("tr");

    // Table Columns
    let columnName = document.createElement("td");
    let columnBirthday = document.createElement("td");
    let columnAction = document.createElement("td");

    // Will be a child of columnAction so we can add hyperlink
    //let linkForURL = document.createElement("a");
    var button = document.createElement('button');
    var reject = document.createElement('button');
    button.type = 'button';
    reject.type = 'button';
    button.className = "btn btn-secondary my-2";
    reject.className = "btn btn-secondary my-2";
    if (type == "current") {
        button.innerHTML = 'View Data';
        reject.style.display = "none";
    }
    else {
        button.innerHTML = 'Accept';
        reject.innerHTML = 'Reject';
    }

    button.onclick = function () {
        if (type == "current") {
            // CHECK
            // window.location = "physiciansDash.html";
            loadPhysicianDashboard();
        }
        else {
            let r = confirm("You are about to add this user as your patient.")
            if (r == true) {
                acceptUser(userID);
                console.log("accept user: " + userID);
            }
        }
    };

    reject.onclick = function () {
        let r = confirm("You are about to delete this patient request.")
        if (r == true) {
            rejectUser(userID);
        }
    }

    reject.style.marginLeft = "5px";

    // Text to be put in the Columns
    let textName = document.createTextNode(name);
    let textBirthday = document.createTextNode(birthday);

    // Put the Text into their respective Columns
    columnName.appendChild(textName);
    columnBirthday.appendChild(textBirthday);
    columnAction.appendChild(button);
    columnAction.appendChild(reject);

    // Add each the Columns to the Row
    row.appendChild(columnName);
    row.appendChild(columnBirthday);
    row.appendChild(columnAction);

    // Add the Row to the Table
    if (type == "current") {
        tableBody.appendChild(row);
    }
    else
        requestListTable.appendChild(row);
}


async function acceptUser(pId) {                                //adds users to their docs and vice versa

    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let id = user.uid;
            db.collection("users").doc(id)
                .get()
                .then(doc => {
                                                                //add patient to physician side
                    let array = doc.data().patients;
                    let check = false;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] == pId) {
                            check = true;
                            break;
                        }
                    }
                    if (check == false) {
                        array.push(pId);
                        console.log(pId);
                        db.collection("users").doc(id).update({
                            patients: array
                        })
                            .then(function () {
                                console.log("Patient successfully added to Physicians!");

                                                                //Add physician to patients side
                                db.collection("users").doc(pId)
                                    .get()
                                    .then(doc => {
                                        var array2 = [];
                                        if(doc.data().physicians != undefined){
                                            array2 = doc.data().physicians;
                                        }

                                        array2.push(id);

                                        db.collection("users").doc(pId).update({
                                            physicians: array2
                                        })
                                            .then(function () {
                                                console.log("physician successfully added to patients side!");
                                                removeRequest(pId);
                                            })
                                            .catch(function (error) {
                                                console.error("Error adding physician to pateints side: ", error);
                                            });

                                    });
                            })
                            .catch(function (error) {
                                console.error("Error adding patient to physicians side: ", error);
                            });

                    } else {
                        removeRequest(pId);
                        console.log("Patient already added");
                    }
                });
        }
    });

}


function rejectUser(pId) {                                      //rejects the request
    removeRequest(pId);
}

async function removeRequest(pID) {                             //Removes the request from the physicians requests array and off the requests table.

    console.log("Attempting to delete request");

    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let id = user.uid;
            db.collection("users").doc(id)
                .get()
                .then(doc => {
                    let array = doc.data().patientRequests;
                    const index = array.indexOf(pID);
                    array.splice(index, 1);


                    db.collection("users").doc(id).update({
                        patientRequests: array
                    })
                        .then(function () {
                            console.log("Request successfully deleted!");
                            location.reload();
                        })
                        .catch(function (error) {
                            console.error("Error deleting request: ", error);
                        });

                });
        }
    });

}

async function getCurrent() {                                    //gets the current list of patients this doctor has
    await firebase.auth().onAuthStateChanged(user => {
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
                                let pData = doc.data();
                                addRow(pData, "current", doc.id);
                            });
                    }
                });
        }
    });
}

const signOut = document.querySelector('.sign-out');
// sign out
signOut.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => console.log('signed out'));
    window.location = '../index.html';
});

function loadPhysicianDashboard() {
    let uri = new URLSearchParams();
    uri.append("DATA", "False");
    uri.append("PATIENT_ID", "");
    uri.append("FIRST", "");
    uri.append("LAST", "");

    // CHECK: replace() okay or use .location?
    // window.location = "./physiciansDash.html?" + uri.toString();
    window.location.replace("./physiciansDash.html?" + uri.toString());
}