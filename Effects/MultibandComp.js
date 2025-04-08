
//Multiband Compressor stage
export default class MultibandCompressor {

    constructor(audioContext) {
      this.audioContext = audioContext;
  
      // Create nodes
      this.input = this.audioContext.createGain();
      this.output = this.audioContext.createGain();
  
      // Filters for band splitting
      this.lowpass = this.audioContext.createBiquadFilter();
      this.lowpass.type = "lowpass";
      this.lowpass.frequency.value = 400; // Crossover frequency for low/mid
  
      this.highpass = this.audioContext.createBiquadFilter();
      this.highpass.type = "highpass";
      this.highpass.frequency.value = 400;
  
      this.bandpass = this.audioContext.createBiquadFilter();
      this.bandpass.type = "bandpass";
      this.bandpass.frequency.value = 1000; // Center frequency for mids
  
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
      ['threshold', 'attack', 'release', 'ratio', 'knee'].forEach((param) => {
        const input = document.getElementById(`${band}-${param}`);
        if (input) {
          input.addEventListener("input", () => {
            console.log(input);
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
    });
  }
 

