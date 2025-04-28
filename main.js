
import MultibandCompressor, { setupCompressorControls, updateValue } from "./Effects/MultibandComp.js";



let audioCtx = new AudioContext();
let sourceNode, audioBuffer;

let  compressor;
let effectsInitialized = false;

// UI Elements
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");

//File Loading
document.getElementById("audio-file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith("audio/")) {
      console.error("Selected file is not an audio file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function () {
      audioCtx.decodeAudioData(
        reader.result,
        function (buffer) {
          // Successfully decoded audio data
          audioBuffer = buffer;
          console.log("Audio file successfully loaded into buffer.");
          playBtn.disabled = false; // Enable play button
          pauseBtn.disabled = true; // Disable pause button
        },
        function (error) {
          // Error decoding audio data
          console.error("Error decoding audio data:", error);
        }
      );
    };

    reader.onerror = function () {
      console.error("Error reading the file:", reader.error);
    };
  } else {
    console.error("No file selected.");
  }
});



// fetch
// Buffer 
// decode
// Buffersourcenode
// connections

// Init Effects Chain (just once)
 function initEffects() {
  // Initialize the compressor first
  compressor = new MultibandCompressor(audioCtx);

  // Mark effects as initialized
  effectsInitialized = true;

  // Set up compressor controls
  setupCompressorControls(compressor);

  // Update UI values for each band and parameter
  const bands = ['low', 'mid', 'high'];
  const params = ['threshold', 'gain', 'attack', 'release', 'knee', 'crossover'];

  bands.forEach((band) => {
    params.forEach((param) => {
      const inputId = `${band}-${param}`;
      const valueId = `${band}-${param}-value`;
      if (!document.getElementById(inputId) || !document.getElementById(valueId)) {
        console.warn(`Missing elements for ${inputId} or ${valueId}`);
      }
      updateValue(inputId, valueId);
    });
  });
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
if (!audioBuffer) {
  console.error("Audio buffer is not loaded.");
};

  sourceNode.connect(compressor.input);
  compressor.connect(audioCtx.destination);
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