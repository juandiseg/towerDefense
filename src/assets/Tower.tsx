export default abstract class Tower{
    private name:string
    private cost:number

    public constructor(name:string, cost:number){
        this.name = name;
        this.cost = cost;
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

    abstract getDimensions() : {height:number,width:number};

    abstract draw(ctx:CanvasRenderingContext2D, point:any) : void;
}




  