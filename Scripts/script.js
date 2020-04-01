//Part 0 ------------------Constants & Variables------------------------
const VOLUME = 0.5; //Main theme volume constant.
const OPENOFFSET = 0.30; //Reduces the opening warning volume.
const SHAKE = 0.25; //Shake value.

let lastStride = "R"; //The last leg the player swung to walk, maintains consistent walking animation.
let player = {x: -5, y: 72, textX: 7, bubbleX: -4, platX: 11, platY: 65}; //Players location on the screen
let origin = {x: -5, y: 72, textX: 7, bubbleX: -4, platX: 11, platY: 65}; //For restarting back to origin positions.
let tries = 7; //Number of tries used by the player.
let stopMoveFlag = false; //Controls player motion
let stepCount = 0; //At 3 steps, player reaches computer and the game screen appears on a delay.
let storeWord = "MOTION"; //Stores the word input by the firebase.
let wordArray = []; //Stores the word as dashes at each index that get replaced with correctly guessed letters.
let shakeCount = 0; //Used to stop shaking after launch.

let themeOST = document.getElementById("theme"); //The main background song; change source in HTML, not here.
let warningS = document.getElementById("warning"); //Warning sound element; changes source repeatedly for each alert.

//Part F -----------------------------Firebase--------------------------
//Lets not push the firebase stuff up. I read its a security issue.
//Also we have 2 firebases, we need to settle on one.
//Part F ---------------------------------------------------------------

//Part ! -------------------Game Start Function-------------------------
function startGame() {
    themeOST.volume = VOLUME;
    themeOST.currentTime = 0;
    themeOST.play();
    warningS.src = "Audio/goal.mp3";
    warningS.currentTime = 0;
    warningS.volume = VOLUME - OPENOFFSET;
    warningS.play();

    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("player").style.visibility = "visible";
    document.getElementById("restart").style.visibility = "visible";
    document.getElementById("thought").style.visibility = "visible";
    document.getElementById("quest").style.visibility = "visible";
    document.getElementById("define").style.visibility = "visible";
    document.getElementById("dash").style.visibility = "visible";
    buttonMaker();
    pullWord();
    createDash();
}

function restart() {
    lastStride = "R";
    stepCount = 0;
    tries = 7;
    shakeCount = 3000;

    player = {x: -5, y: 72, textX: 7, bubbleX: -4, platX: 11, platY: 65};

    document.getElementById("player").style.left = origin.x + "vw";
    document.getElementById("thought").style.left = origin.bubbleX + "vw";
    document.getElementById("quest").style.left = origin.textX + "vw";
    document.getElementById("define").style.left = origin.textX + "vw";
    document.getElementById("dash").style.left = origin.textX + "vw";
    document.getElementById("platform").style.left = origin.platX + "vw";

    document.getElementById("player").style.top = origin.y + "vh";
    document.getElementById("platform").style.top = origin.textY + "vh";

    let clearDiv = document.getElementById("buttons");
    while (clearDiv.firstChild) {
        clearDiv.removeChild(clearDiv.lastChild);
      }

    startGame();
}
//Part ! ---------------------------------------------------------------

//Part A ---------Generates buttons and disables onclick event----------
//Handles button clicks and current game state changes from the click.
function controller(btn, letter) {
    return function buttonClick() {
        shakeCount = 0;
        btn.setAttribute('class', "dead");
        btn.disabled = true;
        btn.onclick = "";
        let result = updateDash(letter);
        if (!result) {
            tries--;
            throwAlert();
        }
        if (stepCount > 3) {
            return;
        }
        if (result) {
            if (lastStride == "R") {
                strideL();
            } else if (lastStride == "L") {
                strideR();
            }
        }
        if (stepCount == 3) {
            warningS.src = "Audio/panel.mp3";
            warningS.volume = VOLUME - OPENOFFSET;
            setTimeout(function () {
                warningS.play();
            }, 2000);
            setTimeout(openScreen,3500);
            stepCount++;
        }
        
    }
}

//Button constructor.
function Button(i) {
    this.btn = document.createElement("BUTTON");
    this.btn.setAttribute('id', String.fromCharCode(65 + i));
    this.letter = String.fromCharCode(65 + i);
    this.btn.setAttribute('class', "btnz");
    this.btn.onclick = controller(this.btn, this.letter);
    this.btn.innerHTML = "" + String.fromCharCode(65 + i);
    document.getElementById("buttons").appendChild(this.btn);
}

//Button generator.
function buttonMaker() {
    let i = 0;
    let n = 26
    for (i; i < n; i++) {
        let t = new Button(i);
    }
}
//Part A ---------------------------------------------------------------

//Part B ---------------Controls Player Walking Animation---------------
//Move handles position changes of the player character.
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
    document.getElementById("define").style.left = player.textX + "vw";
    document.getElementById("dash").style.left = player.textX + "vw";
    setTimeout(move, 2);
}

