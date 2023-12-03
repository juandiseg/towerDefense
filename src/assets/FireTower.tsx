import Tower from "./Tower";

export default class FireTower extends Tower{

    public constructor(){
        super("Fire Tower", 100);
    }

    draw(ctx:any, point:any) : void{
        const towerWidth = 50;
        const towerHeight = 80;
        if(point != null){
            ctx.beginPath();
            ctx.rect(point.x - towerWidth/2,point.y - towerHeight/2, towerWidth*2, towerHeight*2)
            ctx.stroke()
        } else {
            console.log("point not possible")
        }
    }
    
}