import * as music from './music.js'

const INITIAL_COUNTDOWN = 4;

var backgroundInitialized = false;
var backgroundImageIndex = -1;
var noteIndexUI = document.getElementById("note-bar1");
var notesUI = document.getElementById("note-bar2");
var prevNotesString = "";
var notesString = "";
var notesIndex = 0;
var countdown = INITIAL_COUNTDOWN;

// Initialize music
music.init();

// Select random background on update-background button press.
document.getElementById("update-background").addEventListener("click", function(){
    console.log("Update background button toggled.");
    pause();
    updateBackground();
    music.restart();
    countdown = INITIAL_COUNTDOWN;
});

function updateBackground() {
    console.log("Updating background.");
    backgroundInitialized = true;
    const num_backgrounds = 49;
    // Returns integers [0, num_backgrounds - 1] (assumes 0-indexing of backgrounds)
    var rand = Math.floor(Math.random() * num_backgrounds);
    var new_bkg = "assets/backgrounds/bg" + rand.toString() + ".jpg";
    console.log("New background: " + new_bkg);
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundImage = "url(\'" + new_bkg + "\')";
}

// Toggle audio button
document.getElementById("play-pause-button").addEventListener("click", function(){
    console.log("Play-pause button toggled.");
    var audio = document.getElementById('testAudio');
    if (this.className == 'is-playing') {
        // No longer playing
        pause();
    } else {
        // Now playing
        this.className = "is-playing";
        // Replace fa-play with fa-pause icon
        this.innerHTML = "<i class=\"fa fa-pause\"></i>";
        // Update the background only IFF it has not been initialized.
        if (!backgroundInitialized) {
            updateBackground();
        }
        music.start();
    }
});

function pause() {
    var pauseButton = document.getElementById("play-pause-button");
    pauseButton.className = "";
    // Replace fa-pause with fa-play icon
    pauseButton.innerHTML = "<i class=\"fa fa-play\"></i>"
    music.stop();
}

export function loadPage() {
    document.getElementById("page-content").style.display = "grid";
    document.getElementById("loading-screen").style.display = "none";
}

export function emphasizeNote() {
    notesIndex++;
    /* Surround the active note with <span style="color: #02a6f2">EXAMPLE_NOTE</span> */
    var notes = prevNotesString.split(", ");
    /* notesIndex is 1-indexed. */
    notes[notesIndex - 1] = "<span style=\"color: #02a6f2\">" + notes[notesIndex - 1] + "</span>";
    notesUI.innerHTML = notes.join(",&nbsp;");
}

export function updateNotesUI(repeated) {
    if (notesString != "") {
        notesUI.innerHTML = notesString;
    }
    prevNotesString = notesString;
    notesIndex = 0;
    
    if (!repeated) {
        notesString = "";
    }
}

export function resetNotesUI() {
    notesUI.innerHTML = "Claire Goeckner-Wald & Amy Xiong";
    notesString = prevNotesString = "";
    notesIndex = 0;
}

/* Helper function changes alphanumerical representations to unicode representations. */
function unicoder(strinput) {
    /* Change sharps and flats to unicode */
    strinput = strinput.replace("#", "&#x266F;").replace("b", "&#x266D;");
    // Temporarily unavailable due to font conflict:
    // /* Change music lengths to music notes */
    // /* 16n */
    // strinput = strinput.replace("16n", "&#119137;");
    // /* 8n or 8n. */
    // strinput = strinput.replace("8n.", "&#119136;").replace("8n", "&#119136;");
    // /* 4n or 4n. */
    // strinput = strinput.replace("4n.", "&#119135;").replace("4n", "&#119135;");
    // /* 2n or 2n. */
    // strinput = strinput.replace("2n.", "&#119134;").replace("2n", "&#119134;");
    // /* 1m (1 measure) */
    // strinput = strinput.replace("1m", "&#119133;");

    return strinput;
}

export function setNotesString(notes) {
    if (notesString != "") {
        notesString += ", ";
    }

    /* Handle first note separately to avoid trailing commas */
    var unicode_pitch = unicoder(notes[0].pitch);
    var unicode_length = unicoder(notes[0].length);
    if (unicode_pitch != "") {
        notesString += unicode_pitch + " ";
    }
    notesString += unicode_length;

    for (var i = 1; i < notes.length; i++) {
        unicode_pitch = unicoder(notes[i].pitch);
        unicode_length = unicoder(notes[i].length);

        notesString += ", ";
        if (unicode_pitch != "") {
            notesString += unicode_pitch + " ";
        }
        notesString += unicode_length;
    }
}

/* Due to a first-note dropping error, we schedule notes 1 measure in advance. */
export function countdownNotesUI() {
    if (countdown > 0) {
        notesUI.innerHTML = countdown-- + "...";
    }
}

export function setKey(tonic, scale) {
    var key = unicoder(tonic);
    document.getElementById("key-value").innerHTML = key + " " + scale.replace("_", " ");
}

export function setBPM(bpm) {
    document.getElementById("bpm-value").innerHTML = bpm;
}