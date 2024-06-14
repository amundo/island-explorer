class MessageLog extends HTMLElement {
  #messages = []

  constructor() {
    super()
    this.innerHTML = `
      <ul class="message-log" reversed></ul>
    `
    this.listen()
  }

  connectedCallback() {
  }

  clear() {
    this.#messages = []
    console.log(this.querySelector(".message-log"))
    this.querySelector(".message-log").innerHTML = ""
  }

  addMessage(text) {
    console.log(`Adding message: ${text}`)
    let message = {
      text,
      timestamp: new Date(),
    }

    this.#messages.push(message)

    this.renderMessage(message)
  }

  render() {
    this.clear()

    this.#messages.forEach((message) => {
      this.renderMessage(message)
    })
  }

  renderMessage({ text, timestamp }) {
    let list = this.querySelector(".message-log")

    let messageElement = document.createElement("li")
    messageElement.classList.add("message")

    let formattedTimestamp = new Intl.DateTimeFormat("en-US", {
      // dateStyle: 'short',
      timeStyle: "short",
    }).format(timestamp)

    messageElement.innerHTML = `
      <span class="timestamp">${formattedTimestamp}</span>
      <span class="text">${text}</span>
    `

    list.append(messageElement)
  }

  listen() {
  }
}

export { MessageLog }
customElements.define("message-log", MessageLog)
