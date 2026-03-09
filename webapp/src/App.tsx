import { useEffect, useRef, useState } from "react";
import { GameEngine } from "./game/GameEngine";
import { LevelLoader } from "./game/LevelLoader";
import { Jumper } from "./game/Jumper";
import { Const } from "./game/constants";
// Basic virtual joystick assets or styled buttons will be used.

// Basic virtual joystick assets or styled buttons will be used.

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<"firegirl" | "waterboy">("firegirl");
  const [level, setLevel] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);

  const images = useRef<Record<string, HTMLImageElement>>({});

  // 1. Load Images
  useEffect(() => {
    const filenames = [
      "background.png",
      "door.png",
      "fireboy_small.png",
      "gameover.png",
      "greengoo.png",
      "levelCompleted.png",
      "platform.png",
      "watergirl_small.png",
    ];

    let loadedCount = 0;
    filenames.forEach((fname) => {
      const img = new Image();
      img.src = `/${fname}`;
      img.onload = () => {
        loadedCount++;
        images.current[fname] = img;
        if (loadedCount === filenames.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        console.error("Failed to load image", fname);
      };
    });
  }, []);

  // 2. Load Level
  useEffect(() => {
    if (!imagesLoaded) return;

    let levelLayout = "LevelOneLayout.cfg";
    if (level === 2) levelLayout = "LevelTwoLayout.cfg";
    if (level === 3) levelLayout = "LevelThreeLayout.cfg";

    LevelLoader.loadLevel(levelLayout).then((data) => {
      const firegirl = new Jumper(data.startX1, data.startY1, 20, 32, "watergirl_small.png");
      const waterboy = new Jumper(data.startX2, data.startY2, 20, 34, "fireboy_small.png");

      const newEngine = new GameEngine(
        firegirl,
        waterboy,
        data.platformList,
        data.greenGooList,
        data.doorList,
        data.movingPlatformList
      );
      setEngine(newEngine);
      setGameMessage(null);
    });
  }, [level, imagesLoaded]);

  // 3. Game Loop
  useEffect(() => {
    if (!engine || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    const loop = (timestamp: number) => {
      if (timestamp - lastTime >= Const.FRAME_PERIOD) {
        lastTime = timestamp;

        // Update logic
        engine.tick();

        if (engine.gameStatus === "Won") {
          setGameMessage("You Won! Loading Next Level...");
          engine.gameStatus = "playing"; // Pause logic
          setTimeout(() => {
            if (level < 3) setLevel(level + 1);
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
          const img = images.current[imgName];
          if (img) ctx.drawImage(img, x, y);
        };

        drawImage("background.png", 0, 0);

        engine.platformList.forEach((p) => drawImage("platform.png", p.x, p.y));
        engine.greenGooList.forEach((g) => drawImage("greengoo.png", g.x, g.y));
        engine.doorList.forEach((d) => drawImage("door.png", d.x, d.y));
        engine.movingPlatformList.forEach((mp) => drawImage("platform.png", mp.x, mp.y));

        drawImage(engine.firegirl.imagePath, engine.firegirl.x, engine.firegirl.y);
        drawImage(engine.waterboy.imagePath, engine.waterboy.x, engine.waterboy.y);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [engine, level]);

  // 4. Keyboard Controls
  useEffect(() => {
    if (!engine) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isFiregirlActive = activeCharacter === "firegirl";
      const isWaterboyActive = activeCharacter === "waterboy";

      const firegirl = engine.firegirl;
      const waterboy = engine.waterboy;

      if (e.key === "ArrowUp") {
        if ((isFiregirlActive || e.code === "ArrowUp") && (firegirl.vy === 0 || firegirl.isOnMovingPlatform)) {
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

      if (e.key === "w" || e.key === "W") {
        if ((isWaterboyActive || e.key.toLowerCase() === "w") && (waterboy.vy === 0 || waterboy.isOnMovingPlatform)) {
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
    const char = activeCharacter === "firegirl" ? engine.firegirl : engine.waterboy;

    if (action === "left") char.vx = -Const.RUN_SPEED;
    if (action === "right") char.vx = Const.RUN_SPEED;
    if (action === "jump" && (char.vy === 0 || char.isOnMovingPlatform)) {
      char.vy = Const.JUMP_SPEED + char.getMovingPlatformVy();
      char.unsetOnMovingPlatform();
    }
  };

  const handleTouchEnd = (action: "left" | "right") => {
    if (!engine) return;
    const char = activeCharacter === "firegirl" ? engine.firegirl : engine.waterboy;
    if (action === "left" || action === "right") {
      char.vx = 0;
    }
  };


  return (
    <div className="game-container">
      <div className="header">
        <h1>Fireboy & Watergirl</h1>
        <div className="controls">
          <button
            className={`switch-btn ${activeCharacter === "firegirl" ? "active-firegirl" : ""}`}
            onClick={() => setActiveCharacter("firegirl")}>
            Play as Firegirl
          </button>
          <button
            className={`switch-btn ${activeCharacter === "waterboy" ? "active-waterboy" : ""}`}
            onClick={() => setActiveCharacter("waterboy")}>
            Play as Fireboy
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        {gameMessage && <div className="overlay-msg">{gameMessage}</div>}
        <canvas
          ref={canvasRef}
          width={Const.WIDTH}
          height={Const.HEIGHT}
          className="game-canvas"
        />
      </div>

      {/* Mobile Overlay Controls */}
      <div className="mobile-controls">
        <div className="dpad">
          <button
            onPointerDown={(e) => { e.preventDefault(); handleTouchStart("left"); }}
            onPointerUp={(e) => { e.preventDefault(); handleTouchEnd("left"); }}
            onPointerLeave={(e) => { e.preventDefault(); handleTouchEnd("left"); }}
            className="ctrl-btn">&larr;</button>
          <button
            onPointerDown={(e) => { e.preventDefault(); handleTouchStart("right"); }}
            onPointerUp={(e) => { e.preventDefault(); handleTouchEnd("right"); }}
            onPointerLeave={(e) => { e.preventDefault(); handleTouchEnd("right"); }}
            className="ctrl-btn">&rarr;</button>
        </div>
        <div className="action">
          <button
            onPointerDown={(e) => { e.preventDefault(); handleTouchStart("jump"); }}
            className="ctrl-btn jump-btn">&uarr;</button>
        </div>
      </div>
    </div>
  );
}

export default App;
