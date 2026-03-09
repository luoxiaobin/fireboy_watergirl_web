import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Scanner;

public class Game {
    final JFrame gameFrame;

    final MyKeyListener keyListener;
    // game objects
    final Jumper firegirl;
    final Jumper waterboy;
    String gameStatus;
    public final boolean gameActive;

    final java.util.List<Platform> platformList;
    final java.util.List<GreenGoo> greenGooList;
    final java.util.List<Door> doorList;
    final java.util.List<MovingPlatform> movingPlatformList;

    final Background background;
    GameOverScreen gameOverScreen;
    LevelCompletedScreen levelCompletedScreen;
    GamePanel gamePanel;

    JMenuBar gameMenuBar;
    JMenu gameSubmenu;
    JMenuItem gameMenuItemStart, gameMenuItemExit, gameMenuItemInstructions;

    boolean startSignal = false;

    // ------------------------------------------------------------------------------
    Game() {

        keyListener = new MyKeyListener();
        gameStatus = "playing";
        gameActive = true;

        String bckgPic = "images/background.png";
        background = new Background(bckgPic);

        platformList = new ArrayList<>();
        greenGooList = new ArrayList<>();
        doorList = new ArrayList<>();
        movingPlatformList = new ArrayList<>();

        gameFrame = new JFrame("Fireboy and Watergirl");
        gameFrame.setSize(Const.WIDTH, Const.HEIGHT);
        gameFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        gameFrame.setResizable(false);

        gameSetupMenu();

        int jumperX = 50;
        int jumperY = 468; // this is calculated as platform y axis (500) - height of jumper (32)
        firegirl = new Jumper(jumperX, jumperY, ".//images//watergirl_small.png");

        jumperX = 250;
        jumperY = 468; // this is calculated as platform y axis (500) - height of jumper (32)

        waterboy = new Jumper(jumperX, jumperY, ".//images//fireboy_small.png");

    }

    public void setGameLevel(int level) {

        levelCompletedScreen = null;

        if (level == 1) {
            SetupGameObjects("./LevelOneLayout.cfg");
        } else if (level == 2) {
            SetupGameObjects("./LevelTwoLayout.cfg");
        } else if (level == 3) {
            SetupGameObjects("./LevelThreeLayout.cfg");
        }
    }

    public void gameSetMenuDisabled() {
        gameMenuBar.setVisible(false);
    }

    public void gameSetMenuEnabled() {
        gameMenuBar.setVisible(true);
    }

    public void gameSetupMenu() {
        // Create the menu bar.
        gameMenuBar = new JMenuBar();
        // Build the first menu.
        gameSubmenu = new JMenu("Menu Bar");
        gameSubmenu.setMnemonic(KeyEvent.VK_G);
        gameSubmenu.getAccessibleContext().setAccessibleDescription(
                "The only menu in this program that has menu items");
        gameMenuBar.add(gameSubmenu);

        // a group of JMenuItems
        gameMenuItemStart = new JMenuItem("Start", KeyEvent.VK_S);
        gameSubmenu.add(gameMenuItemStart);
        gameMenuItemStart.addActionListener(ev -> {
            startSignal = true;
            gameSetMenuDisabled();
        });

        gameMenuItemInstructions = new JMenuItem("Instructions", KeyEvent.VK_V);

        gameMenuItemInstructions.addActionListener(ev -> {
            final ImageIcon icon = new ImageIcon("./images/watergirl_small.png");
            JOptionPane.showMessageDialog(null,
                    "Watergirl uses the arrow keys to move, fireboy uses the 'a,w,d' keys to move. \nTo complete a level, they both must reach the door. If either touches the \ngreen goo, the level must be restarted. \n\nGOOD LUCK!!!!",
                    "Instruction", JOptionPane.INFORMATION_MESSAGE, icon);
        });

        gameMenuItemExit = new JMenuItem("Exit", KeyEvent.VK_X);
        gameMenuItemExit.addActionListener(ev -> {
            final ImageIcon icon = new ImageIcon("./images/watergirl_small.png");
            JOptionPane.showMessageDialog(null, "See you next time!", "Exit", JOptionPane.INFORMATION_MESSAGE, icon);
            System.exit(0);
        });

        gameSubmenu.add(gameMenuItemInstructions);
        gameSubmenu.add(gameMenuItemExit);
        gameFrame.setJMenuBar(gameMenuBar);
    }

    // ------------------------------------------------------------------------------
    // set up the game platform
    public void setUpGamePlatform() {
        gameFrame.setSize(Const.WIDTH, Const.HEIGHT);
        gameFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        gameFrame.setResizable(false);

        gamePanel = new GamePanel();
        gamePanel.addKeyListener(keyListener);
        gameFrame.add(gamePanel);
        gameFrame.setVisible(true);
    }

