import Tower from "./Tower";

export default class PlayedTower{

    private tower:Tower
    private coordinates:{x:number, y:number}


    public constructor(tower:Tower, coordinates:{x:number, y:number}){
        this.tower = tower;
        this.coordinates = coordinates;
    }

    public draw(ctx:CanvasRenderingContext2D) : void{
        const height = this.tower.getDimensions().height
        const width = this.tower.getDimensions().width
        const x = this.coordinates.x;
        const y = this.coordinates.y;
        ctx.beginPath();
        ctx.rect(x - width/2, y - height/2, width, height)
        ctx.stroke()
    }

    public equals(tower: any){
        if(tower instanceof PlayedTower){
            let temp = tower as PlayedTower
            if(temp.getName() == this.getName() && temp.getCost() == this.getCost() && temp.getCoordinates() == this.getCoordinates()){
                return true;
            }
        }
        return false
    }

    public getName() : string{
        return this.tower.getName();
    }
    public getCost() : number{
        return this.tower.getCost();
    }

    public getCoordinates() : {x:number,y:number}{
        return this.coordinates;
    }

}
