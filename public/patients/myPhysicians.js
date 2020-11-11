var tableBody = document.getElementById('currentList');
var tableBodySearch = document.getElementById('searchList');
var title = document.getElementById('title');
var docList = [];
var db = firebase.firestore();
var query = document.getElementById('query');
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
                    console.log(docList);

                    for (var i = 0; i < docList.length; i++) {
                        db.collection("users").doc(docList[i])
                            .get()
                            .then(doc => {
                                let docData = doc.data();
                                addRow(docData, tableBody);
                            });
                    }


                });

        }

    });
}


// TODO: Refactor variable names below to be more readable
function addRow(data, targetTableID) {
    let name = data.firstname + " " + data.lastname;
    let speciality = data.title;
    let work = data.location;


    // Table Row
    let row = document.createElement("tr");

    // Table Columns
    let columnName = document.createElement("td");
    let columnSpeciality = document.createElement("td");
    let columnUWork = document.createElement("td");

    // Will be a child of columnURL so we can add hyperlink
    //let linkForURL = document.createElement("a");

    // Text to be put in the Columns
    let textName = document.createTextNode(name);
    let textSpeciality = document.createTextNode(speciality);
    let textWork = document.createTextNode(work);

    // Set href attribute for link to test
    //linkForURL.appendChild(textURL);
    //linkForURL.setAttribute("href", urlOfTest);

    // Put the Text into their respective Columns
    columnName.appendChild(textName);
    columnSpeciality.appendChild(textSpeciality);
    columnUWork.appendChild(textWork);

    // Add each the Columns to the Row
    row.appendChild(columnName);
    row.appendChild(columnSpeciality);
    row.appendChild(columnUWork);

    // Add the Row to the Table
    targetTableID.appendChild(row);
}

async function search() {
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
                    addRow(docData, tableBodySearch);
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
                    addRow(docData, tableBodySearch);
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
                addRow(docData, tableBodySearch);
                found = true;
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
                addRow(docData, tableBodySearch);
                found = true;
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
                addRow(docData, tableBodySearch);
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

