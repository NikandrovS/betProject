let btn = document.getElementById("btn");
let form = document.getElementById("form");
let event = document.getElementById("event");

if(event.classList.contains('active')) {
    btn.addEventListener('click', function(ev) {
        form.classList.toggle("hidden");
        form.classList.toggle("setWinner");
    }, false);
}
