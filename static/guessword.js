// Inspiration for game: https://github.com/ndgithub/Word-Guess-Game/blob/master/assets/javascript/game.js
let usertype = false
const starttime = 1
let currword = ""
let hint = 0
let curhint = ""
let curhint1 = ""
let curhint2 = ""
let curhint3 = ""
let words_1;
let exit_cond1 = false;

function guess_game_rules(){
    post_bot_message("Try to guess what the word is.")
    post_bot_message("You will start of with the definition. If incorrect, then you get the synonym. Then, the antonym.")
    post_bot_message("If you still cannot guess, I will give you the word to type.")
    post_bot_message("I will remind you of the timer every 10 seconds.")
    post_bot_message("I will also tell you how many points you have after.")
    post_bot_message("You have 120 seconds to play. Now enter <b>play</b> to start the game. You could enter <b>exitbot</b> to end the game. Good luck!");
}

function newhint(){
    hint++;
    if (hint === 1){
        curhint1 = "Synonym: " + synonym 
        post_bot_message(curhint)
        post_bot_message(curhint1)
    }
    else if (hint === 2){
        curhint2 = "Antonym: " + antonym
        post_bot_message(curhint)
        post_bot_message(curhint1)
        post_bot_message(curhint2)
    }
    else{
        curhint3 = "The word is: " + currword 
        post_bot_message(curhint)
        post_bot_message(curhint1)
        post_bot_message(curhint2)
        post_bot_message(curhint3)
    }
}

function guess_word_game(input){
    const guess = input.trim().toLowerCase()
    if (guess === "exitbot"){
        exit_cond1 = true
        timeleft = 0
        return
    }
    else{
        if (guess === currword){
            updatepoints(currword)
            post_bot_message("Correct! +" + currword.length*10 + " points.");
            start_guess_game()
        }
        else if (hint < 3){
            newhint()
        }
        else{
            start_guess_game()
        }
    }
}

function new_word() {
    words_1 = valid_word_list
    return words_1[Math.floor(Math.random()*words_1.length)]
}

async function get_word_data() {
    myiter++;
    while (true){
        const word = new_word()
        try{
            // Citation: https://github.com/meetDeveloper/freeDictionaryAPI
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            const data = await response.json()
            worddata = data[0]
            console.log(worddata)
            definition= worddata.meanings[0].definitions[0].definition
            synonym= worddata.meanings[0].synonyms[0]
            antonym= worddata.meanings[0].antonyms[0]
            if (synonym == undefined){
                synonym = "No Synonyms"
            }
            if (antonym == undefined){
                antonym = "No Antonym"
            }
            return {word, definition, synonym, antonym}
        }
        catch(error){
            console.log("Word had no data. Trying new word")
        }

    }
} 

async function start_guess_game(){
    game_active = true;
    if (myiter === 0){
        post_bot_message("You have 120 seconds. Guess.");
    }
    game_active = true;
    clearInterval(timerid)
    guess_timelimit()
    hint = 0
    const{word, definition, synonym, antonym} = await get_word_data()
    currword = word.toLowerCase()
    curhint = "Definition: " + definition
    post_bot_message(curhint)
}

function updatepoints(curr_phrase) {
    points = points + curr_phrase.length*10
}
function reset_guess_game(){
    timeleft = 120
    points = 0
    myiter= 0
    currword = ""
    hint = 0
    curhint = ""
    curhint1 = ""
    curhint2 = ""
    curhint3 = ""
    exit_cond1 = false
}

/* Function by Zixi */
function guess_timelimit() {
    timerid = setInterval(() => {
      timeleft--;
      if(!game_active || global_index != 4) {
        console.log("Game exited, stopping timer...");
        //count_down = 0;
        reset_guess_game();
        clearInterval(timerid);
        return;
      }
      if (timeleft > 0 && timeleft % 10 === 0) {
        post_bot_message("There are " + timeleft + " seconds left.");
      }
      // end of game
      if (timeleft <= 0) {
        clearInterval(timerid);
        if (!exit_cond1){
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
        reset_guess_game();
      }
    }, 1000);
}
