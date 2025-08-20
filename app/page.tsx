"use client";
import { use, useEffect, useRef } from "react";

export default function Home() {
  // refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioPickerRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      canvasContextRef.current = canvasRef.current.getContext("2d");
      if (canvasContextRef.current)
        canvasContextRef.current.fillStyle = "white";
    }
  }, []);

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && audioRef.current) {
      const audioUrl = URL.createObjectURL(files[0]);
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.play();

      // Cleanup URL when done
      //return () => URL.revokeObjectURL(audioUrl);
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
          <audio ref={audioRef}>no support for audio</audio>
        </div>
      </main>
    </div>
  );
}
