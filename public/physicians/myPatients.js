var title = document.getElementById('title');
var db = firebase.firestore();
checkForRequests();

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

                });
        }
    });
}