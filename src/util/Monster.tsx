import MonsterPath from "./MonsterPath";

const ORIGINAL_HP:number = 50; 
export default class Monster{
    private path:MonsterPath
    private position:{x:number, y:number}
    private displayPosition:{ x: number; y: number; }
    private livesCount:number
    private hp:number = ORIGINAL_HP;
    private targetedHp:number = 0;
    private monsterSize = {height:30, width: 30}
    private beenKilled = false
    private time:number = 0;
    private speed:number;


    public constructor(livesCount:number, height:number, width:number, pixelsPerFrame:number){

        const positionFactor = Math.round(Math.random()*30)
        const directionFactor = Math.round(Math.random()) * 2 - 1
        const randomFactor = positionFactor*directionFactor*2

        this.speed = pixelsPerFrame;
        this.path = new MonsterPath(height+randomFactor, width, this.speed);
        this.position = {x:width, y:(height+randomFactor)/2}
        this.displayPosition = {x:width, y:(height+randomFactor)/2}
        this.livesCount = livesCount;
    }

    // Requires the canvas' context to draw on it.
    public display(ctx:any){
        // erase previous drawing of this monster
        ctx.beginPath();
        ctx.rect(this.displayPosition.x, this.displayPosition.y, this.monsterSize.width, this.monsterSize.height)
        ctx.stroke()
    }

    public getArea():{x1:number, y1:number, x2:number, y2:number}{
        return {x1: this.displayPosition.x, y1: this.displayPosition.y, x2: this.displayPosition.x+this.monsterSize.width, y2: this.displayPosition.y+this.monsterSize.height}
    }

    public receiveDamage(damage:number):void{
        this.hp = this.hp - damage;
        if(this.hp <= 0){
            this.beenKilled = true;
        }
    }

    public addHPTargeted(damage:number):void{
        this.targetedHp = this.targetedHp + damage;
    }

    public hasTargetedLeftHP():boolean{
        return this.targetedHp < ORIGINAL_HP;
    }

    public monsterDeadOrOffScreen():boolean{
        return this.beenKilled || this.isPathFinished();
    }

    public isDead():boolean{
        return this.beenKilled;
    }

    public update():boolean{
        this.time++;
        // moving in a straight lines vertically to the left.
        this.position = this.path.calculatePosition(this.time, true);
        // The display position is the position for the top-left corner so when used to print to the canvas the monster's center would be in position
        this.displayPosition = this.path.calculateDisplayPosition(this.position, this.monsterSize)
        if(this.path.isPathFinished()){
            this.decreaseHP()
            return false;
        }
        return true;
    }

    public getPositionAtSurplusTime(i:number):{x:number,y:number}{
        return this.path.calculatePosition(i, false);
    }

    public getInitialTime():number{
        return this.time;
    }

    public decreaseHP():void{
        this.livesCount = this.livesCount - 1;
    }

    public getCoordinates():{x:number, y:number}{
        return this.position;
    }

    public isPathFinished():boolean{
        return this.path.isPathFinished();
    }

    public getSpeed():number{
        return this.speed
    }
}