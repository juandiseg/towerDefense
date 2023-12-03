import Tower from "./Tower";

export default class IceTower extends Tower{

    public constructor(){
        super("Ice Tower", 200);
    }

    draw(ctx:any, point:any) : void{
        const towerWidth = 50;
        const towerHeight = 80;
        if(point != null){
            ctx.beginPath();
            ctx.rect(point.x - towerWidth/2,point.y - towerHeight/2, towerWidth*4, towerHeight*4)
            ctx.stroke()
        } else {
            console.log("point not possible")
        }
    }
    
}


