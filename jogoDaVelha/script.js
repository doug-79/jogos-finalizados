const currentPlayer = document.querySelector(".currentPlayer");

let selected;
let player = "X";

let positions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];

function init() {
    selected = [];
    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;

    document.querySelectorAll(".game button").forEach((item) => {
        item.innerHTML = "";
        item.addEventListener("click", newMove);
    });
}
init();

function newMove(e) {
    const index = e.target.getAttribute("data-i");
    e.target.innerHTML = player;
    e.target.removeEventListener("click", newMove);
    selected[index] = player;

    player = player === "X" ? "O" : "X";
    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;

    setTimeout(() => {
        check();
    }, 100);
}

function check() {
    const itens = selected;

    let playerLastMove = player === "X" ? "O" : "X";
    let moves = itens
        .map((item, i) => [item, i])
        .filter((item) => item[0] === playerLastMove)
        .map((item) => item[1]);

    for (let pos of positions) {
        if (pos.every((item) => moves.includes(item))) {
            alert(`O JOGADOR '${playerLastMove}' VENCEU!!!!`);
            init();
            return;
        }
    }

    if (selected.filter((item) => item).length === 9) {
        alert("DEU EMPATE!");
        init();
        return;
    }
}
