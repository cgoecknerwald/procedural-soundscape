(function() {

	// Strict mode changes previously accepted "bad syntax" into real errors.
	"use strict";

	// Tone.js example arpeggio
	var Tone = window.Tone;
	var synth = new Tone.Synth();
	synth.toMaster();
	var pattern = new Tone.Pattern(function(time, note) {
		synth.triggerAttackRelease(note, 0.25);
	}, ["C4", "E4", "G4", "A4"]);

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
		    pattern.start(0);
			Tone.Transport.start();
		  }
	});
	
})();