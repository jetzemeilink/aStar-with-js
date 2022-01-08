"use strict";
//  vars
const cols = 10;
const rows = 10;
const displayGrid = document.querySelector('.display-grid');
const grid = new Array(cols);
const openSet = [];
const closedSet = [];
let start;
let end;
// event listeners
document.addEventListener('DOMContentLoaded', createAStarAlg);
class Tile {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.visited = false;
        this.neighbors = [];
    }
    addNeighbors() {
        if (this.row > 0) {
            this.neighbors.push(grid[this.col][this.row - 1]);
        }
        if (this.row < rows - 1) {
            this.neighbors.push(grid[this.col][this.row + 1]);
        }
        if (this.col > 0) {
            this.neighbors.push(grid[this.col - 1][this.row]);
        }
        if (this.col < cols - 1) {
            this.neighbors.push(grid[this.col + 1][this.row + 1]);
        }
    }
}
function createAStarAlg() {
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }
    setTiles();
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    openSet.push(start);
    // search path
    if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < winner) {
                winner = i;
            }
            let current = openSet[winner];
            if (openSet[winner] === end) {
                console.log("The end");
                return;
            }
            removeFromArray(openSet, current);
            console.log(openSet);
            closedSet.push(current);
            current.visited = true;
            // get neighbors
            const neighbors = current.neighbors;
            console.log('neightbor', neighbors);
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                if (!closedSet.includes(neighbor)) {
                    let tempG = current.g + 1;
                    if (openSet.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                        }
                    }
                    else {
                        neighbor.g = tempG;
                        openSet.push(neighbor);
                    }
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }
        drawTiles();
    }
    else {
        console.log("No solution");
    }
}
;
function setTiles() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Tile(i, j);
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors();
        }
    }
}
function searchPath() {
    if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < winner) {
                winner = i;
            }
            let current = openSet[winner];
            if (openSet[winner] === end) {
                console.log("The end");
                return;
            }
            removeFromArray(openSet, current);
            closedSet.push(current);
            current.visited = true;
            checkNeighbors(current.neighbors, current);
        }
        drawTiles();
    }
    else {
        console.log("No solution");
    }
}
function drawTiles() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const div = document.createElement('div');
            const color = grid[i][j].visited ? 'green' : 'orangered';
            div.classList.add('tile');
            div.classList.add(color);
            displayGrid === null || displayGrid === void 0 ? void 0 : displayGrid.append(div);
        }
    }
}
function removeFromArray(array, item) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === item) {
            array.splice(i, 1);
        }
    }
}
function checkNeighbors(neighbors, current) {
    for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if (!closedSet.includes(neighbor)) {
            let tempG = current.g + 1;
            if (openSet.includes(neighbor)) {
                if (tempG < neighbor.g) {
                    neighbor.g = tempG;
                }
            }
            else {
                neighbor.g = tempG;
                openSet.push(neighbor);
            }
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
        }
    }
}
function heuristic(pointA, PointB) {
    return (PointB.col + PointB.row) - (pointA.col + pointA.row);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
