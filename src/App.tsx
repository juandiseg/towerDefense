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

  //const [framesUntilNextWave, setFrames] = useState<number>(275)
  const [framesUntilNextWave, setFrames] = useState<number>(100)

  const height = 500
  const width = 700

  const towHeight = height/7
  const towerWidth = width/14

  const towers = [new RegularTower(), new FireTower(), new IceTower()]

  const [gameStarted, setStart] = useState<boolean>(false)
  const [gold, setGold] = useState<number>(500)
  const [pickedTower, setPickedTower] = useState<Tower>(towers[0])
  const [playerLevel, setLevel] = useState<number>(1)
  const [currentAlignment, setCurrentAlignment] = useState("center");
  const [playedTowers, setPlayedTowers] = useState<PlayedTower[]>([])
  const [shots, setShot] = useState<Shot[]>([])
  const [hp, setHp] = useState<number>(10)
  const [aliveMonsters, setAliveMonsters] = useState<Monster[]>([])
  const [monsterTimer, setMonsterTimer] = useState<number>(0)
  
  let wave:boolean = false;
  let reaminingMonsters:number = 5;

  
  const [time, setTime2] = useState(Date.now());

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    clearBoard(ctx)
    if(!wave){
      if(framesUntilNextWave-1 <= 20){
        wave = true;
      } else {
        setFrames(framesUntilNextWave-1)
      }
    }
    drawNextFrame(ctx)
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
    drawTowersAndReduceCd(ctx);
    createMonstersInWave(ctx);
    drawMonstersReduceHP(ctx);
    tryToShoot();
    drawShoots(ctx);
    aliveMonsters.forEach((monster, index, object)=>{
      if(monster.hasMonsterBeenKilled()){
        object.splice(index,1);
      }
    })
  }

  function createMonstersInWave(ctx:CanvasRenderingContext2D){
    if(wave && reaminingMonsters != 0){
      if(monsterTimer == 0){
        setAliveMonsters([...aliveMonsters, new Monster(hp, height, width)])
        reaminingMonsters = reaminingMonsters - 1;
        setMonsterTimer(Math.round(Math.random()*100))
      } else {
        setMonsterTimer(monsterTimer-1)
      }
    }
  }

  function drawTowersAndReduceCd(ctx:CanvasRenderingContext2D){
    if(playedTowers.length != 0){
      playedTowers.forEach(tower => {
        tower.draw(ctx)
        tower.reduceCooldown()
      });
    }
  }

  function drawMonstersReduceHP(ctx:CanvasRenderingContext2D){
    if(aliveMonsters.length != 0){
      let checkMonster = false;
      aliveMonsters.forEach((monster, index, object) => {
        if(monster.update()){
          monster.display(ctx)
        } else {
          object.splice(index,1);
          setHp(hp-1)
          //checkMonster = true;
        }
      });
      //if(checkMonster){
      //  setAliveMonsters(aliveMonsters.filter((monster) => {
      //    monster.isPathFinished()
      //  }))
      //}
    }
  }

  function tryToShoot(){
    if(playedTowers.length != 0 || aliveMonsters.length != 0){ 
      aliveMonsters.forEach(monster =>{
        playedTowers.forEach(tower =>{
          if(tower.isMonsterInRage(monster) && tower.isNotInCooldown()){
            setShot([...shots, tower.createShot(monster)]);
          }
        })
      })
    }
  }
  
  function drawShoots(ctx:CanvasRenderingContext2D) : void{
    shots.forEach((shot, index, object) => {
      shot.update()
      shot.display(ctx)
      if(shot.hasLanded()){
        shot.dealDamage();
      }
      if(!shot.isTargetAlive()){
        object.splice(index, 1)
      }
    })
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
        setPlayedTowers([...playedTowers, new PlayedTower(pickedTower, coordinates)])
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
        Current hp = {hp}.
      </p>
      <p>
        Current tower = {pickedTower.getName()} | {pickedTower.getCost()} Gold
      </p>
      <button onClick={selectRegularTower}>REGULAR TOWER</button>
      <button onClick={selectFireTower}>FIRE TOWER</button>
      <button onClick={selectIceTower}>ICE TOWER</button>
      {Canvas(clickListener, canvasRef, width, height)}
      </>
      )

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
