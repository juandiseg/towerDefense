import Monster from "../util/Monster";
import RegularShot from "../util/RegularShot";
import Shot from "../util/Shot";
import Tower from "./Tower";

export default class RegularTower extends Tower{
    
    private towerWidth = 50;
    private towerHeight = 80;
    private borderColor = "black"
    private towerColor = "orange"


    public constructor(){
        super("Regular Tower", 50);
    }

    draw(ctx:CanvasRenderingContext2D, point:any) : void{
        ctx.fillStyle = this.borderColor
        ctx.fillRect(point.x - this.towerWidth/2-1, point.y - this.towerHeight/2-1, this.towerWidth+2, this.towerHeight+2)
            
        ctx.fillStyle = this.towerColor
        const peakMeasure = this.towerWidth/5;
        ctx.fillRect(point.x - this.towerWidth/2, point.y - this.towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - this.towerWidth/2 + peakMeasure*2, point.y - this.towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - this.towerWidth/2 + peakMeasure*4, point.y - this.towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - this.towerWidth/2, point.y - this.towerHeight/2 + peakMeasure, this.towerWidth, this.towerHeight - peakMeasure)
    
        ctx.fillStyle = this.borderColor
        const doorHeigth = 3/8*this.towerHeight
        const doorDimensions = 8/25*this.towerWidth
        const doorMargin = 17/25*this.towerWidth/2

        ctx.fillRect(point.x - this.towerWidth/2 + doorMargin, point.y - this.towerHeight/2 + this.towerHeight - doorHeigth, doorDimensions, doorHeigth)
    }

    getDimensions(): { height: number, width: number } {
        return {height: this.towerHeight, width:this.towerWidth}
    }
    
    generateShot(coordinates:{x:number,y:number}, target:Monster) : Shot{
        return new RegularShot(coordinates, target);
    }
}
