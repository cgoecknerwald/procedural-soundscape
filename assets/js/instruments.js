export class Instrument {
  constructor(synth, volume) {
    this.synth = synth;
    this.synth.toMaster();
    this.synth.volume.value = volume;
  }
  triggerAttackRelease(note, duration, time) {
      this.synth.triggerAttackRelease(note, duration, time);
  }
}

/********************
        PADS
********************/

// Standard rounded synth feel
export class Tiny extends Instrument {
  constructor(volume = 10) {
    super(new Tone.PolySynth(6, Tone.Synth), volume);
    this.synth.set({
      harmonicity: 2,
      oscillator: {
        type: "amsine2",
        modulationType: "sine",
        harmonicity: 1.01
      },
      envelope: {
        attack: 0.006,
        decay: 4,
        sustain: 0.04,
        release: 1.2
      },
      modulation: {
        volume: 13,
        type: "amsine2",
        modulationType: "sine",
        harmonicity: 12
      },
      modulationEnvelope: {
        attack: 0.006,
        decay: 0.2,
        sustain: 0.2,
        release: 0.4
      }
    });

    this.synth.send("reverb", -12);
  }
}

// Harsh pluck, good sweep. Probably best for sweeping atmospheres
export class FM_ElectricCello extends Instrument {
  constructor(volume = 24) {
    super(new Tone.PolySynth(6, Tone.FMSynth), volume);
    this.synth.set({
      volume: 20,
      harmonicity: 3.01,
      modulationIndex: 14,
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.9,
        release: 1.2
      },
      modulation: {
        type: "square"
      },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.2,
        release: 0.1
      }
    });

    this.synth.send("reverb", -12);
  }
}

// Woodwind-esque attack and decay. 
export class SimpleSine extends Instrument {
  constructor(volume = 24) {
    super(new Tone.PolySynth(6, Tone.Synth), volume);
    this.synth.set({
      oscillator: {
        type: "fatsine"
      },
      envelope: {
        attack: 0.2,
        decay: 0.1,
        sustain: 1,
        release: 1
      },
      portamento: 0.2
    });

    this.synth.send("reverb", -12);
  }
}

// Harpsichordy
export class SoftSquareFm extends Instrument {
  constructor(volume = 8) {
    super(new Tone.PolySynth(6, Tone.Synth), volume);
    this.synth.set({
      oscillator: {
        type: "fmsquare2"
      },
      envelope: {
        attack: 0.2,
        decay: 0.1,
        sustain: 1,
        release: 1
      },
      portamento: 0
    });

    const filter = new Tone.Filter(400, "lowpass").toMaster();
    this.synth.send("reverb", -12);
    this.synth.connect(filter);
  }
}

// Synthy piano replacement
export class PossiblePiano extends Instrument {
  constructor(volume = 24) {
    super(new Tone.PolySynth(6, Tone.Synth), volume);
    this.synth.set({
      oscillator: {
        detune: 0,
        type: "custom",
        partials: [2, 1, 2, 2],
        phase: 0,
        volume: 0
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.2,
        release: 1,
      },
      portamento: 0.01,
      volume: -20
    });
  }
}

/********************
        DRUMS
********************/

export class OpenHat extends Instrument {
  constructor(volume = 10, frequency) {
    super(
      new Tone.MetalSynth({
        frequency: frequency
      }),
      volume
    );
  }
}

export class DampenedOpenHat extends Instrument {
  constructor(volume = 8, frequency) {
    super(
      new Tone.MetalSynth({
        frequency: frequency,
        modulationIndex: 32,
        resonance: 1000,
        octaves: 1.5
      }),
      volume
    );
  }
}

export class Shaker extends Instrument {
  constructor(volume = 5, frequency) {
    super(
      new Tone.MetalSynth({
        envelope: {
          attack: 0.1,
          decay: 0.4,
          release: 0.3
        },
        frequency: frequency,
        modulationIndex: 64,
        resonance: 3000,
        octaves: 1.5
      }),
      volume
    );
  }
}

/********************
      EFFECTS
********************/

// Goofy retro laser noise
export class Laser extends Instrument {
  constructor(volume = 28) {
    super(new Tone.MembraneSynth({ pitchDecay: 0.1 }), volume);
    var comp = new Tone.Compressor(-30, 12).toMaster();
    this.synth.connect(comp);
  }
}