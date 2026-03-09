// OBSOLETE CODE - REFERENCE ONLY (See webapp directory for active code)
import java.awt.*;

public class InstructionScreen extends GameObject {

    //------------------------------------------------------------------------------
    InstructionScreen(String picName) {
        //super ( "G" , x , y , width , height );
        super ("L", (Const.WIDTH-200)/2, (Const.HEIGHT-200)/2, picName);
    }

    public void draw (Graphics g) {
        super.draw(g);
    }

}
