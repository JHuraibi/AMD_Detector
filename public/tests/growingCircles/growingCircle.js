/*

The Growing Circles Test

The aim of this test is to see if the user has any blind spots in their vision- and how big of a blind spot it is.
There are a few functionalities of this code:
    1- Hiding and displaying HTML items during the right times
    2- Creating and erasing new circles
    3- Saving only grown circles
    4- Evenly distrubuting the circles
    5- Displaying the results
    6- Saving the results

Here are the functions of this file and what they do:

    - lefteye(), righteye(), botheyes() - These functions are called when the user first loads the Growing Circles page. They must select
    one of these options and upon doing so, we will save which kind of test they are taking in the 'testing' variable and call the appropriate methods

    - setValues() - Sets the default values for the test, called after lefeEye(), righteye(), or botheyes(). Ater this function is called, the 'Start' button
    will appear and the user will be able to start the test

    -test(), test2() -  The test function will be the one that loops to create, grow, and erase the red dots on the canvas.

    -seenRedDot() - this function is called when the user clicks the 'seen' button or presses the space bar during the test. It sets seen = true

    -getUID() - gets the test speed of the user

    -nextTest() - hides the first canvas and 'seen' button and displays the next test instructions

    -startTest2() -  sets up the values for the next test and hides/displays elements on the page

    -Show Results() -  will display the results of both or one eye - depending on which test was taken

    -getGrowingCirclesResults() - will break the two nested arrays into six arrays (need to do this because firebase will not save nested arrays directly)

    -jsonresults() - will save the test results in a jason

    -sendToFireStore() - saves the test results to Firestore

    -uploadSuccess() - edits HTML element to let user know their results were saved

    -getallRegions() - ensures all four coorindates get an even amount of circles generated in them
    
    -newPoint() - this function is called when a new point needs to be generated in a different quadrant

    */


//HTML elements 
var canvas = document.querySelector('canvas');
var canvas2 = document.getElementById("canvas2");
var LER = document.getElementById('leftEyeResults');
var RER = document.getElementById('rightEyeResults');
var nexteye = document.getElementById('nextEye');
var retakebtn = document.getElementById('retakebtn');
var startSecond = document.getElementById('startSecond');
var startbtn = document.getElementById('startOne');
var seenbtn = document.getElementById('button');

//Test Type
document.getElementById("lefteye").addEventListener("click", lefteye);
document.getElementById("righteye").addEventListener("click", righteye);
document.getElementById("botheyes").addEventListener("click", botheyes);

//Test buttons
document.getElementById('startSecond').addEventListener("click", test2);
document.getElementById("button").addEventListener("click", seenRedDot);
document.getElementById("startOne").addEventListener("click", test);
document.getElementById("nexttestbtn").addEventListener("click", startTest2);
document.getElementById("savebtn").addEventListener("click", sendToFirestore);

//Test variables 
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');
var testing;
var growingspeed = 1000;
let timestamp;
var seen = false;

//counter
var testIterations = 0;
//Max iterations, change for testing
var maxInterations = 8;


window.onkeydown = function (event) {                                               //Alternate input to the 'Seen' button
    if (event.keyCode === 32) {
        event.preventDefault();
        seenRedDot();
    }
};



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

//hide canvases for now
canvas.style.display = "none";
canvas2.style.display = "none";
nexteye.style.display = "none";
//hide results text
LER.style.display = "none";
RER.style.display = "none";
//hide buttons
startbtn.style.display = "none";
startSecond.style.display = "none";
seenbtn.style.display = "none";
retakebtn.style.display = "none";
savebtn.style.display = "none";

//Test variables 
var x;
var y;
var z = 0;
var pointsx = [];
var pointsy = [];
var q1;                                                                             //Quadrant 1
var q2;                                                                             //Quadrant 2
var q3;                                                                             //Qudarant 3
var q4;                                                                             //Quadrant 4
var pointsIndex = 0;
var results = [];
var index;
c.fillStyle = "black";
c.beginPath();
c.arc(350, 350, 6, 0, Math.PI * 2, false);
c.fill();
c.stroke();


