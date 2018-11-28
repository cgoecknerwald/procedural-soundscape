import * as instruments from './instruments.js'
import * as chords from './chords.js'

// Choose a random entry from the array
function pickRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

// Note: Everything assumes 4/4 time
const Tone = window.Tone;
var leadLine = new instruments.Tiny();
var bassLine = new instruments.SimpleSine();

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
				
var currPitchIndex = 0, currOctave = 4;

var noteIndexUI = document.getElementById("note-index");
var notesUI = document.getElementById("notes");
var notesString = "";
var notesIndex = 0;

// Create a full, half, or quarter measure of randomly-generated music.
// Generate up to maxLength (in number of quarter notes) of music,
// with given offset from the start of the measure.
function createMeasure(maxLength, offset) {
	var rhythm = pickRandom(chords.rhythms);
	var notes = [];
	var totalTime = offset;
	
	// create a full, half, or quarter measure
	var sectionLength = Math.random() * (Math.log2(maxLength) + 1);
	sectionLength = Math.pow(2, Math.floor(sectionLength));
	// console.log(maxLength + " " + offset + " " + sectionLength);
	var multiplier = sectionLength / 4;
	
	// determine note length, timing, & pitch, for each note in the rhythm
	for (var i = 0; i < rhythm.length; i++) {
		// randomize pitch
		var pitchIndex, pitch, octave;
		do {
			var interval = pickRandom(chords.intervals);
			if (Math.random() > 0.5) {
				interval *= -1;
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
	
	new Tone.Part(function(time, value) {
		leadLine.triggerAttackRelease(value.pitch, value.length, time);
		noteIndexUI.innerHTML = ++notesIndex;
	}, notes).start("+0");
	
	// If a full measure hasn't been generated yet, generate the remaining part
	if (multiplier * 4 < maxLength) {
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

var baseLobassLineop = new Tone.Loop(function() {
	bassLine.triggerAttackRelease("G3", "8n", "+0", 1);
	bassLine.triggerAttackRelease("G3", "8n", "+4n", 0.5);
	bassLine.triggerAttackRelease("G3", "8n", "+2n", 0.5);
	bassLine.triggerAttackRelease("G3", "8n", "+2n.", 0.5);
}, "1m").start(0);

// Toggle audio button
document.getElementById("play-pause-button").addEventListener("click", function(){
    var audio = document.getElementById('testAudio');
	  if (this.className == 'is-playing') {
	  	// No longer playing
	    this.className = "";
	    // Replace fa-pause with fa-play icon
	    this.innerHTML = "<i class=\"fa fa-play\"></i>"
	    Tone.Transport.stop();
	  } else {
	  	// Now playing
	    this.className = "is-playing";
	    // Replace fa-play with fa-pause icon
	    this.innerHTML = "<i class=\"fa fa-pause\"></i>";
		Tone.Transport.start();
	  }
});