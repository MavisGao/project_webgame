// Flag to redirect user input when initials are needed
let input_initials = false;
// To hold game and score while waiting for initials
let pending_game = "";
let pending_score = -1;

// Provides user instructions, stages score data
function process_score(game, score) {
    input_initials = true;
    pending_game = game;
    pending_score = score
    post_bot_message("Congratulations! Your score is " + score + ".");
    post_bot_message("If you'd like to save your score to the leaderboard, please enter your initials.");
    post_bot_message("If not, please hit Enter.");
}

// Processes and formats user input for scoreboard
function process_initials(input) {
    // Remove all white space and grab first 3 chars (max length)
    spaceless = input.replace(/\s/g,'');
    first_three = spaceless.slice(0,3);

    if(first_three.length <= 0) {
        refuse_score();
        return;
    }

    // Format initials to upper case, pass all data to send_score
    initials = first_three.toUpperCase();
    send_score(pending_game, pending_score, initials);
    post_bot_message("Score recieved! Thank you " + initials + ".");
    input_initials = false;
}

// Unstages score data
function refuse_score() {
    input_initials = false;
    post_bot_message("Thank you for playing! Your score will not be recorded.");
    pending_game = "";
    pending_score = -1;
}

// Forms and sends XML POST request to up   date DB
function send_score(game, score, name) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            get_scores(index_to_log[global_index]);
        }
      };
      xhttp.open("POST", "send-score", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send("game=" + game + "&score=" + score + "&name=" + name);
      console.log("Score Sent");
}

// Makes an AJAX request to server's SQL database of scores, inserts the response into high score display
function get_scores(game) {
    if(game == 'home') {
        document.getElementById("score_table").innerHTML = "<p id='noscores'>Please select a game to see high scores.</p>";
        return;
    }
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Scores Received: " + this.responseText);
            // Insert into scoreboard
            document.getElementById("score_table").innerHTML = this.responseText;
        }
    };

    url = "get-scores/" + game;
    xhttp.open("GET", url, true);
    xhttp.send();
    console.log("Get Request Sent");
}