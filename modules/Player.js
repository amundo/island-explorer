     

class Player {
  constructor() {
      this.position = null;
      this.hasBoat = false;
  }

  placeRandomly(island) {
      const randomCell = island.cells[Math.floor(Math.random() * island.cells.length)];
      this.position = { i: randomCell.i, j: randomCell.j };
  }

  move(direction, grid) {
      const { i, j } = this.position;
      let newI = i, newJ = j;
      switch (direction) {
          case 'ArrowUp':
              newI = i - 1;
              break;
          case 'ArrowDown':
              newI = i + 1;
              break;
          case 'ArrowLeft':
              newJ = j - 1;
              break;
          case 'ArrowRight':
              newJ = j + 1;
              break;
      }
      if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length && (grid[newI][newJ] === '1' || (this.hasBoat && grid[newI][newJ] === '0'))) {
          this.position = { i: newI, j: newJ };
      }
  }
}


export { Player }