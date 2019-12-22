let btn = document.getElementById("btn");
let form = document.getElementById("form");
let event = document.getElementById("event");
let ratio1 = document.getElementById("ratio1").innerHTML;
let ratio2 = document.getElementById("ratio2").innerHTML;
if(event.classList.contains('active') || event.classList.contains('pending')) {
    btn.addEventListener('click', function(ev) {
        form.classList.toggle("hidden");
        form.classList.toggle("setWinner");
    }, false);
}

let newBetForm = document.getElementById("newBet");
let userBet = document.getElementById("bet");
let warning = document.getElementById("warning");
let result1 = document.getElementById("result1");
let balance = parseInt(document.getElementById("balance").innerHTML);
newBetForm.addEventListener("submit", checkBalance);

function checkBalance(event) {
    if (userBet.value > balance) {
        console.log(result1);
        event.preventDefault();
        userBet.classList.add('error');
        warning.textContent = "Недостаточно средств"
    }
}

userBet.addEventListener("input", function (event) {
    userBet.value.replace(/[^0-9.]/g, '')
});


