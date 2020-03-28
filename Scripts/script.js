//Part 0 ------------------Constants & Variables------------------------
let objArray;
let lastStride = "R"; //The last leg the player swung to walk, maintains consistent walking animation.
let player = {x: -5}; //Players location on the screen
let stopMoveFlag = false; //Controls player motion
let stepCount = 0; //At 3 steps, player reaches computer and the game screen appears on a delay.
//Part 0 ---------------------------------------------------------------

//Part A ---------Generates buttons and disables onclick event----------
function controller(btn) {
    return function buttonClick() {
        btn.setAttribute('class', "dead");
        btn.disabled = true;
        btn.onclick = "";

        if (lastStride == "R") {
            strideL();
        } else if (lastStride == "L") {
            strideR();
        }
        if (stepCount == 3) {
            setTimeout(openScreen,3000);
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
    let newX = player.x + 0.01;
    player.x = newX;
    document.getElementById("player").style.left = newX + "vw";
    setTimeout(move, 2);
}

function strideL() {
    stepCount++;
    stopMoveFlag = false;
    lastStride = "L";
    document.getElementById("player").style.top = "72.3vh";
    document.getElementById("player").src = "Images/stride1.gif";
    setTimeout(move, 2);
    setTimeout(function () {
        stopMoveFlag = true;
    }, 2450);
    setTimeout(function () {
        document.getElementById("player").style.top = "72vh";
        document.getElementById("player").src = "Images/stop1.png";
    }, 2500);
    
}
function strideR() {
    stepCount++;
    stopMoveFlag = false;
    lastStride = "R";
    document.getElementById("player").style.top = "72.3vh";
    document.getElementById("player").src = "Images/stride2.gif";
    move();
    setTimeout(function () {
        stopMoveFlag = true;
    }, 2400);
    setTimeout(function () {
        document.getElementById("player").style.top = "72vh";
        document.getElementById("player").src = "Images/stop2.png";
    }, 2400);
}
//Part B ---------------------------------------------------------------

//Part C ----------------Word Generator and Input Handler---------------
function openScreen () {
    document.getElementById("game").style.visibility = "visible";
    document.getElementById("box").style.visibility = "visible";
}


//Part C ---------------------------------------------------------------

//Part D -----------------------------End Game--------------------------
//If the player wins, they get teleported into the ship.
function teleport () {
    document.getElementById("port").style.visibility = "visible";
    document.getElementById("port").src= "Images/portal.gif";
    document.getElementById("game").style.visibility = "hidden";
    document.getElementById("box").style.visibility = "hidden";
    setTimeout(function () {
        document.getElementById("player").style.visibility = "hidden";
    }, 600);
    setTimeout(function () {
        document.getElementById("player").style.visibility = "hidden";
        document.getElementById("port").style.visibility = "hidden";
        document.getElementById("port").src= "";
    }, 1200);
}

//If the player loses, <undecided>

//Part D ---------------------------------------------------------------