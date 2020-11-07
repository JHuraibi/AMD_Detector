var sec1Questions = document.getElementById("qSec1");
var sec2Questions = document.getElementById("qSec2");
var sec3Questions = document.getElementById("qSec3");
var sec4Questions = document.getElementById("qSec4");
document.getElementById("sp1").addEventListener("click", s1);
document.getElementById("sp2").addEventListener("click", s2);
document.getElementById("sp3").addEventListener("click", s3);
document.getElementById("sp4").addEventListener("click", s4);



sec1Questions.style.display = "none"
sec2Questions.style.display = "none"
sec3Questions.style.display = "none"
sec4Questions.style.display = "none"




function s1() {


    if (sec1Questions.style.display === "none") {
        sec1Questions.style.display = "inline-block";
    } else {
        sec1Questions.style.display = "none";
    }
}

function s2() {


    if (sec2Questions.style.display === "none") {
        sec2Questions.style.display = "inline-block";
    } else {
        sec2Questions.style.display = "none";
    }
}

function s3() {

    if (sec3Questions.style.display === "none") {
        sec3Questions.style.display = "inline-block";
    } else {
        sec3Questions.style.display = "none";
    }

}

function s4() {
    if (sec4Questions.style.display === "none") {
        sec4Questions.style.display = "inline-block";
    } else {
        sec4Questions.style.display = "none";
    }


}









