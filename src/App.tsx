import { useRef, useState } from 'react'
import Tower from "./assets/Tower"
import Canvas from "./Components/Canvas"

function App() {
  const towers = [new Tower("Regular Tower", 50),new Tower("Fire Tower", 100),new Tower("Ice Tower", 200)]

  const [gameStarted, setStart] = useState<boolean>(false)
  const [gold, setGold] = useState<number>(100)
  const [pickedTower, setPickedTower] = useState<Tower>()
  const [framesUntilNextWave, setTime] = useState<number>(250)
  const [playerLevel, setLevel] = useState<number>(1)
  const [currentAlignment, setCurrentAlignment] = useState("center");



  return (Canvas(700, 500))

  function holder(){
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
