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

function playKillEffect() {
    var effect = effects["kill"];
    effect.style.left = `calc(50vw - 33.7vh + 7.5vh * ${9-toPoint.x} - 6.25vh)`;
    effect.style.top = `calc(12.8vh + 8.27vh * ${toPoint.y-1} - 5.865vh)`;
    effect.style.visibility = "visible";
    effect.play();
}

function playNariEffect() {
    var effect = effects["nari"];
    effect.style.left = `calc(50vw - 33.7vh + 7.5vh * ${9-toPoint.x} - 3.65vh)`;
    effect.style.top = `calc(12.8vh + 8.27vh * ${toPoint.y-1} - 3.365vh)`;
    effect.style.visibility = "visible";
    effect.play();
}

function playNormalEffect() {
    var effect = effects["normal"];
    effect.style.left = `calc(50vw - 33.7vh + 7.5vh * ${9-toPoint.x} - 3.65vh)`;
    effect.style.top = `calc(12.8vh + 8.27vh * ${toPoint.y-1} - 3.365vh)`;
    effect.style.visibility = "visible";
    effect.play();
}

function setBg(element, color, opacity) {
    element.style.opacity = opacity;
    element.style.backgroundColor = color;
    element.style.boxShadow = `0 0 3vh ${color}`;
}

function playBoardEffect() {
    var effect;
    if (boardState == BOARD_STATE.TUMI) {
        effect = effects["tumi"];
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
    if (!capFlg && !nariFlg) {
        playNormalEffect();
    }
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
    for (var path of selectedKoma.pathGen(fromPoint.x, fromPoint.y, shogiBoard.board)) {
        /** その場所に動かした時，自分の王様に利きがないかを調べる */
        if (canNari(selectedKoma, fromPoint.x, fromPoint.y) || canNari(selectedKoma, path.x, path.y)) {
            if (!shogiBoard.canMove(fromPoint, path, selectedKoma.createNari())) {
                continue;
            }
        } else if (!shogiBoard.canMove(fromPoint, path, selectedKoma)) {
            continue;
        }
        var msquare = document.getElementById(`ms${path.x}${path.y}`);
        setBg(msquare, "#fb0", 0.85);
        msquare.onclick =new Function(
            `selectSquare(${path.x}, ${path.y})`
        );
    }
}

/**
 * 与えられた駒を現在打つことができるマスを明るく表示する関数
 */
function showDrop() {
    for (var path of selectedKoma.dropGen(shogiBoard.board)) {
        /** その場所に動かした時，自分の王様に利きがないかを調べる */
        if (!shogiBoard.canMove(point(0, 0), path, selectedKoma)) {
            continue;
        }
        var msquare = document.getElementById(`ms${path.x}${path.y}`);
        setBg(msquare, "#fb0", 0.85);
        msquare.onclick =new Function(
            `selectSquare(${path.x}, ${path.y})`
        );
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
    fromPoint = point(x, y);

    for (var xLocal = 1; xLocal <= 9; xLocal++) {
        for (var yLocal = 1; yLocal <= 9; yLocal++) {
            var msquare = document.getElementById(`ms${xLocal}${yLocal}`);
            if (xLocal == x && yLocal == y) {
                setBg(msquare, "#fb0", 0.4);
            } else {
                setBg(msquare, "#641e00", 0.3);
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
    fromPoint = point(0, 0);

    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var msquare = document.getElementById(`ms${x}${y}`);
            setBg(msquare, "#641e00", 0.3);
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
 * 成るか成らないかを選択するためのウィンドウを表示する関数
 */
function showNariWindow() {
    gameState = NARI_SELECTING;

    var nariWindow = document.getElementById("nari_window");
    nariWindow.style.left = `calc(50vw - 33.7vh + 7.5vh * ${9-toPoint.x} - 7.5vh / 2)`;
    nariWindow.style.top = `calc(12.8vh + 8.27vh * ${toPoint.y-1})`;

    var nari = document.getElementById("NARI");
    nari.style.backgroundImage = selectedKoma.createNari().img;
    nari.onclick = function() {
        nariFlg = true;
        boardState = shogiBoard.move(fromPoint, toPoint, selectedKoma.createNari());
        updateKifuTable(shogiBoard.moves, shogiBoard.kifu.csaData);
        hideNariWindow();
        rotateTurn();
    };

    var narazu = document.getElementById("NARAZU");
    narazu.style.backgroundImage = selectedKoma.img;
    narazu.onclick = function() {
        boardState = shogiBoard.move(fromPoint, toPoint, selectedKoma);
        updateKifuTable(shogiBoard.moves, shogiBoard.kifu.csaData);
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
    sounds["komaoto"] = document.getElementById("komaoto");
    effects["kill"] = document.getElementById("kill_effect");
    effects["nari"] = document.getElementById("nari_effect");
    effects["normal"] = document.getElementById("normal_effect");
    effects["tumi"] = document.getElementById("tumi_effect");

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
    effects["normal"].addEventListener('ended', (event) => {
        effects["normal"].style.visibility = "hidden";
    });
    effects["tumi"].addEventListener('ended', (event) => {
        effects["tumi"].style.visibility = "hidden";
    });

    showBoard();
}