// coding rule: https://cou929.nu/data/google_javascript_style_guide/

let komaSet = [];
let board = [];
let tegoma = [];

let xSelected, ySelected;

let selectedKoma;
let gameTurn;
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
    return (koma.canNari && ((koma.isSelf && isEnemyArea(x, y)) || (koma.isEnemy && isSelfArea(x, y))));
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
    gameTurn = !gameTurn;
    hideMask();
}

/**
 * 手番の駒を動かすことができる盤を表示する関数
 */
function showBoard() {
    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var square = document.getElementById("s" + x + y);
            square.style.backgroundImage = komaSet[board[x][y]].img;

            if (board[x][y] != EMPTY) {
                (function () {
                    var xLocal = x, yLocal = y;
                    square.onclick = function () {
                        if (gameTurn == komaSet[board[xLocal][yLocal]].isSelf && gameState == SELECTING) {
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
        for (var koma = 0; koma <= HI; koma++) {
            var square;
            if (turn == SELF_TURN && komaSet[koma].isKoma) {
                square = document.getElementById("S" + koma);
                square.dataset.num = tegoma[SELF_TURN][koma];
            } else if (komaSet[koma].isKoma) {
                square = document.getElementById("E" + koma);
                square.dataset.num = tegoma[ENEMY_TURN][koma];
            }

            if (tegoma[turn][koma] != 0) {
                (function () {
                    var turnLocal = turn, komaLocal = koma;
                    square.onclick = function () {
                        if (+gameTurn == turnLocal && gameState == SELECTING) {
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
    for (var path of komaSet[board[x][y]].pathGen(x, y, board)) {
        var msquare = document.getElementById("ms" + path.xTo + path.yTo);
        msquare.style.opacity = "0.0";
        // msquare.style.backgroundImage = "";
        if (path.isEmpty) {
            msquare.onclick = new Function("selectEmpty(" + path.xTo + "," + path.yTo + ")");
        } else {
            msquare.onclick = new Function("selectOpposite(" + path.xTo + "," + path.yTo + ")");
        }
    }
}

/**
 * 与えられた駒を現在打つことができるマスを明るく表示する関数
 * @param {Number} koma 駒
 */
function showDrop(koma) {
    for (var path of koma.dropGen(board)) {
        var msquare = document.getElementById("ms" + path.xTo + path.yTo);
        msquare.style.opacity = "0.0";
        // msquare.style.backgroundImage = "";
        msquare.onclick = new Function("selectEmpty(" + path.xTo + "," + path.yTo + ")");
    }
}

/**
 * 動かす駒を選択した時に必要な処理を行う関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 */
function selectKomaToMove(x, y) {
    gameState = BOARD_SELECTED;
    selectedKoma = board[x][y];
    xSelected = x;
    ySelected = y;

    for (var xLocal = 1; xLocal <= 9; xLocal++) {
        for (var yLocal = 1; yLocal <= 9; yLocal++) {
            var msquare = document.getElementById("ms" + xLocal + yLocal);
            if (xLocal == x && yLocal == y) {
                // msquare.style.backgroundImage = komaSet[board[x][y]].img;
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

    for (var koma = 0; koma <= HI; koma++) {
        if (komaSet[koma].isKoma) {
            document.getElementById("mS" + koma).onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
            document.getElementById("mE" + koma).onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }

    document.getElementById("komadai_self_mask").style.visibility = "visible";
    document.getElementById("komadai_enemy_mask").style.visibility = "visible";
    document.getElementById("board_mask").style.visibility = "visible";

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

    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var msquare = document.getElementById("ms" + x + y);
            msquare.style.opacity = "0.2";
            msquare.onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }
    for (var komaLocal = 0; komaLocal <= HI; komaLocal++) {
        if (komaSet[komaLocal].isKoma) {
            document.getElementById("mS" + komaLocal).onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
            document.getElementById("mE" + komaLocal).onclick = function () {
                if (gameState <= SELECTED) { gameState = SELECTING; hideMask(); }
            };
        }
    }
    document.getElementById("komadai_self_mask").style.visibility = "visible";
    document.getElementById("komadai_enemy_mask").style.visibility = "visible";
    document.getElementById("board_mask").style.visibility = "visible";

    showDrop(komaSet[selectedKoma]);
}

/**
 * 動かしたい(使いたい)駒を選択した後に，設置可能な空白マスを選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，設置可能な空白マスの筋
 * @param {Number} y 選択した，設置可能な空白マスの段
 */
function selectEmpty(x, y) {
    if (gameState == BOARD_SELECTED) {
        board[x][y] = selectedKoma;
        board[xSelected][ySelected] = EMPTY;

        if (canNari(komaSet[selectedKoma], x, y) || canNari(komaSet[selectedKoma], xSelected, ySelected)) {
            if (((selectedKoma == KE && y <= 2) || ((selectedKoma == KY || selectedKoma == FU) && y == 1))
                || ((selectedKoma == EKE && y >= 8) || ((selectedKoma == EKY || selectedKoma == EFU) && y == 9))) {
                board[x][y] += NARI;
                rotateTurn();
                showBoard();
            } else {
                showNariWindow(x, y);
            }
        } else {
            rotateTurn();
            showBoard();
        }
    } else if (gameState == KOMADAI_SELECTED) {
        tegoma[+gameTurn][selectedKoma & ~ENEMY]--;
        board[x][y] = selectedKoma;
        rotateTurn();
        showBoard();
    }
}

/**
 * 動かしたい駒を選択した後に，取ることが可能な駒を選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，取ることが可能な駒のマスの筋
 * @param {Number} y 選択した，取ることが可能な駒のマスの段
 */
function selectOpposite(x, y) {
    if (gameState == BOARD_SELECTED) {
        tegoma[+gameTurn][board[x][y] & ~ENEMY & ~NARI]++;
        board[x][y] = selectedKoma;
        board[xSelected][ySelected] = EMPTY;

        if (canNari(komaSet[selectedKoma], x, y) || canNari(komaSet[selectedKoma], xSelected, ySelected)) {
            if (((selectedKoma == KE && y <= 2) || ((selectedKoma == KY || selectedKoma == FU) && y == 1))
                || ((selectedKoma == EKE && y >= 8) || ((selectedKoma == EKY || selectedKoma == EFU) && y == 9))) {
                board[x][y] += NARI;
                rotateTurn();
                showBoard();
            } else {
                showNariWindow(x, y);
            }
        } else {
            rotateTurn();
            showBoard();
        }
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
    nariWindow.style.left = "" + (196 + 52 * (9 - x) - 26) + "px";
    nariWindow.style.top = "" + (21 + 59 * (y - 1)) + "px";

    var nari = document.getElementById("NARI");
    nari.style.backgroundImage = komaSet[selectedKoma + NARI].img;
    nari.onclick = new Function("board[" + x + "][" + y + "] += NARI; document.getElementById('nari_window').style.visibility = 'hidden'; rotateTurn(); showBoard();");

    var narazu = document.getElementById("NARAZU");
    narazu.style.backgroundImage = komaSet[selectedKoma].img;
    narazu.onclick = new Function("document.getElementById('nari_window').style.visibility = 'hidden'; rotateTurn(); showBoard();");

    nariWindow.style.visibility = "visible";
}

/**
 * DOMが構築された後に発生するイベントのハンドラ
 */
window.onload = function () {
    gameTurn = true;

    gameState = SELECTING;

    for (var i = 0; i < 32; i++) {
        komaSet[i] = new Koma(i);
    }

    for (var x = 0; x <= 10; x++) {
        board[x] = [];
        for (var y = 0; y <= 10; y++) {
            if (x == 0 || x == 10 || y == 0 || y == 10) {
                board[x][y] = OUT_OF_BOARD;
            } else {
                board[x][y] = EMPTY;
            }
        }
    }

    for (var turn = 0; turn <= 1; turn++) {
        tegoma[turn] = [];
        for (var koma = 0; koma <= HI; koma++) {
            tegoma[turn][koma] = 0;
        }
    }

    board[1][1] = EKY;
    board[2][1] = EKE;
    board[3][1] = EGI;
    board[4][1] = EKI;
    board[5][1] = EOU;
    board[6][1] = EKI;
    board[7][1] = EGI;
    board[8][1] = EKE;
    board[9][1] = EKY;
    board[8][2] = EHI;
    board[2][2] = EKA;
    board[1][9] = KY;
    board[2][9] = KE;
    board[3][9] = GI;
    board[4][9] = KI;
    board[5][9] = OU;
    board[6][9] = KI;
    board[7][9] = GI;
    board[8][9] = KE;
    board[9][9] = KY;
    board[2][8] = HI;
    board[8][8] = KA;
    for (var i = 1; i <= 9; i++) {
        board[i][3] = EFU;
        board[i][7] = FU;
    }

    showBoard();
}