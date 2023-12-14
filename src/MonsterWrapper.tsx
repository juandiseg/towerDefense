import Monster from "./util/Monster";

export default class MonsterWrapper{
    private monsters:Monster[] = []

    public constructor(){}

    public getMonsters():Monster[]{
        return this.monsters;
    }

    public setMonsters(newMonsters:Monster[]):void{
        this.monsters = newMonsters
    }

    public addMonster(newMonster:Monster):void{
        this.monsters.push(newMonster)
    }

}