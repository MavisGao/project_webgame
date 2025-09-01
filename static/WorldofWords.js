//Inspiration for this game came from https://github.com/Catastrophe0123/word-select-game

let display = ""
let timer = 120
let wow_score = 0
let wow_highscore = 0
let clock;

var wow_word_list;

var found_words = []

var six_letter_words = wow_word_list.filter(check_length)

function set_valid_wow_words(lst)
{
    wow_word_list = lst
}

function check_length(word)
{
    return word.length == 6;
}

function get_jumbled_word(words)
{
    const random_word = six_letter_words[Math.floor(Math.random() * six_letter_words.length)]
    const letters = random_word.split('')
    for (let i = 5; i > 0; i--)
    {
        const random_index = Math.floor(Math.random() * (i+1))
        const temp = letters[i]
        letters[i] = letters[random_index]
        letters[random_index] = temp
    }
    return letters.join('')
}

function wow_rules() {
    post_bot_message("This is World of Words inspired by https://github.com/Catastrophe0123/word-select-game")
    post_bot_message("Make as many words as you can using the jumbled letters.")
    post_bot_message("Words must be at least 3 letters long and at most 6 letters long.")
    post_bot_message("You can only use each unique letter once.");
}

function wow_game(input)
{
    const word_input = input.trim().toLowerCase();
    const displayLetters = display.toLowerCase()

    if (word_input == "exitbot")
    {
        timer = 0
        return;
    }
    if (!is_valid_word(word_input, displayLetters)) 
    {
        return;
    }
    else 
    {
        console.log("VALID")
        found_words.push(word_input.toLowerCase())
        update_wow_score(word_input)
        post_bot_message('Nice! Your score is ' + wow_score)
    }
}

function is_valid_word(text, display) 
{
    /*checks to see if word is valid*/
    if ((text.length > 6) || (text.length < 3)) {
        if (text.length > 6) 
        {
            post_bot_message("That word is too long.")
        }
        else
        {
            post_bot_message("That word is too short.")
        }
        console.log("Invalid length")
        return false
    }

    for (let i = 0; i < text.length; i++)
    {
        if (!(display.includes(text[i])))
        {
            post_bot_message("That word contains invalid letters.")
            console.log("Contains invalid letters")
            return false
        }
    }
    if (!(english_word_list.includes(text.toLowerCase())))
    {
        post_bot_message("That word does not exist.")
        console.log("Word does not exist")
        return false
    }
    if (found_words.includes(text))
    {
        post_bot_message("You have already found that word.")
        console.log("Word already found")
        return false
    }
    return true
}

function update_wow_score(text) 
{
    let points = 0
    if (text.length == 3) { points = 100 }
    else if (text.length == 4) { points = 200 }
    else if (text.length == 5) { points = 400 }
    else if (text.length == 6) { points = 800 }
    wow_score += points
}

function gameover() 
{
    if (wow_score > wow_highscore)
    {
        wow_highscore = wow_score
        post_bot_message("Congratulations! You achieved a new high score.")
    }
    exit_game(wow_score)
}

function start_wow_game() 
{
    game_active = true
    timer = 120
    wow_score = 0
    found_words = []

    post_bot_message("Play World of Words! You have 120 seconds.")

    const jumbled_word = get_jumbled_word(six_letter_words)
    display = jumbled_word.toUpperCase()
    post_bot_message(display)

    clock = setInterval(() => {
        timer--;
        if(!game_active || global_index != 3) {
            console.log("Game exited, stopping timer...");
            //count_down = 0;
            clearInterval(clock);
            return;
          }

        if (timer > 0 && timer % 10 === 0)
        {
            post_bot_message("There are " + timer + " seconds left.");
            post_bot_message(display)
        }
        // end of game
        if (timer <= 0)
        {
            clearInterval(clock);
            gameover()
        }
    }, 1000);    
}