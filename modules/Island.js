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
      { i: 0, j: 1 },
      { i: 1, j: 0 },
      { i: 0, j: -1 },
      { i: -1, j: 0 },
    ];
    let cellsToExpand = [{ i: this.startRow, j: this.startCol }];
    this.markCellAsIsland(this.startRow, this.startCol);

    while (cellsToExpand.length > 0 && this.cells.length < this.maxSize) {
      const { i, j } = cellsToExpand.shift();

      for (let dir of directions) {
        const newRow = i + dir.i;
        const newCol = j + dir.j;

        if (this.isValidCell(newRow, newCol)) {
          this.markCellAsIsland(newRow, newCol);
          cellsToExpand.push({ i: newRow, j: newCol });
          if (this.cells.length >= this.maxSize) break;
        }
      }
    }
  }

  isInGrid(row, col) {
    return row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length;
  }

  isPartOfIsland(row, col) {
    return this.cells.some(cell => cell.i === row && cell.j === col);
  }

  isValidCell(row, col) {
    return this.isInGrid(row, col) && this.grid[row][col] === "0" && !this.isPartOfIsland(row, col);
  }

  markCellAsIsland(row, col) {
    this.grid[row][col] = "1";
    this.cells.push({ i: row, j: col });
  }
}

export { Island };
