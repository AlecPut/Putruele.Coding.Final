
import MultibandCompressor, { setupCompressorControls } from "./Effects/MultibandComp.js";



let audioCtx = new AudioContext();
let sourceNode, audioBuffer;

let  compressor;
let effectsInitialized = false;

// UI Elements
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");

// File Loading
document.getElementById("audio-file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function () {
      audioCtx.decodeAudioData(reader.result, function (buffer) {
        audioBuffer = buffer;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
      });
    };
  }
});

// Init Effects Chain (just once)
function initEffects() {
  
  compressor = new MultibandCompressor(audioCtx);
// chain: Audio File -> MultibandCompressor -> output
  compressor.connect(audioCtx.destination);
    effectsInitialized = true;

  setupCompressorControls(compressor);


}

// Play Logic
function playAudio() {
  audioCtx.resume();
  if (!effectsInitialized) {
    initEffects();
  }

  if (sourceNode) {
    sourceNode.stop();
  }

  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = audioBuffer;


  sourceNode.connect(compressor.input);
  sourceNode.start();

  playBtn.disabled = true;
  pauseBtn.disabled = false;
}

// Pause Logic
function pauseAudio() {
  if (sourceNode) {
    sourceNode.stop();
    sourceNode = null;
  }

  playBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Event Listeners
playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);