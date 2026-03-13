import { Jumper } from "./Jumper";
import { Platform, GreenGoo, Door, MovingPlatform } from "./models";
import { Const } from "./constants";

export class GameEngine {
    firegirl: Jumper;
    waterboy: Jumper;
    platformList: Platform[] = [];
    greenGooList: GreenGoo[] = [];
    doorList: Door[] = [];
    movingPlatformList: MovingPlatform[] = [];

    gameStatus: "playing" | "Won" | "Lost" = "playing";

    constructor(
        firegirl: Jumper,
        waterboy: Jumper,
        platforms: Platform[],
        goos: GreenGoo[],
        doors: Door[],
        movingPlatforms: MovingPlatform[]
    ) {
        this.firegirl = firegirl;
        this.waterboy = waterboy;
        this.platformList = platforms;
        this.greenGooList = goos;
        this.doorList = doors;
        this.movingPlatformList = movingPlatforms;
    }

    tick() {
        if (this.gameStatus !== "playing") return;

        // X Movement
        this.firegirl.moveX();
        this.waterboy.moveX();

        // X Collisions (Static and Moving Platforms)
        for (const p of this.platformList) {
            this.checkPlatformCollisionX(this.firegirl, p);
            this.checkPlatformCollisionX(this.waterboy, p);
        }
        for (const mp of this.movingPlatformList) {
            this.checkPlatformCollisionX(this.firegirl, mp);
            this.checkPlatformCollisionX(this.waterboy, mp);
        }

        // Y Movement (Gravity / Jumping)
        this.firegirl.accelerate();
        this.firegirl.moveY(Const.GROUND);

        this.waterboy.accelerate();
        this.waterboy.moveY(Const.GROUND);

        // Update Moving Platforms
        for (const mp of this.movingPlatformList) {
            mp.move();
        }

        // Y Collisions (Moving Platforms)
        for (const mp of this.movingPlatformList) {
            this.checkMovingPlatformCollisionY(this.firegirl, mp);
            this.checkMovingPlatformCollisionY(this.waterboy, mp);
        }

        // Y Collisions (Static Platforms)
        for (const p of this.platformList) {
            this.checkPlatformCollisionY(this.firegirl, p);
            this.checkPlatformCollisionY(this.waterboy, p);
        }

        // Win Condition
        for (const door of this.doorList) {
            if (this.firegirl.collides(door) && this.waterboy.collides(door)) {
                this.gameStatus = "Won";
                this.stopCharacters();
            }
        }

        // Lose Condition
        for (const goo of this.greenGooList) {
            if (this.firegirl.collides(goo) || this.waterboy.collides(goo)) {
                this.gameStatus = "Lost";
                this.stopCharacters();
            }
        }
    }

    private checkPlatformCollisionX(char: Jumper, p: Platform | MovingPlatform) {
        if (char.collides(p)) {
            if (char.vx > 0) {
                // Moving right, hit left edge
                char.x = p.x - char.width;
            } else if (char.vx < 0) {
                // Moving left, hit right edge
                char.x = p.x + p.width;
            }
        }
    }

    private checkMovingPlatformCollisionY(char: Jumper, mp: MovingPlatform) {
        if (char.vy > 0 && char.collides(mp)) {
            char.y = mp.y - char.height;
            char.setOnMovingPlatform(mp);
        } else if (char.vy < 0 && char.collides(mp)) {
            char.y = mp.y + mp.height;
            char.vy = 0;
            char.unsetOnMovingPlatform();
        }
    }

    private checkPlatformCollisionY(char: Jumper, p: Platform) {
        if (char.vy > 0 && char.collides(p)) {
            char.y = p.y - char.height;
            char.vy = 0;
            char.unsetOnMovingPlatform();
        } else if (char.vy < 0 && char.collides(p)) {
            char.y = p.y + p.height;
            char.vy = 0;
        }
    }

    private stopCharacters() {
        this.firegirl.vx = 0;
        this.firegirl.vy = 0;
        this.waterboy.vx = 0;
        this.waterboy.vy = 0;
    }
}
