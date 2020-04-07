//Part 0 ------------------Constants & Variables------------------------
const VOLUME = 0.5; //Main theme volume constant.
const OPENOFFSET = 0.30; //Reduces the opening warning volume.
const SHAKE = 0.25; //Shake value.

let player = {x: 5, y: 5, platX: 8, platY: 3}; //Players location on the screen
let origin = {x: 5, y: 5, platX: 8, platY: 3, rocket: 2, smoke: 89}; //For restarting back to origin positions.
let tries = 7; //Number of tries used by the player.
let storeWord = ""; //Stores the word input by the firebase.
let wordDashes = []; //Array containing dashes matching word-length.
let shakeCount = 0; //Used to stop shaking after launch.
let userScore = 0;
let index;
let restartFlag = false; //Used to stop liftoff during restart.
let firstRun = true; //Used to control opening audio.

//---------------------------------Word List------------------------------
//Nested Array containing word and it's accompanying definition.
let wordArray = [["spaceship","thing you need to enter...like...right now"],["alien","Space dude with creepy eyes"],
["astronaut","Person who is trained to travel in a spaceship"],["lunar","of, determined by, or resembling the moon."],
["universe","all existing, ever expanding"],["tattoo","a form of body modification where a design is made by inserting ink."],
["spaceship","ships made by Elon Musk"],["gravity","the force that attracts a body toward the center of the earth"],
["comet","a celestial object consisting of a nucleus of ice and dust"],["planet","a celestial body moving in an elliptical orbit around a star."],
["milkyway","the galaxy we live in"], ["electricity", "is the set of physical phenomena associated with the presence and motion of electric charge."]];


let themeOST = document.getElementById("theme"); //The main background song; change source in HTML, not here.
let warningS = document.getElementById("warning"); //Warning sound element; changes source repeatedly for each alert.
let failsound = document.getElementById("fail"); // The sound when user lose.

//Part F -----------------------------Firebase--------------------------
//Lets not push the firebase stuff up. I read its a security issue.
//Also we have 2 firebases, we need to settle on one.
//Part F ---------------------------------------------------------------

//Part ! -------------------Game Start Function-------------------------
function startGame() {
    checkOrientation();
    themeOST.volume = VOLUME;
    themeOST.currentTime = 0;
    themeOST.play();
    warningS.src = "Audio/goal.mp3";
    warningS.currentTime = 0;
    warningS.volume = VOLUME - OPENOFFSET;
    if (firstRun) {
        warningS.play();
    }

    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("player").style.visibility = "visible";
    document.getElementById("restart").style.visibility = "visible";
    document.getElementById("thought").style.visibility = "visible";
    document.getElementById("quest").style.visibility = "visible";
    document.getElementById("define").style.visibility = "visible";
    document.getElementById("dash").style.visibility = "visible";
    document.getElementById("platform").style.visibility = "visible";
    document.getElementById("end").style.visibility = "visible";
    getWords();
    buttonMaker();
}

function restart() {
    checkOrientation();
    userScore = 0;
    firstRun = true;
    restartFlag = true;
    tries = 7;
    shakeCount = 1500;
    failsound.volume = 0;

    player = origin;
    document.getElementById("buttons").style.visibility = "visible";
    document.getElementById("shout").style.visibility = "hidden";
    document.getElementById("answer").style.visibility = "hidden";
    document.getElementById("end").style.visibility = "visible";
    
    document.getElementById("player").style.left = origin.x + "vw";
    document.getElementById("thought").style.left = origin.bubbleX + "vw";
    document.getElementById("quest").style.left = origin.textX + "vw";
    document.getElementById("define").style.left = origin.textX + "vw";
    document.getElementById("dash").style.left = origin.textX + "vw";
    document.getElementById("platform").style.left = origin.platX + "vw";

    document.getElementById("player").style.bottom = origin.y + "vh";
    document.getElementById("platform").style.bottom = origin.platY + "vh";
    document.getElementById("rocket").style.bottom = origin.rocket + "vh";
    document.getElementById("smoke").style.top = origin.smoke + "vh";

    let clearDiv = document.getElementById("buttons");
    while (clearDiv.firstChild) {
        clearDiv.removeChild(clearDiv.lastChild);
      }
    startGame();
}

