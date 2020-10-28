var canvas = document.querySelector('canvas');
var canvas2 = document.getElementById("canvas2");
var LER = document.getElementById('leftEyeResults');
var RER = document.getElementById('rightEyeResults');
var nexteye = document.getElementById('nextEye');
var retakebtn = document.getElementById('retakebtn');
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');
document.getElementById("button").addEventListener("click", myFunction);
document.getElementById("start").addEventListener("click", startTest);
document.getElementById("nexttestbtn").addEventListener("click", startTest2);
document.getElementById("savebtn").addEventListener("click", sendToFirestore);
//const signOut = document.querySelector('.sign-out');
var startbtn = document.getElementById('start');
var seenbtn = document.getElementById('button');
var growingspeed = 1000;
let timestamp;

var seen = false;

var size = 700;
canvas.style.width = size + "px";
canvas.style.height = size + "px";
canvas2.style.width = size + "px";
canvas2.style.height = size + "px";


// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
canvas.width = size * scale;
canvas.height = size * scale;
canvas2.width = size * scale;
canvas2.height = size * scale;

// Normalize coordinate system to use css pixels.
c.scale(scale, scale);
c2.scale(scale, scale);

//hide canvas 2 for now
canvas2.style.display = "none";
nexteye.style.display = "none";
//hide results text
LER.style.display = "none";
RER.style.display = "none";
//hide end buttons
retakebtn.style.display = "none";
savebtn.style.display = "none";

//Test variables 
var x;
var y;
var z = 0;
var j = 0;
var results = [];
results[0] = [];
results[1] = [];
results[2] = [];
var index = 0;
c.fillStyle = "black";
c.beginPath();
c.arc(350, 350, 4, 0, Math.PI * 2, false);
c.fill();
c.stroke();


function test() {

    if (j < 5) {
        // New red dot location
        x = Math.random() * 700;
        y = Math.random() * 700;
        z = 3
        grow();

        // Grow dot
        function grow() {
            c.fillStyle = "red";
            c.beginPath();
            c.arc(x, y, z, 0, Math.PI * 2, false);
            c.fill();
            c.stroke();
            if (seen == false) {                          //user hasnt seen the red dot yet, keep growing
                z++;
                //1000 = 1 second. Default is 1. this changes when the user prefernce changes. 
                setTimeout(grow, 1000);
            } else if (seen == true && z > 5) {                //user seen red dot and it has grown in size- add it to array
                console.log("create array of the coorinates and size of dot")
                results[0][index] = x;
                results[1][index] = y;
                results[2][index] = z;
                index++;
                j++;
                seen = false;
                c.clearRect(0, 0, 700, 700)
                c.fillStyle = "black";
                c.beginPath();
                c.arc(350, 350, 4, 0, Math.PI * 2, false);
                c.fill();
                c.stroke();
                if (j < 5) {
                    setTimeout(test, growingspeed);
                } else test();
            }
            else {                                       //user seen the dot right away
                j++;
                seen = false;
                c.clearRect(0, 0, 700, 700)
                c.fillStyle = "black";
                c.beginPath();
                c.arc(350, 350, 4, 0, Math.PI * 2, false);
                c.fill();
                c.stroke();
                if (j < 5) {
                    setTimeout(test, growingspeed);
                } else test();
            }
        }
    } else {
        console.log("Test is over. Start next eye test")
        nextTest();
    }

}

function myFunction() {
    seen = true;
}

async function getUid() {
    //let user = await firebase.auth().currentUser;
    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            id = user.uid;
            console.log(id);
            db.collection("users").doc(user.uid)
                .get()
                .then(doc => {

                    let newgrowingspeed = (doc.data().testSpeeds) * 1000;
                    growingspeed = newgrowingspeed;
                    console.log(newgrowingspeed);

                });
        }
    });
}

function startTest() {                               //start test and create an array for this test

    getUid();
    timestamp = Date.now();
    if (canvas2.style.display == "none") {
        results = [];
        results[0] = [];
        results[1] = [];
        results[2] = [];
        index = 0;
        j = 0;
        seen = false;
        startbtn.innerText = "Restart";
        test();
    } else {
        startTest2();
    }
}

function nextTest() {
    //Clear the page and tell the user to start the next test
    canvas.style.display = "none";
    //start the next test
    nexteye.style.display = "block";
    //Hide start test and seen button
    startbtn.style.display = "none";
    seenbtn.style.display = "none";

}

//test2
//Test variables 
var x2;
var y2;
var z2 = 0;
var j2 = 0;
var results2 = [];
results2[0] = [];
results2[1] = [];
results2[2] = [];
var index2 = 0;
c2.fillStyle = "black";
c2.beginPath();
c2.arc(350, 350, 4, 0, Math.PI * 2, false);
c2.fill();
c2.stroke();


