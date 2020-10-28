const AmslerQuestions = document.querySelector('.Amslerquestions');
var id;
getUid();

AmslerQuestions.addEventListener('submit', (e) => {
    e.preventDefault();
    
    console.log("saving to database");
    var db = firebase.firestore();
    var dataToWrite = jsonresults();
    var id = firebase.auth().currentUser.uid;
    console.log(id);
    db.collection("TestResults")
        .doc(id)
        .collection("AmslerGrid")
        .add(dataToWrite)
        .then(() => {
            //uploadSuccess();
            setTimeout(() => {
                // Use replace() to disallow back button to come back to this page
                window.location.replace("../../home.html");
            }, 1000);
        });



});

function jsonresults() {
    let timestamp = Date.now();
    let sections= [];
    if(AmslerQuestions.section1.checked==true){
        sections.push("Section1");
    }
    if(AmslerQuestions.section2.checked==true){
        sections.push("Section2");
    }
    if(AmslerQuestions.section3.checked==true){
        sections.push("Section3");
    }
    if(AmslerQuestions.section4.checked==true){
        sections.push("Section4");
    }

    return {
        "TestName": "AmslerGrid",
        "TimeStampMS": timestamp,
        "Eye": AmslerQuestions.q1.value,
        "Sections": sections,
        "Distortion": AmslerQuestions.q3.value,
        "Holes": AmslerQuestions.q4.value,
        "Corners": AmslerQuestions.q5.value,
        "Comments": AmslerQuestions.concerns.value,
    }
}

async function getUid() {
    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            id = user.uid;
        }
    });

} 