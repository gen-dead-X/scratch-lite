/**
 * Play a collision sound effect
 */
export const playCollisionSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const oscillator1 = audioContext.createOscillator();
    oscillator1.type = "sine";
    oscillator1.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(
      880,
      audioContext.currentTime + 0.3
    );

    const oscillator2 = audioContext.createOscillator();
    oscillator2.type = "triangle";
    oscillator2.frequency.setValueAtTime(293.66, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(
      587.33,
      audioContext.currentTime + 0.4
    );

    const gainNode1 = audioContext.createGain();
    gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.8
    );

    const gainNode2 = audioContext.createGain();
    gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1
    );

    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);

    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);

    oscillator1.start();
    oscillator2.start(audioContext.currentTime + 0.05);

    setTimeout(() => {
      oscillator1.stop();
      oscillator2.stop();
    }, 1000);
  } catch (error) {
    console.warn("Audio playback failed:", error);
  }
};
