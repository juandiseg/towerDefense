import Monster from "./Monster";

export default class Shot{

    private position:{x:number, y:number};
    private displayPosition:{x:number, y:number};
    private shotSize = {width:5,height:5};
    private speed = 400/50;
    private dmg = 20;
    private shotHasLanded = false;

    private type:string;
    private goal:Monster;

    public constructor(position:{x:number, y:number}, type:string, goal:Monster){
        this.position = position;
        this.displayPosition = {x:position.x, y:position.y}
        this.type = type;
        this.goal = goal;
    }

    public display(ctx:any){
        // erase previous drawing of this monster
        ctx.beginPath();
        ctx.rect(this.displayPosition.x, this.displayPosition.y, this.shotSize.width, this.shotSize.height)
        ctx.stroke()
    }

    public update(){
        // UPDATE REAL POSITION
        const ratio = this.getRatio()
        this.position = this.calculateMoveDirection(ratio)

        //UPDATE DISPLAY POSITION
        const xDisplay:number = this.position.x - (this.shotSize.width / 2)
        const yDisplay:number = this.position.y - (this.shotSize.height / 2)
        this.displayPosition = {x: xDisplay, y: yDisplay}

        //if(this.displayPosition.x <= 0){
        //    this.decreaseHP()
        //    this.finishedPath = true;
        //    return false;
        //}
        return true;
    }

    public hasLanded():boolean{
        return this.shotHasLanded;
    }

    public dealDamage():void{
        this.goal.receiveDamage(this.dmg);
    }

    public isTargetAlive():boolean{
        return !this.goal.hasMonsterBeenKilled()
    }

    private calculateMoveDirection(ratio:{x:number, y:number}):{x:number, y:number}{
        let newX:number;
        let newY:number;
        if(this.goal.getCoordinates().x > this.position.x){
            newX = this.position.x + ratio.x*this.speed;
        } else {
            newX = this.position.x - ratio.x*this.speed;
        }
        if(this.goal.getCoordinates().y > this.position.y){
            newY = this.position.y + ratio.y*this.speed;
        } else {
            newY = this.position.y - ratio.y*this.speed;
        }

        // CHECK IF SHOT HAS LANDED       
        const monsterArea = this.goal.getArea();
        const rangeShotX = {x1:newX-this.shotSize.width/2, x2:newX+this.shotSize.width/2}
        const rangeShotY = {y1:newY-this.shotSize.height/2, y2:newY+this.shotSize.height/2}

        if(monsterArea.x1 <= rangeShotX.x2 && monsterArea.x2 >= rangeShotX.x1 && monsterArea.y1 <= rangeShotY.y2 && monsterArea.y2 >= rangeShotY.y1){
            this.shotHasLanded = true;
        }

        return {x:newX, y:newY};
    }

    private getRatio(): {x:number, y:number}{
        const monsterX = this.goal.getCoordinates().x
        const shotX = this.displayPosition.x
        const differenceX = Math.abs(monsterX - shotX)
        
        const monsterY = this.goal.getCoordinates().y
        const shotY = this.displayPosition.x
        const differenceY = Math.abs(monsterY - shotY)

        if(differenceX > differenceY){
            return {x: 1,y: differenceY/differenceX}
        } else {
            return {x: differenceX/differenceY,y: 1}
        }
    }

}