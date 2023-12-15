import FireShot from "../util/Shooting/FireShot";
import Monster from "../util/Monster";
import Shot from "../util/Shooting/Shot";
import Tower from "./Tower";

export default class FireTower extends Tower{

    private borderColor = "black"
    private towerColor = "red"

    public constructor(cost:number, cooldown:number){
        super("Fire Tower", {h:80,w:50}, cost, cooldown);
    }

    draw(ctx:CanvasRenderingContext2D, point:any) : void{
        const dimensions = this.getDimensions()
        const towerWidth = dimensions.width;  
        const towerHeight = dimensions.height;  

        ctx.fillStyle = this.borderColor
        ctx.fillRect(point.x - towerWidth/2-1, point.y - towerHeight/2-1, towerWidth+2, towerHeight+2)
                
        ctx.fillStyle = this.towerColor
        const peakMeasure = towerWidth/5;
        ctx.fillRect(point.x - towerWidth/2, point.y - towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - towerWidth/2 + peakMeasure*2, point.y - towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - towerWidth/2 + peakMeasure*4, point.y - towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - towerWidth/2, point.y - towerHeight/2 + peakMeasure, towerWidth, towerHeight - peakMeasure)
        
        ctx.fillStyle = this.borderColor
        const doorHeigth = 3/8*towerHeight
        const doorDimensions = 8/25*towerWidth
        const doorMargin = 17/25*towerWidth/2
    
        ctx.fillRect(point.x - towerWidth/2 + doorMargin, point.y - towerHeight/2 + towerHeight - doorHeigth, doorDimensions, doorHeigth)
    }

    generateShot(coordinates:{x:number,y:number}, target:Monster) : Shot{
        return new FireShot(coordinates, target);
    }
}