import Tower from "./Tower";

export default class IceTower extends Tower{

    private towerWidth = 200;
    private towerHeight = 320;

    public constructor(){
        super("Ice Tower", 200);
    }

    draw(ctx:CanvasRenderingContext2D, point:any) : void{
        if(point != null){
            ctx.beginPath();
            ctx.rect(point.x - this.towerWidth/2, point.y - this.towerHeight/2, this.towerWidth, this.towerHeight)
            ctx.stroke()
        } else {
            console.log("point not possible")
        }
    }
    
    getDimensions(): { height: number, width: number } {
        return {height: this.towerHeight, width:this.towerWidth}
    }
}


