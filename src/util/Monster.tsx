import MonsterPath from "./MonsterPath";

export default class Monster{
    private path:MonsterPath
    private position:{x:number, y:number}
    private displayPosition:{ x: number; y: number; }
    private livesCount:number
    private hp:number = 50;
    private monsterSize = {height:30, width: 30}
    private finishedPath = false
    private beenKilled = false

    public constructor(livesCount:number, height:number, width:number){
        this.path = new MonsterPath(height, width);
        this.position = {x:width, y:height/2}
        this.displayPosition = {x:width, y:height/2}
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
        return {x1: this.displayPosition.x, y1: this.displayPosition.y, x2: this.displayPosition.x+this.monsterSize.width, y2: this.displayPosition.x+this.monsterSize.height}
    }
    public receiveDamage(damage:number):void{
        console.log("HEALTH : " + this.hp)
        console.log("DAMAGE : " + damage)

        this.hp = this.hp - damage;
        if(this.hp <= 0){
            this.beenKilled = true;
        }
    }

    public hasMonsterBeenKilled():boolean{
        return this.beenKilled || this.isPathFinished();
    }


    public update():boolean{
        // moving in a straight lines vertically to the left.
        this.position = {x: this.position.x-(this.getSpeed()), y:this.position.y}
        // The display position is the position for the top-left corner so when used to print to the canvas the monster's center would be in position
        const xDisplay:number = this.position.x - (this.monsterSize.width / 2)
        const yDisplay:number = this.position.y - (this.monsterSize.height / 2)
        this.displayPosition = {x: xDisplay, y: yDisplay}
        if(this.displayPosition.x <= 0){
            this.decreaseHP()
            this.finishedPath = true;
            return false;
        }
        return true;
    }

    public decreaseHP():void{
        this.livesCount = this.livesCount - 1;
    }

    public getCoordinates():{x:number, y:number}{
        return this.position;
    }

    public isPathFinished():boolean{
        return this.finishedPath;
    }

    public getSpeed():number{
        const distance:number = 100 //pixels
        const frameRate:number = 50 //frames per second
        return distance/frameRate; // pixels per second.
    }
}