function test2() {

    if (j2 < 5) {
        // New red dot location
        x2 = Math.random() * 700;
        y2 = Math.random() * 700;
        z2 = 3
        grow2();


        // Grow dot
        function grow2() {
            c2.fillStyle = "red";
            c2.beginPath();
            c2.arc(x2, y2, z2, 0, Math.PI * 2, false);
            c2.fill();
            c2.stroke();
            if (seen == false) {                          //user hasnt seen the red dot yet, keep growing
                z2++;
                setTimeout(grow2, 1000);
            } else if (seen == true && z2 > 5) {                //user seen red dot and it has grown in size- add it to array
                console.log("create array of the coorinates and size of dot")
                results2[0][index2] = x2;
                results2[1][index2] = y2;
                results2[2][index2] = z2;
                index2++;
                j2++;
                seen = false;
                c2.clearRect(0, 0, 700, 700)

                // Black Dot
                c2.fillStyle = "black";
                c2.beginPath();
                c2.arc(350, 350, 4, 0, Math.PI * 2, false);
                c2.fill();
                c2.stroke();
                if (j2 < 5) {
                    setTimeout(test2, growingspeed);
                } else test2();
            }
            else {                                       //user seen the dot right away
                j2++;
                seen = false;
                c2.clearRect(0, 0, 700, 700)
                // Black Dot
                c2.fillStyle = "black";
                c2.beginPath();
                c2.arc(350, 350, 4, 0, Math.PI * 2, false);
                c2.fill();
                c2.stroke();
                if (j2 < 5) {
                    setTimeout(test2, growingspeed);
                } else test2();
            }
        }
    } else {
        console.log("Test is over.")
        showResults(results, results2);
    }

}

function myFunction() {
    seen = true;
}

function startTest2() {                               //start test and create an array for this test
    nexteye.style.display = "none";
    canvas2.style.display = "inline-block";
    startbtn.style.display = "inline-block";
    seenbtn.style.display = "inline-block";
    startbtn.innerText = "Restart";
    results2 = [];
    results2[0] = [];
    results2[1] = [];
    results2[2] = [];
    index2 = 0;
    j2 = 0;
    seen = false;
    test2();
}

//Clear the canvas and create a new one with the data collected. Need to also save the data to the database here

function showResults(r, r2) {

    size = 500;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas2.style.width = size + "px";
    canvas2.style.height = size + "px";


    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
    canvas.width = size * scale;
    canvas.height = size * scale;
    canvas2.width = size * scale;
    canvas2.height = size * scale;

    // Normalize coordinate system to use css pixels.
    c.scale(scale, scale);
    c2.scale(scale, scale);

    //displaying and hiding elements 
    console.log("displaying results from both tests");
    canvas2.style.display = "inline-block";
    canvas.style.display = "inline-block";
    LER.style.display = "inline-block";
    RER.style.display = "inline-block";
    startbtn.style.display = "none";
    seenbtn.style.display = "none";

    //save results or retake test buttons
    retakebtn.style.display = "inline-block";
    savebtn.style.display = "inline-block";

    //clear canvas
    c.clearRect(0, 0, 500, 500)

    // Black Dot
    c.fillStyle = "black";
    c.beginPath();
    c.arc(250, 250, 4, 0, Math.PI * 2, false);
    c.fill();
    c.stroke();

    c2.clearRect(0, 0, 500, 500)

    // Black Dot
    c2.fillStyle = "black";
    c2.beginPath();
    c2.arc(250, 250, 4, 0, Math.PI * 2, false);
    c2.fill();
    c2.stroke();

    //plot all the circles the user missed if any
    var limit = r[0].length;
    if (limit > 0) {
        for (var i = 0; i < limit; i++) {
            x = (500*r[0][i])/700;
            y = (500*r[1][i])/700;
            z = (500*r[2][i])/700;
            c.fillStyle = "red";
            c.beginPath();
            c.arc(x, y, z, 0, Math.PI * 2, false);
            c.fill();
            c.stroke();
        }
    }

    var limit2 = r2[0].length;
    if (limit2 > 0) {
        for (var i = 0; i < limit; i++) {
            x2 = (500*r2[0][i])/700;
            y2 = (500*r2[1][i])/700;
            z2 = (500*r2[2][i])/700;
            c2.fillStyle = "red";
            c2.beginPath();
            c2.arc(x2, y2, z2, 0, Math.PI * 2, false);
            c2.fill();
            c2.stroke();
        }
    }

    getGrowingCirclesResults(r, r2);
}

var lefteyeX = [];
var lefteyeY = [];
var lefteyeZ = [];
var rightEyeX = [];
var rightEyeY = [];
var rightEyeZ = [];

function getGrowingCirclesResults(r, r2) {

    //break the two nested arrays into six arrays

    var limit = r[0].length;
    if (limit > 0) {
        for (var i = 0; i < limit; i++) {
            lefteyeX[i] = r[0][i];
            lefteyeY[i] = r[1][i];
            lefteyeZ[i] = r[2][i];
        }
    }

    limit = r2[0].length;
    if (limit > 0) {
        for (var i = 0; i < limit; i++) {
            rightEyeX[i] = r2[0][i];
            rightEyeY[i] = r2[1][i];
            rightEyeZ[i] = r2[2][i];
        }
    }

}
function jsonresults() {
    return {
        "TestName": "growingCircles",
        "TimeStampMS": timestamp,
        "XLocationsRight": rightEyeX,
        "YLocationsRight": rightEyeY,
        "ZLocationsRight": rightEyeZ,
        "XLocationsLeft": lefteyeX,
        "YLocationsLeft": lefteyeY,
        "ZLocationsLeft": lefteyeZ,
    }
}

function sendToFirestore() {
    console.log("saving to database");
    var dataToWrite = jsonresults();
    var db = firebase.firestore();
    var id = firebase.auth().currentUser.uid;
    console.log(id);
    db.collection("TestResults")
        .doc(id)
        .collection("GrowingCircles")
        .add(dataToWrite)
        .then(() => {
            //uploadSuccess();
            setTimeout(() => {
                // Use replace() to disallow back button to come back to this page
                window.location.replace("../../home.html");
            }, 1000);
        });

}