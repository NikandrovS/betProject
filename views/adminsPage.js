let forms = document.forms;

for (let i = 0; i < forms.length; i++) {
    if (forms[i].name === "pendingWithdraw") {
        forms[i].onsubmit = function (e) {
            e.preventDefault();

            let status = event.target.querySelectorAll('.status')[0];
            if (status.textContent === "pending") {
                const btn = event.target.lastChild;
                btn.classList.add("hidden");
            }

            let whichId = e.target.attributes.withDrawId.value;

            whichId = encodeURIComponent(whichId);
            let xhr = new XMLHttpRequest();

            xhr.open("POST", "/bets/done/:id");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4 && xhr.status === 200) {
                  status.textContent = xhr.responseText;
                }
            };
            xhr.send("id=" + whichId);
        };
    }
}

