// coding rule: https://cou929.nu/data/google_javascript_style_guide/

let shogiBoard;

let fromSq;
let toSq;

let selectedKoma;
let gameState;

const SELECTING = 0;
const BOARD_SELECTED = 1;
const KOMADAI_SELECTED = 2;
const SELECTED = 2;
const NARI_SELECTING = 3;

const SENTE = 1;
const GOTE = 0;

const BOARD_LEFT = 196;
const BOARD_TOP = 19;
const SQUARE_WIDTH = 52;
const SQUARE_HEIGHT = 61;

/**
 * 自分の陣地ないか否かをBooleanで返す関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 * @return {Boolean} 引数で与えられたマスが自分の陣地内の場合はtrue，違う場合はfalseを返す
 */
function isSenteArea(x, y) {
    return (7 <= y && y <= 9 && 1 <= x && x <= 9);
}

/**
 * 敵の陣地ないか否かをBooleanで返す関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 * @return {Boolean} 引数で与えられたマスが敵の陣地内の場合はtrue，違う場合はfalseを返す
 */
function isGoteArea(x, y) {
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
    return (koma.canNari && ((koma.isSente && isGoteArea(x, y)) || (!koma.isSente && isSenteArea(x, y))));
}

/**
 * 全マスクを表示
 */
function showMask() {
    document.getElementById("board_mask").style.visibility = "visible";
    document.getElementById("komadai_sente_mask").style.visibility = "visible";
    document.getElementById("komadai_gote_mask").style.visibility = "visible";
}

/**
 * 全マスクを隠す
 */
function hideMask() {
    document.getElementById("board_mask").style.visibility = "hidden";
    document.getElementById("komadai_sente_mask").style.visibility = "hidden";
    document.getElementById("komadai_gote_mask").style.visibility = "hidden";
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
            var square = document.getElementById(`s${x}${y}`);
            if (!shogiBoard.board[x][y].isEmpty) {
                square.style.backgroundImage = shogiBoard.board[x][y].img;
                (function () {
                    var xLocal = x, yLocal = y;
                    square.onclick = function () {
                        if (shogiBoard.turn == shogiBoard.board[xLocal][yLocal].isSente && gameState == SELECTING) {
                            selectKomaToMove(xLocal, yLocal);
                        }
                    };
                })();
            } else {
                square.style.backgroundImage = "";
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
        for (var koma in shogiBoard.tegoma[turn]) {
            var square = document.getElementById(`${turn==SENTE?"S":"G"}${koma}`);
            square.dataset.num = shogiBoard.tegoma[turn][koma].num;

            if (shogiBoard.tegoma[turn][koma].num != 0) {
                (function () {
                    var turnLocal = turn;
                    var komaLocal = shogiBoard.tegoma[turn][koma].koma;
                    square.onclick = function () {
                        if (+shogiBoard.turn == turnLocal && gameState == SELECTING) {
                            selectTegoma(komaLocal);
                        }
                    }
                })();
            }
        }
    }
}

/**
 * 与えられたマスにある駒が現在移動することができるマスを明るく表示する関数
 */
function showPath() {
    for (var path of selectedKoma.pathGen(fromSq.x, fromSq.y, shogiBoard.board)) {
        /** その場所に動かした時，自分の王様に利きがないかを調べる */
        if (canNari(selectedKoma, fromSq.x, fromSq.y) || canNari(selectedKoma, path.x, path.y)) {
            if (!shogiBoard.canMove(fromSq, path, selectedKoma.createNari())) {
                continue;
            }
        } else if (!shogiBoard.canMove(fromSq, path, selectedKoma)) {
            continue;
        }
        var msquare = document.getElementById(`ms${path.x}${path.y}`);
        msquare.style.opacity = "0.0";
        // msquare.style.backgroundImage = "";
        msquare.onclick = new Function(`selectSquare(${path.x}, ${path.y})`);
    }
}

