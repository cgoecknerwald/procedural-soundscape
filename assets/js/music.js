import * as synth_instruments from './instruments.js'
import * as rhythms from './rhythms.js'
import * as chords from './chords.js'
import * as UI from './main.js'

const chanceAscend = 0.5;
const chanceStartRun = 0.5;
const chanceEndRun = 0.7;
const chanceAscendRun = 0.5;
const chanceRepeat = 0.5;

var tonic, scale;

// Should be called after init()
export function start() {
    window.Tone.Transport.start();
    UI.setKey(tonic, scale);
}

export function stop() {
    window.Tone.Transport.pause();
}

export function init() {
    // Note: Everything assumes 4/4 time
    const Tone = window.Tone;
    
    // Initialize scale & key
    var tonicIndex = chords.pickRandomTonicIndex();
    tonic = chords.getPitchFromIndex(tonicIndex);
    var scaleType = chords.getRandomScaleType();
    var intervals = scaleType.intervals;
    scale = scaleType.type;
    //console.log(tonicIndex + " " + intervals);
    var availableNotes = chords.generateAvailableNotes(tonicIndex, intervals, chords.minOctave, chords.maxOctave);
    //console.log(availableNotes);
                    
    var run = false;
    var runDirection = true;
    var currPitchIndex = Math.floor(availableNotes.length / 2);
    
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
    
    function isValidIndex(i, arr) {
        return i >= 0 && i < arr.length;
    }

    function generateNotes(rhythm, totalTime, multiplier) {
        var notes = [];
        var isValidNotesIndex = (i) => isValidIndex(i, availableNotes);
        
        // determine note length, timing, & pitch, for each note in the rhythm
        for (var i = 0; i < rhythm.length; i++) {
            // randomize pitch
            var pitchIndex;
            if (run) {
                var interval = (runDirection ? 1 : -1);
                pitchIndex = currPitchIndex + interval;
                if (!isValidNotesIndex(pitchIndex)) {
                    run = false;
                }
            }
            
            if (!run) {
                // generate all possible next notes, then randomly pick one of them
                var possibilities = [];
                chords.intervals.forEach(function(s) {
                    var index = currPitchIndex + s;
                    if (isValidNotesIndex(index)) {
                        possibilities.push(index);
                    }
                    
                    index = currPitchIndex - s;
                    if (isValidNotesIndex(index)) {
                        possibilities.push(index);
                    }
                });
                pitchIndex = pickRandom(possibilities);
            }
            var pitch = availableNotes[pitchIndex];
            currPitchIndex = pitchIndex;
            
            // determine note length and timing
            var length = getNoteLength(rhythm[i] * multiplier)
            var time = getNoteTime(totalTime);
            totalTime += rhythm[i] * multiplier;
            
            notes.push({"time" : time, "pitch" : pitch, "length" : length});
            //console.log(time + " " + pitch + " " + length);
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
        
        if (run && Math.random() < chanceEndRun) {
            run = false;
        } else if (!run && Math.random() < chanceStartRun) {
            run = true;
            if (Math.random() < chanceAscendRun) {
                runDirection = true;
                // console.log("start upwards run");
            } else {
                runDirection = false;
                // console.log("start downwards run");
            }
        }
        
        var notes = generateNotes(pickRandom(chords.rhythms), offset, sectionLength / 4);
        
        // possibly repeat
        if (sectionLength * 2 <= maxLength && Math.random() < chanceRepeat) {
            // console.log("repeat " + sectionLength);
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
            wav_suite["saxophone"].triggerAttackRelease(value.pitch, value.length, time);
            // console.log("Updating note index.");
            UI.updateNoteIndex();
        }, notes).start("+1m");
        
        // If a full measure hasn't been generated yet, generate the remaining part
        if (sectionLength < maxLength) {
            createMeasure(maxLength - sectionLength, offset + sectionLength);
        }
    }

    // Load instruments and start Tone
    var wav_suite = SampleLibrary.load({
        instruments: [
        "bass-electric",
        //"bassoon",
        //"cello",
        //"clarinet",
        //"contrabass",
        //"flute",
        //"french-horn",
        //"guitar-acoustic",
        //"guitar-electric",
        //"harmonium",
        //"harp",
        //"organ",
        //"piano",
        "saxophone",
        //"trombone",
        //"trumpet",
        //"tuba",
        //"violin",
        //"xylophone"
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
    
    //var openhat = new synth_instruments.OpenHat(8, Tone.Frequency(tonic + "2").toFrequency());
    //var shaker = new synth_instruments.Shaker(8, Tone.Frequency(tonic + "2").toFrequency());
    Tone.Transport.bpm.value = 100;

    // Randomize, one measure at a time
    var loop = new Tone.Loop(function() {
        UI.resetNotesUI();
        createMeasure(4, 0);
        // console.log("Updating notes.");
    }, "1m").start(0);
    
    var bassLoop = new Tone.Sequence(function(time, hit) {
        if (hit == 1) {
            wav_suite["bass-electric"].triggerAttackRelease(tonic + "3", "8n");
        }
    }, rhythms.randomBassRhythm(), "4n").start("1m");
    
    var initialCountdown = new Tone.Loop(function() {
        UI.countdownNotesUI();
        //console.log("countdown");
    }, "4n");
    initialCountdown.iterations = 4;
    initialCountdown.start(0);
    
    /*var openhatLoop = new Tone.Sequence(function(time, hit) {
        if (hit == 1) {
            openhat.triggerAttackRelease("16n", time);
        }
    }, rhythms.randomOpenHatRythym(), "16n");
    openhatLoop.loop = true;
    openhatLoop.start(0);
    
    var shakerLoop = new Tone.Sequence(function(time, hit) {
        if (hit == 1) {
            shaker.triggerAttackRelease("16n", time);
        }
    }, rhythms.randomShakerRythym(), "16n");
    shakerLoop.loop = true;
    shakerLoop.start(0);*/
        
}