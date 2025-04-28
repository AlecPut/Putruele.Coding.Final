//Multiband Compressor stage

export default class MultibandCompressor {

  constructor(audioContext) {
    this.audioContext = audioContext;
  
    // Create nodes
    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();
  
    // Filters for band splitting
    let crossoverLow = parseFloat(document.getElementById('low-crossover-value')) || 400; // Default to 400 Hz
    this.lowpass = this.audioContext.createBiquadFilter();
    this.lowpass.type = "lowpass";
    this.lowpass.frequency.value = crossoverLow;
  
    let crossoverHigh = parseFloat(document.getElementById('high-crossover-value')) || 6000; // Default to 6000 Hz
    this.highpass = this.audioContext.createBiquadFilter();
    this.highpass.type = "highpass";
    this.highpass.frequency.value = crossoverHigh;
  
    let crossoverMid = parseFloat(document.getElementById('mid-crossover-value')) || 1000; // Default to 1000 Hz
    this.bandpass = this.audioContext.createBiquadFilter();
    this.bandpass.type = "bandpass";
    this.bandpass.frequency.value = crossoverMid;
  
    // Compressors for each band
    this.lowCompressor = this.audioContext.createDynamicsCompressor();
    this.midCompressor = this.audioContext.createDynamicsCompressor();
    this.highCompressor = this.audioContext.createDynamicsCompressor();
  
    // Gain nodes to mix bands
    this.lowGain = this.audioContext.createGain();
    this.midGain = this.audioContext.createGain();
    this.highGain = this.audioContext.createGain();
  
    // Signal Routing
    this.input.connect(this.lowpass);
    this.input.connect(this.highpass);
    this.input.connect(this.bandpass);
  
    this.lowpass.connect(this.lowCompressor);
    this.bandpass.connect(this.midCompressor);
    this.highpass.connect(this.highCompressor);
  
    this.lowCompressor.connect(this.lowGain);
    this.midCompressor.connect(this.midGain);
    this.highCompressor.connect(this.highGain);
  
    this.lowGain.connect(this.output);
    this.midGain.connect(this.output);
    this.highGain.connect(this.output);
  }
    connect(destination) {
      this.output.connect(destination);
    }
  }

  //Setting up controls
  export function setupCompressorControls(compressor) {
    const bands = ['low', 'mid', 'high'];
    bands.forEach((band) => {
      ['threshold', 'attack', 'release', 'knee', 'crossover'].forEach((param) => {
        const input = document.getElementById(`${band}-${param}`);
        if (input) {
          input.addEventListener("input", () => {
            compressor[`${band}Compressor`][param].value = parseFloat(input.value);
          });
        }
      });
  
      const gainInput = document.getElementById(`${band}-gain`);
      if (gainInput) {
        gainInput.addEventListener("input", () => {
          compressor[`${band}Gain`].gain.value = parseFloat(gainInput.value);
        });
      }
  
      // Now handle ratio radio buttons
      const ratioRadios = document.querySelectorAll(`input[name="${band}-ratio"]`);
      ratioRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
          let ratioValue;
          if (radio.value === "ALL") {
            ratioValue = 162; // ALL IN = extreme compression
          } else {
            ratioValue = parseInt(radio.value.split(':')[0], 10); // Extract '3' from "3:1"
          }
          compressor[`${band}Compressor`].ratio.value = ratioValue;
        });
      });
    });
  }
 
// --- Updating Displayed Values (also outside the class) ---
export function updateValue(id, valueId) {



  const slider = document.getElementById(id);
  const value = document.getElementById(valueId);
  if (slider && value) {
    value.textContent = slider.value;
    slider.addEventListener('input', () => {
      value.textContent = slider.value;
    });
  };
};
