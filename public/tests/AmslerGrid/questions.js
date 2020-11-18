const AmslerQuestions = document.querySelector('.Amslerquestions');
document.getElementById("sp1").addEventListener("click", s1);
document.getElementById("sp2").addEventListener("click", s2);
document.getElementById("sp3").addEventListener("click", s3);
document.getElementById("sp4").addEventListener("click", s4);

var sec1Questions = document.getElementById("qSec1");
var sec2Questions = document.getElementById("qSec2");
var sec3Questions = document.getElementById("qSec3");
var sec4Questions = document.getElementById("qSec4");

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

sec1Questions.style.display = "none"
sec2Questions.style.display = "none"
sec3Questions.style.display = "none"
sec4Questions.style.display = "none"




function s1() {


    if (sec1Questions.style.display === "none") {
        sec1Questions.style.display = "inline-block";
    } else {
        sec1Questions.style.display = "none";
    }
}

function s2() {


    if (sec2Questions.style.display === "none") {
        sec2Questions.style.display = "inline-block";
    } else {
        sec2Questions.style.display = "none";
    }
}

function s3() {

    if (sec3Questions.style.display === "none") {
        sec3Questions.style.display = "inline-block";
    } else {
        sec3Questions.style.display = "none";
    }

}

function s4() {
    if (sec4Questions.style.display === "none") {
        sec4Questions.style.display = "inline-block";
    } else {
        sec4Questions.style.display = "none";
    }


}




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