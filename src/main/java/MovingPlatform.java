// OBSOLETE CODE - REFERENCE ONLY (See webapp directory for active code)
import java.awt.*;

public class MovingPlatform extends GameObject {
    private int Vy;
    private final int movingDistance;
    private final int originalY;


    //------------------------------------------------------------------------------
    MovingPlatform(int x, int y, int movingDistance) {
        super ("G", x, y, ".//images//platform.png");
        this.originalY = y;
        this.Vy = Const.PLATFORM_SPEED;
        this.movingDistance = movingDistance; 
    }

    public int getVy() {
        return this.Vy;
    }

    public void move() {
        
        this.setY(this.getY()+this.Vy);
 
        //if it reaches movingDistance, it will flip the velocity
        if ((this.getY()-this.originalY) > this.movingDistance) {
            this.Vy = -1 * this.Vy;
        }
        else if ((this.originalY - this.getY()) > this.movingDistance) {
             this.Vy = -1 * this.Vy;
        }
    }
       
    public void draw(Graphics g) {
        g.setColor(Color.blue);
        super.draw(g);
    }

}
