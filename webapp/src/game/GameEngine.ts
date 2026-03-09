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

        // Movement resolution
        this.firegirl.accelerate();
        this.firegirl.moveX();
        this.firegirl.moveY(Const.GROUND);

        this.waterboy.accelerate();
        this.waterboy.moveX();
        this.waterboy.moveY(Const.GROUND);

        for (const mp of this.movingPlatformList) {
            mp.move();
        }

        // Moving Platform Collisions
        for (const mp of this.movingPlatformList) {
            this.checkMovingPlatformCollision(this.firegirl, mp);
            this.checkMovingPlatformCollision(this.waterboy, mp);
        }

        // Static Platform Collisions
        for (const p of this.platformList) {
            this.checkPlatformCollision(this.firegirl, p);
            this.checkPlatformCollision(this.waterboy, p);
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

    private checkMovingPlatformCollision(char: Jumper, mp: MovingPlatform) {
        if (char.vy > 0 && char.collides(mp)) {
            char.y = mp.y - char.height;
            char.setOnMovingPlatform(mp);
        } else if (char.vy < 0 && char.collides(mp)) {
            char.y = mp.y - char.height;
            char.setOnMovingPlatform(mp);
        }
    }

    private checkPlatformCollision(char: Jumper, p: Platform) {
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
