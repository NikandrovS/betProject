let btn = document.getElementById("btn");

btn.addEventListener('click', function(ev) {
    document.getElementById("form").classList.toggle("hidden");
    document.getElementById("form").classList.toggle("setWinner");
}, false);
