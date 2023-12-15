import Monster from "../util/Monster";
import Shot from "../util/Shooting/Shot";

export default abstract class Tower{
    private cooldown:number;
    private name:string
    private cost:number
    private towerHeight;
    private towerWidth;


    public constructor(name:string, dimension:{h:number, w:number}, cost:number, cooldown:number){
        this.name = name;
        this.cost = cost;
        this.cooldown = cooldown;
        this.towerHeight = dimension.h;
        this.towerWidth = dimension.w;
    }

    public getCooldown():number{
        return this.cooldown;
    }

    public getName() : string{
        return this.name;
    }
    public getCost() : number{
        return this.cost;
    }

    public equals(tower: any){
        if(tower instanceof Tower){
            let temp = tower as Tower
            if(temp.getName() == this.getName() && temp.getCost() == this.getCost()){
                return true;
            }
        }
        return false
    }

    public getDimensions() : {height:number,width:number}{
        return {height: this.towerHeight, width:this.towerWidth}
    }

    abstract draw(ctx:CanvasRenderingContext2D, point:any) : void;

    abstract generateShot(coordinates:{x:number,y:number}, target:Monster) : Shot;
}




  