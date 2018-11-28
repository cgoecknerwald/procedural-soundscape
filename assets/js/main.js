import * as synth_instruments from './instruments.js'
import * as chords from './chords.js'

// Choose a random entry from the array
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Note: Everything assumes 4/4 time
const Tone = window.Tone;
var wav_suite = SampleLibrary.load({
    instruments: [
    "bass-electric",
    "bassoon",
    "cello",
    "clarinet",
    "contrabass",
    "flute",
    "french-horn",
    "guitar-acoustic",
    "guitar-electric",
    "harmonium",
    "harp",
    "organ",
    "piano",
    "saxophone",
    "trombone",
    "trumpet",
    "tuba",
    "violin",
    "xylophone"
    ]});
    
// must call .toMaster() on all instruments
wav_suite["piano"].toMaster();
wav_suite["saxophone"].toMaster();

Tone.Transport.bpm.value = 100;

// Converts input note length from a float (1 = quarter, 0.5 = eighth, etc.)
// to Tone's string format ("4n", "8n", etc.).
// Cannot handle triplet notes or double dots.
function getNoteLength(length) {
    var exp = Math.log2(length);
    if (exp % 1 == 0 && length < 4) {
        return Math.pow(2, -exp + 2) + "n";
    } else if (length % 4 == 0) {
        return Math.floor(length / 4) + "m";
    } else { // assume dotted
        return getNoteLength(2 * length / 3) + ".";
    }
}

// Converts input time from a float (0 as start of measure, 1 as first quarter)
// to Tone's bars:quarters:sixteenths format.
function getNoteTime(time) {
    var bars = Math.floor(time / 4);
    var quarters = Math.floor(time - bars);
    var sixteenths = (time - bars - quarters) * 4;
    return bars + ":" + quarters + ":" + sixteenths;
}
const chanceAscend = 0.5;
const chanceStartRun = 0.5;
const chanceEndRun = 0.7;
const chanceAscendRun = 0.5;
                
var currPitchIndex = 0, currOctave = 4;

var noteIndexUI = document.getElementById("note-index");
var notesUI = document.getElementById("notes");
var notesString = "";
var notesIndex = 0;
var run = false;
var runDirection = true; // true = up;

function generateNotes(rhythm, totalTime, multiplier) {
    var notes = [];
    
    // determine note length, timing, & pitch, for each note in the rhythm
    for (var i = 0; i < rhythm.length; i++) {
        // randomize pitch
        var pitchIndex, pitch, octave;
        do {
            var interval;
            if (run) {
                interval = (runDirection ? 1 : -1);
            } else {
                interval = pickRandom(chords.intervals);
                if (Math.random() > chanceAscend) {
                    interval *= -1;
                }
            }
            
            pitchIndex = currPitchIndex + interval;
            octave = currOctave;
            if (pitchIndex < 0) {
                pitchIndex += chords.pitches.length;
                octave--;
            } else if (pitchIndex >= chords.pitches.length) {
                pitchIndex -= chords.pitches.length;
                octave++;
            }
            pitch = chords.pitches[pitchIndex] + octave;
            
            if ((octave < chords.minOctave || octave > chords.maxOctave) && run) {
                // stay on the same note for runs that go out of bounds
                pitch = chords.pitches[currPitchIndex] + currOctave;
                octave = currOctave;
                pitchIndex = currPitchIndex;
            }
        } while (octave < chords.minOctave || octave > chords.maxOctave);
        currPitchIndex = pitchIndex;
        currOctave = octave;
        
        // determine note length and timing
        var length = getNoteLength(rhythm[i] * multiplier)
        var time = getNoteTime(totalTime);
        totalTime += rhythm[i] * multiplier;
        
        if (pitch != "") {
            notes.push({"time" : time, "pitch" : pitch, "length" : length});
            notesString += pitch + " " + length + ", ";
        }
        // console.log(time + " " + pitch + " " + length);
    }
    return notes;
}

// Create a full, half, or quarter measure of randomly-generated music.
// Generate up to maxLength (in number of quarter notes) of music,
// with given offset from the start of the measure.
function createMeasure(maxLength, offset) {
    // create a full, half, or quarter measure
    var sectionLength = Math.random() * Math.floor(Math.log2(maxLength) + 1);
    sectionLength = Math.pow(2, Math.floor(sectionLength));
    // console.log(maxLength + " " + offset + " " + sectionLength);
    
    if (run && Math.random() < chanceEndRun) {
        run = false;
        //console.log("run finished");
    } else if (!run && Math.random() < chanceStartRun) {
        run = true;
        if (Math.random() < chanceAscendRun) {
            runDirection = true;
            //console.log("start upwards run");
        } else {
            runDirection = false;
            //console.log("start downwards run");
        }
    }
    
    var notes = generateNotes(pickRandom(chords.rhythms), offset, sectionLength / 4);
    new Tone.Part(function(time, value) {
        wav_suite["saxophone"].triggerAttackRelease(value.pitch, value.length, time);
        noteIndexUI.innerHTML = ++notesIndex;
    }, notes).start("+0");
    
    // If a full measure hasn't been generated yet, generate the remaining part
    if (sectionLength < maxLength) {
        createMeasure(maxLength - sectionLength, offset + sectionLength);
    }
}

// Randomize, one measure at a time
var loop = new Tone.Loop(function() {
    createMeasure(4, 0);
    notesUI.innerHTML = notesString;
    notesString = "";
    notesIndex = 0;
}, "1m").start(0);

var bassLoop = new Tone.Loop(function() {
    wav_suite["piano"].triggerAttackRelease("G3", "8n", "+0", 1);
    wav_suite["piano"].triggerAttackRelease("G3", "8n", "+4n", 0.5);
    wav_suite["piano"].triggerAttackRelease("G3", "8n", "+2n", 0.5);
    wav_suite["piano"].triggerAttackRelease("G3", "8n", "+2n.", 0.5);
}, "1m").start(0);

// Select random background on update-background button press.
document.getElementById("update-background").addEventListener("click", function(){
    console.log("Update background button toggled.");
    const num_backgrounds = 38;
    // Returns integers [0, num_backgrounds - 1] (assumes 0-indexing of backgrounds)
    var rand = Math.floor(Math.random() * num_backgrounds);
    var new_bkg = "../backgrounds/bkg" + rand.toString() + ".jpg";
    console.log("New background: " + new_bkg);
    document.body.style.backgroundImage = "url(\'" + new_bkg + "\'";
    console.log(document.body.style.backgroundImage);
});

// <body onload="setbackground();">

// Toggle audio button
document.getElementById("play-pause-button").addEventListener("click", function(){
    console.log("Play-pause button toggled.");
    var audio = document.getElementById('testAudio');
    if (this.className == 'is-playing') {
        // No longer playing
        this.className = "";
        // Replace fa-pause with fa-play icon
        this.innerHTML = "<i class=\"fa fa-play\"></i>"
        Tone.Transport.stop();
    } 
    else {
        // Now playing
        this.className = "is-playing";
        // Replace fa-play with fa-pause icon
        this.innerHTML = "<i class=\"fa fa-pause\"></i>";
        Tone.Transport.start();
    }
});