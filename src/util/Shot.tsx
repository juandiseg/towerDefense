import Monster from "./Monster";
import ShotPath from "./ShotPath";

export default class Shot{

    private position:{x:number, y:number};
    private displayPosition:{x:number, y:number};
    private shotSize = {width:5,height:5};
    private dmg = 20;
    private shotHasLanded = false;
    private shotPath:ShotPath;

    private time:number = 0;

    private type:string;
    private goal:Monster;

    public constructor(position:{x:number, y:number}, type:string, goal:Monster){
        this.position = position;
        this.displayPosition = {x:position.x, y:position.y}
        this.type = type;
        this.goal = goal;
        this.shotPath = new ShotPath(position, goal, 400/50);
        this.goal.addHPTargeted(this.dmg);
    }

 
    
    public display(ctx:any){
        // erase previous drawing of this monster
        ctx.beginPath();
        ctx.rect(this.displayPosition.x, this.displayPosition.y, this.shotSize.width, this.shotSize.height)
        ctx.stroke()
    }

    public update():void{
        this.time++;
        this.position = this.shotPath.calculatePosition(this.time);
        this.displayPosition = this.shotPath.calculateDisplayPosition(this.position, this.shotSize);
        this.checkTargetHit()
    }

    private checkTargetHit():void{
        const position = this.displayPosition
        const monsterArea = this.goal.getArea();
        const rangeShotX = {x1:position.x, x2:position.x + this.shotSize.width}
        const rangeShotY = {y1:position.y, y2:position.y + this.shotSize.height}

        const xRange = this.inXRange(monsterArea, rangeShotX);
        const yRange = this.inYRange(monsterArea, rangeShotY);
        this.shotHasLanded = xRange && yRange; 
    }

    public hasLanded():boolean{
        return this.shotHasLanded;
    }


    private inXRange(monsterArea:{x1: number, y1: number, x2: number, y2: number}, rangeShotX:{x1:number, x2:number}):boolean{
        if(monsterArea.x1 + 5 <= rangeShotX.x1 && rangeShotX.x1 <= monsterArea.x2 - 5){
            // Shot's left X is inside the monster's area
            return true;
        }
        if(monsterArea.x1 + 5 <= rangeShotX.x2 && rangeShotX.x2 <= monsterArea.x2 - 5){
            // Shot's right X is inside the monster's area
            return true;
        }
        return false;
    }

    private inYRange(monsterArea:{x1: number, y1: number, x2: number, y2: number}, rangeShotY:{y1:number, y2:number}):boolean{
        if(monsterArea.y1 + 5 <= rangeShotY.y1 && rangeShotY.y1 <= monsterArea.y2 - 5){
            // Shot's upper Y is inside the monster's area
            return true;
        }
        if(monsterArea.y1 + 5 <= rangeShotY.y2 && rangeShotY.y2 <= monsterArea.y2 - 5){
            // Shot's down Y is inside the monster's area
            return true;
        }
        return false;
    }

    public dealDamage():void{
        this.goal.receiveDamage(this.dmg);
    }

    public isShotOfScreen():boolean{
        const dPosition = this.displayPosition;
        return dPosition.x < 0 || dPosition.x>700 || dPosition.y < 0 || dPosition.y > 500
    }

    public targetIsDead():boolean{
        return this.goal.isDead();
    }

}