var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
document.getElementById("button").addEventListener("click", myFunction);
document.getElementById("start").addEventListener("click", startTest);
var seen = false;

var size = 500;
canvas.style.width = size + "px";
canvas.style.height = size + "px";

// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
canvas.width = size * scale;
canvas.height = size * scale;

// Normalize coordinate system to use css pixels.
c.scale(scale, scale);


//Test variables 
var count = 0;
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

    if (j < 20) {
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
        console.log("Test is over.")
        showResults(results);
    }

}

function myFunction() {
    seen = true;
}

function startTest() {                               //start test and create an array for this test

    results = [];
    results[0] = [];
    results[1] = [];
    results[2] = [];
    index = 0;
    j = 0;
    seen = false;
    test();
}

//Clear the canvas and create a new one with the data collected. Need to also save the data to the database here

function showResults(r) {

    //clear canvas
    c.clearRect(0, 0, 500, 500)

    // Black Dot
    c.fillStyle = "black";
    c.beginPath();
    c.arc(250, 250, 4, 0, Math.PI * 2, false);
    c.fill();
    c.stroke();

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

}
