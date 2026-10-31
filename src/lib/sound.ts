// Zumbido grave sintetizado na hora, sem arquivos de áudio.
const VOLUME = 0.5;

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
      void context.close();
    },
  };
}

export type Sound = ReturnType<typeof createSound>;
