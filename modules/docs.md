---
title: Island Explorer Game
description: Build an island explorer game using JavaScript classes.
---

### Island Class

#### Description
The `Island` class represents an island in the game. It handles the creation and expansion of the island from a starting point.

#### Properties
- `startRow`: The starting row of the island.
- `startCol`: The starting column of the island.
- `maxSize`: The maximum size of the island.
- `grid`: The game grid where the island is placed.
- `cells`: An array of cells that make up the island.

#### Methods
- `createIsland()`: Expands the island from the starting point to a maximum size using a flood-fill algorithm.

```javascript
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
```

### Player Class

#### Description
The `Player` class represents the player in the game. It handles the player's position and movement.

#### Properties
- `position`: The current position of the player.
- `hasBoat`: A boolean indicating if the player has the boat.

#### Methods
- `placeRandomly(island)`: Places the player randomly on a given island.
- `move(direction, grid)`: Moves the player in the specified direction if the move is valid.

```javascript
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
```

### Item Class

#### Description
The `Item` class represents an item in the game, such as a boat or treasure. It handles the item's properties and position.

#### Properties
- `name`: The name of the item.
- `emoji`: The emoji representing the item.
- `position`: The position of the item on the grid.

```javascript
class Item {
    constructor({ name, emoji, position = null }) {
        this.name = name;
        this.emoji = emoji;
        this.position = position;
    }
}
```

### Game Class

#### Description
The `Game` class represents the game itself. It handles the game grid, player, items, enemies, and islands.

#### Properties
- `rows`: The number of rows in the game grid.
- `cols`: The number of columns in the game grid.
- `islandCount`: The number of islands to generate.
- `maxIslandSize`: The maximum size of each island.
- `gridData`: The game grid.
- `player`: The player object.
- `items`: An array of items in the game.
- `enemies`: An array of enemy positions.
- `islands`: An array of islands in the game.
- `enemyMoveInterval`: The interval for moving enemies.

#### Methods
- `generateRandomIslandMap()`: Generates a random island map.
- `createIsland()`: Creates an island and adds it to the game grid.
- `placePlayer()`: Places the player randomly on one of the islands.
- `placeBoatAndItems()`: Places the boat on the player's island and treasures on random islands.
- `placeEnemies(count)`: Places a specified number of enemies on the game grid.
- `drawGrid()`: Draws the game grid with all elements (player, items, enemies).
- `start()`: Starts the game by initializing the grid and elements and setting up event listeners.
- `handleKeyPress(event)`: Handles player movement based on key press events.
- `moveEnemies()`: Moves enemies randomly on the grid.
- `checkForBoat()`: Checks if the player has collected the boat.
- `collectTreasure()`: Checks if the player has collected all treasures.
- `checkForGameOver()`: Checks if the game is over (player caught by an enemy).
- `endGame()`: Ends the game by clearing intervals and event listeners.

