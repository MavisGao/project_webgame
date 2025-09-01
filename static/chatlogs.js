// Defines Log object to hold all message data
class Log {
    constructor(sender, contents) {
        this.sender = sender;
        this.contents = contents;
        this.date = new Date;
    }
}

// The maximum number of messages restored when the user selects a game with an existing log
const max_recall = 100;
// Dictionary to hold all logs
const chatlogs = {
    home : [],
    typing : [],
    spelling : [],
    wow : [],
    guess : []
};

// Adds a new message to specified log
function add_log(log_name, sender, contents) {
    chatlogs[log_name].push(new Log(sender, contents));
}

// For testing purposes, prints specified log out to console
function print_log(log_name) {
    console.log("Index | Date / Time | Sender | Contents");
    let i = 0;
    for(const log of chatlogs[log_name]) {
        console.log(i + " | " + log.date.toLocaleString() + " | " + log.sender + " | " + log.contents);
        i++;
    }
}

// Replaces contents of output display with messages from specified log
function load_log(log_name) {
    // Clear out prev contents from output div
    document.getElementById("output").innerHTML = "";

    // Load in logged messages by iterating through array
    console.log("loading messages from " + log_name + "...");
    length = chatlogs[log_name].length;
    let start = 0;
    if(length > max_recall) {
        start = (length - max_recall);
    }
    for(let i = start; i<length; i++) {
        let log = chatlogs[log_name][i];
        // Uses data from log to re-construct HTML
        const input = "<p class=\"chat_text " + log.sender + "\">" + log.contents + "</p>";
        // Inserts HTML for message into output div
        document.getElementById("output").insertAdjacentHTML("beforeend", input);
    }
}