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
/* Ref: https://github.com/wheelibin/synaesthesia/tree/master/src/synth/instruments */
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
    this.synth.volume.value = 5;
    this.synth.send("reverb", -12);
  }
}

export class SawTooth extends Instrument {
  constructor() {
    super(
      new Tone.Synth({
        oscillator: {
          type: "sawtooth"
        },
        envelope: {
          attack: 0.02,
          decay: 0.2,
          sustain: 0.8,
          release: 1
        }
      }),
      2
    );
  }
}