    public void showGameOverScreen() {
        String gameOverPic = "images/gameover.png";
        gameOverScreen = new GameOverScreen(gameOverPic);
    }

    public void showLevelCompletedScreen() {
        String levelCompletedPic = "images/levelCompleted.png";
        levelCompletedScreen = new LevelCompletedScreen(levelCompletedPic);
    }

    public void SetupGameObjects(String platformLayout) {
        try {
            java.util.List<java.util.List<String>> gameObjectRecords = new ArrayList<>();

            System.out.println(System.getProperty("user.dir"));
            Scanner scanner = new Scanner(new File(platformLayout));
            while (scanner.hasNextLine()) {
                String gameObjectRecordString = scanner.nextLine();

                java.util.List<String> gameObjectRecordValues = new ArrayList<>();
                Scanner rowScanner = new Scanner(gameObjectRecordString);
                rowScanner.useDelimiter(Const.COMMA_DELIMITER);
                while (rowScanner.hasNext()) {
                    gameObjectRecordValues.add(rowScanner.next());
                }
                gameObjectRecords.add(gameObjectRecordValues);
            }

            for (java.util.List<String> record : gameObjectRecords) {
                if (record.isEmpty() || record.get(0).trim().isEmpty())
                    continue;
                String gameObjectType = record.get(0).toUpperCase();
                int posX = Integer.parseInt(record.get(1).trim());
                int posY = Integer.parseInt(record.get(2).trim());

                switch (gameObjectType) {
                    case "P":
                        platformList.add(new Platform(posX, posY));
                        break;
                    case "G":
                        greenGooList.add(new GreenGoo(posX, posY));
                        break;
                    case "D":
                        doorList.add(new Door(posX, posY));
                        break;
                    case "M":
                        int movingDistance = Integer.parseInt(record.get(3).trim());
                        movingPlatformList.add(new MovingPlatform(posX, posY, movingDistance));
                        break;
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    // ------------------------------------------------------------------------------
    // main game loop
    public void runGameLoop() {

        // while (true) {
        while (gameStatus.equals("playing")) {
            gameFrame.repaint();
            try {
                Thread.sleep(Const.FRAME_PERIOD);
            } catch (Exception ignored) {
            }

            firegirl.accelerate();
            firegirl.moveX();
            firegirl.moveY(Const.GROUND);
            waterboy.accelerate();
            waterboy.moveX();
            waterboy.moveY(Const.GROUND);

            for (MovingPlatform movingPlatform : movingPlatformList) {
                movingPlatform.move();
            }

            for (MovingPlatform movingPlatform : movingPlatformList) {
                // if the jumper is moving down and collides with a moving platform
                if (firegirl.getVy() > 0 && firegirl.collides(movingPlatform)) {
                    firegirl.setY(movingPlatform.getY() - firegirl.getHeight());
                    firegirl.setOnMovingPlatform(movingPlatform);
                }
                // if the jumper is moving up and collides with the platform
                else if (firegirl.getVy() < 0 && firegirl.collides(movingPlatform)) {
                    firegirl.setY(movingPlatform.getY() - firegirl.getHeight());
                    firegirl.setOnMovingPlatform(movingPlatform);
                }
                // if the jumper is moving down and collides with a moving platform
                if (waterboy.getVy() > 0 && waterboy.collides(movingPlatform)) {
                    waterboy.setY(movingPlatform.getY() - waterboy.getHeight());
                    waterboy.setOnMovingPlatform(movingPlatform);
                }
                // if the jumper is moving up and collides with the platform
                else if (waterboy.getVy() < 0 && waterboy.collides(movingPlatform)) {
                    waterboy.setY(movingPlatform.getY() - waterboy.getHeight());
                    waterboy.setOnMovingPlatform(movingPlatform);
                }
            }

            for (Platform platform : platformList) {
                // if the object is moving down and collides with the platform
                if (firegirl.getVy() > 0 && firegirl.collides(platform)) {
                    firegirl.setY(platform.getY() - firegirl.getHeight());
                    firegirl.setVy(0);
                }
                // if the object is moving up and collides with the platform
                else if (firegirl.getVy() < 0 && firegirl.collides(platform)) {
                    firegirl.setY(platform.getY() + platform.getHeight());
                    firegirl.setVy(0);
                }
                // if the object is moving down and collides with the platform
                if (waterboy.getVy() > 0 && waterboy.collides(platform)) {
                    waterboy.setY(platform.getY() - waterboy.getHeight());
                    waterboy.setVy(0);
                }
                // if the object is moving up and collides with the platform
                else if (waterboy.getVy() < 0 && waterboy.collides(platform)) {
                    waterboy.setY(platform.getY() + platform.getHeight());
                    waterboy.setVy(0);
                }

            }

            // if the object collides with the door
            for (Door door : doorList) {
                if (firegirl.collides(door) && waterboy.collides(door)) {
                    gameStatus = "Won";
                    firegirl.setVx(0);
                    firegirl.setVy(0);
                    waterboy.setVx(0);
                    waterboy.setVy(0);
                    System.out.println("Great job!");
                }
            }

            // if the object collides with any of the GreenGoo
            for (GreenGoo greenGoo : greenGooList) {
                if (firegirl.collides(greenGoo) || waterboy.collides(greenGoo)) {
                    gameStatus = "Lost";
                    firegirl.setVx(0);
                    firegirl.setVy(0);
                    waterboy.setVx(0);
                    waterboy.setVy(0);
                    System.out.println("Fail!");
                    gameFrame.dispose();
                }
            }

            // if jumper hits left edge of the screen, it should bounce back
            if (firegirl.getX() <= 1) {
                firegirl.setX(2 * Math.abs(firegirl.getX()));
            } else if (firegirl.getX() >= Const.WIDTH) {
                firegirl.setX(2 * Const.WIDTH - firegirl.getX());
            }

            if (waterboy.getX() <= 1) {
                waterboy.setX(2 * Math.abs(waterboy.getX()));
            } else if (waterboy.getX() >= Const.WIDTH) {
                waterboy.setX(2 * Const.WIDTH - waterboy.getX());
            }

        }
    }

    // ------------------------------------------------------------------------------
    // act upon key events
    public class MyKeyListener implements KeyListener {
        public void keyPressed(KeyEvent e) {
            int key = e.getKeyCode();
            if ((key == KeyEvent.VK_UP) && (firegirl.getVy() == 0 || firegirl.getOnMovingPlatform())) {
                if (firegirl.getOnMovingPlatform()) {
                    firegirl.setVy(Const.JUMP_SPEED + firegirl.getMovingPlatformVy());
                } else {
                    firegirl.setVy(Const.JUMP_SPEED);
                }
                System.out.println("up is pressed");
                firegirl.unsetOnMovingPlatform();
            }
            if (key == KeyEvent.VK_LEFT) {
                firegirl.setVx(-Const.RUN_SPEED);
                System.out.println("left is pressed");
                firegirl.unsetOnMovingPlatform();
            }
            if (key == KeyEvent.VK_RIGHT) {
                firegirl.setVx(Const.RUN_SPEED);
                System.out.println("right is pressed");
                firegirl.unsetOnMovingPlatform();
            }
            if ((key == KeyEvent.VK_W) && (waterboy.getVy() == 0 || waterboy.getOnMovingPlatform())) {
                waterboy.setVy(Const.JUMP_SPEED);
                System.out.println("up is pressed");
                waterboy.unsetOnMovingPlatform();
            }
            if (key == KeyEvent.VK_A) {
                waterboy.setVx(-Const.RUN_SPEED);
                System.out.println("left is pressed");
                waterboy.unsetOnMovingPlatform();
            }
            if (key == KeyEvent.VK_D) {
                waterboy.setVx(Const.RUN_SPEED);
                System.out.println("right is pressed");
                waterboy.unsetOnMovingPlatform();
            }

        }

        public void keyReleased(KeyEvent e) {
            int key = e.getKeyCode();
            if (key != KeyEvent.VK_LEFT) {
                firegirl.setVx(0);
            }
            if (key != KeyEvent.VK_RIGHT) {
                firegirl.setVx(0);
            }
            if (key != KeyEvent.VK_A) {
                waterboy.setVx(0);
            }
            if (key != KeyEvent.VK_D) {
                waterboy.setVx(0);
            }
        }

        public void keyTyped(KeyEvent e) {
        }
    }

    // ------------------------------------------------------------------------------
    // draw everything
    public class GamePanel extends JPanel {
        GamePanel() {
            setFocusable(true);
            requestFocusInWindow();
        }

        @Override
        public void paintComponent(Graphics g) {
            super.paintComponent(g); // required
            background.draw(g);

            for (Platform platform : platformList) {
                platform.draw(g);
            }
            for (GreenGoo greenGoo : greenGooList) {
                greenGoo.draw(g);
            }
            for (Door door : doorList) {
                door.draw(g);
            }
            for (MovingPlatform movingPlatform : movingPlatformList) {
                movingPlatform.draw(g);
            }
            if (gameOverScreen != null) {
                gameOverScreen.draw(g);
            }
            if (levelCompletedScreen != null) {
                levelCompletedScreen.draw(g);
            }
            firegirl.draw(g);
            waterboy.draw(g);
        }
    }

    public static void main(String[] args) {
        Game game = new Game();
        game.setGameLevel(1);
        game.gameSetMenuDisabled();
        game.setUpGamePlatform();
        game.runGameLoop();
    }

}