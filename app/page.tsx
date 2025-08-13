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

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white rounded-lg"
          id="canvas"
        ></canvas>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <input type="file" id="audioPicker" accept="audio/*" />
          <audio>no support for audio</audio>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 cursor-default hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            Upload Audio
          </a>
        </div>
      </main>
    </div>
  );
}
