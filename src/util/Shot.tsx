import Monster from "./Monster";

export default class Shot{

    private position:{x:number, y:number};
    private type:string;
    private goal:Monster;

    public constructor(position:{x:number, y:number}, type:string, goal:Monster){
        this.position = position;
        this.type = type;
        this.goal = goal;
    }

}