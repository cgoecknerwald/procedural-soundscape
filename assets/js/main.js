(function() {

	// Strict mode changes previously accepted "bad syntax" into real errors.
	"use strict";

	var Tone = window.Tone;
	var synth = new Tone.Synth();
	synth.toMaster();
	
	var pitches = ["C4", "E4", "G4", "A4"];
	var rhythms = [["0", "0:2", "0:3:2"], ["0", "0:0:2", "0:1", "0:2", "0:3"]];
	
	function createMeasure(rhythm) {
		var notes = [];
		for (var i = 0; i < rhythm.length; i++) {
			notes.push([rhythm[i] , pitches[i % pitches.length]]);
		}
		new Tone.Part(function(time, note) {
			synth.triggerAttackRelease(note, "8n", time);
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