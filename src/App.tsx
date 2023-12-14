import { useEffect, useRef, useState } from 'react'
import Tower from "./assets/Tower"
import RegularTower from "./assets/RegularTower"
import FireTower from './assets/FireTower'
import IceTower from './assets/IceTower'
import Canvas from "./Components/Canvas"
import PlayedTower from './assets/PlayedTower'
import Monster from './util/Monster'
import Shot from './util/Shot'

    

function App() {

  const [framesUntilNextWave, setFrames] = useState<number>(40) // was 100

  const height = 500
  const width = 700

  const topGrass:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:0, x2:width, y2:205}
  const centerPath:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:205, x2:width, y2:height-205}
  const bottomGrass:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:height-205, x2:width, y2:height}

  const grassColor:string = "green"
  const pathColor:string = "brown"


  const towHeight = height/7
  const towerWidth = width/14
  const [roundMonstersLeft, setRoundMonstersLeft] = useState<number>(99)


  const towers = [new RegularTower(), new FireTower(), new IceTower()]

  const [hpLimit, setHpLimit] = useState<number>(10)

  const [gameStarted, setStart] = useState<boolean>(false)
  const [gold, setGold] = useState<number>(500)
  const [pickedTower, setPickedTower] = useState<Tower>(towers[0])
  const [playerLevel, setLevel] = useState<number>(1)
  const [playedTowers, setPlayedTowers] = useState<PlayedTower[]>([])
  const [shots, setShot] = useState<Shot[]>([])

  
  const [hp, setHp] = useState<number>(10)
  const [aliveMonsters, setAliveMonsters] = useState<Monster[]>([])
  const [monsterTimer, setMonsterTimer] = useState<number>(0)

  const [wave2, setWave] = useState<boolean>(false)

  
  let wave:boolean = false;
  
  const [time, setTime2] = useState(Date.now());
  
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    if(wave == false){
      if(framesUntilNextWave-1 <= 20){
        wave = true;
      } else {
        setFrames(framesUntilNextWave-1)
        setRoundMonstersLeft(99)
      }
    }
    if(wave){
      clearBoard(ctx)
      drawNextFrame(ctx)
    }
    setTimeout(() => {
      setTime2(Date.now());
    },1000/50)
  }, [time]);


  const canvasRef = useRef(null)
  const ctxRef = useRef(null)

  function clearBoard(ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0, width, height);
  }

  function drawNextFrame(ctx:CanvasRenderingContext2D){
    drawBackground(ctx);
    drawTowersAndReduceCd(ctx);
    createMonstersInWave();
    drawMonstersReduceHP(ctx);
    tryToShoot();
    drawShoots(ctx);
    aliveMonsters.forEach((monster, index, object)=>{
      if(monster.monsterDeadOrOffScreen()){
        object.splice(index,1);
      }
    })
    if(aliveMonsters.length == 0 && roundMonstersLeft <= 0){
      setFrames(50*5+22);
    }
  }
  function drawBackground(ctx:CanvasRenderingContext2D){
    const topG = topGrass;    
    ctx.fillStyle = grassColor
    ctx.fillRect(topG.x1, topG.y1, topG.x2, topG.y2);
    
    const path = centerPath
    ctx.fillStyle = pathColor
    ctx.fillRect(path.x1, path.y1, path.x2, path.y2);
    
    const bottomG = bottomGrass;
    ctx.fillStyle = grassColor
    ctx.fillRect(bottomG.x1, bottomG.y1, bottomG.x2, bottomG.y2);
  }
  

  function createMonstersInWave(){
    if(wave && roundMonstersLeft > 0){
      if(monsterTimer != 0){
        setMonsterTimer(monsterTimer-1)
      } else {
        setAliveMonsters([...aliveMonsters, new Monster(hp, height, width, 2)])
        setRoundMonstersLeft(roundMonstersLeft - 1);
        setMonsterTimer(Math.round(Math.random()*50))
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
    aliveMonsters.forEach((monster, index, object) => {
      if(monster.update()){
        monster.display(ctx)
      } else {
        object.splice(index,1);
        setHp(hp-1)
      }
    });
    if(roundMonstersLeft <= 0 && aliveMonsters.length == 0){
      wave = false;
    }

  }

  function tryToShoot(){
    if(playedTowers.length != 0 || aliveMonsters.length != 0){ 
      for(let m = 0; m< aliveMonsters.length; m++){
        for(let t = 0; t < playedTowers.length; t++){
          if(playedTowers[t].isMonsterInRage(aliveMonsters[m]) && playedTowers[t].isNotInCooldown()){
            if(aliveMonsters[m].hasTargetedLeftHP()){
              let tempShot = playedTowers[t].createShot(aliveMonsters[m]);
              if(tempShot!=null){
                setShot([...shots, tempShot]);
              }
            }
          }
        }
      }


/*       aliveMonsters.forEach(monster =>{
        playedTowers.forEach(tower =>{
          if(tower.isMonsterInRage(monster) && tower.isNotInCooldown()){
            if(monster.hasTargetedLeftHP()){
              setShot([...shots, tower.createShot(monster)]);
            }
          }
        })
      }) */
    }
  }
  
  function drawShoots(ctx:CanvasRenderingContext2D) : void{
    let arrLen = shots.length
    for(let i = 0; i <arrLen; i++){
      let shot = shots[i]
      shot.update()
      if(shot.isShotOfScreen()){
        shots.splice(i, 1)
        arrLen--;
      } else {
        shot.display(ctx)
        if(shot.hasLanded() || shot.targetIsDead()){
          shot.dealDamage();
          shots.splice(i, 1)
          arrLen--;
        }
      }
    }
    
/*     shots.forEach((shot, index, object) => {
      shot.update()
      if(shot.isShotOfScreen()){
        object.splice(index, 1)
      } else {
        shot.display(ctx)
        if(shot.hasLanded()){
          shot.dealDamage();
          object.splice(index, 1)
        }
      }
    }) */
  }

  useEffect(() => {
    const canvas = canvasRef.current; 
    const ctx = canvas.getContext("2d"); 
    ctxRef.current = ctx;
  },[])

  const clickListener = (e) => {
      const coordinates = computePointInCanvas(e.clientX, e.clientY)
      if(coordinates == null){
        console.log("You clicked outside the canvas...")
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

  function computePointInCanvas(asbX:number, absY:number){
    if(canvasRef.current){
        const boundingRect = canvasRef.current.getBoundingClientRect();
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
      The game is {gameStarted ? ("") : ("NOT")} started.
    </p>
      <p>
        Time until next wave = {Math.round(framesUntilNextWave/50)} seconds.
      </p>
      <p>
        Current gold = {gold}.
      </p>
      <p>
        Current level = {playerLevel}.
      </p>
      <p>
        Current hp = {hp} ({hpLimit}).
      </p>
      <p>
        Monsters left in round = {roundMonstersLeft + 1}
      </p>
      <p>
        Current tower = {pickedTower.getName()} | {pickedTower.getCost()} Gold
      </p>
      <button onClick={selectRegularTower}>REGULAR TOWER</button>
      <button onClick={selectFireTower}>FIRE TOWER</button>
      <button onClick={selectIceTower}>ICE TOWER</button>
      <button onClick={healUp}>Heal 1 HP for 50g</button>
      <button onClick={limitUp}>Increment limit by 1 HP for 25g</button>


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

  function increaseHPLimit(){
    if (gold >= 100){
      setHp(hp+1);
      setGold(gold-100);
    }
  } 

  function selectedTower(index:number){
    if(pickedTower?.equals(towers[index])){
      console.log("Already selected")
    } else {
      setPickedTower(towers[index])
      console.log("The tower: " + towers[index].getName() + " has been selected")
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
