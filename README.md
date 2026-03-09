# FinalProject / Fireboy & Watergirl

![Modern Web Edition](https://img.shields.io/badge/Version-Web_Edition_Live-success)
**🎮 Play the modern web version here: [Fireboy & Watergirl Web](https://luoxiaobin.github.io/fireboy_watergirl_web/)**

> **Note:** The original Java Swing codebase in `src/main/java` has been retired. The game has been completely modernized and rebuilt as a responsive web application in TypeScript and React. All active development and documentation can now be found in the [`webapp/`](./webapp) directory.

---

## Original Java Swing Project (Ivy Luo ICS3U6's final project assignment)


This platform game requires two players, one using the arrow keys to control their character, the other using the keys ‘a’, ‘w’, ‘s’, and ‘d’. The two characters must overcome obstacles to reach the two doors for them to complete each level. The users will interact with the program through the keyboard to move their characters and the mouse/touchpad to start a new level. This program will also require a text file for every level, which will hold the layout and must be converted to different objects using a method.

Possible classes that will be created:
- Character class → creates the two characters that will play the game
- Level class → creates different levels of the game
- Objects class → creates all the objects that will be the obstacles for the game (possibly a child class for every object, e.g. platform, green goo, door, etc…)


Possible methods that will be created:
- setUp() → Set up the game window
- setUpGameObjects() → Set up all the objects from the text file to the window
- runGameLoop() → Runs while the user is playing a level
- keyPressed() and keyReleased() → Controls the character’s movement corresponding to the keyboard input
- moveX() and move(Y) → Moves the character’s location

Possible challenges:
- Creating a text file for the layout of the game and converting it into objects for the game
- Moving the character when the user presses two keys at once (e.g. upon pressing up and right, they should jump while moving right)

Realistic timeline:
- Monday, Jan 17th: Complete methods for the character’s movement
- Wednesday, Jan 21st: Finish creating all objects for at least one level and connecting the text file to the layout
- Friday, Jan 23rd: Have two characters that can play simultaneously and finish the graphics for all obstacles
- Sunday, Jan 25th: Create text files for all the levels, a start game button, and connecting one level to another



