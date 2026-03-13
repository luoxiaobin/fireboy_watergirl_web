import { useEffect, useRef, useState } from "react";
import { GameEngine } from "./game/GameEngine";
import { LevelLoader } from "./game/LevelLoader";
import { Jumper } from "./game/Jumper";
import { Const } from "./game/constants";
import { useGameAssets } from "./hooks/useGameAssets";
import { useGameControls } from "./hooks/useGameControls";
import { useGameLoop } from "./hooks/useGameLoop";
import { useFullscreen } from "./hooks/useFullscreen";

declare const __BUILD_DATE__: string;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<
    "firegirl" | "waterboy"
  >("firegirl");
  const [level, setLevel] = useState(1);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  // Fullscreen
  const { isFullscreen, toggleFullscreen, showIOSPrompt, dismissIOSPrompt } = useFullscreen();

  // Detect portrait orientation on mobile
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

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
      {/* Portrait Rotation Prompt */}
      {isPortrait && (
        <div className="rotate-prompt">
          <div className="rotate-icon">📱</div>
          <span>Rotate your device to landscape for the best experience</span>
          <button className="switch-btn" onClick={toggleFullscreen}>
            Go Fullscreen
          </button>
        </div>
      )}

      {/* iOS Add to Home Screen Prompt */}
      {showIOSPrompt && (
        <div className="ios-prompt-overlay" onClick={dismissIOSPrompt}>
          <div className="ios-prompt" onClick={(e) => e.stopPropagation()}>
            <h2>Add to Home Screen</h2>
            <p>Safari doesn't support fullscreen mode. For the best experience:</p>
            <ol>
              <li>Tap the <strong>Share</strong> button (⬆️) in Safari</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Open the app from your Home Screen — it will run fullscreen!</li>
            </ol>
            <button className="switch-btn active-firegirl" onClick={dismissIOSPrompt}>
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className="header">
        <h1>Fireboy &amp; Watergirl</h1>
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
          <button
            className="switch-btn fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? "⛶" : "⛶"}
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        {/* Loading Spinner */}
        {!imagesLoaded && (
          <div className="overlay-msg loading-overlay">
            <div className="spinner"></div>
            <span>Loading Assets...</span>
          </div>
        )}

        {/* Level Transition Message */}
        {gameMessage && <div className="overlay-msg">{gameMessage}</div>}

        <canvas
          ref={canvasRef}
          width={Const.WIDTH}
          height={Const.HEIGHT}
          className={`game-canvas ${(!imagesLoaded || gameMessage) ? 'canvas-dimmed' : ''}`}
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
            className="ctrl-btn ctrl-left"
          >
            ◀
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
            className="ctrl-btn ctrl-right"
          >
            ▶
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
            ▲
          </button>
        </div>
      </div>
      
      <div className="build-info">
        Build: {typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : 'Local Dev'}
      </div>
    </div>
  );
}

export default App;
