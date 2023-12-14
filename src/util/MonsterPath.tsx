export default class MonsterPath{
    private beginning:{x:number, y:number}
    private end:{x:number, y:number}
    private velocityVector:{x:number, y:number}
    private pathFinishedFlag:boolean = false
    private timeCollition:number;


    // Velocity is pixels per frame.
    public constructor(height:number, width:number, velocity:number){
        this.beginning = {x: width, y: height/2}
        this.end = {x: 0, y: height/2}
        const distanceToCover = {x:(this.end.x - this.beginning.x), y: (this.end.y - this.beginning.y)};
        const maxNumberFrames = {x: Math.abs(distanceToCover.x/velocity), y: Math.abs(distanceToCover.y/velocity)}
        if(maxNumberFrames.x == 0){
            this.velocityVector = {x:0, y: distanceToCover.y/maxNumberFrames.y};
        } else if (maxNumberFrames.y == 0){
            this.velocityVector = {x:distanceToCover.x/maxNumberFrames.x, y: 0};
        } else {
            this.velocityVector = {x:distanceToCover.x/maxNumberFrames.x, y: distanceToCover.y/maxNumberFrames.y};
        }
        if(distanceToCover.x/this.velocityVector.x != 0){
            this.timeCollition = distanceToCover.x/this.velocityVector.x;
        } else {
            this.timeCollition = distanceToCover.y/this.velocityVector.y;
        }
    }

    public calculatePosition(time:number):{x:number, y:number}{
        let position = {x:this.beginning.x + this.velocityVector.x * time, y:this.beginning.y + this.velocityVector.y * time};
        if(this.timeCollition == time){
            this.pathFinishedFlag = true;
        }
        return position; 
    }

    public calculateDisplayPosition(position:{x:number, y:number}, monsterSize:{height:number, width: number}):{x:number, y:number}{
        return {x: position.x - (monsterSize.width / 2), y: position.y - (monsterSize.height / 2)};
    }

    public isPathFinished():boolean{
        return this.pathFinishedFlag;
    }
}