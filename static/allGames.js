rules_functions[1] = game_rules;
game_functions[1] = typingGame;
rules_functions[2] = spellingBeeRules;
game_functions[2] = spellingBeeGame;
rules_functions[3] = wow_rules;
game_functions[3] = wow_game; 
rules_functions[4] = guess_game_rules;
game_functions[4] = guess_word_game;
function launch_game(game) {
    if (game == "home") {
        give_rules(game);
    } else if (game == "Spelling Bee") {
        post_bot_message("Launching <b>" + game + "</b>...");
        load_word().then(() => start_bee_game());
    }
    else if (game == "Typing Challenge") {
        post_bot_message("Launching <b>" + game + "</b>...");
        start_type_game();
    }
    else if (game == "World of Words") {
        post_bot_message("Launching <b>" + game + "</b>...");
        start_wow_game();
    }
    else if (game == "Guess the Word") {
        post_bot_message("Launching <b>" + game + "</b>...");
        start_guess_game();
    }
}