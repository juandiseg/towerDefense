import Tower from "./Tower";

export default class RegularTower extends Tower{

    public constructor(){
        super("Regular Tower", 50);
    }

    draw(ctx:any, point:any) : void{
        const towerWidth = 50;
        const towerHeight = 80;
        if(point != null){
            ctx.beginPath();
            ctx.rect(point.x - towerWidth/2,point.y - towerHeight/2, towerWidth, towerHeight)
            ctx.stroke()
        } else {
            console.log("point not possible")
        }
    }
    
}
