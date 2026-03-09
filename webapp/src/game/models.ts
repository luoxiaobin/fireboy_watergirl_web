import { Const } from "./constants";

export abstract class GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    imagePath: string;

    constructor(x: number, y: number, width: number, height: number, imagePath: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imagePath = imagePath;
    }

    collides(other: GameObject): boolean {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

export class Platform extends GameObject {
    constructor(x: number, y: number) {
        super(x, y, Const.PLATFORM_WIDTH, Const.PLATFORM_HEIGHT, "/platform.png");
    }
}

export class MovingPlatform extends GameObject {
    private startY: number;
    private movingDistance: number;
    private speed: number = 2; // Keep at 2 to match similar speed
    private direction: number = 1;

    constructor(x: number, y: number, movingDistance: number) {
        super(x, y, Const.MOVING_PLATFORM_WIDTH, Const.MOVING_PLATFORM_HEIGHT, "/platform.png");
        this.startY = y;
        this.movingDistance = movingDistance;
    }

    move() {
        this.y += this.speed * this.direction;
        if (this.y > this.startY + this.movingDistance || this.y < this.startY - this.movingDistance) {
            this.direction *= -1;
        }
    }

    getVy(): number {
        return this.speed * this.direction;
    }
}

export class GreenGoo extends GameObject {
    constructor(x: number, y: number) {
        super(x, y, Const.GREEN_GOO_WIDTH, Const.GREEN_GOO_HEIGHT, "/greengoo.png");
    }
}

export class Door extends GameObject {
    constructor(x: number, y: number) {
        super(x, y, Const.DOOR_WIDTH, Const.DOOR_HEIGHT, "/door.png");
    }
}
