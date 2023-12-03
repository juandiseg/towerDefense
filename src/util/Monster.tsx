import MonsterPath from "./MonsterPath";

export default class Monster{
    private path:MonsterPath
    private position:{x:number, y:number}
    private displayPosition:{ x: number; y: number; }
    private livesCount:number
    private monsterSize = {height:30, width: 30}

    public constructor(livesCount:number, height:number, width:number){
        this.path = new MonsterPath(height, width);
        this.position = {x:height/2, y:width}
        this.displayPosition = {x:height/2, y:width}
        this.livesCount = livesCount;
    }

    // Requires the canvas' context to draw on it.
    public display(ctx:any){
        // erase previous drawing of this monster
        ctx.beginPath();
        ctx.rect(this.displayPosition.x, this.displayPosition.y, this.monsterSize.width, this.monsterSize.height)
        ctx.stroke()
    }

    public update(){
        const speed:number = 100 //pixels per second
        const frameRate:number = 50 // frames per second
        // moving in a straight lines vertically to the left.
        this.position = {x: this.position.x-speed/frameRate, y:this.position.y}
        
        // The display position is the position for the top-left corner so when used to print to the canvas the monster's center would be in position
        const yDisplay:number = this.position.x - this.monsterSize.width / 2
        const xDisplay:number = this.position.y - this.monsterSize.height / 2
        this.displayPosition = {x: xDisplay, y: yDisplay}
        if(this.displayPosition.x <= 0){
            this.decreaseHP()
        }
    }

    public decreaseHP():void{
        this.livesCount = this.livesCount - 1;
    }
}