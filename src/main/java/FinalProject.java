import javax.swing.*;
import java.awt.*;

public class FinalProject {

    public static void main(String[] args) {

        int level = 1;

        Game game = new Game();
        game.setGameLevel(level);

        game.setUpGamePlatform();

        while (!game.startSignal) {
            try {
                Thread.sleep(50);
            } catch (Exception e) {
            }
        }

        System.out.println("level 1 is now starting");
        game.gameSetMenuDisabled();
        game.runGameLoop();
        while (game.gameActive) {
            try {
                Thread.sleep(50);
            } catch (Exception e) {
            }
            if (game.gameStatus == "Lost") {
                System.out.println("You lost");
                game.gameFrame.dispose();
                game = new Game();
                game.setGameLevel(level);
                game.setUpGamePlatform();
                game.showGameOverScreen();
                game.gameSetMenuEnabled();
                game.startSignal = false;
                while (!game.startSignal) {
                    try {
                        Thread.sleep(50);
                    } catch (Exception e) {
                    }
                }
                game.setGameLevel(level);
                game.gameSetMenuDisabled();
                game.gameOverScreen = null;
                game.runGameLoop();
            } else if (game.gameStatus == "Won") {
                if (level >= 3) {
                    game.showLevelCompletedScreen();
                    game.gameSetMenuDisabled();
                } else {
                    System.out.println("You won");
                    game.gameFrame.dispose();
                    game = new Game();
                    level = level + 1;
                    game.setGameLevel(level);
                    game.setUpGamePlatform();
                    game.showLevelCompletedScreen();
                    game.startSignal = false;
                    while (!game.startSignal) {
                        try {
                            Thread.sleep(50);
                        } catch (Exception e) {
                        }
                    }
                    game.setGameLevel(level);
                    game.gameSetMenuDisabled();
                    game.runGameLoop();
                }
            }
        }
    }
}