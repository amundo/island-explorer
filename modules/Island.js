     

class Island {
  constructor(startRow, startCol, maxSize, grid) {
      this.cells = [];
      this.startRow = startRow;
      this.startCol = startCol;
      this.maxSize = maxSize;
      this.grid = grid;
      this.createIsland();
  }

  createIsland() {
      const directions = [
          { i: 0, j: 1 }, { i: 1, j: 0 }, { i: 0, j: -1 }, { i: -1, j: 0 }
      ];
      let cellsToExpand = [{ i: this.startRow, j: this.startCol }];
      this.grid[this.startRow][this.startCol] = '1';
      this.cells.push({ i: this.startRow, j: this.startCol });

      while (cellsToExpand.length > 0 && this.cells.length < this.maxSize) {
          const { i, j } = cellsToExpand.shift();

          for (let dir of directions) {
              const newRow = i + dir.i;
              const newCol = j + dir.j;

              if (newRow >= 0 && newRow < this.grid.length && newCol >= 0 && newCol < this.grid[0].length && this.grid[newRow][newCol] === '0') {
                  this.grid[newRow][newCol] = '1';
                  this.cells.push({ i: newRow, j: newCol });
                  cellsToExpand.push({ i: newRow, j: newCol });
                  if (this.cells.length >= this.maxSize) break;
              }
          }
      }
  }
}

export { Island };