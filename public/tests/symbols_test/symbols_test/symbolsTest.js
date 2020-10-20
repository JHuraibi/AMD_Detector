// // The program is meant to randomly display symbols on the canvas 
// // If the user sees "+" press "a"
// // If the user sees "-" press "s"
// // If the user sees "x" press "x"
// // If the user sees "÷" press "d"
// // Any error in pressing the wrong key should be flagged and displayed after the test is conducted
// // JS code
// //


var canvas = document.getElementById('canvas1');
var canvas2 = document.getElementById("canvas2");
var c = canvas.getContext('2d');
var c2 = canvas2.getContext('2d');

var size = 500;
canvas.style.width = size + "px";
canvas.style.height = size + "px";
canvas2.style.width = size + "px";
canvas2.style.height = size + "px";

var scale = window.devicePixelRatio;
canvas.width = size * scale;
canvas.height = size * scale;
canvas2.width = size * scale;
canvas2.height = size * scale;

c.scale(scale, scale);
c2.scale(scale, scale);

window.addEventListener('keydown', function (e) {
	// WebStorm saying keyCode is deprecated. It might not work in all browsers (-Jay)
	// var key = e.keyCode;
	
	// key variable
	var key = e.key;
//if key pressed is s
	if (key === 's') {
		console.log("KeyPress: S");
		sKey();
	}
// if a key is pressed
	if (key === 'a') {
		console.log("KeyPress: A");
		aKey();
	}
//if d key is pressed
	if (key === 'd') {
		console.log("KeyPress: D");
		dKey();
	}
// if x key is pressed
	if (key === 'x') {
		console.log("KeyPress: X");
		xKey();
	}
	
});

c.fillStyle = "White";
c.fillRect(0, 0, 500, 500);

// Variable
var x, y, y2, x2;
var symbols = ["+", "-", "x", "÷"];
var resultX = [];
var resultY = [];
var resultX2 = [];
var resultY2 = [];
var resultsSymbols = [];

canvas2.style.display = "none";
// index to capture result
var t = 0;
var t2 = 0;

