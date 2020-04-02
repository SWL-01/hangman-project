//Part F ----------------------------FireBase---------------------------
    
// References to DOM elements & Other Variables
const outputHeader = document.querySelector("#output");
const starter = document.querySelector("#start");
const rank1 = document.querySelector("#rank1");
const rank2 = document.querySelector("#rank2");
const rank3 = document.querySelector("#rank3");
const rank4 = document.querySelector("#rank4");
const rank5 = document.querySelector("#rank5");
const userName = document.querySelector("#nameTextBox");
let rankList = [rank1, rank2, rank3, rank4, rank5]; //Array to store DOM elements for leaderboard
let currentLeads = []; //Array to store LeaderBoard

//Pulls current leaderboard from firebase (firebase stores top 5)
function pullLB() {
    for (let i = 1; i <= 5; i++) {
            const leader = db.collection("Leader-board").doc("Rank" + i);
            leader.get().then(function(doc){
                currentLeads.push(doc.data().Score)
                rankList[i - 1].innerHTML = doc.data().Name + " --- " + doc.data().Score + "pts";
            });
    }
}

//Firebase leaderboard update. 
//Param currLeads is the currently stored leading scores in firebase
//Param currName is the name entered in the modal
//Param spot is their rank relative to the current leaderboard
function updateLB(currLeads, currName, spot) {
    const leader = db.collection("Leader-board").doc("Rank" + spot);
    leader.set({
        Name: currName,
        Score: currLeads[spot - 1]
    }).then(function() {
        console.log("replaced!");
    });
}

//Gets name to store in firebase
function getName() {
    if (userName.value === "") {
        alert("Enter Name to Save"); //User cannot have empty Name (Spaces pass through)
    } else {
        console.log(userName.value);
        leader(userName.value);
        pullLB();
    }
}

//Slots current score in leader Array based on score
//param name passed to updateLB when rank is found
function leader(name) {
    let added = false; //flag to check if current score has been added to leaderboard.
    for(let i = 0; i < 5; i++) {
        if(userScore > currentLeads[i] && added == false) {
            currentLeads.splice(i, 0, userScore);
            currentLeads.pop();
            added = true;
            console.log(currentLeads);
            updateLB(currentLeads, name, (i + 1)); //updates firebase leaderboard
        }
    }
}

//Reveals up to date leaderboard
function leaderBoardScreen() {
    $('#endModal').modal('hide');
    $('#leaderBoardModal').modal('show');
} 

//Part F ---------------------------------------------------------------

