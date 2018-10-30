(function() {

	// Strict mode changes previously accepted "bad syntax" into real errors.
	"use strict";

	var Tone = window.Tone;
	var synth = new Tone.Synth();
	synth.toMaster();
	
	var i = 0;
	var rhythms = [
		function() {new Tone.Part(function(time, note) {
			synth.triggerAttackRelease(note, "8n", time);
		}, [[0, "C3"], ["0:2", "C4"], ["0:3:2", "G3"]]).start("+0");},
		function() {new Tone.Part(function(time, note) {
			synth.triggerAttackRelease(note, "8n", time);
		}, [["0:1", "E3"], ["0:2", "E4"], ["0:3:2", "G3"]]).start("+0");}
	];

	var loop = new Tone.Loop(function() {
		rhythms[i]();
		i++;
		i %= rhythms.length;
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
	var output = document.getElementById("slider-value");
	output.innerHTML = Tone.Transport.bpm.value;

	// Update the current slider value (each time you drag the slider handle)
	slider.oninput = function() {
	   output.innerHTML = this.value;
	} 
	
})();