function test() {                                                                       //Starting test for one eye
    seenbtn.style.display = "inline-block";                                             //Display the 'seen' button
    startbtn.style.display = "none";                                                    //Hide the 'Start' button

    if (testIterations < maxInterations) {                                         //If the quadrants have not reached the max value, display another button

        x = Math.random() * 700;                                                        // New red dot x-location
        y = Math.random() * 700;                                                        // New red dot y-location
        getAllRegions(x);                                                            //Call this function to see if we should use these coorindates

        z = 3                                                                           //Default radius of the circle
        grow();                                                                         //Grow the size of the circle until input given

        function grow() {

            c.fillStyle = "red";                                                        //Make the circle red
            c.beginPath();                                                              //canvas requires element for drawing new objects
            c.arc(x, y, z, 0, Math.PI * 2, false);                                      //Drawing a circle at x,y with z-radius
            c.fill();                                                                   //Canvas required element 
            c.stroke();                                                                 //Canvas required element 

            if (seen == false) {                                                        //user hasnt seen the red dot yet
                z++;                                                                    //Increase radius size
                setTimeout(grow, 1000);                                                 //Wait one second and call grow() again to redraw the circle but bigger
            } else if (seen == true && z > 5) {                                         //user seen red dot and it has grown in size
                console.log("create array of the coorinates and size of dot")           //Save the values of the circle
                results[0][index] = x;                                                  //Save the x-value
                results[1][index] = y;                                                  //Save the y-value
                results[2][index] = z;                                                  //Save the z-value
                index++;                                                                //increment index

                seen = false;                                                           //reset the 'seen' value to default
                c.clearRect(0, 0, 700, 700)                                             //clear the canvas

                c.fillStyle = "black";                                                  //redraw black dot in center
                c.beginPath();
                c.arc(350, 350, 6, 0, Math.PI * 2, false);
                c.fill();
                c.stroke();

                if (testIterations < maxInterations) {                             //if the test isnt over
                    setTimeout(test, growingspeed);                                     //Call for another circle after growingspeed (user chosen test speed)
                } else test();                                                          //else, call test and the test will end 
            }
            else {                                                                      //user seen the red dot right away
                seen = false;                                                           //reset 'seen' to default value
                c.clearRect(0, 0, 700, 700)                                             //clear the canvas
                c.fillStyle = "black";                                                  //redraw black dot in center
                c.beginPath();
                c.arc(350, 350, 6, 0, Math.PI * 2, false);
                c.fill();
                c.stroke();

                if (testIterations < maxInterations) {                             //if the test isnt over
                    setTimeout(test, growingspeed);                                     //Call for another circle after growingspeed (user chosen test speed)
                } else test();                                                          //else, call test and the test will end 
            }
        }
    } else {                                                                            //If the test is over
        if (testing !== "botheyes") {                                                   //If we're testing one eye
            console.log("Test is over.")                                                //The test is over
            showResults(results, "null");                                               //Call the showResults function. Second value is null becuase we are only testing one eye
        } else {                                                                        //Else we are testing both eyes
            console.log("Starting next eye.");                                          //Start the next eyes test
            nextTest();                                                                 //Call the NextTest method to prepare for the second test
        }
    }

}

function seenRedDot() {                                                                 //Sets 'seen' = true after user input
    seen = true;                                                                        //input: the user clicks the 'seen' button or the space bar during the test
}

var id;

