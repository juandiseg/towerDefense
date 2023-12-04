import MonsterPath from "./MonsterPath";

export default class Monster{
    private path:MonsterPath
    private position:{x:number, y:number}
    private displayPosition:{ x: number; y: number; }
    private livesCount:number
    private monsterSize = {height:30, width: 30}
    private finishedPath = false

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

    public update():boolean{
        const speed:number = 10 //pixels per second
        const frameRate:number = 1000 // frames per second
        // moving in a straight lines vertically to the left.
        this.position = {x: this.position.x-(speed/frameRate), y:this.position.y}
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

    public isPathFinished():boolean{
        return this.finishedPath;
    }
}