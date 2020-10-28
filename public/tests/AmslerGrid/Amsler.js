var sd = document.getElementById("strtdiv");
var Ampic = document.getElementById("amslerpic");
var next = document.getElementById("nxt");
var start = document.getElementById("strt");
var time = document.getElementById("timer");
next.style.display = "none";

// Ampic.style.display = "none"

start.style.display = "inline-block";

var countDown = 10;
document.getElementById("timer").innerHTML =  countDown +" seconds"; 
function interval()
{
    
    start.style.display = "none";
    Ampic.style.display = "inline-block"
    
    document.getElementById("timer").innerHTML = countDown +" seconds"; 
    if(countDown != 0)
    {
        setTimeout(interval, 1000)
        countDown--;

    }
    else {
        displayNext();
    }

}


function displayNext() {
    next.style.display = "block";
}





