import { useEffect, useRef, useState } from "react";
import { GameEngine } from "./game/GameEngine";
import { LevelLoader } from "./game/LevelLoader";
import { Jumper } from "./game/Jumper";
import { Const } from "./game/constants";
import { useGameAssets } from "./hooks/useGameAssets";
import { useGameControls } from "./hooks/useGameControls";
import { useGameLoop } from "./hooks/useGameLoop";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<
    "firegirl" | "waterboy"
  >("firegirl");
  const [level, setLevel] = useState(1);
  const [gameMessage, setGameMessage] = useState<string | null>(null);

  // 1. Assets
  const { imagesLoaded, imagesRef } = useGameAssets();

  // 2. Level Loading
  useEffect(() => {
    if (!imagesLoaded) return;

    let levelLayout = "LevelOneLayout.cfg";
    if (level === 2) levelLayout = "LevelTwoLayout.cfg";
    if (level === 3) levelLayout = "LevelThreeLayout.cfg";

    LevelLoader.loadLevel(levelLayout).then((data) => {
      const firegirl = new Jumper(
        data.startX1,
        data.startY1,
        20,
        32,
        "watergirl_small.png"
      );
      const waterboy = new Jumper(
        data.startX2,
        data.startY2,
        20,
        34,
        "fireboy_small.png"
      );

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

  // 3. Execution & Rendering Loop
  useGameLoop(
    engine,
    canvasRef,
    imagesRef,
    level,
    setLevel,
    setGameMessage
  );

  // 4. Input Controls
  const { handleTouchStart, handleTouchEnd } = useGameControls(
    engine,
    activeCharacter
  );

  return (
    <div className="game-container">
      <div className="header">
        <h1>Fireboy & Watergirl</h1>
        <div className="controls">
          <button
            className={`switch-btn ${
              activeCharacter === "firegirl" ? "active-firegirl" : ""
            }`}
            onClick={() => setActiveCharacter("firegirl")}
          >
            Play as Firegirl
          </button>
          <button
            className={`switch-btn ${
              activeCharacter === "waterboy" ? "active-waterboy" : ""
            }`}
            onClick={() => setActiveCharacter("waterboy")}
          >
            Play as Fireboy
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        {!imagesLoaded && <div className="overlay-msg">Loading Assets...</div>}
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
            onPointerDown={(e) => {
              e.preventDefault();
              handleTouchStart("left");
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              handleTouchEnd("left");
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              handleTouchEnd("left");
            }}
            className="ctrl-btn"
          >
            &larr;
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              handleTouchStart("right");
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              handleTouchEnd("right");
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              handleTouchEnd("right");
            }}
            className="ctrl-btn"
          >
            &rarr;
          </button>
        </div>
        <div className="action">
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              handleTouchStart("jump");
            }}
            className="ctrl-btn jump-btn"
          >
            &uarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
