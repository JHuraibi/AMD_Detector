var countDown = 15;

function interval()
{
    document.getElementById("timer").innerHTML = countDown +" seconds"; 
    if(countDown > 0)
    {
        setTimeout(interval, 1000)
        countDown--;

    }
       
}
interval();


