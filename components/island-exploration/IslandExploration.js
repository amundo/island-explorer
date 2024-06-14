import { MessageLog } from '../message-log/MessageLog.js';
import {Player} from '../../modules/Player.js';
import {Island} from '../../modules/Island.js';
import {Item} from '../../modules/Item.js';

class IslandExploration extends HTMLElement {
  constructor(rows = 10, cols = 10, islandCount = 3, maxIslandSize = 10) {
    super();
    this.rows = rows
    this.cols = cols
    this.islandCount = islandCount
    this.maxIslandSize = maxIslandSize
    this.gridData = []
    this.player = new Player()
    this.items = []
    this.enemies = []
    this.islands = []
    this.enemyMoveInterval = null
  
    this.innerHTML = `
      <aside class="sidebar">
        <message-log></message-log>
      </aside>
      <main class="game-board">
        <div id="grid"></div>
      </main>
    `;

    this.messageLog = this.querySelector('message-log');
  }

  connectedCallback() {
    this.start()
  }

  start() {
    this.generateRandomIslandMap()
    this.placePlayer()
    this.placeBoatAndItems()
    this.placeEnemies(3) // Place 3 enemies
    this.gridElement = this.querySelector('#grid')
    this.drawGrid()
    document.addEventListener("keydown", this.handleKeyPress.bind(this))
    this.enemyMoveInterval = setInterval(this.moveEnemies.bind(this), 1000) // Move enemies every second
  }


  generateRandomIslandMap() {
    this.gridData = Array.from(
      { length: this.rows },
      () => Array(this.cols).fill("0"),
    )
    this.islands = []
    for (let i = 0; i < this.islandCount; i++) {
      this.createIsland()
    }
  }

  createIsland() {
    let startRow = Math.floor(Math.random() * this.rows)
    let startCol = Math.floor(Math.random() * this.cols)
    while (this.gridData[startRow][startCol] === "1") {
      startRow = Math.floor(Math.random() * this.rows)
      startCol = Math.floor(Math.random() * this.cols)
    }

    const island = new Island(
      startRow,
      startCol,
      this.maxIslandSize,
      this.gridData,
    )
    this.islands.push(island)
  }
  
  placePlayer() {
    const randomIsland =
      this.islands[Math.floor(Math.random() * this.islands.length)]
    this.player.placeRandomly(randomIsland)
  }

  handleKeyPress(event) {
    this.player.move(event.key, this.gridData)
    this.checkForBoat()
    this.collectTreasure()
    this.checkForGameOver()
    this.drawGrid()
  }

  placeBoatAndItems() {
    // Ensure the boat is on the player's island
    let playerIsland = this.islands.find((island) =>
      island.cells.some((cell) =>
        cell.i === this.player.position.i && cell.j === this.player.position.j
      )
    )

    let boatPlaced = false
    while (!boatPlaced) {
      const randomCell = playerIsland
        .cells[Math.floor(Math.random() * playerIsland.cells.length)]
      if (
        !(randomCell.i === this.player.position.i &&
          randomCell.j === this.player.position.j)
      ) {
        this.items.push(
          new Item({
            name: "boat",
            emoji: "⛵",
            position: { i: randomCell.i, j: randomCell.j },
          }),
        )
        boatPlaced = true
      }
    }

    // Place treasures on random islands
    for (let t = 0; t < 5; t++) {
      let placed = false
      while (!placed) {
        const randomIsland =
          this.islands[Math.floor(Math.random() * this.islands.length)]
        const randomCell = randomIsland
          .cells[Math.floor(Math.random() * randomIsland.cells.length)]
        if (
          !(randomCell.i === this.player.position.i &&
            randomCell.j === this.player.position.j) &&
          !this.items.some((item) =>
            item.position.i === randomCell.i && item.position.j === randomCell.j
          )
        ) {
          this.items.push(
            new Item({
              name: "treasure",
              emoji: "💎",
              position: { i: randomCell.i, j: randomCell.j },
            }),
          )
          placed = true
        }
      }
    }
  }

