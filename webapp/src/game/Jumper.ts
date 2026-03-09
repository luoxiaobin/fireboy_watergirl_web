import { Const } from "./constants";
import { GameObject, MovingPlatform } from "./models";

export class Jumper extends GameObject {
    vx: number = 0;
    vy: number = 0;
    isOnMovingPlatform: boolean = false;
    currentMovingPlatform: MovingPlatform | null = null;

    constructor(x: number, y: number, width: number, height: number, imagePath: string) {
        super(x, y, width, height, imagePath);
    }

    accelerate() {
        if (!this.isOnMovingPlatform) {
            this.vy += Const.GRAVITY;
        }
    }

    moveX() {
        this.x += this.vx;
        // Bound to screen X
        if (this.x <= 0) {
            this.x = 0;
        } else if (this.x + this.width >= Const.WIDTH) {
            this.x = Const.WIDTH - this.width;
        }
    }

    moveY(bottomLimit: number) {
        if (this.isOnMovingPlatform && this.currentMovingPlatform) {
            this.y += this.currentMovingPlatform.getVy();
        } else {
            this.y += this.vy;
            if (this.y + this.height >= bottomLimit) {
                this.y = bottomLimit - this.height;
                this.vy = 0;
                this.unsetOnMovingPlatform();
            }
        }
    }

    setOnMovingPlatform(platform: MovingPlatform) {
        this.currentMovingPlatform = platform;
        this.isOnMovingPlatform = true;
    }

    unsetOnMovingPlatform() {
        this.currentMovingPlatform = null;
        this.isOnMovingPlatform = false;
    }

    getMovingPlatformVy(): number {
        return this.isOnMovingPlatform && this.currentMovingPlatform ? this.currentMovingPlatform.getVy() : 0; // Moving platform moves Y
    }

    // AABB collision logic is handled by base GameObject, but we can resolve it in the game loop
}
