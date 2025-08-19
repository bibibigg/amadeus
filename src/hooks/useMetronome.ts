import { useEffect, useState } from "react";

export default function useMetronome(initialBpm: number = 80) {
  const [bpm, setBpm] = useState<number>(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);

  // 메트로놈 클릭 소리
  const playClick = () => {
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = 800; // Hz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05); // 50ms
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = (60 / bpm) * 1000; // ms per beat
    const id = setInterval(() => {
      console.log("tick", bpm);
      playClick();
    }, interval);

    return () => clearInterval(id); // cleanup
  }, [bpm, isPlaying]);

  return {
    bpm,
    setBpm,
    isPlaying,
    start: () => setIsPlaying(true),
    stop: () => setIsPlaying(false),
  };
}
