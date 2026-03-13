import { useEffect } from "react";
import { GameEngine } from "../game/GameEngine";
import { Const } from "../game/constants";

export function useGameControls(
  engine: GameEngine | null,
  activeCharacter: "firegirl" | "waterboy"
) {
  // 4. Keyboard Controls
  useEffect(() => {
    if (!engine) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isFiregirlActive = activeCharacter === "firegirl";
      const isWaterboyActive = activeCharacter === "waterboy";

      const firegirl = engine.firegirl;
      const waterboy = engine.waterboy;

      // Firegirl Controls (Arrow Keys)
      if (e.key === "ArrowUp") {
        if (
          (isFiregirlActive || e.code === "ArrowUp") &&
          (firegirl.vy === 0 || firegirl.isOnMovingPlatform)
        ) {
          firegirl.vy = Const.JUMP_SPEED + firegirl.getMovingPlatformVy();
          firegirl.unsetOnMovingPlatform();
        }
      }
      if (e.key === "ArrowLeft") {
        if (isFiregirlActive || e.code === "ArrowLeft") {
          firegirl.vx = -Const.RUN_SPEED;
          firegirl.unsetOnMovingPlatform();
        }
      }
      if (e.key === "ArrowRight") {
        if (isFiregirlActive || e.code === "ArrowRight") {
          firegirl.vx = Const.RUN_SPEED;
          firegirl.unsetOnMovingPlatform();
        }
      }

      // Waterboy Controls (WASD)
      if (e.key === "w" || e.key === "W") {
        if (
          (isWaterboyActive || e.key.toLowerCase() === "w") &&
          (waterboy.vy === 0 || waterboy.isOnMovingPlatform)
        ) {
          waterboy.vy = Const.JUMP_SPEED + waterboy.getMovingPlatformVy();
          waterboy.unsetOnMovingPlatform();
        }
      }
      if (e.key === "a" || e.key === "A") {
        if (isWaterboyActive || e.key.toLowerCase() === "a") {
          waterboy.vx = -Const.RUN_SPEED;
          waterboy.unsetOnMovingPlatform();
        }
      }
      if (e.key === "d" || e.key === "D") {
        if (isWaterboyActive || e.key.toLowerCase() === "d") {
          waterboy.vx = Const.RUN_SPEED;
          waterboy.unsetOnMovingPlatform();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        engine.firegirl.vx = 0;
      }
      if (e.key.toLowerCase() === "a" || e.key.toLowerCase() === "d") {
        engine.waterboy.vx = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [engine, activeCharacter]);

  // Touch Control Handlers
  const handleTouchStart = (action: "left" | "right" | "jump") => {
    if (!engine) return;
    const char =
      activeCharacter === "firegirl" ? engine.firegirl : engine.waterboy;

    if (action === "left") char.vx = -Const.RUN_SPEED;
    if (action === "right") char.vx = Const.RUN_SPEED;
    if (action === "jump" && (char.vy === 0 || char.isOnMovingPlatform)) {
      char.vy = Const.JUMP_SPEED + char.getMovingPlatformVy();
      char.unsetOnMovingPlatform();
    }
  };

  const handleTouchEnd = (action: "left" | "right") => {
    if (!engine) return;
    const char =
      activeCharacter === "firegirl" ? engine.firegirl : engine.waterboy;
    if (action === "left" || action === "right") {
      char.vx = 0;
    }
  };

  return { handleTouchStart, handleTouchEnd };
}
