import * as synth_instruments from './instruments.js'
import * as rhythms from './rhythms.js'
import * as chords from './chords.js'
import * as UI from './main.js'

const chanceAscend = 0.5;
const chanceStartRun = 0.5;
const chanceEndRun = 0.7;
const chanceAscendRun = 0.5;
const chanceRepeat = 0.5;
const chanceRest = 0.3;

var tonic, scale;
export var scaleNotes;

// Should be called after init()
export function start() {
    Tone.Transport.start();
}

export function stop() {
    Tone.Transport.pause();
}

export function updateBPM() {
    var bpm = Math.floor(Math.random() * 9) * 5 + 80;
    Tone.Transport.bpm.value = bpm;
    UI.setBPM(bpm);
}

export function updateScale() {
    // Pick scale & key
    var tonicIndex = chords.pickRandomTonicIndex();
    tonic = chords.getPitchFromIndex(tonicIndex);
    var scaleType = chords.getRandomScaleType();
    var intervals = scaleType.intervals;
    scale = scaleType.type;

    scaleNotes = chords.generateAvailableNotes(tonicIndex, intervals, chords.minOctave, chords.maxOctave);
    UI.setKey(tonic, scale);
}

export function init() {
    var wav_suite = loadInstruments();
    updateBPM();
    updateScale();

    // Randomize melody, one measure at a time
    var loop = new Tone.Loop(function() {
        UI.resetNotesUI();
        createMeasure(4, 0, wav_suite["saxophone"]);
    }, "1m").start(0);

    // Simple bass loop
    var bassLoop = new Tone.Sequence(function(time, hit) {
        if (hit == 1) {
            wav_suite["bass-electric"].triggerAttackRelease(tonic + "3", "8n", "+1m");
        }
    }, rhythms.randomBassRhythm(), "4n").start(0);

    // One measure countdown before the melody starts
    var initialCountdown = new Tone.Loop(function() {
        UI.countdownNotesUI();
    }, "4n");
    initialCountdown.iterations = 4;
    initialCountdown.start(0);
}

function loadInstruments() {
    // Load instruments and start Tone
    var wav_suite = SampleLibrary.load({
        instruments: [
        "bass-electric",
        // "bassoon",
        // "cello",
        // "clarinet",
        // "contrabass",
        // "flute",
        // "french-horn",
        // "guitar-acoustic",
        // "guitar-electric",
        // "harmonium",
        // "harp",
        // "organ",
        // "piano",
        "saxophone",
        // "trombone",
        // "trumpet",
        // "tuba",
        // "violin",
        // "xylophone"
        ],
        baseUrl: "https://cgoecknerwald.github.io/procedural-soundscape/assets/samples/",
    });
    console.log("Loading tonejs-instruments...");
    Tone.Buffer.on("load", function() {
        console.log("Successfully loaded tonejs-instruments.");
        UI.loadPage();
        wav_suite["saxophone"].toMaster();
        wav_suite["bass-electric"].toMaster();
    });
    Tone.Buffer.on("error", function() {
        console.log("Error: failed to load tonejs-instruments.");
    });
    return wav_suite;
}

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

// Choose a random entry from the array
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Returns whether or not i is a valid index for array arr
function isValidIndex(i, arr) {
    return i >= 0 && i < arr.length;
}

// Create a full, half, or quarter measure of randomly-generated music.
// Generate up to maxLength (in number of quarter notes) of music,
// with given offset from the start of the measure.
function createMeasure(maxLength, offset, instrument) {
    // create a full, half, or quarter measure
    var sectionLength = Math.random() * Math.floor(Math.log2(maxLength) + 1);
    sectionLength = Math.pow(2, Math.floor(sectionLength));

    if (typeof createMeasure.availableNotes == 'undefined' || offset == 0) {
        createMeasure.availableNotes = scaleNotes;
    }
    var notes = generateNotes(pickRandom(chords.rhythms), offset, sectionLength / 4, createMeasure.availableNotes);

    // possibly repeat
    if (sectionLength * 2 <= maxLength && Math.random() < chanceRepeat) {
        var len = notes.length;
        for (var i = 0; i < len; i++) {
            var oldTime = notes[i].time;
            var newTime = oldTime.slice(0, 2) + (parseInt(oldTime[2]) + sectionLength);
            newTime += oldTime.slice(3);
            notes.push({"time": newTime, "pitch": notes[i].pitch, "length" : notes[i].length});
        }

        sectionLength *= 2;
    }

    UI.setNotesString(notes);

    new Tone.Part(function(time, value) {
        instrument.triggerAttackRelease(value.pitch, value.length, time);
        UI.emphasizeNote();
    }, notes).start("+1m");

    // If a full measure hasn't been generated yet, generate the remaining part
    if (sectionLength < maxLength) {
        createMeasure(maxLength - sectionLength, offset + sectionLength, instrument);
    }
}

function generateNotes(rhythm, totalTime, multiplier, availableNotes) {
    var notes = [];
    var isValidNotesIndex = (i) => isValidIndex(i, availableNotes);

    // initialize static variables
    if (typeof generateNotes.currPitchIndex == 'undefined') {
        generateNotes.currPitchIndex = Math.floor(availableNotes.length / 2);
    }
    if (typeof run == 'undefined') {
        generateNotes.run = false;
    }
    if (typeof runDirection == 'undefined') {
        generateNotes.runDirection = true;
    }

    // possibly start or stop a run
    if (generateNotes.run && Math.random() < chanceEndRun) {
        generateNotes.run = false;
    } else if (!generateNotes.run && Math.random() < chanceStartRun) {
        generateNotes.run = true;
        if (Math.random() < chanceAscendRun) {
            generateNotes.runDirection = true;
        } else {
            generateNotes.runDirection = false;
        }
    }

    // determine note length, timing, & pitch, for each note in the rhythm
    for (var i = 0; i < rhythm.length; i++) {
        // determine note length and timing
        var length = getNoteLength(rhythm[i] * multiplier)
        var time = getNoteTime(totalTime);
        totalTime += rhythm[i] * multiplier;

        // possibly rest
        if ((length == "2n" || length == "4n") && Math.random() < chanceRest) {
            notes.push({"time" : time, "pitch" : "", "length" : length});
            continue;
        }

        // randomize pitch
        var pitchIndex;
        if (generateNotes.run) {
            var interval = (generateNotes.runDirection ? 1 : -1);
            pitchIndex = generateNotes.currPitchIndex + interval;
            if (!isValidNotesIndex(pitchIndex)) {
                generateNotes.run = false;
            }
        }

        if (!generateNotes.run) {
            // generate all possible next notes, then randomly pick one of them
            var possibilities = [];
            chords.intervals.forEach(function(s) {
                var index = generateNotes.currPitchIndex + s;
                if (isValidNotesIndex(index)) {
                    possibilities.push(index);
                }

                index = generateNotes.currPitchIndex - s;
                if (isValidNotesIndex(index)) {
                    possibilities.push(index);
                }
            });
            pitchIndex = pickRandom(possibilities);
        }
        var pitch = availableNotes[pitchIndex];
        generateNotes.currPitchIndex = pitchIndex;

        notes.push({"time" : time, "pitch" : pitch, "length" : length});
    }
    return notes;
}