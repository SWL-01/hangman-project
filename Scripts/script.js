//Part 0 ------------------Constants & Variables------------------------
let objArray;
let lastStride = "R"; //The last leg the player swung to walk, maintains consistent walking animation.
let player = {x: -5, textX: 7, bubbleX: -4}; //Players location on the screen

let stopMoveFlag = false; //Controls player motion
let stepCount = 1; //At 3 steps, player reaches computer and the game screen appears on a delay.
let storeWord = "HELLO"; //Stores the word input by the firebase.
let wordArray = []; //Stores the word as dashes at each index that get replaced with correctly guessed letters.

//Part 0 ---------------------------------------------------------------

//Part ! -------------------Game Start Function-------------------------
function startGame() {
    document.getElementById("thought").style.visibility = "visible";
    document.getElementById("quest").style.visibility = "visible";
    document.getElementById("dash").style.visibility = "visible";
    buttonMaker();
    pullWord();
    createDash();
}
//Part ! ---------------------------------------------------------------

//Part A ---------Generates buttons and disables onclick event----------
function controller(btn, letter) {
    return function buttonClick() {
        btn.setAttribute('class', "dead");
        btn.disabled = true;
        btn.onclick = "";
        updateDash(letter);
        if (stepCount == 3) {
            setTimeout(openScreen,3000);
            stepCount++;
        }
        if (stepCount > 4) {
            return;
        }
        if (lastStride == "R") {
            strideL();
        } else if (lastStride == "L") {
            strideR();
        }
        
    }
}

function Button(i) {
    this.btn = document.createElement("BUTTON");
    this.btn.setAttribute('id', String.fromCharCode(65 + i));
    this.letter = String.fromCharCode(65 + i);
    this.btn.setAttribute('class', "btnz");
    this.btn.onclick = controller(this.btn, this.letter);
    this.btn.innerHTML = "" + String.fromCharCode(65 + i);
    document.getElementById("buttons").appendChild(this.btn);
}

function buttonMaker() {
    let i = 0;
    let n = 26
    for (i; i < n; i++) {
        let t = new Button(i);
    }
}
//Part A ---------------------------------------------------------------

//Part B ---------------Controls Player Walking Animation---------------
function move() {
    if (stopMoveFlag) {
        return;
    }
    player.x += 0.01;
    player.bubbleX += 0.01;
    player.textX += 0.01;

    document.getElementById("player").style.left = player.x + "vw";
    document.getElementById("thought").style.left = player.bubbleX + "vw";
    document.getElementById("quest").style.left = player.textX + "vw";
    document.getElementById("dash").style.left = player.textX + "vw";
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
//Opens the command window for when player reaches the computer.
function openScreen () {
    document.getElementById("game").style.visibility = "visible";
    document.getElementById("box").style.visibility = "visible";
}

//Not yet working. Pulls word from firebase.
function pullWord () {
    return 0;
}

//Takes word input and creates dashed lines of equal size.
function createDash() {
    let i;
    for (i = 0; i < storeWord.length; i++) {
        wordArray[i] = "- ";
        document.getElementById("dash").innerHTML += wordArray[i];
    }
}

//Updates the dashes to reveal correctly guessed letter.
function updateDash(letter) {
    document.getElementById("dash").innerHTML = "";
    let i;
    for (i = 0; i < storeWord.length; i++) {
        if (storeWord[i] == letter) {
            wordArray[i] = letter + " ";
        }
        document.getElementById("dash").innerHTML += wordArray[i];
    }
}

//Not yet working, uses enter key to accept password input.
function enterPassword(ele) {
    if (event.key  === 'Enter') {
        if (ele == storeWord) {
            teleport ();
        }
    }
}
//Part C ---------------------------------------------------------------

//Part D -----------------------------End Game--------------------------
//If the player wins, they get teleported into the ship.
function teleport () {
    document.getElementById("thought").style.visibility = "hidden";
    document.getElementById("quest").style.visibility = "hidden";
    document.getElementById("dash").style.visibility = "hidden";
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