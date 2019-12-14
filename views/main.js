let btn = document.getElementById("btn");
let form = document.getElementById("form");
let event = document.getElementById("event");
let ratio1 = document.getElementById("ratio1").innerHTML;
let ratio2 = document.getElementById("ratio2").innerHTML;
if(event.classList.contains('active') && ratio1 > 1.01 && ratio2 > 1.01 ) {
    btn.addEventListener('click', function(ev) {
        form.classList.toggle("hidden");
        form.classList.toggle("setWinner");
    }, false);
}

let newBetForm = document.getElementById("newBet");
let userBet = document.getElementById("bet");
let balance = parseInt(document.getElementById("balance").innerHTML);

newBetForm.addEventListener("submit", checkBalance);

function checkBalance(event) {
    if (userBet.value > balance) {
        event.preventDefault();
        userBet.classList.add('error');
    }
}

userBet.addEventListener("input", function (event) {
    userBet.value.replace(/[^0-9.]/g, '')
});


