var wave;
var currentFreq;
var currentKey;

var noteMap = {
  'Z': 4,
  'S': 5,
  'X': 6,
  'D': 7,
  'C': 8,
  'V': 9,
  'G': 10,
  'B': 11,
  'H': 12,
  'N': 13,
  'J': 14,
  'M': 15,
  0xBC: 16, // ','
  'L': 17,
  0xBE: 18, // '.'
  0xBA: 19, // ';'
  0xBF: 20, // '/'
  'Q': 16,
  '2': 17,
  'W': 18,
  '3': 19,
  'E': 20,
  'R': 21,
  '5': 22,
  'T': 23,
  '6': 24,
  'Y': 25,
  '7': 26,
  'U': 27,
  'I': 28,
  '9': 29,
  'O': 30,
  '0': 31,
  'P': 32,
  0xDB: 33, // '['
  0xDD: 35 // ']'
};
var waveMap = {};

var octave = 4;
var currentAmp = 0.6;
var active = false;
var normalOctave = true;
var bgColor;

function setup() {
  createCanvas(512, 200);
  cursor(CROSS);
  bgColor = Math.floor(map(currentAmp, 0, 1, 0, 64));
  wave = new p5.TriOsc();
  wave.amp(0);
  wave.start();
  
  waveMap[LEFT_ARROW] = p5.SinOsc;
  waveMap[DOWN_ARROW] = p5.TriOsc;
  waveMap[RIGHT_ARROW] = p5.SawOsc;
  waveMap[UP_ARROW] = p5.SqrOsc;
  waveMap[SHIFT] = p5.Pulse;
  
  stroke(255);
}

function draw() {
  background(bgColor);
  // stroke(127);
  // for (int i = 0; i < bufferSize - 1; i++) {
    // float x1 = map(i, 0, bufferSize, 0, width);
    // float x2 = map(i + 1, 0, bufferSize, 0, width);
    // line(x1, 50 + out.left.get(i) * 50, x2, 50 + out.left.get(i + 1) * 50);
    // line(x1, 150 + out.right.get(i) * 50, x2, 150 + out.right.get(i + 1) * 50);
  // }
  
  text("Hz: " + currentFreq, 5, 15);
  text("Octave: " + octave, 5, 30);
  text("Press z-/ and q-] to play notes (z and q are C). Accidentals are on the row above.", 5, height - 55);
  text("Press + and - to change octaves. Hold \\ to toggle octaves mid-note.", 5, height - 40);
  text("Move your mouse to control the volume (right is louder).", 5, height - 25);
  text("Use the arrow keys, and shift to pick a waveform.", 5, height - 10);
}

function keyPressed() {
  var noteNum = noteMap[keyCode >= 0x30 && keyCode <= 0x5A ? key : keyCode];
  if (key !== currentKey && noteNum !== undefined) {
    currentFreq = toHz(noteNum);
    wave.freq(currentFreq);
    wave.amp(currentAmp);
    active = true;
    currentKey = key;
  } else if (keyCode === 0xDC && normalOctave) { // '\\'
    octave += 1;
    currentFreq *= 2;
    wave.freq(currentFreq);
    normalOctave = false;
  } else if (keyCode === 0xBB) { // '='
    octave += 1;
    if (octave > 38) {
      octave = 38;
    }
  } else if (keyCode === 0xBD) { // '-'
    octave -= 1;
    if (octave < 0) {
      octave = 0;
    }
  }
}

function keyReleased() {
  if (key === currentKey) {
    wave.amp(0.0);
    active = false;
    currentKey = '';
  } else if (keyCode === 0xDC) { // '\\'
    octave -= 1;
    currentFreq /= 2;
    wave.freq(currentFreq);
    normalOctave = true;
  } else {
    var WaveType = waveMap[keyCode];
    if (WaveType !== undefined) {
      wave.stop();
      wave = new WaveType(currentFreq);
      if (key === '5') {
        wave.width(0.25);
      }
      if (active) {
        wave.amp(currentAmp);
      } else {
        wave.amp(0);
      }
      wave.start();
    }
  }
}

function mouseMoved() {
  currentAmp = constrain(map(mouseX, 0.0, width, 0.0, 1.0), 0, 1);
  bgColor = Math.floor(map(currentAmp, 0, 1, 0, 64));
  if (active) {
    wave.amp(currentAmp, 0.01);
  }
}

function toHz(noteNum) {
  var octNote = noteNum + 12 * (octave - 1);
  var freq = pow(2.0, (octNote - 49.0) / 12.0) * 440.0;
  return freq;
}
