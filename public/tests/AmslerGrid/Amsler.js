var sd = document.getElementById("strtdiv");
var Ampic = document.getElementById("amslerpic");
var next = document.getElementById("nxt");
var start = document.getElementById("strt");
next.style.display = "none";

Ampic.style.display = "none"

//Adding more to functions
var countDown = 10;
function interval()
{
    sd.style.display = "none";
    start.style.display = "none";
    Ampic.style.display = "inline-block"
    document.getElementById("timer").innerHTML = countDown +" seconds"; 
    if(countDown != 0)
    {
        setTimeout(interval, 1000)
        countDown--;

    }
    else
    {
        displayNext();
    }
       
}


function displayNext()
{
    next.style.display = "block";
}





