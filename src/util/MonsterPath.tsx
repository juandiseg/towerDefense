export default class MonsterPath{
    private beginning:{x:number, y:number}
    private end:{x:number, y:number}

    public constructor(height:number, width:number){
        this.beginning = {x: width, y: height/2}
        this.end = {x: 0, y: height/2}
    }
}