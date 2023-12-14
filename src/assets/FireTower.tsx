import Monster from "../util/Monster";
import Shot from "../util/Shot";
import Tower from "./Tower";

export default class FireTower extends Tower{

    private towerWidth = 100;
    private towerHeight = 160;

    public constructor(){
        super("Fire Tower", 100);
    }

    draw(ctx:CanvasRenderingContext2D, point:any) : void{
        if(point != null){
            ctx.beginPath();
            ctx.rect(point.x - this.towerWidth/2,point.y - this.towerHeight/2, this.towerWidth, this.towerHeight)
            ctx.stroke()
        } else {
            console.log("point not possible")
        }
    }
    
    getDimensions(): { height: number, width: number } {
        return {height: this.towerHeight, width:this.towerWidth}
    }

    generateShot(coordinates:{x:number,y:number}, target:Monster) : Shot{
        return new Shot(coordinates, "Fire Tower", target);
    }
}