import Shot from "./util/Shot";

export default class ShotWrapper{
    private shots:Shot[] = []

    public constructor(){}

    public getShots():Shot[]{
        return this.shots;
    }

    public setShots(newShots:Shot[]):void{
        this.shots = newShots
    }

    public addShot(newShot:Shot):void{
        this.shots.push(newShot)
    }

    public addShots(newShot:Shot[]):void{
        newShot.forEach((shot)=>{
            this.shots.push(shot)
        })
    }


}