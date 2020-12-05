/*
    speed.js lets the user change the testspeed value in their 
*/

var db = firebase.firestore();
var speed = document.getElementById("num");
class FirebaseDAO {

    savespeed() {
        var id = firebase.auth().currentUser.uid;
        db.collection("users").doc(id).update({
            testSpeeds: speed.value
        })
            .then(function () {
                console.log("Document successfully written!");
                document.getElementById('speedbtn').innerHTML = 'Saved!';
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

}

