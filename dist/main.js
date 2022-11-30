"use strict";
//  vars
const cols = 100;
const rows = 100;
const displayGrid = document.querySelector('.display-grid');
const startBtn = document.querySelector('.start');
const grid = new Array(cols);
const openSet = [];
const closedSet = [];
let start;
let end;
let divList = [];
let finish = false;
// event listeners  
document.addEventListener('DOMContentLoaded', createAStarAlg);
class Tile {
    constructor(id, col, row, isWall) {
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
        if (this.col > 0) {
            this.neighbors.push(grid[this.col - 1][this.row]);
        }
        if (this.col < cols - 1) {
            this.neighbors.push(grid[this.col + 1][this.row]);
        }
        if (this.row > 0) {
            this.neighbors.push(grid[this.col][this.row - 1]);
        }
        if (this.row < rows - 1) {
            this.neighbors.push(grid[this.col][this.row + 1]);
        }
        if (this.col > 0 && this.row > 0) { //NW
            if (!(grid[this.col - 1][this.row].isWall || grid[this.col][this.row - 1].isWall)) {
                this.neighbors.push(grid[this.col - 1][this.row - 1]);
            }
        }
        if (this.col < cols - 1 && this.row < rows - 1) { //SE
            if (!(grid[this.col + 1][this.row].isWall || grid[this.col][this.row + 1].isWall)) {
                this.neighbors.push(grid[this.col + 1][this.row + 1]);
            }
        }
        if (this.col < cols - 1 && this.row > 0) { //NE
            if (!(grid[this.col + 1][this.row].isWall || grid[this.col][this.row - 1].isWall)) {
                this.neighbors.push(grid[this.col + 1][this.row - 1]);
            }
        }
        if (this.col > 0 && this.row < cols - 1) { //SW
            if (!(grid[this.col - 1][this.row].isWall || grid[this.col][this.row + 1].isWall)) {
                this.neighbors.push(grid[this.col - 1][this.row + 1]);
            }
        }
    }
}
async function createAStarAlg() {
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }
    setTiles();
    drawGrid();
    start = grid[0][0];
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
                divList[current.id].classList.add("finish");
                getPath(current);
                return;
            }
            removeFromArray(openSet, current);
            closedSet.push(current);
            // get neighbors
            const neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                let newPath = false;
                if (!closedSet.includes(neighbor) && !neighbor.isWall) {
                    updateGrid(neighbor.id);
                    let tempG = current.g + 1;
                    if (openSet.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    }
                    else {
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }
                    if (newPath) {
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
            await sleep(100);
        }
    }
    else {
        console.log("No solution");
    }
}
;
function setTiles() {
    let counter = 0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let randomBool = Math.random() < 0.2;
            grid[i][j] = new Tile(counter, i, j, randomBool);
            counter++;
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors();
        }
    }
}
function drawGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let isWall = grid[i][j].isWall;
            const div = document.createElement('div');
            div.classList.add('tile');
            div.classList.add(grid[i][j].id.toString());
            if (isWall) {
                div.classList.add("wall");
            }
            displayGrid === null || displayGrid === void 0 ? void 0 : displayGrid.append(div);
            divList.push(div);
        }
    }
}
function updateGrid(id) {
    divList[id].classList.add('green');
}
function removeFromArray(array, item) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === item) {
            array.splice(i, 1);
        }
    }
}
function heuristic(pointA, pointB) {
    return (pointB.col + pointB.row) - (pointA.col + pointA.row);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getPath(tile) {
    await sleep(30);
    divList[tile.id].classList.remove('green');
    divList[tile.id].classList.add("path");
    const newTile = tile.previous;
    if (newTile) {
        getPath(newTile);
    }
}
