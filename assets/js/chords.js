// Pitch, intervals, and rhythm patterns to choose from
export const pitches = ["C", "D", "E", "F", "G", "A", "B"];
export const intervals = [0, 0, 1, 1, 1, 2, 2, 3];
export const rhythms =  [[4], [2, 2], [1, 1, 1, 1],
                        [1, 1, 2], [1, 2, 1], [2, 1, 1],
                        [1, 3], [3, 1]];
export const minOctave = 2, maxOctave = 4;

// From https://raw.githubusercontent.com/wheelibin/synaesthesia/master/src/synth/scales.js

const roots = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export const scales = {
  Major: [2, 2, 1, 2, 2, 2],
  Minor: [2, 1, 2, 2, 1, 2],
  Harmonic_Minor: [2, 1, 2, 2, 1, 3],
  Melodic_Minor: [2, 1, 2, 2, 2, 2],
  Pentatonic_Major: [2, 2, 3, 2],
  Pentatonic_Minor: [3, 2, 2, 3],
  Pentatonic_Blues: [3, 2, 1, 1],
  Pentatonic_Neutral: [2, 3, 2],
  Ionian: [2, 2, 1, 2, 2, 2],
  Aeolian: [2, 1, 2, 2, 1, 2],
  Dorian: [2, 1, 2, 2, 2, 1],
  Mixolydian: [2, 2, 1, 2, 2, 1],
  Phrygian: [1, 2, 2, 2, 1, 2],
  Lydian: [2, 2, 2, 1, 2, 2],
  Locrian: [1, 2, 2, 1, 2, 2],
  Dominant_7th: [2, 2, 1, 2, 2, 1],
  Blues: [3, 2, 1, 1, 3]
  //   Dimhalf: [1, 2, 1, 2, 1, 2],
  //   Dimwhole: [2, 1, 2, 1, 2, 1],
  //   Whole: [2, 2, 2, 2],
  //   Augmented: [3, 1, 3, 1],
  //   Chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //   RoumanianMinor: [2, 1, 3, 1, 2, 1],
  //   SpanishGypsy: [1, 3, 1, 2, 1, 2],
  //   Diatonic: [2, 2, 3, 2],
  //   DoubleHarmonic: [1, 3, 1, 2, 1, 3],
  //   EightToneSpanish: [1, 2, 1, 1, 1, 2, 2],
  //   Enigmatic: [1, 3, 2, 2, 2, 1],
  //   LeadingWholeTone: [2, 2, 2, 2, 1],
  //   LydianAugmented: [2, 2, 2, 2, 1, 2],
  //   NeopolitanMajor: [1, 2, 2, 2, 2, 2],
  //   NeopolitanMinor: [1, 2, 2, 2, 1, 2],
  //   Pelog: [1, 2, 3, 4],
  //   Prometheus: [2, 2, 2, 3, 1],
  //   PrometheusNeopolitan: [1, 3, 2, 3, 1],
  //   SixToneSymmetrical: [1, 3, 1, 3, 1],
  //   SuperLocrian: [1, 2, 1, 2, 2, 2],
  //   LydianMinor: [2, 2, 2, 1, 1, 2],
  //   LydianDiminished: [2, 1, 3, 1, 1, 2],
  //   NineToneScale: [2, 1, 1, 2, 1, 1, 1, 2],
  //   AuxiliaryDiminished: [2, 1, 2, 1, 2, 1, 2],
  //   AuxiliaryAugmented: [2, 2, 2, 2, 2],
  //   AuxiliaryDimBlues: [1, 2, 1, 2, 1, 2, 1],
  //   MajorLocrian: [2, 2, 1, 1, 2, 2],
  //   Overtone: [2, 2, 2, 1, 2, 1],
  //   DiminishedWholeTone: [1, 2, 1, 2, 2, 2],
  //   PureMinor: [2, 1, 2, 2, 1, 2]
};

export const chordProgressions = [
  [1, 5, 4, 4, 1, 5, 1, 5],
  [1, 1, 1, 1, 4, 4, 1, 1, 5, 5, 1, 1],
  [1, 6, 4, 5],
  [1, 4, 7, 4],
  [2, 5, 1],
  [1, 5, 7, 4],
  [6, 2, 5, 1],
  [1, 5, 6, 3],
  [1, 4, 2, 5],
  [1, 5, 6, 3, 4, 1, 4, 5]
];

