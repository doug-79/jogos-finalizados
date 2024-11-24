const canvas = document.getElementById('jogo');
const ctx = canvas.getContext('2d');
var tiles = [];
const ntilesX = 10;
const ntilesY = 10;
const nBombs = 10;

class Tile {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.isBomb = false;
        this.isOpen = false;
        this.bombAround = 0;
        this.marked = false;
        this.openedAround = false;
    }
}

function generateTiles() {
    for (let i = 0; i < ntilesX; i++) {
        for (let j = 0; j < ntilesY; j++) {
            let tile = new Tile(i, j);
            tiles.push(tile);
        }
    }
}

function generateBombs() {
    for (let i = 0; i < nBombs; i++) {
        let randomTiles = tiles.filter(t => !t.isBomb);
        let random = Math.floor(Math.random() * randomTiles.length);
        randomTiles[random].isBomb = true;
    }
}

function calculateBombs(tile) {
    let bombCount = 0;
    for (let i = tile.i - 1; i <= tile.i + 1; i++) {
        for (let j = tile.j - 1; j <= tile.j + 1; j++) {
            if ((i !== tile.i || j !== tile.j) && getTiles(i, j) && getTiles(i, j).isBomb) {
                bombCount++;
            }
        }
    }
    return bombCount;
}

function generateNBombs() {
    tiles.forEach(t => {
        t.bombAround = calculateBombs(t);
    });
}

function getTiles(i, j) {
    return tiles.find(t => t.i === i && t.j === j);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tiles.forEach(t => {
        drawTile(t);
    });
}

function drawTile(tile) {
    let x = (tile.i * 51) + 1;
    let y = (tile.j * 51) + 1;
    if (tile.isOpen) {
        if (tile.isBomb) {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(x, y, 50, 50);
        } else {
            ctx.fillStyle = "#999999";
            ctx.fillRect(x, y, 50, 50);
            if (tile.bombAround) {
                ctx.font = "30px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "red"; // Cor do texto
                ctx.fillText(tile.bombAround, x + 25, y + 35); // Centraliza o texto
            }
        }
    } else {
        ctx.fillStyle = tile.marked ? "#0000FF" : "#aaaaaa";
        ctx.fillRect(x, y, 50, 50);
    }
}

function openTile(tile) {
    tile.isOpen = true;
    if (!tile.openedAround && tile.bombAround === 0) openAround(tile);
}

function openAround(tile) {
    tile.openedAround = true;
    for (let i = tile.i - 1; i <= tile.i + 1; i++) {
        for (let j = tile.j - 1; j <= tile.j + 1; j++) {
            if (i !== tile.i || j !== tile.j) {
                const currentTile = getTiles(i, j);
                if (currentTile && !currentTile.isBomb) openTile(currentTile);
            }
        }
    }
}

generateTiles();
generateBombs();
generateNBombs();
draw();

document.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const i = Math.floor((mouseX / canvas.width) * ntilesX);
    const j = Math.floor((mouseY / canvas.height) * ntilesY);

    let tile = getTiles(i, j);
    if (tile) {
        openTile(tile);
        draw();
    }
});

document.addEventListener("contextmenu", e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const i = Math.floor((mouseX / canvas.width) * ntilesX);
    const j = Math.floor((mouseY / canvas.height) * ntilesY);
    let tile = getTiles(i, j);
    if (tile) {
        tile.marked = !tile.marked;
        draw();
    }
});
