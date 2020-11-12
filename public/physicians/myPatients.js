var tableBody = document.getElementById('currentList');
var requestListTable = document.getElementById('requestList');
var title = document.getElementById('title');
var db = firebase.firestore();

checkForRequests();
//getCurrent();

async function checkForRequests() {

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

function getRequests(array) {

    for (var i = 0; i < array.length; i++) {
        db.collection("users").doc(array[i])
            .get()
            .then(doc => {
                let pData = doc.data();
                addRow(pData, "new", array[i]);
            });
    }
}

function addRow(data, type, userID) {
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
    }
    else {
        button.innerHTML = 'Accept';
        reject.innerHTML = 'Reject';
    }

    button.onclick = function () {
        if (type == "users") {
            //add button that goes to dashboard and views the user data     
        }
        else {
            let r = confirm("You are about to add this user as your patient.")
            if (r == true) {
                acceptUser(userID);
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
    requestListTable.appendChild(row);
}

async function acceptUser(pId) {
    removeRequest(pId);

}

function rejectUser(pId) {
    removeRequest(pId);
}

//Removes the request from the physicians requests array and off the requests table.
async function removeRequest(pID){

    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let id = user.uid;
            db.collection("users").doc(id)
                .get()
                .then(doc => {
                    let array = doc.data().patientRequests;
                    const index = array.indexOf(pID);
                    array.splice(index,1);


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
