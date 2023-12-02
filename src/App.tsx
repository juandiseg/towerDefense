import { useRef, useState } from 'react'
import Tower from "./assets/Tower"
import Canvas from "./Canvas"


function App() {
  const towers = [new Tower("Regular Tower", 50),new Tower("Fire Tower", 100),new Tower("Ice Tower", 200)]

  const [gameStarted, setStart] = useState<boolean>(false)
  const [gold, setGold] = useState<number>(100)
  const [pickedTower, setPickedTower] = useState<Tower>()
  const [framesUntilNextWave, setTime] = useState<number>(250)
  const [playerLevel, setLevel] = useState<number>(1)
  const [currentAlignment, setCurrentAlignment] = useState("center");
  const testCanvas = true;



  const drawArt = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "blue";
    context.fillRect(0,0,100,100);
    context.strokeRect(100,100,50,50);
  }

  const drawExample = (context: CanvasRenderingContext2D) => {
    context.fillStyle = 'rgba(255, 0, 0, 0.637)';
    context.fillRect(20, 20, 100, 120);

    context.fillStyle = '#00ff003b';
    context.fillRect(90, 95, 100, 100);
  }

if(testCanvas){
  return (
  <>
  <h1>Example</h1>
  <Canvas draw={drawExample} width={window.innerWidth} height={400}/>
  <h1>Art</h1>
  <Canvas draw={drawArt} width={window.innerWidth} height={400}/>
  </>
  )
} 






else {
  return (<><p>
    The game is {gameStarted ? ("") : ("NOT")} started.
  </p>
    <p>
      Time until next wave = {framesUntilNextWave/50} seconds.
    </p>
    <p>
      Current gold = {gold}.
    </p>
    <p>
      Current level = {playerLevel}.
    </p>
    <p>
      Current tower = {pickedTower===null ? ("Ola") : ("Not yet decided")}
    </p>
    <button onClick={selectRegularTower}>REGULAR TOWER</button>
    <button onClick={selectFireTower}>FIRE TOWER</button>
    <button onClick={selectIceTower}>ICE TOWER</button>
    </>
    )
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
