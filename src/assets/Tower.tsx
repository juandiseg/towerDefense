import Monster from "../util/Monster";
import Shot from "../util/Shot";

export default abstract class Tower{
    private name:string
    private cost:number
    private cooldown:number
    private currentCooldown:number

    public constructor(name:string, cost:number, cooldown:number){
        this.name = name;
        this.cost = cost;
        this.cooldown = cooldown;
        this.currentCooldown = 0;
    }

    public getName() : string{
        return this.name;
    }
    public getCost() : number{
        return this.cost;
    }

    public getCooldown() : number{
        return this.currentCooldown;
    }
    public reduceCooldown():void{
        if(this.currentCooldown != 0){
            this.currentCooldown = this.currentCooldown - 1;
        }
    }

    public resetCooldown():void{
        this.currentCooldown = this.cooldown;
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

    abstract getDimensions() : {height:number,width:number};

    abstract draw(ctx:CanvasRenderingContext2D, point:any) : void;

    abstract generateShot(coordinates:{x:number,y:number}, target:Monster) : Shot;
}




  