//StrideL and StrideR update the players image source to display consistent walking animation.
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
    document.getElementById("box").value = "";
    document.getElementById("game").style.visibility = "visible";
    document.getElementById("box").style.visibility = "visible";
}

//Not yet working. Pulls word from firebase.
function pullWord () {
    return 0;
}

//Takes word input and creates dashed lines of equal size.
function createDash() {
    document.getElementById("dash").innerHTML = "";
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
    let letterFlag = false;
    let count = 0;
    for (i = 0; i < storeWord.length; i++) {
        if (storeWord[i] == letter) {
            wordArray[i] = letter + " ";
            letterFlag = true;
        }
        document.getElementById("dash").innerHTML += wordArray[i];
        if (wordArray[i] != "- ") {
            count++;
        }
        if (count == storeWord.length) {
            document.getElementById("box").value = storeWord;
            setTimeout(win,500);
        }
    }
    return letterFlag;
}

//Uses enter key to accept password input.
function enterPassword(ele) {
    if (event.key  === 'Enter') {
        if (ele.value.toUpperCase() == storeWord) {
            win();
        } else {
            document.getElementById("box").value = "Incorrect password";
            warningS.src = "Audio/denied.mp3";
            warningS.volume = VOLUME - OPENOFFSET;
            warningS.play();
            setTimeout(endGame,1000);
        }
    }
}

//Activates the win state of the game by hiding elements, teleporting player, and launching rocket.
function win() {
    warningS.src = "Audio/granted.mp3";
    warningS.volume = VOLUME - OPENOFFSET;
    warningS.play();
            
    //Hides elements on screen
    document.getElementById("thought").style.visibility = "hidden";
    document.getElementById("quest").style.visibility = "hidden";
    document.getElementById("dash").style.visibility = "hidden";
    document.getElementById("define").style.visibility = "hidden";
    document.getElementById("game").style.visibility = "hidden";
    document.getElementById("box").style.visibility = "hidden";

    setTimeout(function () {
        teleport();
    }, 3000);
}
//Part C ---------------------------------------------------------------

//Part D -----------------------------End Game--------------------------
//Warning alert function to signal how many tries are left
function throwAlert() {
    switch (tries) {
        case 5: 
            warningS.src = "Audio/radiation.mp3";
            warningS.volume = VOLUME - OPENOFFSET;
            warningS.play();
            break;
        case 3:
            warningS.src = "Audio/criticalHP.mp3";
            warningS.volume = VOLUME - OPENOFFSET;
            warningS.play();
            break;
        case 1:
            warningS.src = "Audio/clearzone.mp3";
            warningS.volume = VOLUME - OPENOFFSET;
            warningS.play();
            break;
        case 0:
            warningS.src = "Audio/rocket.mp3";
            warningS.volume = VOLUME + 0.30;
            themeOST.volume = VOLUME - OPENOFFSET;
            warningS.play();
            endGame();
    }
}

//Shakes elements on the screen at the time of rocket launch.
function shake () {
    shakeCount++;
    if (shakeCount > 3000) {
        return;
    }
    console.log(shakeCount);
    let range1 = Math.random() * SHAKE - SHAKE;
    let range2 = Math.random() * SHAKE - SHAKE;
    let range3 = Math.random() * SHAKE - SHAKE;
    let range4 = Math.random() * SHAKE - SHAKE;
    document.getElementById("player").style.left = player.x + range1 + "vw";
    document.getElementById("platform").style.left = player.platX + range2 + "vw";

    document.getElementById("player").style.top = player.y + range4 + "vh";
    document.getElementById("platform").style.top = player.platY + range3 + "vh";
    
    setTimeout(shake,5);
}

//If the player wins, they get teleported into the ship.
function teleport () {
    //Portal gif starts
    document.getElementById("port").style.visibility = "visible";
    document.getElementById("port").src= "Images/portal.gif";

    //Player disappears mid portal animation
    setTimeout(function () {
        document.getElementById("player").style.visibility = "hidden";
    }, 600);
    //Portal animation stopped
    setTimeout(function () {
        document.getElementById("player").style.visibility = "hidden";
        document.getElementById("port").style.visibility = "hidden";
        document.getElementById("port").src= "";
    }, 1200);
}

//If the player loses, <undecided>
function endGame () {
    document.getElementById("thought").style.visibility = "hidden";
    document.getElementById("quest").style.visibility = "hidden";
    document.getElementById("dash").style.visibility = "hidden";
    document.getElementById("define").style.visibility = "hidden";
    document.getElementById("game").style.visibility = "hidden";
    document.getElementById("box").style.visibility = "hidden";

    shake();
}

//Score display function
function scoreScreen () {

}
//Part D ---------------------------------------------------------------