```javascript
class Game {
    constructor(rows, cols, islandCount, maxIslandSize) {
        this.rows = rows;
        this.cols = cols;
        this.islandCount = islandCount;
        this.maxIslandSize = maxIslandSize;
        this.gridData = [];
        this.player = new Player();
        this.items = [];
        this.enemies = [];
        this.islands = [];
        this.enemyMoveInterval = null;
    }

    generateRandomIslandMap() {
        this.gridData = Array.from({ length: this.rows }, () => Array(this.cols).fill('0'));
        this.islands = [];
        for (let i = 0; i < this.islandCount; i++) {
            this.createIsland();
        }
    }

    createIsland() {
        let startRow = Math.floor(Math.random() * this.rows);
        let startCol = Math.floor(Math.random() * this.cols);

        while (this.gridData[startRow][startCol] === '1') {
            startRow = Math.floor(Math.random() * this.rows);
            startCol = Math.floor(Math.random() * this.cols);
        }

        const island = new Island(startRow, startCol, this.maxIslandSize, this.gridData);
        this.islands.push(island);
    }

    placePlayer() {
        const randomIsland = this.islands[Math.floor(Math.random() * this.islands.length)];
        this.player.placeRandomly(randomIsland);
    }

    placeBoatAndItems() {
        // Ensure the boat is on the player's island
        let playerIsland = this.islands.find(island => island.cells.some(cell => cell.i === this.player.position.i && cell.j === this.player.position.j));

        let boatPlaced = false;
        while (!boatPlaced) {
            const randomCell = playerIsland.cells[Math.floor(Math.random() * playerIsland.cells.length)];
            if (!(randomCell.i === this.player.position.i && randomCell.j === this.player.position.j)) {
                this.items.push(new Item({ name: 'boat', emoji: '⛵', position: { i: randomCell.i, j: randomCell.j } }));
                boatPlaced = true;
            }
        }

        // Place treasures on random islands
        for (let t = 0; t < 5; t++) {
            let placed = false;
            while (!placed) {
                const randomIsland = this.islands[Math.floor(Math.random() * this.islands.length)];
                const randomCell = randomIsland.cells[Math.floor(Math.random() * randomIsland.cells.length)];
                if (!(randomCell.i === this.player.position.i && randomCell.j === this.player.position.j) && !this.items.some(item => item.position.i === randomCell.i && item.position.j === randomCell.j)) {
                    this.items.push(new Item({ name: 'treasure', emoji: '💎', position: { i: randomCell.i, j: randomCell.j } }));
                    placed = true;
                }
            }
        }
    }

    placeEnemies(count) {
        this.enemies = [];
        for (let e = 0; e < count; e++) {
            let placed = false;
            while (!placed) {
                const i = Math.floor(Math.random() * this.gridData.length);
                const j = Math.floor(Math.random() * this.gridData[0].length);
                if (this.gridData[i][j]

 === '1' && (i !== this.player.position.i || j !== this.player.position.j)) {
                    this.enemies.push({ i, j });
                    placed = true;
                }
            }
        }
    }

    drawGrid() {
        const gridElement = document.getElementById('grid');
        gridElement.style.gridTemplateRows = `repeat(${this.rows}, 20px)`;
        gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 20px)`;
        gridElement.innerHTML = '';

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.classList.add(this.gridData[i][j] === '1' ? 'land' : 'water');

                if (i === this.player.position.i && j === this.player.position.j) {
                    cell.textContent = '😊'; // Player emoji
                } else if (this.items.some(item => item.position.i === i && item.position.j === j)) {
                    const item = this.items.find(item => item.position.i === i && item.position.j === j);
                    cell.textContent = item.emoji; // Item emoji
                } else if (this.enemies.some(e => e.i === i && e.j === j)) {
                    cell.textContent = '🧟'; // Enemy emoji
                }

                gridElement.appendChild(cell);
            }
        }
    }

    start() {
        this.generateRandomIslandMap();
        this.placePlayer();
        this.placeBoatAndItems();
        this.placeEnemies(3); // Place 3 enemies
        this.drawGrid();
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.enemyMoveInterval = setInterval(this.moveEnemies.bind(this), 1000); // Move enemies every second
    }

    handleKeyPress(event) {
        this.player.move(event.key, this.gridData);
        this.checkForBoat();
        this.collectTreasure();
        this.checkForGameOver();
        this.drawGrid();
    }

    moveEnemies() {
        for (let enemy of this.enemies) {
            const directions = [
                { i: -1, j: 0 }, // up
                { i: 1, j: 0 }, // down
                { i: 0, j: -1 }, // left
                { i: 0, j: 1 } // right
            ];
            const validMoves = directions.filter(dir => {
                const newI = enemy.i + dir.i;
                const newJ = enemy.j + dir.j;
                return newI >= 0 && newI < this.rows && newJ >= 0 && newJ < this.cols && this.gridData[newI][newJ] === '1';
            });
            if (validMoves.length > 0) {
                const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                enemy.i += move.i;
                enemy.j += move.j;
            }
        }
        this.checkForGameOver();
        this.drawGrid();
    }

    checkForBoat() {
        const boat = this.items.find(item => item.name === 'boat');
        if (boat && this.player.position.i === boat.position.i && this.player.position.j === boat.position.j) {
            this.player.hasBoat = true;
            this.items = this.items.filter(item => item.name !== 'boat'); // Remove the boat from the grid
            alert('You have collected the boat! Now you can move over water.');
        }
    }

    collectTreasure() {
        this.items = this.items.filter(item => !(item.name === 'treasure' && item.position.i === this.player.position.i && item.position.j === this.player.position.j));
        if (!this.items.some(item => item.name === 'treasure')) {
            alert('You collected all the treasures! You win!');
            this.endGame();
        }
    }

    checkForGameOver() {
        if (this.enemies.some(e => e.i === this.player.position.i && e.j === this.player.position.j)) {
            alert('Game Over! An enemy caught you.');
            this.endGame();
        }
    }

    endGame() {
        clearInterval(this.enemyMoveInterval);
        document.removeEventListener('keydown', this.handleKeyPress.bind(this));
    }
}
```

### HTML Structure

Ensure your HTML includes the necessary elements and links to the JavaScript file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Island Explorer Game</title>
    <style>
        #grid {
            display: grid;
            gap: 2px;
        }
        .cell {
            width: 20px;
            height: 20px;
            border: 1px solid #ccc;
        }
        .land {
            background-color: green;
        }
        .water {
            background-color: blue;
        }
        .treasure {
            background-color: gold;
        }
    </style>
</head>
<body>
    <h1>Island Explorer Game</h1>
    <form id="settingsForm">
        <label for="rows">Height (rows):</label>
        <input type="number" id="rows" name="rows" value="10" min="1"><br>
        <label for="cols">Width (cols):</label>
        <input type="number" id="cols" name="cols" value="10" min="1"><br>
        <button type="button" onclick="startGame()">Start Game</button>
    </form>
    <div id="grid"></div>
    <script src="island_explorer_game.js"></script>
    <script>
        let game;

        function startGame() {
            const rows = parseInt(document.getElementById('rows').value);
            const cols = parseInt(document.getElementById('cols').value);
            game = new Game(rows, cols, 5, 10); // 5 islands, max size of 10
            game.start();
        }
    </script>
</body>
</html>
```
