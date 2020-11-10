var tableBody = document.getElementById('currentList');
var docList = [];
var db = firebase.firestore();

getDocs();

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
    tableBody.appendChild(row);
}

