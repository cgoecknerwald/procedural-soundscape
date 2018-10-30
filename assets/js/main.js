(function() {

	// Strict mode changes previously accepted "bad syntax" into real errors.
	"use strict";
	
	// Note: Everything assumes 4/4 time
	var Tone = window.Tone;
	var leadLine = new Tone.Synth();
	leadLine.toMaster();
	var bassLine = new Tone.Synth();
	bassLine.toMaster();
	
	Tone.Transport.bpm.value = 80;
	
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
	
	// Note patterns and rhythm patterns to choose from
	var pitches = ["C4", "E4", "G4", "A4"];
	var rhythms =  [[4], [2, 2], [1, 1, 1, 1],
					[1, 1, 2], [1, 2, 1], [2, 1, 1],
					[1, 3], [3, 1]];
	
	// Create a full, half, or quarter measure of randomly-generated music.
	// Generate up to maxLength (in number of quarter notes) of music,
	// with given offset from the start of the measure.
	function createMeasure(maxLength, offset) {
		var rhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
		var notes = [];
		var totalTime = offset;
		
		// create a full, half, or quarter measure
		var multiplier = Math.floor(Math.random() * Math.log2(maxLength));
		multiplier = Math.pow(2, multiplier) / 4;
		console.log(multiplier);
		
		// determine note length, timing, & pitch, for each note in the rhythm
		for (var i = 0; i < rhythm.length; i++) {
			var pitch = pitches[i % pitches.length];
			var length = getNoteLength(rhythm[i] * multiplier)
			var time = getNoteTime(totalTime);
			totalTime += rhythm[i] * multiplier;
			notes.push({"time" : time, "pitch" : pitch, "length" : length});
		}
		
		new Tone.Part(function(time, value) {
			leadLine.triggerAttackRelease(value.pitch, value.length, time);
		}, notes).start("+0");
		
		// If a full measure hasn't been generated yet, generate the remaining part
		if (multiplier * 4 < maxLength) {
			createMeasure(maxLength - multiplier * 4, offset + multiplier * 4);
		}
	}

	// Randomize, one measure at a time
	var loop = new Tone.Loop(function() {
		createMeasure(4, 0);
	}, "1m").start(0);
	
	var baseLoop = new Tone.Loop(function() {
		bassLine.triggerAttackRelease("A3", "8n", "+0", 1);
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

	// Slider
	var slider = document.getElementById("slider");
	var output = document.getElementById("slider-value");
	output.innerHTML = slider.value;

	// Update the current slider value (each time you drag the slider handle)
	slider.oninput = function() {
	    output.innerHTML = this.value;
	} 
	
})();