import { assertEquals } from "https://deno.land/std@0.110.0/testing/asserts.ts";
import { Island } from "../Island.js";

Deno.test("Island creation: grid boundaries", () => {
  const grid = [
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"]
  ];

  const island = new Island(0, 0, 1, grid);

  // Test if the starting cell is correctly marked
  assertEquals(grid[0][0], "1");
  assertEquals(island.cells.length, 1);
  assertEquals(island.cells[0], { i: 0, j: 0 });
});

Deno.test("Island creation: expanding correctly", () => {
  const grid = [
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"]
  ];

  const island = new Island(1, 1, 4, grid);

  // Test if the island has grown correctly to 4 cells
  assertEquals(island.cells.length, 4);
  let markedCells = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === "1") markedCells++;
    }
  }
  assertEquals(markedCells, 4);
});

Deno.test("Island creation: respect maxSize", () => {
  const grid = [
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"]
  ];

  const island = new Island(1, 1, 2, grid);

  // Test if the island has grown correctly to 2 cells
  assertEquals(island.cells.length, 2);
  let markedCells = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === "1") markedCells++;
    }
  }
  assertEquals(markedCells, 2);
});

Deno.test("Island creation: boundary conditions", () => {
  const grid = [
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"]
  ];

  const island = new Island(0, 0, 9, grid);

  // Test if the island covers all grid cells
  assertEquals(island.cells.length, 9);
  let markedCells = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === "1") markedCells++;
    }
  }
  assertEquals(markedCells, 9);
});

Deno.test("Island creation: invalid starting point", () => {
  const grid = [
    ["1", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"]
  ];

  const island = new Island(0, 0, 2, grid);

  // Test if no new cells are marked because the start was invalid
  assertEquals(island.cells.length, 0);
});
