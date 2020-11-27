var tableContainer = document.getElementById('tableContainer');
var db = firebase.firestore();
var userData;
loadInfo();
loadHistory();

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

async function savePast() {
    datatowrite = jsonresults();

    //Check values
    if (datatowrite.disease == undefined) {
        datatowrite.disease = "";
    }
    if (datatowrite.sleep == undefined) {
        datatowrite.sleep = "";
    }
    if (datatowrite.areds == undefined) {
        datatowrite.areds = "";
    }
    if (datatowrite.eyewear == undefined) {
        datatowrite.eyewear = "";
    }
    if (datatowrite.meds == undefined) {
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


function loadHistory() {

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            id = user.uid;
            db.collection("users")
                .doc(id)
                .collection("medicalHistory")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        let data = doc.data();
                        addTable(data);
                    });
                });
        }
    });

}

function addTable(data) {
    let areds = data.areds;
    let disease = data.disease;
    let eyewear = data.eyewear;
    let meds = data.meds;
    let sleep = data.sleep;
    let date = formatDate(data.TimeStampMS);

    //Create a table
    table = document.createElement('table');
    table.className = "table table-striped table-sm";

    //Row for date question
    let rowDate = document.createElement("tr");
    //Column
    let columnDateText = document.createElement("th");
    let columnDateInput = document.createElement("td");
    //Column texts
    let textDate = document.createTextNode("Date Updated:");
    let textDateInput = document.createTextNode(date);
    //Put text in columns
    columnDateText.appendChild(textDate);
    columnDateInput.appendChild(textDateInput);
    //Style
    columnDateText.style.width = "50%";
    columnDateInput.style.width = "50%";
    columnDateInput.style.backgroundColor = "white";
    //Add columns to row
    rowDate.appendChild(columnDateText);
    rowDate.appendChild(columnDateInput);
    //Add row to table
    table.appendChild(rowDate);

    //Row for Sleep apnea question
    let rowSleep = document.createElement("tr");
    //Column
    let columnSleepQuestion = document.createElement("th");
    let columnSleepAnswer = document.createElement("td");
    //Column texts
    let textSleepQuestion = document.createTextNode("Do you suffer from sleep apnea or other sleep disorders?");
    let textSleepAnswer = document.createTextNode(sleep);
    //Put text in columns
    columnSleepQuestion.appendChild(textSleepQuestion);
    columnSleepAnswer.appendChild(textSleepAnswer);
    columnSleepAnswer.style.backgroundColor = "white";
    //Add columns to row
    rowSleep.appendChild(columnSleepQuestion);
    rowSleep.appendChild(columnSleepAnswer);
    //Add row to table
    table.appendChild(rowSleep);

    //Row for Areds Question
    let rowaAreds = document.createElement("tr");
    //Column
    let columnAredsQuestion = document.createElement("th");
    let columnAredsAnswer = document.createElement("td");
    //Column texts
    let textAredsQuestion = document.createTextNode("Do you take AREDS or AREDS2 vitamins?");
    let textAredsAnswer = document.createTextNode(areds);
    //Put text in columns
    columnAredsQuestion.appendChild(textAredsQuestion);
    columnAredsAnswer.appendChild(textAredsAnswer);
    columnAredsAnswer.style.backgroundColor = "white";
    //Add columns to row
    rowaAreds.appendChild(columnAredsQuestion);
    rowaAreds.appendChild(columnAredsAnswer);
    //Add row to table
    table.appendChild(rowaAreds);

    //Row for Eyewear question
    let rowaEyewear = document.createElement("tr");
    //Column
    let columnEyewearQuestion = document.createElement("th");
    let columnEyewearAnswer = document.createElement("td");
    //Column texts
    let textEyewearQuestion = document.createTextNode("If any, list all eyewear you use (i.e. contacts, prescription glasses, reading glasses) and how often you wear them:");
    let textEyewearAnswer = document.createTextNode(eyewear);
    //Put text in columns
    columnEyewearQuestion.appendChild(textEyewearQuestion);
    columnEyewearAnswer.appendChild(textEyewearAnswer);
    columnEyewearAnswer.style.backgroundColor = "white";
    //Add columns to row
    rowaEyewear.appendChild(columnEyewearQuestion);
    rowaEyewear.appendChild(columnEyewearAnswer);
    //Add row to table
    table.appendChild(rowaEyewear);

    //Row for Disease question
    let rowDisease = document.createElement("tr");
    //Column
    let columnDiseaseQuestion = document.createElement("th");
    let columnDiseaseAnswer = document.createElement("td");
    //Column texts
    let textDiseaseQuestion = document.createTextNode("Have you been diagnosed with any eye diseases or disorders that could affect your quality of vision? If so, include when you were diagnosed and any treatment you may have been given.");
    let textDiseaseAnswer = document.createTextNode(disease);
    //Put text in columns
    columnDiseaseQuestion.appendChild(textDiseaseQuestion);
    columnDiseaseAnswer.appendChild(textDiseaseAnswer);
    columnDiseaseAnswer.style.backgroundColor = "white";
    //Add columns to row
    rowDisease.appendChild(columnDiseaseQuestion);
    rowDisease.appendChild(columnDiseaseAnswer);
    //Add row to table
    table.appendChild(rowDisease);

    //Row for Medication question
    let rowMeds = document.createElement("tr");
    //Column
    let columnMedsQuestion = document.createElement("th");
    let columnMedsAnswer = document.createElement("td");
    //Column texts
    let textMedsQuestion = document.createTextNode("List any medication you take:");
    let textMedsAnswer = document.createTextNode(meds);
    //Put text in columns
    columnMedsQuestion.appendChild(textMedsQuestion);
    columnMedsAnswer.appendChild(textMedsAnswer);
    columnMedsAnswer.style.backgroundColor = "white";
    //Add columns to row
    rowMeds.appendChild(columnMedsQuestion);
    rowMeds.appendChild(columnMedsAnswer);
    //Add row to table
    table.appendChild(rowMeds);

    //Empty row
    // let empty = document.createElement("tr");
    // let columnempty = document.createElement("td");
    // let emptytext = document.createTextNode("");
    // columnempty.appendChild(emptytext);
    // empty.appendChild(columnempty);
    // table.appendChild(empty);

    //Add table to page
    tableContainer.appendChild(table);

    let linebreak = document.createElement("br");
    tableContainer.appendChild(linebreak);

}

function formatDate(milliseconds) {
    let date = new Date(milliseconds);
    let timezoneOffset = 5;	// UTC -5:00

    let dateString = date.toDateString();
    let hoursString = +date.getUTCHours() - timezoneOffset;
    let minutesString = date.getUTCMinutes();
    let postfix = hoursString > 11 ? "PM" : "AM";

    if (hoursString === 0) {
        hoursString = 12;
    }

    minutesString = minutesString < 10 ? "0" + minutesString : minutesString;
    hoursString = hoursString % 12;

    // Uncomment below line to add time of day
    // return dateString + " at " + hoursString + ":" + minutesString + postfix;
    return dateString;
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