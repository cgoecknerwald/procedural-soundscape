import * as music from './music.js'

var backgroundInitialized = false;
var backgroundImageIndex = -1;
var noteIndexUI = document.getElementById("note-bar1");
var notesUI = document.getElementById("note-bar2");
var notesString = "";
var notesIndex = 0;

// Initialize music
music.init();

// Select random background on update-background button press.
document.getElementById("update-background").addEventListener("click", function(){
    console.log("Update background button toggled.");
    updateBackground();
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
        this.className = "";
        // Replace fa-pause with fa-play icon
        this.innerHTML = "<i class=\"fa fa-play\"></i>"
        music.stop();
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

// Display BPM
document.getElementById("bpm-value").innerHTML = Tone.Transport.bpm.value;

export function updateNoteIndex() {
    noteIndexUI.innerHTML = ++notesIndex;
}

export function resetNotesUI() {
    notesUI.innerHTML = notesString;
    notesString = "";
    notesIndex = 0;
}

export function setNotesString(notes) {
    notes.forEach(function(note) {
        notesString += note.pitch + " " + note.length + ", ";
    });
}