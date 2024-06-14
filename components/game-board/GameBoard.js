import { Game } from "../../modules/Game.js"
import { MessageLog } from "../message-log/MessageLog.js"

class GameBoard extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = `
      <message-log></message-log>
      <main class="game-container"></main>
    `

    this.messageLog = this.querySelector("message-log")
  }

  connectedCallback() {
    this.initGame()
  }

  initGame() {
    this.game = new Game()
    this.addEventListener("game-message", (event) => {
      this.messageLog.addMessage(event.detail)
    })
    this.game.start() // Start the game or initialize it as needed
  }
}

customElements.define("game-board", GameBoard)
export { GameBoard }
