// The program is meant to randomly display symbols on the canvas 
// If the user sees "+" press "a"
// If the user sees "-" press "s"
// If the user sees "x" press "x"
// If the user sees "÷" press "d"
// Any error in pressing the wrong key should be flagged and displayed after the test is conducted
// JS code
//





var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
window.addEventListener('keydown',function(e)
{  
    // key variable
var key = e.keyCode;
//if key pressed is s
if(key == 83)
{
    sKey();
}
// if a key is pressed
if (key == 65 )
{
    aKey();
}
//if d key is pressed
if (key == 68)
{
    dKey();
}
// if x key is pressed
if (key  == 88)
{
    xKey();
}

});

c.fillStyle = "White";
c.fillRect(0,0,500,500);

// variable for random x, y coordinates
var x;
var y;


//Arrays to capture x,y results
var resultX = [];
var resultY = [];
var resultsSymbols = [];

//Symbols that  will randomly appear in canvas
var symbols = ["+", "-", "x", "÷"];

//function to clear canvas
function clearCanvas()
{
    c.clearRect(0, 0, 500, 500);
    c.fillStyle = "White";
    c.fillRect(0,0,500,500);

}
//Function have black dot in the center
function blackDot()
{
c.fillStyle = "black";
c.beginPath();
c.arc(250, 250, 4, 0, Math.PI * 2);
c.fill();
}
// varibale representing random index in the symbols array
var r;
// Function to randomly place random symbol in the canvas
function randomSymbol()
{
    r = Math.floor( Math.random() * 4);

    x = Math.floor(Math.random() * 500);
    y = Math.floor(Math.random() * 500);
    c.beginPath();
    c.fillStyle = "red";
    c.font = "40px Arial";
    c.fillText(symbols[r], x, y);

}

// index to capture result
var t = 0;
// if the key pressed is not a capture the result for the next 4 functions
function aKey()
{
    if(symbols[r] != "+")
    {
        resultsSymbols[t] = symbols[r];
        resultX[t] = x;
        resultY[t] = y;
        t++;

    }
    

}
function sKey()
{
    if(symbols[r] != "-")
    {
        resultsSymbols[t] = symbols[r];
        resultX[t] = x;
        resultY[t] = y;
        t++;

    }
    

}

function xKey()
{
    if(symbols[r] != "x")
    {
        resultsSymbols[t] = symbols[r];
        resultX[t] = x;
        resultY[t] = y;
        t++;

    }
    

}
function dKey()
{
    if(symbols[r] != "÷")
    {
        resultsSymbols[t] = symbols[r];
        resultX[t] = x;
        resultY[t] = y;
        t++;

    }
    

}

// Vaariable representing iterations
var i = 0;
function test1()
{

    if(i < 5)
    {
        clearCanvas();
        blackDot();
        randomSymbol();
        i++;
        setTimeout(test1, 3000);
    }


}


// Creating a test for the other eye
// function test2()
// {
//     if


// }


var j;
// function to show the erros after test is conducted
function results()
{
    clearCanvas();
    blackDot();
    for(j = 0;j < resultY.length; j++)
    {
        c.fillStyle = "blue";
        c.font = "35 px Arial";
        c.fillText(resultsSymbols[j], resultX[j], resultY[j]);

    }

}

