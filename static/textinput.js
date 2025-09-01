// Create reference variables
var textbox = document.getElementById("input");
var enter_button = document.getElementById("submit");

// Warning flag for early exit
let warn_given = false;

// Array of functions to redirect user input to
let game_functions = new Array(5).fill(dummy);

// Placeholder function, mostly used to make sure it isn't being called
function dummy() {
    console.log("Hey! You called the dummy function.");
}

// Detects enter keypress, submits user text
textbox.addEventListener("keydown", function(event) {
    if(event.key == "Enter") {
        handle_input();
    }
});

// Detects esc keypress to end game early
document.addEventListener("keydown", function(event) {
    if(event.key == "Escape" && game_active) {
        if(!warn_given) {
            post_bot_message("Are you sure you'd like to exit the game? Your score will not be recorded.");
            post_bot_message("To confirm, press <b>ESC</b> again.")
            warn_given = true;
        } else {
            post_bot_message("Exiting <b>" + index_to_game[global_index] + "</b>...")
            exit_game(0);
            warn_given = false;
            post_bot_message("Thank you for playing!");
        }
    }
});

// Extracts input from textbox, passes it where it needs to go
function handle_input() {
    var raw_input = textbox.value
    // If the user has entered characters into the input box
    if(raw_input != "") {
        textbox.value = "";
        post_usr_message(raw_input);
        // If no game is active, and not waiting for user to input initials
        if(!game_active && !input_initials) {
            // Direct input to processing by core chat
            process_input(raw_input);
        // If game is active
        } else if(game_active) {
            // Direct input to game's function via index & array
            game_functions[global_index](raw_input);
        // If waiting on user to input intials
        } else {
            process_initials(raw_input);
        }

    // If input box is empty
    } else {
        // If waiting for initials, assume user has declined
        if(input_initials) {
            refuse_score();
        }
    }
}

// Inserts user input into the output div as <p> tag
function post_usr_message(raw_input) {
    add_log(index_to_log[global_index], "user", raw_input);
    var input = "<p class=\"chat_text user\">" + raw_input + "</p>";
    document.getElementById("output").insertAdjacentHTML("beforeend", input);
    
}