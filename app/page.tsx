"use client";
import { on } from "events";
import { use, useEffect, useRef } from "react";

export default function Home() {
  // refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioPickerRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // canvas setup
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      canvasContextRef.current = canvasRef.current.getContext("2d");
      if (canvasContextRef.current)
        canvasContextRef.current.fillStyle = "white";
    }

    // initialize audio context and analyzer
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();

    // configure analyzer
    analyserRef.current.fftSize = 2048;
    analyserRef.current.smoothingTimeConstant = 0.8;

    return () => {
      audioContextRef.current?.close(); //does this neeed a '?'

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current || !canvasContextRef.current)
      return;

    //why is the fequency bin count half of the fft window size?
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray); //what does this do?

    const canvas = canvasRef.current;
    const ctx = canvasContextRef.current;
    const width = canvas.width;
    const height = canvas.height;

    //clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    //Draw frequency bars
    const barWidth = (width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    ctx.fillStyle = "black";
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }

    // Cantinue the animation loop
    animationFrameRef.current = requestAnimationFrame(draw);
  };

  // select audio file
  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && audioRef.current) {
      const audioUrl = URL.createObjectURL(files[0]);
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      //audioRef.current.play();

      // Cleanup URL when done
      //return () => URL.revokeObjectURL(audioUrl);
    }
  };

  const processAudio = () => {
    if (!audioContextRef.current || !audioRef.current || !analyserRef.current)
      return;

    const track = audioContextRef.current.createMediaElementSource(
      audioRef.current
    );
    track.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);

    // Start visualization
    draw();
  };

  const handleClickPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      processAudio();
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-1/2">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white rounded-lg"
          id="canvas"
        ></canvas>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <input
            ref={audioPickerRef}
            onChange={handleAudioChange}
            type="file"
            id="audioPicker"
            accept="audio/*"
          />
          <button
            onClick={handleClickPlay}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          ></button>
          <audio ref={audioRef}>no support for audio</audio>
        </div>
      </main>
    </div>
  );
}
