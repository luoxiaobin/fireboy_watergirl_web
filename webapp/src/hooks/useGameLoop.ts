import { useEffect, RefObject, MutableRefObject } from "react";
import { GameEngine } from "../game/GameEngine";
import { Const } from "../game/constants";

export function useGameLoop(
  engine: GameEngine | null,
  canvasRef: RefObject<HTMLCanvasElement>,
  imagesRef: MutableRefObject<Record<string, HTMLImageElement>>,
  level: number,
  setLevel: React.Dispatch<React.SetStateAction<number>>,
  setGameMessage: React.Dispatch<React.SetStateAction<string | null>>
) {
  useEffect(() => {
    if (!engine || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    let accumulator = 0;

    const loop = (timestamp: number) => {
      // Initialize lastTime on first frame
      if (lastTime === 0) lastTime = timestamp;

      let deltaTime = timestamp - lastTime;
      // Cap deltaTime to prevent spiral of death if tab was inactive
      if (deltaTime > 100) deltaTime = 100;

      lastTime = timestamp;
      accumulator += deltaTime;

      // Fixed timestep update
      while (accumulator >= Const.FRAME_PERIOD) {
        engine.tick();
        // The game logic expects delta time in seconds, so we convert the 20ms fixed step
        engine.particleEngine.update(Const.FRAME_PERIOD / 1000); 
        accumulator -= Const.FRAME_PERIOD;
      }

      // Handle win/loss after ticks
      if (engine.gameStatus === "Won") {
        setGameMessage("You Won! Loading Next Level...");
        engine.gameStatus = "playing"; // Pause logic
        setTimeout(() => {
          if (level < 3) setLevel((prev) => prev + 1);
          else setGameMessage("Game Completed!");
        }, 2000);
      } else if (engine.gameStatus === "Lost") {
        setGameMessage("You Lost! Restarting...");
        engine.gameStatus = "playing"; // Pause logic
        setTimeout(() => {
          setLevel(level); // trigger reload
        }, 2000);
      }

      // Draw logic
      ctx.clearRect(0, 0, Const.WIDTH, Const.HEIGHT);

      const drawImage = (imgName: string, x: number, y: number) => {
        const img = imagesRef.current[imgName];
        if (img) ctx.drawImage(img, x, y);
      };

      drawImage("background.png", 0, 0);

      engine.platformList.forEach((p) => drawImage("platform.png", p.x, p.y));
      engine.greenGooList.forEach((g) => drawImage("greengoo.png", g.x, g.y));
      engine.doorList.forEach((d) => drawImage("door.png", d.x, d.y));
      engine.movingPlatformList.forEach((mp) =>
        drawImage("platform.png", mp.x, mp.y)
      );

      drawImage(
        engine.firegirl.imagePath,
        engine.firegirl.x,
        engine.firegirl.y
      );
      drawImage(
        engine.waterboy.imagePath,
        engine.waterboy.x,
        engine.waterboy.y
      );

      // Draw particles on top of characters but behind UI
      engine.particleEngine.draw(ctx);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [engine, level, canvasRef, imagesRef, setLevel, setGameMessage]);
}