async function getUid() {                                                               //Gets the test speed of the user    

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


function nextTest() {                                                                   //Hiding and displaying values for next test
    canvas.style.display = "none";                                                      //Clear the page and tell the user to start the next test
    nexteye.style.display = "block";                                                    //start the next test
    seenbtn.style.display = "none";                                                     //Hide seen button
}

//test2
//Test variables 
var x2;
var y2;
var z2 = 0;
var results2 = [];
results2[0] = [];
results2[1] = [];
results2[2] = [];
var index2 = 0;
c2.fillStyle = "black";
c2.beginPath();
c2.arc(350, 350, 6, 0, Math.PI * 2, false);
c2.fill();
c2.stroke();


function test2() {                                                                  //Functions just like test() but with different variable names
    seenbtn.style.display = "inline-block";
    startSecond.style.display = "none";

    if (testIterations < maxInterations) {
        // New red dot location
        x = Math.random() * 700;
        y = Math.random() * 700;
        getAllRegions(x);

        z = 3
        grow2();


        // Grow dot
        function grow2() {
            c2.fillStyle = "red";
            c2.beginPath();
            c2.arc(x, y, z, 0, Math.PI * 2, false);
            c2.fill();
            c2.stroke();
            if (seen == false) {
                z++;
                setTimeout(grow2, 1000);
            } else if (seen == true && z > 5) {
                console.log("create array of the coorinates and size of dot")
                results2[0][index2] = x;
                results2[1][index2] = y;
                results2[2][index2] = z;
                index2++;
                seen = false;
                c2.clearRect(0, 0, 700, 700)


                c2.fillStyle = "black";
                c2.beginPath();
                c2.arc(350, 350, 6, 0, Math.PI * 2, false);
                c2.fill();
                c2.stroke();
                if (testIterations < maxInterations) {
                    setTimeout(test2, growingspeed);
                } else test2();
            }
            else {

                seen = false;
                c2.clearRect(0, 0, 700, 700)
                // Black Dot
                c2.fillStyle = "black";
                c2.beginPath();
                c2.arc(350, 350, 6, 0, Math.PI * 2, false);
                c2.fill();
                c2.stroke();
                if (testIterations < maxInterations) {
                    setTimeout(test2, growingspeed);
                } else test2();
            }
        }
    } else {
        console.log("Test is over.")
        showResults(results, results2);                                                     //Call showResults and send results from both tests
    }

}


function startTest2() {                                                             //set the values for the second test
    nexteye.style.display = "none";                                                 //hide instructions for next eye
    canvas2.style.display = "inline-block";                                         //show canvas 2
    startSecond.style.display = "inline-block";                                     //show 'start' button

    results2 = [];                                                                  //set values
    results2[0] = [];
    results2[1] = [];
    results2[2] = [];
    pointsx = [];
    pointsy = [];
    pointsIndex = 0;
    testIterations = 0;
    q1 = 0;
    q2 = 0;
    q3 = 0;
    q4 = 0;
    index2 = 0;
    seen = false;
}


function showResults(r, r2) {                                                       //Clear the canvas and create a new one with the data collected

    size = 500;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
    canvas.width = size * scale;
    canvas.height = size * scale;


    // Normalize coordinate system to use css pixels.
    c.scale(scale, scale);
    if (testing == "righteye") {
        LER.style.display = "inline-block";
        LER.innerHTML = "Right Eye Results";
    } else if (testing == "lefteye") {
        LER.style.display = "inline-block";
        LER.innerHTML = "Left Eye Results";
    }

    //displaying and hiding elements 
    console.log("displaying results from both tests");
    canvas.style.display = "inline-block";
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
    c.arc(250, 250, 6, 0, Math.PI * 2, false);
    c.fill();
    c.stroke();

    //plot all the circles the user missed if any
    var limit = r[0].length;
    if (limit > 0) {
        for (var i = 0; i < limit; i++) {
            x = (500 * r[0][i]) / 700;
            y = (500 * r[1][i]) / 700;
            z = (500 * r[2][i]) / 700;
            c.fillStyle = "red";
            c.beginPath();
            c.arc(x, y, z, 0, Math.PI * 2, false);
            c.fill();
            c.stroke();
        }
    }

    //If two tests were taken
    if (r2 != "null") {
        canvas2.style.width = size + "px";
        canvas2.style.height = size + "px";
        canvas2.width = size * scale;
        canvas2.height = size * scale;
        c2.scale(scale, scale);

        LER.style.display = "inline-block";
        RER.style.display = "inline-block";
        canvas2.style.display = "inline-block";
        c2.clearRect(0, 0, 500, 500)

        // Black Dot
        c2.fillStyle = "black";
        c2.beginPath();
        c2.arc(250, 250, 6, 0, Math.PI * 2, false);
        c2.fill();
        c2.stroke();

        var limit2 = r2[0].length;
        if (limit2 > 0) {
            for (var i = 0; i < limit; i++) {
                x2 = (500 * r2[0][i]) / 700;
                y2 = (500 * r2[1][i]) / 700;
                z2 = (500 * r2[2][i]) / 700;
                c2.fillStyle = "red";
                c2.beginPath();
                c2.arc(x2, y2, z2, 0, Math.PI * 2, false);
                c2.fill();
                c2.stroke();
            }
        }
    }

    getGrowingCirclesResults(r, r2);
}


//Created arrays to store values to save to firebase
var lefteyeX = [];
var lefteyeY = [];
var lefteyeZ = [];
var rightEyeX = [];
var rightEyeY = [];
var rightEyeZ = [];



function getGrowingCirclesResults(r, r2) {                                          //break the two nested arrays into six arrays

    var limit = r[0].length;

    if (testing == "lefteye") {
        if (limit > 0) {
            for (var i = 0; i < limit; i++) {
                lefteyeX[i] = r[0][i];
                lefteyeY[i] = r[1][i];
                lefteyeZ[i] = r[2][i];
            }
        }
    } else if (testing == "righteye") {
        if (limit > 0) {
            for (var i = 0; i < limit; i++) {
                rightEyeX[i] = r[0][i];
                rightEyeY[i] = r[1][i];
                rightEyeZ[i] = r[2][i];
            }
        }
    }
    else if (r2 != "null") {
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

}


function jsonresults() {                                                            //Save the results in a json
    if (testing == "botheyes") {
        console.log("Saving both eyes test results.");
        return {
            "TestName": "growingCircles",
            "TimeStampMS": timestamp,
            "XLocationsRight": rightEyeX,
            "YLocationsRight": rightEyeY,
            "ZLocationsRight": rightEyeZ,
            "XLocationsLeft": lefteyeX,
            "YLocationsLeft": lefteyeY,
            "ZLocationsLeft": lefteyeZ,
            "TestSpeed": growingspeed / 1000,
            "Tested": "both",
        }
    } else if (testing == "lefteye") {
        console.log("Saving left eye test results.");
        return {
            "TestName": "growingCircles",
            "TimeStampMS": timestamp,
            "XLocationsLeft": lefteyeX,
            "YLocationsLeft": lefteyeY,
            "ZLocationsLeft": lefteyeZ,
            "TestSpeed": growingspeed / 1000,
            "Tested": "left",
        }
    }
    else {
        console.log("Saving right eye test results.");
        return {
            "TestName": "growingCircles",
            "TimeStampMS": timestamp,
            "XLocationsRight": rightEyeX,
            "YLocationsRight": rightEyeY,
            "ZLocationsRight": rightEyeZ,
            "TestSpeed": growingspeed / 1000,
            "Tested": "right",
        }
    }
}

function sendToFirestore() {                                                        //Sends the results to Firestore
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
            uploadSuccess();
            updateFirstTest();
        });

}