// if the key pressed is not a capture the result for the next 4 functions
function aKey() {
	if (canvas.style.display != "none") {
		if (symbols[r] != "+") {
			resultsSymbols[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "+") {
			resultsSymbols[t2] = symbols[r2];
			resultX2[t2] = x2;
			resultY2[t2] = y2;
			t2++;
			
		}
		
	}
	
	
}

function sKey() {
	if (canvas.style.display != "none") {
		if (symbols[r] != "-") {
			resultsSymbols[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "-") {
			resultsSymbols[t2] = symbols[r2];
			resultX2[t2] = x2;
			resultY2[t2] = y2;
			t2++;
			
		}
		
	}
	
	
}

function xKey() {
	if (canvas.style.display != "none") {
		if (symbols[r] != "x") {
			resultsSymbols[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "x") {
			resultsSymbols[t2] = symbols[r2];
			resultX2[t2] = x2;
			resultY2[t2] = y2;
			t2++;
			
		}
		
	}
	
	
}

function dKey() {
	if (canvas.style.display != "none") {
		if (symbols[r] != "÷") {
			resultsSymbols[t] = symbols[r];
			resultX[t] = x;
			resultY[t] = y;
			t++;
			
		}
	}
	else {
		if (symbols[r2] != "÷") {
			resultsSymbols[t2] = symbols[r2];
			resultX2[t2] = x2;
			resultY2[t2] = y2;
			t2++;
			
		}
		
	}
	
}


//function to clear canvas
function clearCanvas() {
	c.clearRect(0, 0, 500, 500);
	c.fillStyle = "White";
	c.fillRect(0, 0, 500, 500);
	
	// Canvas 2
	c2.clearRect(0, 0, 500, 500);
	c2.fillStyle = "White";
	c2.fillRect(0, 0, 500, 500);
	
}

//Function have black dot in the center
function blackDot() {
	c.fillStyle = "black";
	c.beginPath();
	c.arc(250, 250, 4, 0, Math.PI * 2);
	c.fill();
// Canvas 2
	c2.fillStyle = "black";
	c2.beginPath();
	c2.arc(250, 250, 4, 0, Math.PI * 2);
	c2.fill();
}

var r;
var r2;

// Function to randomly place random symbol in the canvas
function randomSymbol() {
	r = Math.floor(Math.random() * 4);
	r2 = Math.floor(Math.random() * 4);
	
	if (canvas.style.display != "none") {
		x = Math.floor(Math.random() * 500);
		y = Math.floor(Math.random() * 500);
		c.beginPath();
		c.fillStyle = "red";
		c.font = "40px Arial";
		c.fillText(symbols[r], x, y);
	}
	else {
		console.log("In the else c2 random symbols")
		// Canvas 2
		c2.beginPath();
		c2.fillStyle = "red";
		c2.font = "40px Arial";
		c2.fillText(symbols[r2], x, y);
	}
	
}

// Vaariable representing iterations
var i = 0;

function test1() {
	
	console.log("test 1");
	blackDot();
	if (i < 5) {
		clearCanvas();
		blackDot();
		randomSymbol();
		i++;
		setTimeout(test1, 3000);
	}
	else {
		console.log("Going to next test");
		nexttest();
	}
	
}

function nexttest() {
	canvas.style.display = "none";
	canvas2.style.display = "block";
	test2();
	
}

var a = 0;

function test2() {
	
	console.log("Test2");
	if (a < 5) {
		console.log("In test 2 loop");
		clearCanvas();
		blackDot();
		randomSymbol();
		a++;
		setTimeout(test2, 3000);
	}
	else results();
	
}

var j;
var j2;

// function to show the erros after test is conducted
function results() {
	
	canvas.style.display = "block";
	clearCanvas();
	blackDot();
	for (j = 0; j < resultY.length; j++) {
		c.fillStyle = "blue";
		c.font = "35 px Arial";
		c.fillText(resultsSymbols[j], resultX[j], resultY[j]);
		
	}
	for (j2 = 0; j2 < resultY2.length; j2++) {
		console.log("In loop of c2 results ");
		c2.fillStyle = "blue";
		c2.font = "35 px Arial";
		c2.fillText(resultsSymbols[j2], resultX2[j2], resultY2[j2]);
		
	}
	
	
}


// var canvas = document.querySelector('canvas');
// var c = canvas.getContext('2d');
// window.addEventListener('keydown',function(e)
// {
//     // key variable
// var key = e.keyCode;
// //if key pressed is s
// if(key == 83)
// {
//     sKey();
// }
// // if a key is pressed
// if (key == 65 )
// {
//     aKey();
// }
// //if d key is pressed
// if (key == 68)
// {
//     dKey();
// }
// // if x key is pressed
// if (key  == 88)
// {
//     xKey();
// }

// });


// c.fillStyle = "White";
// c.fillRect(0,0,500,500);

// // variable for random x, y coordinates
// var x;
// var y;


// //Arrays to capture x,y results
// var resultX = [];
// var resultY = [];
// var resultsSymbols = [];

// //Symbols that  will randomly appear in canvas
// var symbols = ["+", "-", "x", "÷"];

// //function to clear canvas
// function clearCanvas()
// {
//     c.clearRect(0, 0, 500, 500)
//     c.fillStyle = "White";
//     c.fillRect(0,0,500,500);


// }
// //Function have black dot in the center
// function blackDot()
// {
// c.fillStyle = "black";
// c.beginPath();
// c.arc(250, 250, 6, 0, Math.PI * 2);
// c.fill();
// }
// // varibale representing random index in the symbols array
// var r;
// // Function to randomly place random symbol in the canvas
// function randomSymbol()
// {
//     r = Math.floor( Math.random() * 4);

//     x = Math.floor(Math.random() * 500);
//     y = Math.floor(Math.random() * 500);
//     c.beginPath();
//     c.fillStyle = "red";
//     c.font = "40px Arial";
//     c.fillText(symbols[r], x, y);

// }

// // index to capture result
// var t = 0;
// // if the key pressed is not a capture the result for the next 4 functions
// function aKey()
// {
//     if(symbols[r] != "+")
//     {
//         resultsSymbols[t] = symbols[r];
//         resultX[t] = x;
//         resultY[t] = y;
//         t++;

//     }


// }
// function sKey()
// {
//     if(symbols[r] != "-")
//     {
//         resultsSymbols[t] = symbols[r];
//         resultX[t] = x;
//         resultY[t] = y;
//         t++;

//     }


// }

// function xKey()
// {
//     if(symbols[r] != "x")
//     {
//         resultsSymbols[t] = symbols[r];
//         resultX[t] = x;
//         resultY[t] = y;
//         t++;

//     }


// }
// function dKey()
// {
//     if(symbols[r] != "÷")
//     {
//         resultsSymbols[t] = symbols[r];
//         resultX[t] = x;
//         resultY[t] = y;
//         t++;

//     }


// }

// // Vaariable representing iterations
// var i = 0;
// function test1()
// {

//     if(i < 6)
//     {
//         clearCanvas();
//         blackDot();
//         randomSymbol();
//         i++;
//         setTimeout(test1, 3000);
//     }
//     else
//     {

//         results();

//     }


// }


// var j;
// // function to show the erros after test is conducted
// function results()
// {
//     clearCanvas();
//     blackDot();
//     for(j = 0;j < resultY.length; j++)
//     {
//         c.fillStyle = "blue";
//         c.font = "35 px Arial";
//         c.fillText(resultsSymbols[j], resultX[j], resultY[j]);

//     }

// }


// // The program is meant to randomly display symbols on the canvas
// // If the user sees "+" press "a"
// // If the user sees "-" press "s"
// // If the user sees "x" press "x"
// // If the user sees "÷" press "d"
// // Any error in pressing the wrong key should be flagged and displayed after the test is conducted
// // JS code
// //


// // var nexteye = document.getElementById('nextEye');
// // document.getElementById("nexttestbtn").addEventListener("click", test2);
// // var canvas = document.querySelector('canvas');
// // var c = canvas.getContext('2d');
// // window.addEventListener('keydown',function(e)
// // {
// //     // key variable
// // var key = e.keyCode;
// // //if key pressed is s
// // if(key == 83)
// // {
// //     sKey();
// // }
// // // if a key is pressed
// // if (key == 65 )
// // {
// //     aKey();
// // }
// // //if d key is pressed
// // if (key == 68)
// // {
// //     dKey();
// // }
// // // if x key is pressed
// // if (key  == 88)
// // {
// //     xKey();
// // }

// // });

// // c.clearRect(0,0, 500, 500)
// // c.fillStyle = "White";
// // c.fillRect(0,0,500,500);
// // nexteye.style.display ="none";

// // // variable for random x, y coordinates
// // var x;
// // var y;


// // //Arrays to capture x,y results
// // var resultX = [];
// // var resultY = [];
// // var resultsSymbols = [];

// // //Symbols that  will randomly appear in canvas
// // var symbols = ["+", "-", "x", "÷"];

// // //function to clear canvas
// // function clearCanvas()
// // {


// //     // c.fillStyle = "White";
// //     // c.fillRect(0,0,500,500);
// //     c.fillStyle = "white";
// //     c.fillRect(0, 0, 500, 500);
// //     c.clearRect(0, 0, 500, 500);

// // }
// // //Function have black dot in the center
// // function blackDot()
// // {
// // c.fillStyle = "black";
// // c.beginPath();
// // c.arc(250, 250, 4, 0, Math.PI * 2);
// // c.fill();
// // }
// // // varibale representing random index in the symbols array
// // var r;
// // // Function to randomly place random symbol in the canvas
// // function randomSymbol()
// // {
// //     r = Math.floor( Math.random() * 4);

// //     x = Math.floor(Math.random() * 500);
// //     y = Math.floor(Math.random() * 500);
// //     c.beginPath();
// //     c.fillStyle = "red";
// //     c.font = "40px Arial";
// //     c.fillText(symbols[r], x, y);

// // }

// // // index to capture result
// // var t = 0;
// // // if the key pressed is not a capture the result for the next 4 functions
// // function aKey()
// // {
// //     if(symbols[r] != "+")
// //     {
// //         resultsSymbols[t] = symbols[r];
// //         resultX[t] = x;
// //         resultY[t] = y;
// //         t++;

// //     }


// // }
// // function sKey()
// // {
// //     if(symbols[r] != "-")
// //     {
// //         resultsSymbols[t] = symbols[r];
// //         resultX[t] = x;
// //         resultY[t] = y;
// //         t++;

// //     }


// // }

// // function xKey()
// // {
// //     if(symbols[r] != "x")
// //     {
// //         resultsSymbols[t] = symbols[r];
// //         resultX[t] = x;
// //         resultY[t] = y;
// //         t++;

// //     }


// // }
// // function dKey()
// // {
// //     if(symbols[r] != "÷")
// //     {
// //         resultsSymbols[t] = symbols[r];
// //         resultX[t] = x;
// //         resultY[t] = y;
// //         t++;

// //     }


// // }

// // // Vaariable representing iterations
// // var i = 0;
// // function test1()
// // {

// //     if(i < 5)
// //     {
// //         c.clearRect(0, 0, 500, 500);
// //         clearCanvas();
// //         blackDot();
// //         randomSymbol();
// //         i++;
// //         setTimeout(test1, 3000);
// //     }
// //     else
// //     {
// //         results();
// //         //nextTest();

// //     }


// // }
// // // function nextTest() {

// // //     //start the next test
// // //     nexteye.style.display ="block";


// // // }

// // var p = 0;
// // function test2()
// // {

// //     if(p < 5)
// //     {
// //         clearCanvas();
// //         blackDot();
// //         randomSymbol();
// //         p++;
// //         setTimeout(test2, 3000);
// //     }


// // }


// // // Creating a test for the other eye
// // // function test2()
// // // {
// // //     if


// // // }


// // var j;
// // // function to show the erros after test is conducted
// // function results()
// // {
// //     clearCanvas();
// //     blackDot();
// //     for(j = 0;j < resultY.length; j++)
// //     {
// //         c.fillStyle = "blue";
// //         c.font = "35 px Arial";
// //         c.fillText(resultsSymbols[j], resultX[j], resultY[j]);

// //     }

// // }