// Global vars to keep track of currently selected game and whether user is in play
let global_index = 0;
let game_active = false;
// Arrays that translate global index for currently selected game to its displayable or shorthand name
//                      0            1                  2               3                  4
let index_to_game = ['home', 'Typing Challenge', 'Spelling Bee', 'World of Words', 'Guess the Word'];
let index_to_log =  ['home', 'typing',           'spelling',     'wow',            'guess'];

// Checks that page has loaded before posting welcome
onload=welcome(index_to_game[global_index])
onload=get_scores(index_to_log[global_index])

// Prints a welcome message to user, varied depending on selected game
function welcome(game) {
    if(game == 'home') {
        post_bot_message("Hello! Welcome to ChatBot Games.");
        // On first time, prompts user to select a game
        if(chatlogs[game].length <= 1) {
            post_bot_message("Please select a game from the panel on the left to get started!")
        }
    } else {
        post_bot_message("Welcome to <b>" + game + "</b>. Please let me know if you'd like to hear the rules, or begin the game.");
    }
}

// Array of functions to direct rules requests to
let rules_functions = new Array(5).fill(dummy);

// Uses index & array of functions to provide user with each game's rules
function give_rules(game) {
    if(game == 'home') {
        // If no game is selected, prompt user to choose one 
        post_bot_message("You haven't chosen a game yet! Please select an option from the panel on the left.");
    } else {
        post_bot_message("The rules for <b>" + game + "</b> are as follows...");
        rules_functions[global_index]();
    }
}

// Called to restore control to core chat, input no longer redirected
// Takes user's score in game as a parameter for processing
function exit_game(score) {
    game_active = false;
    if(score > 0) {
        process_score(index_to_log[global_index], score);
    }
}

// Called when user selects game buttons from panel. Updates global index and displayed output to reflect choice
function game_select(index) {
    // Automatically fail if old game is active
    if(game_active) {
        post_bot_message("Cannot select new game while in active play.");
        post_bot_message("Please finish playing, or press <b>ESC</b> to exit early.");
        return;
    }

    // If not, proceed
    if(global_index != index) {
        global_index = index;
        // Load the chat records from new game into the output display
        load_log(index_to_log[global_index]);
        // Make a request to SQL database for new game's high scores
        get_scores(index_to_log[global_index]);
        
        // Checks to see if new game's log is empty, posts welcome if yes
        if(chatlogs[index_to_log[global_index]].length == 0) {
            welcome(index_to_game[global_index]);
        }
    // If new selection is the same as current, alert user
    } else {
        if(index == 0) {
            post_bot_message("You're already on the home page! Please select a game to get started.")
        } else {
            post_bot_message("It looks like you've already selected <b>" + index_to_game[index] + "</b>. Would you like to hear the rules, or begin playing?");
        }
    }
}

// Inserts bot messages into the output div as <p> tag
function post_bot_message(raw_input) {
    add_log(index_to_log[global_index], "bot", raw_input);
    const input = "<p class=\"chat_text bot\">" + raw_input + "</p>";
    document.getElementById("output").insertAdjacentHTML("beforeend", input);

}

// Brains behind the bot's "language processing"
function process_input(raw_input) {
    const help = ["help", "rules", "explain", "how"];
    const start = ["start", "begin", "play"];
    const greeting = ["hi", "hello", "hey"];
    
    // Make input case-blind
    const caseless_input = raw_input.toLowerCase();

    // Check for help request
    for(const keyword of help) {
        if(caseless_input.includes(keyword)) {
            give_rules(index_to_game[global_index]);
            return;
        }
    }

    // Check for request to begin game
    for(const keyword of start) {
        if(caseless_input.includes(keyword)) {
            console.log("Detected launch keyword, index: " + global_index + "name: " + index_to_game[global_index]);
            launch_game(index_to_game[global_index]);
            console.log("called launch game");
            return;
        }
    }
    
    // Check for greeting
    for(const keyword of greeting) {
        if(caseless_input.includes(keyword)) {
            welcome(index_to_game[global_index]);
            return;
        }
    }

    // If no command is recognized
    post_bot_message("Sorry, I didn't understand your request. Please try re-phrasing it and ask again.");
}