function uploadSuccess() {                                                          //Saving Results status
    let uploadStatusIndicator = document.getElementById('uploadStatus');
    uploadStatusIndicator.style.display = "block";
    uploadStatusIndicator.textContent = "Results Saved!";
}

function updateFirstTest() {                                                        //If this was their first test, it will update in the database

    let dbRef = firebase.firestore();
    dbRef.collection("TestResults")
        .doc(id)
        .set({
            firstTest: false
        });
}


function lefteye() {                                                                //Testing the left eye has been selected. 
    testing = "lefteye";                                                            //Save which eye we're testing in the 'testing' variable
    document.getElementById('eyeSelector').style.display = "none";                  //Hide the HTML element that asks which eye they would like to test
    setValues();                                                                    //Call the setVales() method to set default values for the test
}

function righteye() {                                                               //Testing the right eye has been selected. 
    testing = "righteye";                                                           //Save which eye we're testing in the 'testing' variable
    document.getElementById('eyeSelector').style.display = "none";                  //Hide the HTML element that asks which eye they would like to test
    setValues();                                                                    //Call the setVales() method to set default values for the test
}

function botheyes() {                                                               //Testing both eyes has been selected. 
    testing = "botheyes";                                                           //Save which eye we're testing in the 'testing' variable
    document.getElementById('eyeSelector').style.display = "none";                  //Hide the HTML element that asks which eye they would like to test
    setValues();                                                                    //Call the setVales() method to set default values for the test
}

