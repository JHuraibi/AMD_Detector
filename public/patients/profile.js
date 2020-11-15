var db = firebase.firestore();
loadInfo();
var userData;

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
    document.getElementById('firstname').placeholder = data.firstname;
    document.getElementById('lastname').placeholder = data.lastname;
    document.getElementById('birthday').value = data.birthday;
    document.getElementById('email').placeholder = data.email;

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
                    meds: meds
                })
                .then(doc => {
                    document.getElementById('saveMedical').value = "Saved!"
                    console.log("User medical information updated.")
                });
        }
    });

});