function nextRound() {
    checkOrientation();
    restartFlag = true;
    shakeCount = 1500;
    failsound.volume = 0;

    player = origin;
    
    document.getElementById("buttons").style.visibility = "visible";
    document.getElementById("shout").style.visibility = "hidden";
    document.getElementById("answer").style.visibility = "hidden";
    document.querySelector("#end").style.visibility = "visible";
    
    document.getElementById("player").style.left = origin.x + "vw";
    document.getElementById("thought").style.left = origin.bubbleX + "vw";
    document.getElementById("quest").style.left = origin.textX + "vw";
    document.getElementById("define").style.left = origin.textX + "vw";
    document.getElementById("dash").style.left = origin.textX + "vw";
    document.getElementById("platform").style.left = origin.platX + "vw";

    document.getElementById("player").style.bottom = origin.y + "vh";
    document.getElementById("platform").style.bottom = origin.platY + "vh";
    document.getElementById("rocket").style.bottom = origin.rocket + "vh";
    document.getElementById("smoke").style.top = origin.smoke + "vh";

    let clearDiv = document.getElementById("buttons");
    while (clearDiv.firstChild) {
        clearDiv.removeChild(clearDiv.lastChild);
      }
    startGame();
}

function checkOrientation() {
    if(window.innerHeight > window.innerWidth){
        alert("Please use Landscape!");
    }
}

//Score display function
function endScreen() {
    document.querySelector("#end").style.visibility = "hidden";
    firstRun = true;
    document.querySelector("#scoreOutput").innerHTML = "Score: " + userScore;
    $('#endModal').modal('show');
}

//Part ! ---------------------------------------------------------------

