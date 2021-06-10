/* eslint-disable */
// coding rule: https://cou929.nu/data/google_javascript_style_guide/
let sounds = {};
let effects = {};

let shogiBoard;
let boardState;

let fromPoint;
let toPoint;

let selectedKoma;
let gameState;

let capFlg = false;
let nariFlg = false;

const SELECTING = 0;
const BOARD_SELECTED = 1;
const KOMADAI_SELECTED = 2;
const SELECTED = 2;
const NARI_SELECTING = 3;
const FIN = 4;

const SENTE = 1;
const GOTE = 0;

function playBoardEffect() {
    var effect;
    if (boardState == BOARD_STATE.TUMI) {
        effect = effects["tumi"];
        effect.style.visibility = "visible";
        effect.play();
    } else if (boardState == BOARD_STATE.OUTE) {
        effect = effects["oute"];
        effect.style.visibility = "visible";
        effect.play();
    }
}

/**
 * 手番を変更する関数
 */
function rotateTurn() {
    sounds["komaoto"].play();
    if (capFlg) {
        playKillEffect();
    }
    if (nariFlg) {
        playNariEffect();
    }
    // if (!capFlg && !nariFlg) {
    //     playNormalEffect();
    // }
    playBoardEffect();
    capFlg = false;
    nariFlg = false;
    shogiBoard.rotateTurn();
    hideMask();
    showBoard();
}

function updateKifuTable(moves, csaData) {
    var move = csaData[moves];
    var tbody = document.getElementById('kifu_tbody');
    var newRow = tbody.insertRow();
    newRow.outerHTML =
    `<tr${moves%2?'':' class="even"'}><th>${moves}</th><td>${move}</td><tr>`;
    var tr = tbody.getElementsByTagName('tr')[moves - 1];
    tbody.scrollTop = tr.offsetTop;
}

/**
 * 動かしたい(使いたい)駒を選択した後に，設置可能な空白マスを選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，設置可能な空白マスの筋
 * @param {Number} y 選択した，設置可能な空白マスの段
 */
function selectSquare(x, y) {
    if (gameState == BOARD_SELECTED) {
        toPoint = point(x, y);
        capFlg = shogiBoard.board[x][y].isKoma;
        if (canNari(selectedKoma, x, y) || canNari(selectedKoma, fromPoint.x, fromPoint.y)) {
            if ((selectedKoma.symbol == "KE" && selectedKoma.isSente && y <= 2)
            || (selectedKoma.symbol == "KY" && selectedKoma.isSente && y == 1)
            || (selectedKoma.symbol == "FU" && selectedKoma.isSente && y == 1)
            || (selectedKoma.symbol == "KE" && !selectedKoma.isSente && y >= 8)
            || (selectedKoma.symbol == "KY" && !selectedKoma.isSente && y == 9)
            || (selectedKoma.symbol == "FU" && !selectedKoma.isSente && y == 9)) {
                nariFlg = true;
                boardState = shogiBoard.move(fromPoint, toPoint, selectedKoma.createNari());
                updateKifuTable(shogiBoard.moves, shogiBoard.kifu.csaData);
                rotateTurn();
            } else {
                showNariWindow();
            }
        } else {
            boardState = shogiBoard.move(fromPoint, toPoint, selectedKoma);
            updateKifuTable(shogiBoard.moves, shogiBoard.kifu.csaData);
            rotateTurn();
        }
    } else if (gameState == KOMADAI_SELECTED) {
        toPoint = point(x, y);
        boardState = shogiBoard.move(fromPoint, toPoint, selectedKoma);
        updateKifuTable(shogiBoard.moves, shogiBoard.kifu.csaData);
        rotateTurn();
    }
}

/**
 * DOMが構築された後に発生するイベントのハンドラ
 */
window.onload = function () {
    sounds["komaoto"] = document.getElementById("komaoto");
    effects["kill"] = document.getElementById("kill_effect");
    effects["nari"] = document.getElementById("nari_effect");
    // effects["normal"] = document.getElementById("normal_effect");
    effects["tumi"] = document.getElementById("tumi_effect");
    effects["oute"] = document.getElementById("oute_effect");

    fromPoint = point(0, 0);
    toPoint = point(0, 0);
    shogiBoard = new ShogiBoard(true);

    gameState = SELECTING;

    effects["kill"].addEventListener('ended', (event) => {
        effects["kill"].style.visibility = "hidden";
    });
    effects["nari"].addEventListener('ended', (event) => {
        effects["nari"].style.visibility = "hidden";
    });
    // effects["normal"].addEventListener('ended', (event) => {
    //     effects["normal"].style.visibility = "hidden";
    // });
    effects["tumi"].addEventListener('ended', (event) => {
        effects["tumi"].style.visibility = "hidden";
    });
    effects["oute"].addEventListener('ended', (event) => {
        effects["oute"].style.visibility = "hidden";
    });

    showBoard();
}