/**
 * 与えられた駒を現在打つことができるマスを明るく表示する関数
 */
function showDrop() {
    for (var path of selectedKoma.dropGen(shogiBoard.board)) {
        /** その場所に動かした時，自分の王様に利きがないかを調べる */
        if (!shogiBoard.canMove(sq(0, 0), path, selectedKoma)) {
            continue;
        }
        var msquare = document.getElementById(`ms${path.x}${path.y}`);
        msquare.style.opacity = "0.0";
        // msquare.style.backgroundImage = "";
        msquare.onclick = new Function(`selectSquare(${path.x}, ${path.y})`);
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
    fromSq = sq(x, y);

    for (var xLocal = 1; xLocal <= 9; xLocal++) {
        for (var yLocal = 1; yLocal <= 9; yLocal++) {
            var msquare = document.getElementById(`ms${xLocal}${yLocal}`);
            if (xLocal == x && yLocal == y) {
                // msquare.style.backgroundImage = shogiBoard.board[x][y].img;
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

    for (var turn = 0; turn <= 1; turn++) {
        for (var koma in shogiBoard.tegoma[0]) {
            document.getElementById(`m${turn==SENTE?"S":"G"}${koma}`).onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }

    showMask();

    showPath();
}

/**
 * 使う手駒を選択した時に必要な処理を行う関数
 * @param {Number} koma 駒を表す数値
 */
function selectTegoma(koma) {
    gameState = KOMADAI_SELECTED;
    selectedKoma = koma;
    fromSq = sq(0, 0);

    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var msquare = document.getElementById(`ms${x}${y}`);
            msquare.style.opacity = "0.2";
            msquare.onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }

    for (var turn = 0; turn <= 1; turn++) {
        for (var komaLocal in shogiBoard.tegoma[0]) {
            document.getElementById(`m${turn==SENTE?"S":"G"}${komaLocal}`).onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }

    showMask();

    showDrop();
}

/**
 * 動かしたい(使いたい)駒を選択した後に，設置可能な空白マスを選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，設置可能な空白マスの筋
 * @param {Number} y 選択した，設置可能な空白マスの段
 */
function selectSquare(x, y) {
    toSq = sq(x, y);
    if (gameState == BOARD_SELECTED) {
        if (canNari(selectedKoma, x, y) || canNari(selectedKoma, fromSq.x, fromSq.y)) {
            if ((selectedKoma.symbol == "KE" && selectedKoma.isSente && y <= 2)
            || (selectedKoma.symbol == "KY" && selectedKoma.isSente && y == 1)
            || (selectedKoma.symbol == "FU" && selectedKoma.isSente && y == 1)
            || (selectedKoma.symbol == "KE" && !selectedKoma.isSente && y >= 8)
            || (selectedKoma.symbol == "KY" && !selectedKoma.isSente && y == 9)
            || (selectedKoma.symbol == "FU" && !selectedKoma.isSente && y == 9)) {
                shogiBoard.move(fromSq, toSq, selectedKoma.createNari());
                rotateTurn();
            } else {
                showNariWindow(x, y);
            }
        } else {
            shogiBoard.move(fromSq, toSq, selectedKoma);
            rotateTurn();
        }
    } else if (gameState == KOMADAI_SELECTED) {
        shogiBoard.move(fromSq, toSq, selectedKoma);
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
    nari.style.backgroundImage = selectedKoma.createNari().img;
    nari.onclick = function() {
        shogiBoard.move(fromSq, toSq, selectedKoma.createNari());
        hideNariWindow();
        rotateTurn();
    };

    var narazu = document.getElementById("NARAZU");
    narazu.style.backgroundImage = selectedKoma.img;
    narazu.onclick = function() {
        shogiBoard.move(fromSq, toSq, selectedKoma);
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
    fromSq = sq(0, 0);
    toSq = sq(0, 0);
    shogiBoard = new ShogiBoard(true);

    gameState = SELECTING;

    showBoard();
}