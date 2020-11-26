var table = document.getElementById('historyTable');
var db = firebase.firestore();
var userData;
loadInfo();

async function loadInfo() {
    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            id = user.uid;
            db.collection("users").doc(user.uid)
                .get()
                .then(doc => {
                    userData = doc.data();
                    insertData(userData);
                });
        }
    });
}

//load current user information
function insertData(data) {

    //account information
    document.getElementById('firstname').placeholder = data.firstname;
    document.getElementById('lastname').placeholder = data.lastname;
    document.getElementById('birthday').value = data.birthday;
    document.getElementById('email').placeholder = data.email;

    //medical information
    document.getElementById('meds').value = data.meds;
    document.getElementById('sleep').value = data.sleep;
    document.getElementById('eyewear').value = data.eyewear;
    document.getElementById('disease').value = data.disease;
    document.getElementById('areds').value = data.areds;

    //if undefined, leave empty
    if (data.meds == undefined) {
        document.getElementById('meds').value = "";
    }
    if (data.disease == undefined) {
        document.getElementById('disease').value = "";
    }
    if (data.eyewear == undefined) {
        document.getElementById('eyewear').value = "";
    }

}


// Update Account Information after clicking 'save' button
const accountForm = document.querySelector('.accountForm');

accountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //read in form values
    var first = accountForm['firstname'].value;
    var last = accountForm['lastname'].value;
    var email = accountForm['email'].value;
    /* var password = accountForm['password'].value; */
    var birthday = accountForm['birthday'].value;

    if (first == "") {
        first = userData.firstname;
    }
    if (last == "") {
        last = userData.lastname;
    }
    if (email == "") {
        email = userData.email;
    }

    var r = confirm("Please confirm the following: \n" +
        "First name: " + first + "\n" +
        "Last name: " + last + "\n" +
        "Email: " + email + "\n" +
        "Birthday: " + birthday + "\n"
    );

    if (r == true) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                id = user.uid;
                db.collection("users").doc(user.uid)
                    .update({
                        firstname: first,
                        lastname: last,
                        birthday: birthday,
                        email: email,
                    })
                    .then(doc => {
                        document.getElementById('saveAccount').value = "Saved!"
                        console.log("User account information updated.")
                    });
            }
        });
    }

});

//Update Medical Information after clicking 'save' button
const medicalForm = document.querySelector('.medicalForm');

medicalForm.addEventListener('submit', (e) => {
    e.preventDefault();
   let timestamp = Date.now();
    savePast();

    //read in form values
    var sleep = medicalForm['sleep'].value;
    var areds = medicalForm['areds'].value;
    var eyewear = medicalForm['eyewear'].value;
    var disease = medicalForm['disease'].value;
    var meds = medicalForm['meds'].value;

    /* if (sleep == "") {
        sleep = userData.sleep;
        alert(sleep);
    }
    if (areds == "") {
        areds = userData.areds;
    }
    if (eyewear == "") {
        eyewear = userData.eyewear;
    }
    if (disease == "") {
        disease = userData.disease;
    }
    if (meds = "") {
        meds = userData.meds;
    } */


    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            id = user.uid;
            db.collection("users").doc(user.uid)
                .update({
                    sleep: sleep,
                    areds: areds,
                    eyewear: eyewear,
                    disease: disease,
                    meds: meds,
                    TimeStampMS: timestamp
                })
                .then(doc => {
                    document.getElementById('saveMedical').value = "Saved!"
                    console.log("User medical information updated.")
                });
        }
    });

});

async function savePast(){
    datatowrite = jsonresults();

    //Check values
    if(datatowrite.disease == undefined){
        datatowrite.disease = "";
    }
    if(datatowrite.sleep == undefined){
        datatowrite.sleep = "";
    }
    if(datatowrite.areds == undefined){
        datatowrite.areds = "";
    }
    if(datatowrite.eyewear == undefined){
        datatowrite.eyewear = "";
    }
    if(datatowrite.meds == undefined){
        datatowrite.meds = "";
    }
    

    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            id = user.uid;
            db.collection("users").doc(user.uid).collection("medicalHistory")
                .add(datatowrite)
                .then(console.log("Past history saved"));
        }
    });
}

function jsonresults() {
    return {
        "areds": userData.areds,
        "TimeStampMS": userData.TimeStampMS,
        "disease": userData.disease,
        "eyewear": userData.eyewear,
        "meds": userData.meds,
        "sleep": userData.sleep,
    }
}

function addRow(data) {
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
    table.appendChild(row);
}

/*
document.getElementById('deactivate').addEventListener("click", deactivate);

//TODO: delete them from the physicians account
async function deactivate() {

    let r = confirm("WARNING: You are about to deactivate your account. This will delete all of your information from our website. This cannot be undone.");

    if (r == true) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection("users").doc(user.uid).delete().then(function () {
                    console.log("Document successfully deleted!");

                    firebase.auth().deleteUser(user.uid)
                        .then(function () {
                            console.log('Successfully deleted user');
                            window.location = '../index.html';
                        })
                        .catch(function (error) {
                            console.log('Error deleting user:', error);
                        });

                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });

            }
        });

    }

        }

        */