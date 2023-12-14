import Monster from "../util/Monster";
import Shot from "../util/Shot";
import Tower from "./Tower";

export default class PlayedTower{

    private tower:Tower
    private coordinates:{x:number, y:number}
    private currentCooldown:number = 0;
    private cooldown:number = 50/2;

    public constructor(tower:Tower, coordinates:{x:number, y:number}){
        this.tower = tower;
        this.coordinates = coordinates;
    }

    public draw(ctx:CanvasRenderingContext2D) : void{
        const height = this.tower.getDimensions().height
        const width = this.tower.getDimensions().width
        const x = this.coordinates.x;
        const y = this.coordinates.y;
        this.tower.draw(ctx, {x:x,y:y});
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

    
    public reduceCooldown():void{
        if(this.currentCooldown != 0){
            this.currentCooldown = this.currentCooldown - 1;
        }
    }

    public resetCooldown():void{
        this.currentCooldown = this.cooldown;
    }

    public createShot(target:Monster) : Shot{
        return this.tower.generateShot(this.coordinates, target);
    }

    public isNotInCooldown() : boolean{
        return this.currentCooldown == 0;
    }


    public isMonsterInRage(monster:Monster) : boolean{
        const towerRange = {x:300,y:300};
        const monsterX = monster.getCoordinates().x;
        const monsterY = monster.getCoordinates().y;
        let towerX = this.coordinates.x;
        let towerY = this.coordinates.y;
        const xRange = {x1: towerX-towerRange.x, x2:towerX+towerRange.x}
        const yRange = {y1: towerY-towerRange.y, y2:towerY+towerRange.y}
        if(xRange.x1 <= monsterX && xRange.x2 >= monsterX && yRange.y1 <= monsterY && yRange.y2 >= monsterY){
            return true;
        } else {
            return false;
        }
    }

}
