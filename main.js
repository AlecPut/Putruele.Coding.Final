
import Equalizer from "./Effects/Equalizaer";
import MultibandCompressor from "./Effects/MultibandComp";
import StereoWidening from "./Effects/StereoWidening";
import Limiting from "./Effects/Limiting";
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let sourceNode, audioBuffer;
let eq, compressor, stereo, limiter;

// Get UI elements
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");

// Load User Audio File
document.getElementById("audio-file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function () {
      audioCtx.decodeAudioData(reader.result, function (buffer) {
        audioBuffer = buffer; // Store audio buffer for playback
        playBtn.disabled = false; // Enable play button
        pauseBtn.disabled = true; // Pause should be disabled until playing
      });
    };
  }
});

// Function to Play Audio
function playAudio() {
  if (sourceNode) {
    sourceNode.stop(); // Stop existing playback
  }

  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = audioBuffer;

  // Initialize Effects on first play
  if (!compressor) {
    eq = new Equalizer(audioCtx);
    compressor = new MultibandCompressor(audioCtx);
    stereo = new StereoWidener(audioCtx);
    limiter = new Limiter(audioCtx);

    eq.connect(compressor.input);
    compressor.connect(stereo.input);
    stereo.connect(limiter.input);
    limiter.connect(audioCtx.destination);
  }

  // Connect source to effects chain
  sourceNode.connect(eq.input);
  sourceNode.start();

  playBtn.disabled = true;
  pauseBtn.disabled = false;
}

// Function to Stop Audio
function pauseAudio() {
  if (sourceNode) {
    sourceNode.stop(); // Stop playback
    sourceNode = null;
  }

  playBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Attach play/pause event listeners
playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);