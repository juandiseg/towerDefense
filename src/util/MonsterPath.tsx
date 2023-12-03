export default class MonsterPath{
    private beginning:{x:number, y:number}
    private end:{x:number, y:number}

    public constructor(height:number, width:number){
        this.beginning = {x: height/2, y: width}
        this.end = {x: height/2, y: 0}
    }
}