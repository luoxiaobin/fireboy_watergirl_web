# Fireboy & Watergirl (Web Edition)

A modern, responsive web port of the classic Java Swing puzzle-platformer "Fireboy & Watergirl". 

## 🎮 How to Play

Play the live version right now: **[Play Fireboy & Watergirl Web](https://luoxiaobin.github.io/fireboy_watergirl_web/)**

Your goal is to guide both Fireboy and Watergirl to the exit door(s) safely. If *either* character touches the green goo, the level resets!

### Desktop Controls
- **Firegirl** (Blue): Use the `Arrow` keys (`Left`, `Right`, `Up` to jump).
- **Waterboy** (Red): Use the `W, A, D` keys (`A/D` to move, `W` to jump).

### Mobile / Touch Controls
- Use the on-screen **Switch Character** toggle at the top to choose who you are controlling.
- Use the **Virtual D-Pad** (Left/Right Arrows) in the bottom-left to move.
- Use the **Jump Button** (Up Arrow) in the bottom-right to jump!

---

## 🏗️ Technical Architecture

This project was rebuilt from the ground up to modernize an aging `JFrame` Java Swing codebase into a lightweight, high-performance web application. 

### Tech Stack
- **Framework**: React 18
- **Language**: TypeScript (Provides strict typing for the game engine and physics models).
- **Build Tool**: Vite (Extremely fast HMR and optimized production bundling).
- **Rendering**: Native HTML5 `<canvas>` API (Handling 50 FPS draw loops).
- **Hosting**: GitHub Pages via the `gh-pages` npm package.

### File Structure
- `src/App.tsx`: The main React component. Handles React State, the game loop `requestAnimationFrame`, keyboard/touch event listeners, and the `<canvas>` rendering context.
- `src/game/GameEngine.ts`: The core physics and game logic loop. Handles AABB (Axis-Aligned Bounding Box) collisions, moving platforms, and win/loss states.
- `src/game/models.ts`: Object-Oriented classes (Platform, Door, GreenGoo) that represent the static world.
- `src/game/Jumper.ts`: The player character class governing velocity (`vx`, `vy`) and gravity accumulation.
- `src/game/LevelLoader.ts`: An async utility that fetches and parses the old-school `.cfg` layout files into instantiated TypeScript objects.

---

## 🎨 Design Document

### The Challenge
The original Java game utilized a single keyboard to control two players simultaneously (`A/W/D` vs `Arrows`). Porting a dual-keyboard game to Mobile Web presented a significant UX challenge.

### The Solution: "Single-Player Toggle"
To make the game mobile-friendly without cluttering the limited screen space with dual D-Pads, the Web Edition introduces a "Switch Character" mechanic. 
- A prominent toggle at the top of the UI allows players to hot-swap their active character.
- The virtual D-Pad then seamlessly binds to whichever character is currently active. 

### Visual Presentation
The game canvas is wrapped in a premium, dark-mode styling with subtle box-shadows and CSS Flexbox centering, ensuring the 1024x568 game bounds dynamically scale down to fit beautifully on any device screen, whilst preserving the original aspect ratio. 

---

## 🛠️ Local Development

To run the game on your own machine:

1. Clone this repository.
2. Navigate to the `webapp` directory: `cd webapp`
3. Install dependencies: `npm install`
4. Start the Vite dev server: `npm run dev`
5. Visit `http://localhost:5173` in your browser!

### Deploying
The `webapp/package.json` includes custom scripts to automatically compile the Vite build and push it to the `gh-pages` branch.
```bash
npm run deploy
```
