// coding rule: https://cou929.nu/data/google_javascript_style_guide/

let komaSet = [];

let fromSquare = { x: 0, y: 0 };
let toSquare = { x: 0, y: 0 };

let selectedKoma;
let gameState;

const SELECTING = 0;
const BOARD_SELECTED = 1;
const KOMADAI_SELECTED = 2;
const SELECTED = 2;
const NARI_SELECTING = 3;

const SELF_TURN = 1;
const ENEMY_TURN = 0;

const OUT_OF_BOARD = 128;
const EMPTY = 0;

const BOARD_LEFT = 196;
const BOARD_TOP = 19;
const SQUARE_WIDTH = 52;
const SQUARE_HEIGHT = 61;

let shogiBoard;

/**
 * 自分の陣地ないか否かをBooleanで返す関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 * @return {Boolean} 引数で与えられたマスが自分の陣地内の場合はtrue，違う場合はfalseを返す
 */
function isSelfArea(x, y) {
    return (7 <= y && y <= 9 && 1 <= x && x <= 9);
}

/**
 * 敵の陣地ないか否かをBooleanで返す関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 * @return {Boolean} 引数で与えられたマスが敵の陣地内の場合はtrue，違う場合はfalseを返す
 */
function isEnemyArea(x, y) {
    return (1 <= y && y <= 3 && 1 <= x && x <= 9);
}

/**
 * 与えられた駒がそのマスに移動した時に成れる否かをBooleanで返す関数
 * @param {Number} koma 駒を表す数値
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 * @return {Boolean} 引数で与えられた駒が，同じく引数で与えられたマスに移動した時に成れる場合はtrue，違う場合はfalseを返す
 */
function canNari(koma, x, y) {
    return (koma.canNari && ((koma.isSelf && isEnemyArea(x, y)) || (!koma.isSelf && isSelfArea(x, y))));
}

/**
 * 全マスクを表示
 */
function showMask() {
    document.getElementById("board_mask").style.visibility = "visible";
    document.getElementById("komadai_self_mask").style.visibility = "visible";
    document.getElementById("komadai_enemy_mask").style.visibility = "visible";
}

/**
 * 全マスクを隠す
 */
function hideMask() {
    document.getElementById("board_mask").style.visibility = "hidden";
    document.getElementById("komadai_self_mask").style.visibility = "hidden";
    document.getElementById("komadai_enemy_mask").style.visibility = "hidden";
}

/**
 * 手番を変更する関数
 */
function rotateTurn() {
    shogiBoard.rotateTurn();
    hideMask();
    showBoard();
}

/**
 * 手番の駒を動かすことができる盤を表示する関数
 */
function showBoard() {
    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var square = document.getElementById("s" + x + y);
            square.style.backgroundImage = komaSet[shogiBoard.board[x][y]].img;

            if (shogiBoard.board[x][y] != EMPTY) {
                (function () {
                    var xLocal = x, yLocal = y;
                    square.onclick = function () {
                        if (shogiBoard.turn == komaSet[shogiBoard.board[xLocal][yLocal]].isSelf && gameState == SELECTING) {
                            selectKomaToMove(xLocal, yLocal);
                        }
                    };
                })();
            } else {
                square.onclick = "";
            }
        }
    }

    showTegoma();

    gameState = SELECTING;
}

/**
 * 手駒を表示する関数
 */
function showTegoma() {
    for (var turn = 0; turn <= 1; turn++) {
        for (var koma = FU; koma <= HI; koma++) {
            var square;
            if (turn == SELF_TURN) {
                square = document.getElementById("S" + koma);
                square.dataset.num = shogiBoard.tegoma[SELF_TURN][koma];
            } else {
                square = document.getElementById("E" + koma);
                square.dataset.num = shogiBoard.tegoma[ENEMY_TURN][koma];
            }

            if (shogiBoard.tegoma[turn][koma] != 0) {
                (function () {
                    var turnLocal = turn, komaLocal = koma;
                    square.onclick = function () {
                        if (+shogiBoard.turn == turnLocal && gameState == SELECTING) {
                            selectTegoma(turnLocal, komaLocal);
                        }
                    }
                })();
            }
        }
    }
}

/**
 * 与えられたマスにある駒が現在移動することができるマスを明るく表示する関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 */
function showPath(x, y) {
    for (var path of komaSet[shogiBoard.board[x][y]].pathGen(x, y, shogiBoard.board)) {
        var msquare = document.getElementById("ms" + path.xTo + path.yTo);
        msquare.style.opacity = "0.0";
        // msquare.style.backgroundImage = "";
        msquare.onclick = new Function("selectSquare(" + path.xTo + "," + path.yTo + ")");
    }
}

/**
 * 与えられた駒を現在打つことができるマスを明るく表示する関数
 * @param {Number} koma 駒
 */
function showDrop(koma) {
    for (var path of koma.dropGen(shogiBoard.board)) {
        var msquare = document.getElementById("ms" + path.xTo + path.yTo);
        msquare.style.opacity = "0.0";
        // msquare.style.backgroundImage = "";
        msquare.onclick = new Function("selectSquare(" + path.xTo + "," + path.yTo + ")");
    }
}