//Part A ---------Generates buttons and disables onclick event----------
//Handles button clicks and current game state changes from the click.
function controller(btn, letter) {
    return function buttonClick() {
        restartFlag = false;
        shakeCount = 0;
        btn.setAttribute('class', "dead");
        btn.disabled = true;
        btn.onclick = "";
        let result = updateDash(letter);
        if (!result) {
            userScore -= 1; //decerement score on failed guess
            tries--; 
            throwAlert();
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

//Part C ----------------Word Generator and Input Handler---------------
//Opens the command window for when player reaches the computer.
function openScreen () {
    document.getElementById("box").value = "";
    document.getElementById("box").style.visibility = "visible";
}

//Chooses random word and accompanying definition from Word array.
function getWords() {
    index = Math.floor(Math.random() * (wordArray.length - 1));
    storeWord = wordArray[index][0].toUpperCase();
    document.getElementById("define").innerHTML = wordArray[index][1];
    console.log(index);
    createDash(storeWord);
    endGamemessage();
}

//Takes word input and creates dashed lines of equal size.
function createDash(wordToGuess) {
    document.getElementById("dash").innerHTML = "";
    for (let i = 0; i < wordToGuess.length; i++) {
        wordDashes[i] = "- ";
        document.getElementById("dash").innerHTML += wordDashes[i];
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
            wordDashes[i] = letter + " ";
            letterFlag = true;
            userScore += 1; //increment score on correct guess
        }
        document.getElementById("dash").innerHTML += wordDashes[i];
        if (wordDashes[i] != "- ") {
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
    if (firstRun) {
        warningS.src = "Audio/granted.mp3";
        warningS.volume = VOLUME - OPENOFFSET;
        warningS.play();
        firstRun = false;
    } else {
        warningS.src = "Audio/pc.mp3";
        warningS.volume = VOLUME - OPENOFFSET;
        warningS.play();
    }

    //Hides elements on screen
    document.getElementById("thought").style.visibility = "hidden";
    document.getElementById("quest").style.visibility = "hidden";
    document.getElementById("dash").style.visibility = "hidden";
    document.getElementById("define").style.visibility = "hidden";
    document.getElementById("box").style.visibility = "hidden";
    

    if (firstRun) {
        setTimeout(function () {
            teleport();
        }, 3200);
    
        setTimeout(function () {
            warningS.src = "Audio/rocket.mp3";
            warningS.volume = VOLUME;
            warningS.play();
            shake();
        }, 4400);
        setTimeout(function () {
            liftoff();
        }, 4400);
        setTimeout(function () {
            nextRound();
        }, 9700);
    } else {
        setTimeout(function () {
            teleport();
        }, 1500);

        setTimeout(function () {
            warningS.src = "Audio/rocket.mp3";
            warningS.volume = VOLUME;
            warningS.play();
            shake();
        }, 2700);
        setTimeout(function () {
            liftoff();
        }, 2700);
        setTimeout(function () {
            nextRound();
        }, 8000);
    }
}

// Rocket liftoff
function liftoff() {
    if (restartFlag) {
        clearInterval(id2);
        clearInterval(id);
        return;
    }
    let rocketShip = document.getElementById("rocket");
    let smoke = document.getElementById("smoke");
    smoke.style.visibility="visible";
    let rocketPos = 2;
    let smokePos = 79;
    let id = setInterval(rocketUp, 50);
    let id2 = setInterval(smokeUp, 50);
    function rocketUp() {
        if (restartFlag) {   
            clearInterval(id2);
            clearInterval(id);
            return;
        }
        if (rocketPos == -300) {
            clearInterval(id);
        } else {
            rocketPos++;
            rocketShip.style.bottom = rocketPos + 'vh';
        }
    }
    function smokeUp() {
        if (restartFlag) {
            clearInterval(id2);
            clearInterval(id);
            return;
        }
        if (smokePos == -10) {
            clearInterval(id2);
        } else {
            smokePos--;
            smoke.style.top = smokePos + 'vh';
        }
    } 
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
            endGame();
            
    }
}

//Shakes elements on the screen at the time of rocket launch.
function shake () {
    shakeCount++;
    if (shakeCount > 1500) {
        return;
    }
    let range1 = Math.random() * SHAKE - SHAKE;
    let range2 = Math.random() * SHAKE - SHAKE;
    let range3 = Math.random() * SHAKE - SHAKE;
    let range4 = Math.random() * SHAKE - SHAKE;
    document.getElementById("player").style.left = player.x + range1 + "vw";
    document.getElementById("platform").style.left = player.platX + range2 + "vw";

    document.getElementById("player").style.bottom = player.y + range4 + "vh";
    document.getElementById("platform").style.bottom = player.platY + range3 + "vh";
    
    setTimeout(shake,5);
}

//If the player wins, they get teleported into the ship.
function teleport () {
    //Portal gif starts
    warningS.src = "Audio/portal.mp3";
    warningS.volume = VOLUME;
    warningS.play();
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

//End game message according to string value of question.
function endGamemessage() {
    let indexnum = index;
    let answer = wordArray[indexnum][0].toUpperCase()
    document.getElementById("answer").innerHTML="The password was... " + answer + "!";
    console.log(answer);
}

//If the player loses, appear endgame img and the answer of the question.
function endGame () {
    document.getElementById("thought").style.visibility = "hidden";
    document.getElementById("quest").style.visibility = "hidden";
    document.getElementById("dash").style.visibility = "hidden";
    document.getElementById("define").style.visibility = "hidden";
    document.getElementById("box").style.visibility = "hidden";
    document.getElementById("buttons").style.visibility = "hidden";
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("player").style.visibility = "hidden";
    document.getElementById("platform").style.visibility = "hidden";
    document.getElementById("shout").style.visibility = "visible";
    document.getElementById("answer").style.visibility = "visible";

    themeOST.pause();
    failsound.currentTime = 0;
    failsound.volume = VOLUME - OPENOFFSET;
    failsound.play();
    endGamemessage();
    setTimeout(endScreen, 2000);
}

//Reveals up to date leaderboard
function leaderBoardScreen() {
    $('#endModal').modal('hide');
    $('#leaderBoardModal').modal('show');

} 
//Part D ---------------------------------------------------------------