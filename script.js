//Part A ---------Generates buttons and disables onclick event----------
let objArray;

function controller(btn) {
    return function buttonClick() {
        btn.setAttribute('class', "dead");
        btn.disabled = true;
        btn.onclick = "";
    }
}
function buttonMaker() {
    let i = 0;
    let n = 26
    for (i; i < n; i++) {
        btn = document.createElement("BUTTON");
        btn.setAttribute('id', String.fromCharCode(65 + i));
        btn.setAttribute('class', "btnz");
        btn.onclick = controller(this.btn);
        btn.innerHTML = "" + String.fromCharCode(65 + i);                    
        document.getElementById("buttons").appendChild(btn);
    }
}
buttonMaker();
//Part A ---------------------------------------------------------------