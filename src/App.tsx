import { useEffect, useRef, useState } from 'react'
import Tower from "./assets/Tower"
import RegularTower from "./assets/RegularTower"
import FireTower from './assets/FireTower'
import IceTower from './assets/IceTower'
import Canvas from "./Components/Canvas"
import PlayedTower from './assets/PlayedTower'
import Monster from './util/Monster'
import Shot from './util/Shot'
import ShotWrapper from './ShotWrapper'
import MonsterWrapper from './MonsterWrapper'
import CircularProgress from '@mui/material/CircularProgress';    

function App() {

  const [framesUntilNextWave, setFrames] = useState<number>(40) // was 100

  const height = 500
  const width = 700

  const topGrass:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:0, x2:width, y2:205}
  const centerPath:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:205, x2:width, y2:90}
  const bottomGrass:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:height-205, x2:width, y2:height}

  const grassColor:string = "green"
  const pathColor:string = "brown"

  const [monstersThisRound, setMonstersThisRound] = useState<number>(20)

  const [roundMonstersLeft, setRoundMonstersLeft] = useState<number>(20)

  const towers = [new RegularTower(50, 28), new FireTower(100, 50), new IceTower(200, 7)]

  const [hpLimit, setHpLimit] = useState<number>(10)

  const [gameStarted, setStart] = useState<boolean>(false)
  const [isAlive, setIsAlive] = useState<boolean>(true)
  const [gold, setGold] = useState<number>(100)
  const [pickedTower, setPickedTower] = useState<Tower>(towers[0])
  const [playerLevel, setLevel] = useState<number>(1)
  const [playedTowers, setPlayedTowers] = useState<PlayedTower[]>([])
  const [shots, setShot] = useState<ShotWrapper>(new ShotWrapper())
  
  const [monsterSpeed, setMonsterSpeed] = useState<number>(2)
  
  const [hp, setHp] = useState<number>(10)
  const [aliveMonsters, setAliveMonsters] = useState<MonsterWrapper>(new MonsterWrapper())
  const [monsterTimer, setMonsterTimer] = useState<number>(0)

  const [wave, setWave] = useState<boolean>(false)
  
  let levelUpGoal:number = 30;
  const [mLimitCd, setMLimitCd] = useState<number>(100)

  const [levelUpStatus, setLevelUpStatus] = useState<number>(0)

  
  const [time, setTime2] = useState(Date.now());
  
  useEffect(() => {
    if(gameStarted && isAlive){
      const ctx = canvasRef.current.getContext('2d');
      if(wave == false && aliveMonsters.getMonsters().length == 0){
        if(framesUntilNextWave-1 <= 20){
          setWave(true)
          setMonstersThisRound(Math.round(monstersThisRound * 1.25))
          setRoundMonstersLeft(monstersThisRound)
        } else {
          setFrames(framesUntilNextWave-1)
        }
      }
      if(wave || aliveMonsters.getMonsters().length > 0){
        drawNextFrame(ctx)
        setPlayedTowers(playedTowers)
      }
      setTimeout(() => {
        setTime2(Date.now());
      },1000/50)
    }
  }, [time, gameStarted]);


  const canvasRef = useRef(null)
  const ctxRef = useRef(null)

  function clearBoard(ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0, width, height);
  }

  function removeUnnecessary():void{
    let numDead = 0;
    const reducedMonsters = aliveMonsters.getMonsters().filter((monster)=>{
      if(monster.wasMonsterKilled()){
        numDead = numDead + 1
        return false;
      } else if(monster.isPathFinished()){
        return false;
      }
      return true;
    })
    setGold(gold+numDead*5);
    if(levelUpStatus+numDead >= levelUpGoal){
      levelUp();
      levelUpGoal = levelUpGoal*1.15
    } else {
      setLevelUpStatus(levelUpStatus + numDead)
    }
    aliveMonsters.setMonsters(reducedMonsters);
    setAliveMonsters(aliveMonsters);
  }

  function levelUp():void{
    setLevel(playerLevel + 1)
    setLevelUpStatus(0)
    setHpLimit(hpLimit+5)
    setMLimitCd(Math.round(mLimitCd*0.94))
  }

  function drawNextFrame(ctx:CanvasRenderingContext2D){
    clearBoard(ctx)
    removeUnnecessary();
    drawBackground(ctx);
    drawTowersAndReduceCd(ctx);
    createMonstersInWave();
    drawMonstersReduceHP(ctx);
    tryToShoot();
    drawShoots(ctx);
    const newMonsters = aliveMonsters.getMonsters().filter((monster)=>{
      if(monster.wasMonsterKilled() || monster.isPathFinished()){
        return false;
      }
      return true;
    })
    if(aliveMonsters.getMonsters().length == 0 && roundMonstersLeft <= 0){
      setFrames(50*5+22);
    }
    
  }
  function drawBackground(ctx:CanvasRenderingContext2D){
    const topG = topGrass;    
    ctx.fillStyle = grassColor
    ctx.fillRect(topG.x1, topG.y1, topG.x2, topG.y2);
    
    const bottomG = bottomGrass;
    ctx.fillStyle = grassColor
    ctx.fillRect(bottomG.x1, bottomG.y1, bottomG.x2, bottomG.y2);

    const path = centerPath
    ctx.fillStyle = "black"
    ctx.fillRect(path.x1, path.y1-2, path.x2, path.y2+4);
    
    ctx.fillStyle = pathColor
    ctx.fillRect(path.x1, path.y1, path.x2, path.y2);

  }
  

  function createMonstersInWave(){
    if(wave && roundMonstersLeft > 0){
      if(monsterTimer != 0){
        setMonsterTimer(monsterTimer-1)
      } else {
        aliveMonsters.addMonster(new Monster(hp, height, width, monsterSpeed));
        setAliveMonsters(aliveMonsters);
        setRoundMonstersLeft(roundMonstersLeft - 1);
        setMonsterTimer(Math.round(Math.random()*mLimitCd))
      }
    }
  }




  function drawTowersAndReduceCd(ctx:CanvasRenderingContext2D){
      playedTowers.forEach(tower => {
        tower.draw(ctx)
        tower.reduceCooldown()
      });
  }

  function drawMonstersReduceHP(ctx:CanvasRenderingContext2D){ 
    const newMonsters = aliveMonsters.getMonsters().filter((monster) =>{
      if(monster.update()){
        monster.display(ctx);
        return true;
      } else {
        setHp(hp-1)
        if(hp==0){
          setStart(false);
          setIsAlive(false);
          console.log("dead")
        }
        return false;
      }
    })
    aliveMonsters.setMonsters(newMonsters)
    setAliveMonsters(aliveMonsters)
    if(roundMonstersLeft <= 0){
        setWave(false)
    }
  }

  function tryToShoot(){
    const newShots:Shot[] = []
    if(playedTowers.length != 0 || aliveMonsters.getMonsters().length != 0){
      aliveMonsters.getMonsters().forEach((monster)=>{
          playedTowers.forEach((tower)=>{
            if(tower.isMonsterInRage(monster) && tower.isNotInCooldown()){
              if(monster.hasTargetedLeftHP()){
                let tempShot = tower.createShot(monster);
                if(tempShot.getShotPath().isShotPathViable()){
                  tower.resetCooldown();
                  newShots.push(tempShot)
                }
              }
            }
        })
      })
    }
    if(newShots.length != 0){
      shots.addShots(newShots)
    }
  }
  
  function drawShoots(ctx:CanvasRenderingContext2D) : void{
    let arrLen = shots.getShots().length
    const newShots = shots.getShots().filter((shot)=>{
      shot.update()
      shot.display(ctx)
      if(shot.isShotOfScreen()){
        return false;
      } else if (shot.hasLanded() || shot.targetIsDead()){
        return false;
      }
      return true;
    })

    shots.setShots(newShots);
    setShot(shots);

  }

  useEffect(() => {
    const canvas = canvasRef.current; 
    const ctx = canvas.getContext("2d"); 
    ctxRef.current = ctx;
  },[])

  const clickListener = (e) => {
      const coordinates = computePointInCanvas(e.clientX, e.clientY)
      if(coordinates == null || coordinatesInPath(coordinates.y) || coordinatesOutOfBounds(coordinates)){
      } else if (gold >= pickedTower.getCost()){
        const ctx = canvasRef.current.getContext('2d');
        setGold(gold-pickedTower.getCost())
        let temp:PlayedTower = new PlayedTower(pickedTower, coordinates)
        setPlayedTowers([...playedTowers, temp])
        if(!wave){
          temp.draw(ctx)
        }
      }
  }
  function coordinatesInPath(y:number):boolean{
    const tDimension = pickedTower.getDimensions();
    const heightCovered = {y1:205, y2:295}
    if(heightCovered.y1 <= y - tDimension.height/2 && y <= heightCovered.y2 - tDimension.height/2){
      return true;
    } else if (heightCovered.y1 <= y + tDimension.height/2 && y <= heightCovered.y2 + tDimension.height/2){
      return true;
    }
    return false;
  }

  function coordinatesOutOfBounds(coordinates:{x:number, y:number}):boolean{
    const tDimension = pickedTower.getDimensions();    
    const xLimits = {x1: coordinates.x - tDimension.width/2, x2: coordinates.x + tDimension.width/2}
    const yLimits = {y1: coordinates.y - tDimension.height/2, y2: coordinates.y + tDimension.height/2}
      console.log(xLimits)
      console.log(yLimits)
    if(yLimits.y1 <= 0 || 500 <= yLimits.y2){
      return true;
    } else if (xLimits.x1 <= 0 || 700 <= xLimits.x2){
      return true;
    }
    return false;
  }

  function computePointInCanvas(asbX:number, absY:number){
    if(canvasRef.current){
        const boundingRect:DOMRect = canvasRef.current.getBoundingClientRect();
        let relativeCoord = {
            x: asbX-boundingRect.left,
            y: absY-boundingRect.top, 
        }
        if(relativeCoord.x < 0 || relativeCoord.x > width){
            return null;
        }
        if(relativeCoord.y<0 || relativeCoord.y > height){
            return null;
        }
        return relativeCoord
    }
    return null;
}

    return (<><p>
      The game {gameStarted ? ("is STARTED") : isAlive ? ("is NOT STARTED") : ("IS OVER")}.
    </p>
      <p>
        Time until next wave = {Math.round(framesUntilNextWave/50)} seconds.
      </p>
      <p>
        Current gold = {gold}.
      </p>
      <p>
        Current level = {playerLevel} {
        <CircularProgress variant="determinate" value={Math.round(levelUpStatus/levelUpGoal*100)}/>}
      </p>
      <p>
        Current hp = {hp} ({hpLimit}).
      </p>
      <p>
        Monsters left in round = {roundMonstersLeft}
      </p>
      <p>
        Current tower = {pickedTower.getName()} | {pickedTower.getCost()} Gold
      </p>
      <button onClick={() => setStart(true)}>START GAME</button>
      <button onClick={selectRegularTower}>REGULAR TOWER</button>
      <button onClick={selectFireTower}>FIRE TOWER</button>
      <button onClick={selectIceTower}>ICE TOWER</button>
      <button onClick={healUp}>Heal 1 HP for 50g</button>
      <button onClick={limitUp}>Increment limit by 1 HP for 25g</button>
      <button onClick={slowDownMonsters}>Reduce monster speed by 10% for 400g</button>



      {Canvas(clickListener, canvasRef, width, height)}
      </>
      )

  function healUp(){
    if (gold >= 50 && hp != hpLimit){
      setHp(hp+1);
      setGold(gold-50);
    }
  } 

  function limitUp(){
    if (gold >= 25){
      setHpLimit(hpLimit+1);
      setGold(gold-25);
    }
  } 

  function slowDownMonsters(){
    if (gold >= 400){
      setMonsterSpeed(monsterSpeed*0.9)
      setGold(gold-400);
    }
  } 

  function selectedTower(index:number){
    if(pickedTower?.equals(towers[index])){
    } else {
      setPickedTower(towers[index])
    }
  }

  function selectRegularTower(){
    selectedTower(0)
  }

  function selectFireTower(){
    selectedTower(1)  
  }

  function selectIceTower(){
    selectedTower(2)
  }

}





export default App
