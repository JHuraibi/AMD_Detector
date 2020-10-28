var countDown = 10;
var next = document.getElementById("nxt");
next.style.display = "none";

function interval() {
    document.getElementById("timer").innerHTML = countDown + " seconds";
    if (countDown != 0) {
        setTimeout(interval, 1000)
        countDown--;

    }
    else {
        displayNext();
    }

}
interval();

function displayNext() {
    next.style.display = "block";
}

// var i = 0;
// function test()
// {

//     if(i ==  0)
//     {
//         interval();
//         i++;
//     }

//     if(i == 1)
//     {
//         alert("Switch eyes! ");
//         interval();
//         i++;

//         if(i == 2)
//         {
//             next.style.display = "in-line block";

//         }
//     }



// }
// test();



