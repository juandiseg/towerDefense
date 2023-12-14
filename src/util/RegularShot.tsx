import Monster from "./Monster";
import Shot from "./Shot";

export default class RegularShot extends Shot{
    
    private size = {width:5, height:5};

    public constructor(position:{x:number, y:number}, goal:Monster){
        super(position, goal, {width:5, height:5}, 400/50, 20)
    }

    public display(ctx:any){
        // erase previous drawing of this monster
        const displayPosition = this.getDisplayPosition();
        ctx.beginPath();
        ctx.rect(displayPosition.x, displayPosition.y, this.size.width, this.size.height)
        ctx.stroke()
    }
}