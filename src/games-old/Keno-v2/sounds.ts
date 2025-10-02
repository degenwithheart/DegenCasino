// Keno v2 Sound Effects
export const KENO_SOUNDS = {
  click: () => {
    const audio = new Audio();
    audio.volume = 0.3;
    const oscillator = new AudioContext();
    // Quick tick sound for number selection
    const osc = oscillator.createOscillator();
    const gainNode = oscillator.createGain();
    osc.connect(gainNode);
    gainNode.connect(oscillator.destination);
    
    osc.frequency.setValueAtTime(800, oscillator.currentTime);
    gainNode.gain.setValueAtTime(0.1, oscillator.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, oscillator.currentTime + 0.1);
    
    osc.start();
    osc.stop(oscillator.currentTime + 0.1);
  },

  draw: () => {
    // Ball drawing sound - higher pitch
    const oscillator = new AudioContext();
    const osc = oscillator.createOscillator();
    const gainNode = oscillator.createGain();
    osc.connect(gainNode);
    gainNode.connect(oscillator.destination);
    
    osc.frequency.setValueAtTime(1200, oscillator.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, oscillator.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.15, oscillator.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, oscillator.currentTime + 0.3);
    
    osc.start();
    osc.stop(oscillator.currentTime + 0.3);
  },

  hit: () => {
    // Number hit sound - success tone
    const oscillator = new AudioContext();
    const osc = oscillator.createOscillator();
    const gainNode = oscillator.createGain();
    osc.connect(gainNode);
    gainNode.connect(oscillator.destination);
    
    osc.frequency.setValueAtTime(1000, oscillator.currentTime);
    osc.frequency.setValueAtTime(1200, oscillator.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, oscillator.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, oscillator.currentTime + 0.2);
    
    osc.start();
    osc.stop(oscillator.currentTime + 0.2);
  },

  bigWin: () => {
    // Big win celebration sound
    const oscillator = new AudioContext();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const osc = oscillator.createOscillator();
        const gainNode = oscillator.createGain();
        osc.connect(gainNode);
        gainNode.connect(oscillator.destination);
        
        osc.frequency.setValueAtTime(800 + (i * 200), oscillator.currentTime);
        gainNode.gain.setValueAtTime(0.15, oscillator.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, oscillator.currentTime + 0.3);
        
        osc.start();
        osc.stop(oscillator.currentTime + 0.3);
      }, i * 100);
    }
  }
};