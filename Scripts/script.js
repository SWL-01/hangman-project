//Part 0 ------------------Constants & Variables------------------------
let objArray;
let lastStride = "R";
let player = {x: -10};
let stopMoveFlag = false;
//Part 0 ---------------------------------------------------------------

//Part A ---------Generates buttons and disables onclick event----------
function controller(btn) {
    return function buttonClick() {
        btn.setAttribute('class', "dead");
        btn.disabled = true;
        btn.onclick = "";

        if (lastStride == "R") {
            strideL();
        } else {
            strideR();
        }
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

//Part B ---------------Controls Player Walking Animation---------------
function move() {
    if (stopMoveFlag) {
        return;
    }
    let newX = player.x + 0.02;
    player.x = newX;
    document.getElementById("player").style.left = newX + "vw";
    setTimeout(move, 2);
}

function strideL() {
    stopMoveFlag = false;
    lastStride = "L";
    document.getElementById("player").style.top = "47.3vh";
    document.getElementById("player").src = "Images/stride1.gif";
    setTimeout(move, 2);
    setTimeout(function () {
        stopMoveFlag = true;
    }, 2450);
    setTimeout(function () {
        document.getElementById("player").style.top = "47vh";
        document.getElementById("player").src = "Images/stop1.png";
    }, 2500);
    
}
function strideR() {
    stopMoveFlag = false;
    lastStride = "R";
    document.getElementById("player").style.top = "47.3vh";
    document.getElementById("player").src = "Images/stride2.gif";
    move();
    setTimeout(function () {
        stopMoveFlag = true;
    }, 2400);
    setTimeout(function () {
        document.getElementById("player").style.top = "47vh";
        document.getElementById("player").src = "Images/stop2.png";
    }, 2400);
}
//Part B ---------------------------------------------------------------

//Part C ----------------

//Part C ---------------------------------------------------------------