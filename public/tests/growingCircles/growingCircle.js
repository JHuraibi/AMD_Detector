var canvas = document.querySelector('canvas');
var canvas2 = document.getElementById("canvas2");
var LER = document.getElementById('leftEyeResults');
var RER = document.getElementById('rightEyeResults');
var nexteye = document.getElementById('nextEye');
var retakebtn = document.getElementById('retakebtn');
var savebtn = document.getElementById('savebtn');
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');
document.getElementById("button").addEventListener("click", myFunction);
document.getElementById("start").addEventListener("click", startTest);
document.getElementById("nexttestbtn").addEventListener("click", startTest2);
const signOut = document.querySelector('.sign-out');
var startbtn= document.getElementById('start');
var seenbtn= document.getElementById('button');

// sign out
signOut.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => console.log('signed out'));
  window.location = '../../index.html';
});

var seen = false;

var size = 500;
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
nexteye.style.display ="none";
//hide results text
LER.style.display ="none";
RER.style.display="none";
//hide end buttons
retakebtn.style.display="none";
savebtn.style.display="none";

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
c.arc(250, 250, 4, 0, Math.PI * 2, false);
c.fill();
c.stroke();


function test() {

    if (j < 10) {
        // New red dot location
        x = Math.random() * 500;
        y = Math.random() * 500;
        z = 4
        c.clearRect(0, 0, 500, 500)

        // Black Dot
        c.fillStyle = "black";
        c.beginPath();
        c.arc(250, 250, 4, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
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
                setTimeout(grow, 1000);
            } else if (seen == true && z > 5) {                //user seen red dot and it has grown in size- add it to array
                console.log("create array of the coorinates and size of dot")
                results[0][index] = x;
                results[1][index] = y;
                results[2][index] = z;
                index++;
                j++;
                seen = false;
                test();
            }
            else {                                       //user seen the dot right away
                j++;
                seen = false;
                test();
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

function startTest() {                               //start test and create an array for this test

    if (canvas2.style.display == "none") {
        results = [];
        results[0] = [];
        results[1] = [];
        results[2] = [];
        index = 0;
        j = 0;
        seen = false;
        test();
    } else {
        startTest2();
    }
}

function nextTest() {
    //Clear the page and tell the user to start the next test
    canvas.style.display = "none";
    //start the next test
    nexteye.style.display ="block";
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
c2.arc(250, 250, 4, 0, Math.PI * 2, false);
c2.fill();
c2.stroke();


function test2() {

    if (j2 < 10) {
        // New red dot location
        x2 = Math.random() * 500;
        y2 = Math.random() * 500;
        z2 = 4
        c2.clearRect(0, 0, 500, 500)

        // Black Dot
        c2.fillStyle = "black";
        c2.beginPath();
        c2.arc(250, 250, 4, 0, Math.PI * 2, false);
        c2.fill();
        c2.stroke();
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
                test2();
            }
            else {                                       //user seen the dot right away
                j2++;
                seen = false;
                test2();
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
    nexteye.style.display ="none";
    canvas2.style.display = "inline-block";
    startbtn.style.display = "inline-block";
    seenbtn.style.display = "inline-block";
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

    //displaying and hiding elements 
    console.log("displaying results from both tests");
    canvas2.style.display = "inline-block";
    canvas.style.display = "inline-block";
    LER.style.display ="block";
    RER.style.display="block";
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
            x = r[0][i];
            y = r[1][i];
            z = r[2][i];
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
            x2 = r2[0][i];
            y2 = r2[1][i];
            z2 = r2[2][i];
            c2.fillStyle = "red";
            c2.beginPath();
            c2.arc(x2, y2, z2, 0, Math.PI * 2, false);
            c2.fill();
            c2.stroke();
        }
    }

}


