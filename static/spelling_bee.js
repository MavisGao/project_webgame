let letter = [];
let words = new Set();
let used_words = new Set();
let score = 0;
let count_down = 120;
let bee_clock;
let center_letter = ''; 

// the rules for spelling bee game
function spellingBeeRules() {
    post_bot_message("You will have 7 letters: 3 vowels and 4 consonants.");
    post_bot_message("You will make English words using these letters. Words must contain at least four letters. \
Letters can be used more than once.");
    post_bot_message("You have 120 seconds to play. Now enter <b>play</b> to start the game. You could enter <b>newbee</b> to reset the game\
with another set of words. Good luck!");
}

// change because there is a new word list
async function load_word(){
    return new Promise((resolve)=>{
        const script = document.createElement('script');
        script.src = "http://michaelwehar.com/spellchecker/english_word_list.js";
        script.onload = () => {
            words = new Set(english_words.split("|"));
            resolve();
        };
        document.head.appendChild(script);
    });
}

function generate_letter(){
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

    while (letter.length < 3) {
        const index = Math.floor(Math.random() * vowels.length);
        const char = vowels[index];
        if (!letter.includes(char)) {
            letter.push(char);
        }
    }
    while (letter.length < 7) {
        const index = Math.floor(Math.random() * consonants.length);
        const char = consonants[index];
        if (!letter.includes(char)) {
            letter.push(char);
        }
    }
    center_letter = letter[Math.floor(Math.random() * letter.length)];

    return letter;
}

function spellingBeeGame(input){
    const word = input.trim().toLowerCase();
    // if the user wants to restart the game
    if (word === "newbee") {
        clearInterval(bee_clock); 
        post_bot_message("Starting a new round with another set of letters...");
        load_word().then(() => start_bee_game());  
        return;
    }
    // if the word is inside the word list
    if (word.length < 4) {
        post_bot_message("The word needs to have at least 4 letters. ");
        return;
    }
    // if the word is inside the word list
    if (used_words.has(word)) {
        post_bot_message("You have already used that word. Try to think of another word.");
        return;
    }
    // if the word does not include the center letter
    if (!word.includes(center_letter)) {
        post_bot_message("Word must include the center letter: <b>" + center_letter.toUpperCase() + "</b>");
        return;
    }
    // if the word has invalid letter
    for (let character of word) {
        if (!letter.includes(character)) {
            post_bot_message("That word uses letters not in your set.");
            return;
        }
    }
    // if the word is invalid
    if (!words.has(word)) {
        post_bot_message("That word is not in our dictionary.");
        return;
    }

    // if the word is valid
    score += word.length;
    used_words.add(word);
    post_bot_message("Nice! <b>" + word + "</b> is worth " + word.length + " points. Current Score: " + score);
}

function start_bee_game(){
    game_active = true;
    used_words.clear();
    score = 0;
    count_down = 120;

    post_bot_message("Let's play Spelling Bee! You have 120 seconds.");

    // generate the letter
    letter = [];    
    letter = generate_letter(); 
    post_bot_message("Your letters are: <b>" + letter.join(" ").toUpperCase() + "</b>");
    post_bot_message("You must use: <b>" + center_letter.toUpperCase() + "</b> for each word. ");
    // count down of time
    bee_clock = setInterval(() => {
        // Make sure game hasn't been exited
        if(!game_active || global_index != 2) {
            console.log("Game exited, stopping timer...");
            //count_down = 0;
            clearInterval(bee_clock);
            return;
        }

        // If not, continue
        count_down--;
        // reminds the user every 10 seconds
        if (count_down > 0 && count_down % 10 === 0){
            post_bot_message("There are " + count_down + " seconds left.");
        }
        // end of game
        if (count_down <= 0){
            clearInterval(bee_clock);
            post_bot_message("Time is up! Final score is " + score);
            exit_game(score);
        }
    }, 1000);    
}


