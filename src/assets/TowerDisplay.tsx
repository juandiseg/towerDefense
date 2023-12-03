import Tower from "./Tower";

class TowerDisplay{
    private tower:Tower
    private x:number
    private y:number

    public constructor(tower:Tower, x:number, y:number){
        this.tower = tower;
        this.x = x;
        this.y = y;
    }
}