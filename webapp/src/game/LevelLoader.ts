import { Const } from "./constants";
import { Platform, GreenGoo, Door, MovingPlatform } from "./models";

export class LevelLoader {
    static async loadLevel(levelName: string) {
        const platformList: Platform[] = [];
        const greenGooList: GreenGoo[] = [];
        const doorList: Door[] = [];
        const movingPlatformList: MovingPlatform[] = [];

        const startX1 = 50;
        const startY1 = 468;
        const startX2 = 250;
        const startY2 = 468;

        try {
            const response = await fetch(`${import.meta.env.BASE_URL}assets/levels/${levelName}`);
            const text = await response.text();
            const lines = text.split('\n');

            for (const line of lines) {
                if (!line.trim()) continue;
                const record = line.split(Const.COMMA_DELIMITER).map((s) => s.trim());
                if (record.length < 3) continue;

                const type = record[0].toUpperCase();
                const posX = parseInt(record[1], 10);
                const posY = parseInt(record[2], 10);

                switch (type) {
                    case "P":
                        platformList.push(new Platform(posX, posY));
                        break;
                    case "G":
                        greenGooList.push(new GreenGoo(posX, posY));
                        break;
                    case "D":
                        doorList.push(new Door(posX, posY));
                        break;
                    case "M":
                        if (record.length >= 4) {
                            const movingDistance = parseInt(record[3], 10);
                            movingPlatformList.push(new MovingPlatform(posX, posY, movingDistance));
                        }
                        break;
                }
            }
        } catch (e) {
            console.error("Failed to load level", e);
        }

        return {
            platformList,
            greenGooList,
            doorList,
            movingPlatformList,
            startX1,
            startY1,
            startX2,
            startY2
        };
    }
}
