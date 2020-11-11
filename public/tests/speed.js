var db = firebase.firestore();
var speed = document.getElementById("num");
class FirebaseDAO {

    changeSpeed() {
        var id = firebase.auth().currentUser.uid;

        var docRef = db.collection("users").doc(id);

        db.collection("users").doc(id)
            .get()
            .then(doc => {

                let extractedData = doc.data();
                this.savespeed(extractedData);

                console.log("ID: " + doc.id);
                console.log("Email: " + doc.data().email);
                console.log("First name: " + doc.data().firstname);
                console.log("last name: " + doc.data().lastname);
                console.log("birthday: " + doc.data().birthday);

            });
    }

    savespeed(data) {
        var id = firebase.auth().currentUser.uid;
        db.collection("users").doc(id).set({
            firstname: data.firstname,
            lastname: data.lastname,
            birthday: data.birthday,
            email: data.email,
            physicians: data.physicians,
            testSpeeds: speed.value
        })
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

}