  placeEnemies(count) {
    this.enemies = []
    for (let e = 0; e < count; e++) {
      let placed = false
      while (!placed) {
        const i = Math.floor(Math.random() * this.gridData.length)
        const j = Math.floor(Math.random() * this.gridData[0].length)
        if (
          this.gridData[i][j] ===
            "1" &&
          (i !== this.player.position.i || j !== this.player.position.j)
        ) {
          this.enemies.push({ i, j })
          placed = true
        }
      }
    }
  }

  moveEnemies() {
    for (let enemy of this.enemies) {
      const directions = [
        { i: -1, j: 0 }, // up
        { i: 1, j: 0 }, // down
        { i: 0, j: -1 }, // left
        { i: 0, j: 1 }, // right
      ]
      const validMoves = directions.filter((dir) => {
        const newI = enemy.i + dir.i
        const newJ = enemy.j + dir.j
        return newI >= 0 && newI < this.rows && newJ >= 0 && newJ < this.cols &&
          this.gridData[newI][newJ] === "1"
      })
      if (validMoves.length > 0) {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)]
        enemy.i += move.i
        enemy.j += move.j
      }
    }
    this.checkForGameOver()
    this.drawGrid()
  }

  checkForBoat() {
    const boat = this.items.find((item) => item.name === "boat")
    if (
      boat && this.player.position.i === boat.position.i &&
      this.player.position.j === boat.position.j
    ) {
      this.player.hasBoat = true
      this.items = this.items.filter((item) => item.name !== "boat") // Remove the boat from the grid
      this.collectBoat(
        "You have collected the boat! Now you can move over water.",
      )
    }
  }

  collectTreasure() {
    this.items = this.items.filter((item) =>
      !(item.name === "treasure" &&
        item.position.i === this.player.position.i &&
        item.position.j === this.player.position.j)
    )
    if (!this.items.some((item) => item.name === "treasure")) {
      // alert('You collected all the treasures! You win!');
      this.winGame("You collected all the treasures! You win!")
      this.endGame()
    }
  }

  checkForGameOver() {
    if (
      this.enemies.some((e) =>
        e.i === this.player.position.i && e.j === this.player.position.j
      )
    ) {
      this.gameOver("Game Over! An enemy caught you.")
      this.endGame()
    }
  }

  endGame() {
    clearInterval(this.enemyMoveInterval)
    document.removeEventListener("keydown", this.handleKeyPress.bind(this))
  }

  drawGrid() {
    if (!this.gridElement) {
      console.error('Grid element not found')
      return
    }

    const gridElement = document.getElementById("grid")
    gridElement.style.gridTemplateRows = `repeat(${this.rows}, 20px)`
    gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 20px)`
    gridElement.innerHTML = ""

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cell.classList.add(this.gridData[i][j] === "1" ? "land" : "water")
        this.player

        if (i === this.player.position.i && j === this.player.position.j) {
          cell.textContent = "😊" // Player emoji
        } else if (
          this.items.some((item) =>
            item.position.i === i && item.position.j === j
          )
        ) {
          const item = this.items.find((item) =>
            item.position.i === i && item.position.j === j
          )
          cell.textContent = item.emoji // Item emoji
        } else if (this.enemies.some((e) => e.i === i && e.j === j)) {
          cell.textContent = "🧟" // Enemy emoji
        }

        gridElement.appendChild(cell)
      }
    }
  }


  collectBoat() {
    this.messageLog.addMessage('You have collected the boat! Now you can move over water.');
  }

  winGame() {
    this.messageLog.addMessage('You collected all the treasures! You win!');
  }

  gameOver() {
    this.messageLog.addMessage('Game Over! An enemy caught you.');
  }

  // Add other game methods here, replacing alert() calls with messageLog.addMessage()
}

customElements.define('island-exploration', IslandExploration);
export { IslandExploration };
