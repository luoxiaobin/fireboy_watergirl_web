// OBSOLETE CODE - REFERENCE ONLY (See webapp directory for active code)
import java.awt.*;

public class GreenGoo extends GameObject {

    //------------------------------------------------------------------------------
    GreenGoo (int x , int y) {
        super ("G", x, y, ".//images//greengoo.png");
    }

    public void draw(Graphics g) {
        g.setColor(Color.green);
        super.draw(g);
    }

}
