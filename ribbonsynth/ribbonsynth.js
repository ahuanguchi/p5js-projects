var wave;
var note;
var frequency;
var volume;
var noteWidth;

var waveMap = {
  '1': p5.SinOsc,
  '2': p5.TriOsc,
  '3': p5.SawOsc,
  '4': p5.SqrOsc,
  '5': p5.Pulse
};

var numNotes = 88;
var quantize = true;
var active = false;
var octave = false;
var recording = false;
var light = 95;
var stripes = [light, 0, light, light, 0, light, 0, light, light, 0, light, 0];

function setup() {
  createCanvas(windowWidth < 1000 ? windowWidth : 1000, 200);
  cursor(CROSS);
  wave = new p5.TriOsc();
  wave.amp(0);
  wave.start();
  noteWidth = width / numNotes;
}

function draw() {
  var i;
  stroke(159, 0, 0);
  if (mouseIsPressed) {
    note = map(mouseX, 0.0, width, 1.0, numNotes + 1.0);
    if (quantize) {
      note = floor(note);
    }
    if (octave) {
      note += 12.0;
    }
    frequency = pow(2.0, (note - 49.0) / 12.0) * 440.0;
    wave.freq(frequency, quantize ? 0 : 0.02);
    volume = map(mouseY, 0.0, height, 1.0, 0.0)
    wave.amp(volume, 0.01);
  }
  for (i = 0; i < numNotes; i += 1) {
    fill(stripes[i % 12]);
    rect(i * noteWidth, -1, noteWidth, height + 1);
  }
  stroke(255); // instead of fill
  text("Note #: " + note, 10, 20);
  text("Hz: " + frequency, 10, 40);
}

function mouseReleased() {
  wave.amp(0.0);
}

function keyPressed() {
  switch (key) {
  case 'O':
    octave = true;
    break;
  default:
    break;
  }
}

function keyReleased() {
  switch (key) {
  case 'O':
    octave = false;
    break;
  case 'Q':
    quantize = !quantize;
    break;
  default:
    var WaveType = waveMap[key];
    if (WaveType !== undefined) {
      wave.stop();
      wave = new WaveType();
      if (key === '5') {
        wave.width(0.25);
      }
      wave.amp(0);
      wave.start();
    }
    break;
  }
}