/**
 * 動かす駒を選択した時に必要な処理を行う関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 */
function selectKomaToMove(x, y) {
    gameState = BOARD_SELECTED;
    selectedKoma = shogiBoard.board[x][y];
    fromSquare = { x: x, y: y };

    for (var xLocal = 1; xLocal <= 9; xLocal++) {
        for (var yLocal = 1; yLocal <= 9; yLocal++) {
            var msquare = document.getElementById("ms" + xLocal + yLocal);
            if (xLocal == x && yLocal == y) {
                // msquare.style.backgroundImage = komaSet[shogiBoard.board[x][y]].img;
                msquare.style.opacity = "0.0";
            } else {
                // msquare.style.backgroundImage = "";
                msquare.style.opacity = "0.2";
            }
            msquare.onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }

    for (var koma = FU; koma <= HI; koma++) {
        document.getElementById("mS" + koma).onclick = function () {
            if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
        };
        document.getElementById("mE" + koma).onclick = function () {
            if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
        };
    }

    showMask();

    showPath(x, y);
}

/**
 * 使う手駒を選択した時に必要な処理を行う関数
 * @param {Number} turn 手番(自分=1/敵=0)
 * @param {Number} koma 駒を表す数値
 */
function selectTegoma(turn, koma) {
    gameState = KOMADAI_SELECTED;
    selectedKoma = koma;
    if (turn == ENEMY_TURN) {
        selectedKoma |= ENEMY;
    }
    fromSquare = { x: 0, y: 0 };

    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var msquare = document.getElementById("ms" + x + y);
            msquare.style.opacity = "0.2";
            msquare.onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }
    for (var komaLocal = FU; komaLocal <= HI; komaLocal++) {
        document.getElementById("mS" + komaLocal).onclick = function () {
            if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
        };
        document.getElementById("mE" + komaLocal).onclick = function () {
            if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
        };
    }

    showMask();

    showDrop(komaSet[selectedKoma]);
}

/**
 * 動かしたい(使いたい)駒を選択した後に，設置可能な空白マスを選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，設置可能な空白マスの筋
 * @param {Number} y 選択した，設置可能な空白マスの段
 */
function selectSquare(x, y) {
    toSquare = { x: x, y: y };
    if (gameState == BOARD_SELECTED) {

        if (canNari(komaSet[selectedKoma], x, y) || canNari(komaSet[selectedKoma], fromSquare.x, fromSquare.y)) {
            if (((selectedKoma == KE && y <= 2) || ((selectedKoma == KY || selectedKoma == FU) && y == 1))
                || ((selectedKoma == EKE && y >= 8) || ((selectedKoma == EKY || selectedKoma == EFU) && y == 9))) {
                shogiBoard.move(fromSquare, toSquare, selectedKoma + NARI);
                rotateTurn();
            } else {
                showNariWindow(x, y);
            }
        } else {
            shogiBoard.move(fromSquare, toSquare, selectedKoma);
            rotateTurn();
        }
    } else if (gameState == KOMADAI_SELECTED) {
        shogiBoard.move(fromSquare, toSquare, selectedKoma);
        rotateTurn();
    }
}

/**
 * 成るか成らないかを選択するためのウィンドウを表示する関数
 * @param {Number} x 選択した駒の移動先のマスの筋
 * @param {Number} y 選択した駒の移動先のマスの段
 */
function showNariWindow(x, y) {
    gameState = NARI_SELECTING;

    var nariWindow = document.getElementById("nari_window");
    nariWindow.style.left = `${BOARD_LEFT + SQUARE_WIDTH * (9 - x) - SQUARE_WIDTH/2}px`;
    nariWindow.style.top = `${BOARD_TOP + SQUARE_HEIGHT * (y - 1)}px`;

    var nari = document.getElementById("NARI");
    nari.style.backgroundImage = komaSet[selectedKoma + NARI].img;
    nari.onclick = function() {
        shogiBoard.move(fromSquare, toSquare, selectedKoma + NARI);
        hideNariWindow();
        rotateTurn();
    };

    var narazu = document.getElementById("NARAZU");
    narazu.style.backgroundImage = komaSet[selectedKoma].img;
    narazu.onclick = function() {
        shogiBoard.move(fromSquare, toSquare, selectedKoma);
        hideNariWindow();
        rotateTurn();
    };

    nariWindow.style.visibility = "visible";
}

/**
 * 成るか成らないかを選択するためのウィンドウを隠す関数
 */
function hideNariWindow() {
    document.getElementById("nari_window").style.visibility = "hidden";
}

/**
 * DOMが構築された後に発生するイベントのハンドラ
 */
window.onload = function () {
    shogiBoard = new ShogiBoard(true);

    gameState = SELECTING;

    for (var i = 0; i < 32; i++) {
        komaSet[i] = koma(i);
    }

    showBoard();
}