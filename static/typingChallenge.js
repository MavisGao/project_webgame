// Inspiration for the game: https://github.com/kenilghetia/speed-typing-game-js/blob/main/script.js
let timeleft = 120
let points = 0
let timerid
let myiter = 0
let sentences_list
let curr_phrase = ""
let choosediff= false
var valid_word_list;
var valid_sent_list;
let exit_cond = false ;

function set_valid_word_list(english_word_list){
    valid_word_list = english_word_list;
}

function set_valid_sentences_list(english_sent_list){
    valid_sent_list = english_sent_list;
}

function game_rules(){
    post_bot_message("Type the texts I send you.")
    post_bot_message("Spelling and punctuation must match.")
    post_bot_message("I will remind you of the timer every 10 seconds.")
    post_bot_message("I will also tell you how many points you have after")
    post_bot_message("You have 120 seconds to play. Now enter <b>play</b> to start the game. You could enter <b>exitbot</b> to end the game. Good luck!");
}

function new_phrase() {
    /*return some phrase*/
    return sentences_list[Math.floor(Math.random()*sentences_list.length)]
}


function typingGame(input){
    const myinput = input.trim()
    if (!choosediff){
        if (myinput === "hard"){
            sentences_list = valid_sent_list;
            choosediff = true
            myiter++;
            post_bot_message("You have 120 seconds. Type.");
            start_type_game()
        }
        else if (myinput === "easy"){
            sentences_list = valid_word_list
            choosediff = true
            myiter++;
            post_bot_message("You have 120 seconds. Type.");
            start_type_game()
        }
        else{
            post_bot_message("That is not an option: easy or hard")
        }
        }

    else{
        if (myinput === "exitbot"){
            exit_cond = true
            timeleft = 0
            return
        }
        if (myinput === curr_phrase) {
            updatepoints(curr_phrase);
            post_bot_message("Correct! +" + curr_phrase.length*10 + " points.");
            myiter++;
            start_type_game()
        } else {
            post_bot_message("Try again.");
            post_bot_message(curr_phrase);
        }
    }

}

function start_type_game(){
    if (myiter === 0){
        post_bot_message("Timer will start after difficulty chosen");
        post_bot_message("Please choose difficulty: easy or hard");
        game_active = true;
    }
    else{
        clearInterval(timerid)
        type_timelimit()
        const myphrase = new_phrase()
        curr_phrase = myphrase
        post_bot_message(curr_phrase)
    }

}

function updatepoints(curr_phrase) {
    points = points + curr_phrase.length*10
}
function reset_type_game(){
    timeleft = 120
    points = 0
    myiter= 0
    choosediff= false
    exit_cond = false
}

/* Function by Zixi */
function type_timelimit() {
    timerid = setInterval(() => {
      timeleft--;
      if(!game_active || global_index != 1) {
        console.log("Game exited, stopping timer...");
        //count_down = 0;
        reset_type_game();
        clearInterval(timerid);
        return;
      }
      if (timeleft > 0 && timeleft % 10 === 0) {
        post_bot_message("There are " + timeleft + " seconds left.");
      }
      // end of game
      if (timeleft <= 0) {
        clearInterval(timerid);
        if (!exit_cond){
            post_bot_message("Time is up! Game has ended.");
        }
        else{
            post_bot_message("Game has ended.");
        }
        if (points > 0){
            post_bot_message("After storing points, type play to start new game.");  
        }
        else{
            post_bot_message("Type play to start new game.");
        }
        exit_game(points);
        reset_type_game()
      }
    }, 1000);
}