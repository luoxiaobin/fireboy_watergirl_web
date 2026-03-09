// OBSOLETE CODE - REFERENCE ONLY (See webapp directory for active code)
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class Jumper {
    private final int height;
    private final Rectangle box;
    private int x;
    private int y;
    private int Vx;
    private int Vy;
    private boolean isOnMovingPlatform;
    private MovingPlatform currentMovingPlatform;
    private BufferedImage picture;

    //------------------------------------------------------------------------------
    Jumper(int x, int y, String picName) {

        this.x = x;
        this.y = y;
        this.Vx = 0;
        this.Vy = 0;
        this.isOnMovingPlatform = false;

        try {
            this.picture = ImageIO.read(new File (picName));
        }
        catch (IOException ex){}

        int width = this.picture.getWidth ( );
        this.height = this.picture.getHeight();
        this.box = new Rectangle(x, y, width , this.height);
    }

    //------------------------------------------------------------------------------
    public int getHeight() {
        return this.height;
    }
    public int getVy() {
        return this.Vy;
    }
    public void setVy(int Vy) {
        this.Vy = Vy;
    }
    public int getVx() {
        return this.Vx;
    }
    public void setVx(int Vx) {
        this.Vx = Vx;
    }
    public Rectangle getBox() {
        return this.box;
    }
    public void setX(int x) {
        this.x = x;
    }
    public int getX() {
        return this.x;
    }
    public void setY(int y) {
        this.y = y;
    }
    public void setBox() {
        this.box.setLocation(this.x, this.y);
    }

    //------------------------------------------------------------------------------
    public void draw (Graphics g) {
        g.setColor(Color.red);
        //g.fillRect (this.x, this.y, this.width, this.height);
        g.drawImage(this.picture, this.x, this.y, null);
    }

    public void accelerate() {
        //only when jumper is not on moving platform
        if (!this.isOnMovingPlatform) {
            this.Vy += Const.GRAVITY;
        }
    }

    public void moveX() {
        this.x += this.Vx;
        //this.setVx(0);
        this.setBox();
    }

    public void setOnMovingPlatform(MovingPlatform movingPlatform) {
        this.currentMovingPlatform = movingPlatform;
        this.isOnMovingPlatform = true;     
    }
    
    public void unsetOnMovingPlatform() {
        this.currentMovingPlatform = null;
        this.isOnMovingPlatform = false;     
    }

    public boolean getOnMovingPlatform() {
        return this.isOnMovingPlatform;     
    }

    public int getMovingPlatformVy() {
        int movingPlatformVy = 0;
        if (this.isOnMovingPlatform)
            movingPlatformVy = currentMovingPlatform.getVy();
        return movingPlatformVy;     
    }

    
    public void moveY(int bottomLimit) {
        //when jumper is stuck on moving platform
        if (this.isOnMovingPlatform) {
            this.y += this.currentMovingPlatform.getVy();
        }
        else { //when jumper is not on a moving platform
            this.y += this.Vy;
            if (this.y + this.height >= bottomLimit) {
                this.y = bottomLimit - this.height;
                this.Vy = 0;
                System.out.println("On the ground!");
            }
        }
        this.setBox(); 
    } 
    
    public boolean collides(GameObject object){
        return this.getBox().intersects(object.getBox()); 
    }     
    public boolean isOnLevel(int level){ 
        return (this.y + this.height == level); 
    } 
}
