// OBSOLETE CODE - REFERENCE ONLY (See webapp directory for active code)
import java.awt.*;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public abstract class GameObject {
    private final String ObjectType;
    private int x;
    private int y;
    private final int width;
    private final int height;
    private BufferedImage picture;
    private final Rectangle box;

    public GameObject (String ObjectType , int x , int y , String picName) {
        this.ObjectType = ObjectType;
        this.x = x;
        this.y = y;

        try {
            this.picture = ImageIO.read ( new File ( picName ) );
        } catch (IOException ex) {

        }


        //we still need a Rectangle object to be able to detect collision etc. but let's not draw it
        this.width = this.picture.getWidth ( );
        this.height = this.picture.getHeight ( );
        this.box = new Rectangle ( x , y , this.width , this.height );
    }

    public String ObjectType ( ) {
        return ObjectType;
    }

    public void setX (int x) {
        this.x = x;
    }

    public int getX ( ) {
        return this.x;
    }

    public void setY (int y) {
        this.y = y;
    }

    public int getY ( ) {
        return this.y;
    }

    public int getWidth ( ) {
        return this.width;
    }

    public int getHeight ( ) {
        return this.height;
    }

    public Rectangle getBox ( ) {
        return this.box;
    }

    //------------------------------------------------------------------------------
    public void draw (Graphics g) {
        //g.fillRect ( this.x , this.y , this.width , this.height );
        if (this.ObjectType.equals ( "B" )) {
            g.drawImage ( this.picture , this.x , this.y , null );
        } else {
            //g.drawImage(this.picture, this.x-this.width, this.y-this.height, null);
            g.drawImage ( this.picture , this.x , this.y , null );
        }

    }

}