const chords = [[1, 3, 5], [1, 3, 5, 7], [1, 3, 5, 9], [1, 3, 5, 7, 9], [1, 3, 5, 7, 9, 11]];


// USED OWN FUNCTIONS

export function pickRandomTonicIndex() {
    return Math.floor(Math.random() * roots.length);
}

export function getPitchFromIndex(index) {
    return roots[index];
}

export function generateAvailableNotes(tonicIndex, intervals, minOctave, maxOctave) {
    var scaleIndices = [tonicIndex];
    var noteIndex = tonicIndex;
    intervals.forEach(function(s) {
        noteIndex += s;
        if (noteIndex >= roots.length) {
            noteIndex -= roots.length;
        }
        scaleIndices.push(noteIndex);
    });
    
    var notes = [];
    var octave = minOctave;
    var prevPitch = tonicIndex;
    var currPitch = tonicIndex;
    var i = 0;
    while (octave <= maxOctave) {
        notes.push(roots[currPitch] + octave);
        
        // get next pitch
        i++;
        if (i >= scaleIndices.length) {
            i -= scaleIndices.length;
        }
        
        prevPitch = currPitch;
        currPitch = scaleIndices[i];
        if (currPitch < prevPitch) {
            octave++;
        }
    }
    
    return notes;
}


// USED WHEELIBIN FUNCTIONS

export const getRandomScaleType = () => {
  var keys = Object.keys(scales);
  var randomType = keys[(keys.length * Math.random()) << 0];
  return { type: randomType, intervals: scales[randomType] };
};


// CURRENTLY UNUSED WHEELIBIN FUNCTIONS

export const getRandomRootNote = () => {
  return roots[utils.randomIntBetween(0, roots.length - 1)];
};

export const actualNotesFromScale = (tonic, scale, lowOctave, highOctave) => {
  let notes = [];

  //Get just the note value without octaves
  if (!utils.isNumeric(tonic)) {
    tonic = tonic.replace(/[0-9]/g, "");
  } else {
    tonic = Tone.Frequency(tonic)
      .toNote()
      .replace(/[0-9]/g, "");
  }

  for (let octave = lowOctave; octave <= highOctave; octave++) {
    const octaveScale = scaleFromTonic(tonic + octave, scale);
    notes = [...notes, ...octaveScale];
  }
  return notes;
};

export const getChordProgressionForKey = (key, progression, chordTypesToUse) => {
  const progressionRootNotes = chordFromScale(progression, key.root, key.type, key.chordOctave);

  const progressionNotes = [];
  for (let index = 0; index < progressionRootNotes.length; index++) {
    const progressionIndex = progression[index];
    const chord = chordTypesToUse[index];
    progressionNotes.push(chordFromScale(chord, key.root, key.type, key.chordOctave, progressionIndex));
  }
  return progressionNotes;
};

export const getRandomChordTypesForProgression = progressionRootNotes => {
  const chordTypes = [];
  for (let index = 0; index < progressionRootNotes.length; index++) {
    chordTypes.push(utils.randomFromArray(chords));
  }
  return chordTypes;
};

export const chordFromScale = (chordToneIndexes, tonic, scale, mainOctave, indexOffset = 0) => {
  const fullScale = actualNotesFromScale(tonic, scale, mainOctave, mainOctave + 1);

  const filteredScale = [];
  for (const index of chordToneIndexes) {
    filteredScale.push(fullScale[index + indexOffset - 1]);
  }

  return filteredScale;
};

export const scaleFromTonic = (tonic, intervals) => {
  const scale = [];
  let note = Tone.Frequency(tonic);
  scale.push(tonic);

  for (const interval of intervals) {
    note = note.transpose(interval);
    scale.push(note.toFrequency());
  }

  return scale;
};

export const rootNotesFromChordProgression = chordProgression => {
  return chordProgression
    .map(chord =>
      Tone.Frequency(chord[0])
        .toNote()
        .replace(/[0-9]/g, "")
    )
    .join(", ");
};