function setValues() {                                                              //Set default values for the test

    getUid();                                                                       //Get the user's saved test speed

    timestamp = Date.now();                                                         //Clear the test variables and set everything to its default values
    results = [];
    results[0] = [];
    results[1] = [];
    results[2] = [];
    pointsx = [];
    pointsy = [];
    pointsIndex = 0;
    testIterations = 0;
    q1 = 0;
    q2 = 0;
    q3 = 0;
    q4 = 0;
    index = 0;
    seen = false;

    canvas.style.display = "inline-block";                                          //Display the canvas
    startbtn.style.display = "inline-block";                                        //Display the 'Start' buttom
}


function getAllRegions() {                                                          //checks to see if the current x and y value should be used
    //We want to cover all regions of the canvas, so if a region has reached 5
    //get a new point. Else, keep current point

    //Quadrant 1
    //Top-left corner = (350, 0) 
    //Bottom-right corner = (700, 350)


    //Quadrant 2
    //Top-left corner = (0, 0) 
    //Bottom-right corner = (350, 350)

    //Quadrant 3
    //Top-left corner = (0, 350) 
    //Bottom-right corner = (350, 700)

    //Quadrant 4
    //Top-left corner = (350, 350) 
    //Bottom-right corner = (700, 700)

    if (y >= 0 && y < 350) {                                                                     //Top half

        if (x >= 0 && x < 350) {                                                                 //Quadrant 2
            if (q2 != 5) {
                q2++;
                testIterations++;
                console.log("In quadrant 2. Value: " + x + ", " + y + ". Quadrant 2 count: " + q2);
                return;
            } else
                newPoint();
        } else {                                                                                //Quadrant 1
            if (q1 != 5) {
                q1++;
                testIterations++;
                console.log("In quadrant 1. Value: " + x + ", " + y + ". Quadrant 1 count: " + q1);
                return;
            } else
                newPoint();
        }

    } else {                                                                                    //Bottom half

        if (x >= 0 && x < 350) {                                                                //Quadrant 3
            if (q3 != 5) {
                q3++;
                testIterations++;
                console.log("In quadrant 3. Value: " + x + ", " + y + ". Quadrant 3 count: " + q3);
                return;
            } else
                newPoint();
        } else {                                                                                //Quadrant 4
            if (q4 != 5) {
                q4++;
                testIterations++;
                console.log("In quadrant 4. Value: " + x + ", " + y + ". Quadrant 4 count: " + q4);
                return;
            } else
                newPoint();
        }
    }

}


function newPoint() {                                                               //Called when a new point needs to be generated

    if (q1 < 5) {                                                                   //If this quadrant isnt full, get a point in this region
        x = (Math.random() * 350) + 350;
        y = Math.random() * 350;
        q1++;
        testIterations++;
        return;
    } else if (q2 < 5) {                                                           //If this quadrant isnt full, get a point in this region
        x = Math.random() * 350;
        y = Math.random() * 350;
        q2++;
        testIterations++;
        return;
    } else if (q3 < 5) {                                                           //If this quadrant isnt full, get a point in this region
        x = Math.random() * 350;
        y = (Math.random() * 350) + 350;
        q3++;
        testIterations++;
        return;
    } else if (q4 < 5) {                                                          //If this quadrant isnt full, get a point in this region
        x = (Math.random() * 350) + 350;
        y = (Math.random() * 350) + 350;
        q4++;
        testIterations++;
        return;
    }

}

