     

class Item {
  constructor({ name, emoji, position = null }) {
      this.name = name;
      this.emoji = emoji;
      this.position = position;
  }
}

export { Item }