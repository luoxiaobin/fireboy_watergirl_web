// OBSOLETE CODE - REFERENCE ONLY (See webapp directory for active code)
import java.awt.*;

public class Door extends GameObject {
    
    //------------------------------------------------------------------------------
    Door (int x , int y) {
        super ("G", x, y, ".//images//door.png");
    }
    
    public void draw (Graphics g) {
        g.setColor(Color.white);
        super.draw(g);
    }
}
