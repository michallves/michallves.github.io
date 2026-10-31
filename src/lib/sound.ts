// Som sintetizado na hora: zumbido grave do sabre e respiração filtrada, sem arquivos de áudio.
const BREATH_SECONDS = 4.8;
const VOLUME = 0.5;

function breathBuffer(context: AudioContext) {
  const length = Math.floor(context.sampleRate * BREATH_SECONDS);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  let low = 0;
  let band = 0;
  for (let i = 0; i < length; i++) {
    const t = i / context.sampleRate;
    const inhale = t < 1.8 ? Math.sin((Math.PI * t) / 1.8) : 0;
    const exhale = t > 2.1 && t < 4.4 ? Math.sin((Math.PI * (t - 2.1)) / 2.3) : 0;
    // A inspiração é mais aguda que a expiração
    const cutoff = inhale > 0 ? 0.11 : 0.05;
    low += (Math.random() * 2 - 1 - low) * cutoff;
    band += (low - band) * 0.012;
    samples[i] = (low - band) * (inhale * 0.8 + exhale) * 2.4;
  }
  return buffer;
}

export function createSound() {
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  const hum = context.createGain();
  hum.gain.value = 0.09;
  const humFilter = context.createBiquadFilter();
  humFilter.type = "lowpass";
  humFilter.frequency.value = 260;
  humFilter.connect(hum).connect(master);
  const oscillators = [58, 61.5].map((frequency) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = frequency;
    oscillator.connect(humFilter);
    oscillator.start();
    return oscillator;
  });

  const breath = context.createBufferSource();
  breath.buffer = breathBuffer(context);
  breath.loop = true;
  const breathGain = context.createGain();
  breathGain.gain.value = 0.32;
  breath.connect(breathGain).connect(master);
  breath.start();

  const fade = (target: number) => {
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setTargetAtTime(target, context.currentTime, 0.25);
  };

  return {
    on() {
      void context.resume();
      fade(VOLUME);
    },
    off() {
      fade(0);
    },
    pause() {
      void context.suspend();
    },
    resume() {
      void context.resume();
    },
    close() {
      oscillators.forEach((oscillator) => oscillator.stop());
      breath.stop();
      void context.close();
    },
  };
}

export type Sound = ReturnType<typeof createSound>;