export const bassLineForChordProgression = (notesPerChord, chordProgression, key, octave) => {
  const transposeSemiTones = -1 * octave * 12;
  const notes = [];

  for (let i = 0; i < chordProgression.length; i++) {
    const chord = chordProgression[i];
    const noteCountForChord = notesPerChord[i];
    const chordRoot = Tone.Frequency(chord[0]).transpose(transposeSemiTones);
    const scaleForCurrentChord = actualNotesFromScale(key.root, key.type, octave, octave);

    const notesForChord = [chordRoot];
    for (let i = 0; i < noteCountForChord - 1; i++) {
      notesForChord.push(utils.randomFromArray(scaleForCurrentChord));
    }
    notes.push(notesForChord);
  }

  return notes;
};

export const smoothBassLineForChordProgression = (notesPerChord, chordProgression, key, octave) => {
  const transposeSemiTones = -1 * octave * 12;
  const notes = [];

  for (let i = 0; i < chordProgression.length; i++) {
    const chord = chordProgression[i];
    const noteCountForChord = notesPerChord[i];
    const chordRoot = Tone.Frequency(chord[0]).transpose(transposeSemiTones);
    const scaleForCurrentChord = actualNotesFromScale(key.root, key.type, octave, octave);

    const notesForChord = [chordRoot];
    let previousNoteIndex = 0;
    for (let i = 0; i < noteCountForChord - 1; i++) {
      //get a note not too far away from the last
      const newNote = utils.randomIntBetween(Math.max(previousNoteIndex - 2, 0), Math.min(previousNoteIndex + 2, scaleForCurrentChord.length));
      notesForChord.push(scaleForCurrentChord[newNote]);

      previousNoteIndex = newNote;
    }
    notes.push(notesForChord);
  }

  return notes;
};

export const motifForChordProgression = (notesPerChord, chordProgression, key, octave) => {
  const notes = [];

  for (let i = 0; i < chordProgression.length; i++) {
    const noteCountForChord = notesPerChord[i];
    const scaleForCurrentChord = actualNotesFromScale(key.root, key.type, octave, octave);
    const notesForChord = [];
    let previousNoteIndex = 0;
    for (let i = 0; i < noteCountForChord; i++) {
      //get a note not too far away from the last
      const newNote = utils.randomIntBetween(Math.max(previousNoteIndex - 2, 0), Math.min(previousNoteIndex + 2, scaleForCurrentChord.length));
      notesForChord.push(scaleForCurrentChord[newNote]);

      previousNoteIndex = newNote;
    }
    notes.push(notesForChord);
  }

  return notes;
};

export const melodyForChordProgression = (chordProgression, key) => {
  //const notesPerChord = 8;
  const melodyOctave = key.chordOctave + 1;
  const transposeSemiTones = melodyOctave - key.chordOctave * 12;
  const notes = [];

  for (const chord of chordProgression) {
    const chordRoot = Tone.Frequency(chord[0]).transpose(transposeSemiTones);
    const chordRootToNote = Tone.Frequency(chordRoot).toNote();

    const scaleForCurrentChord = actualNotesFromScale(chordRootToNote, key.type, melodyOctave, melodyOctave);
    const notesForChord = [chordRootToNote];

    notesForChord.push(scaleForCurrentChord[1]);
    notesForChord.push(scaleForCurrentChord[2]);
    notesForChord.push(scaleForCurrentChord[1]);
    notesForChord.push(scaleForCurrentChord[4]);
    notesForChord.push(scaleForCurrentChord[4]);
    notesForChord.push(scaleForCurrentChord[2]);
    notesForChord.push(scaleForCurrentChord[0]);

    notes.push(notesForChord);
  }

  return notes;
};

// From https://github.com/wheelibin/synaesthesia/blob/master/src/synth/keys.js

export const keyFromTonicAndScale = (tonic, scale, lowOctave, highOctave) => {
  let notes = [];
  for (let octave = lowOctave; octave <= highOctave; octave++) {
    const octaveScale = scales.scaleFromTonic(tonic + octave, scale);
    notes = [...notes, ...octaveScale];
  }
  return notes;
};