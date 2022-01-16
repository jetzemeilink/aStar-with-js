//  vars
const cols = 10;
const rows = 10;
const displayGrid = document.querySelector('.display-grid');
const grid: Tile[][] = new Array(cols);
const openSet: Tile[] = [];
const closedSet: Tile[] =[];
let start: Tile;
let end: Tile;
let divList: HTMLElement[] = [];
let finish: boolean = false;

// event listeners
document.addEventListener('DOMContentLoaded', createAStarAlg);

class Tile {
  id: number;
  col: number;
  row: number;
  f: number;
  g: number;
  h: number;
  neighbors: Tile[];
  isWall: boolean;
  previous?: Tile;

  constructor(id: number, col: number, row: number, isWall: boolean) {
    this.id = id;
    this.col = col;
    this.row = row;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.isWall = isWall;
  }

  addNeighbors() {
    if (this.row > 0) {
      this.neighbors.push(grid[this.col][this.row - 1]);
    }
    if (this.row < rows - 1) {
      this.neighbors.push(grid[this.col][this.row + 1]);
    }
    if (this.col > 0) {
      this.neighbors.push(grid[this.col - 1][this.row])

    }
    if (this.col < cols - 1) {
      this.neighbors.push(grid[this.col + 1][this.row])
    }
  }
}

async function createAStarAlg(): Promise<void> {
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  } 

  setTiles();

  drawGrid();

  start = grid[0][0]
  end = grid[cols - 1][rows - 1];

  openSet.push(start);

  // search path
  if (openSet.length > 0) {

    while (!finish) {

      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }

      let current = openSet[winner];
  
      if (current === end) {
        finish = true;
        divList[current.id].classList.add("finish")
        getPath(current);
        return;
      }
  
      removeFromArray(openSet, current);
      closedSet.push(current)

      // get neighbors
      const neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        
          if (!closedSet.includes(neighbor) && !neighbor.isWall) {
            let tempG = current.g + 1;
      
            if (openSet.includes(neighbor)) {
              if (tempG < neighbor.g) {
                neighbor.g = tempG;
              }
            } else {
                neighbor.g = tempG;
                openSet.push(neighbor);
            }
        
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;

          } 
        }
        updateGrid(current.id);
        await sleep(1);
    }
  
  } else { 
    console.log("No solution")
  }
};

function setTiles(): void {
  let counter = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let randomBool = Math.random() < 0.2;
      grid[i][j] = new Tile(counter, i, j, randomBool);
      counter++
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors();
    }
  }
}

function drawGrid(): void {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let isWall = grid[i][j].isWall;
      const div = document.createElement('div');
      div.classList.add('tile');
      div.classList.add(grid[i][j].id.toString())

      if (isWall) {
        div.classList.add("wall");
      }
      displayGrid?.append(div);
      divList.push(div);
    }
  }
}

function updateGrid(id: number): void {
  divList[id].classList.add('green');
}

function removeFromArray(array: Tile[], item: Tile) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === item) {
      array.splice(i, 1);
    }
  }
}

function heuristic(pointA: Tile, pointB: Tile): number {
  return (pointB.col + pointB.row) - (pointA.col + pointA.row)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPath(tile: Tile): Promise<void> {
  await sleep(30);
  divList[tile.id].classList.add("path");

  const newTile = tile.previous;

  if (newTile) {
    getPath(newTile);
  } 
  
}


