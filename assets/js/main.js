(function() {

	// Strict mode changes previously accepted "bad syntax" into real errors.
	"use strict";
	
	// Note: Everything assumes 4/4 time
	var Tone = window.Tone;
	var synth = new Tone.Synth();
	synth.toMaster();
	
	Tone.Transport.bpm.value = 80;
	
	// Converts input note length from a float (1 = quarter, 0.5 = eighth, etc.)
	// to Tone's string format ("4n", "8n", etc.).
	// For now, can only handle non-dotted and non-triplet notes.
	function getNoteLength(length) {
		var exp = Math.log2(length);
		if (exp % 1 == 0 && length < 4) {
			return Math.pow(2, -exp + 2) + "n";
		} else if (length % 4 == 0) {
			return Math.floor(length / 4) + "m";
		} else {
			throw new Error("invalid note length");
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
	
	var pitches = ["C4", "E4", "", "G4", "A4"];
	var rhythms = [[2, 1, 0.5, 0.5], [0.5, 0.5, 1, 1, 1]];
	
	function createMeasure(rhythm) {
		var notes = [];
		var totalTime = 0;
		for (var i = 0; i < rhythm.length; i++) {
			var pitch = pitches[i % pitches.length];
			var length = getNoteLength(rhythm[i]);
			var time = getNoteTime(totalTime);
			totalTime += rhythm[i];
			notes.push({"time" : time, "pitch" : pitch, "length" : length});
		}
		new Tone.Part(function(time, value) {
			synth.triggerAttackRelease(value.pitch, value.length, time);
		}, notes).start("+0");
	}

	var loop = new Tone.Loop(function() {
		createMeasure(rhythms[Math.floor(Math.random() * rhythms.length)]);
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