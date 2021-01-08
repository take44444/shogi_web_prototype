// coding rule: https://cou929.nu/data/google_javascript_style_guide/

var komaImg;
var komaNariWindowImg;
var nariWindow;
var nariWindowFlg;

var xClicked, yClicked;

var selectedKoma;
var turn;
var state;

SELECTING = 0;
BOARD_SELECTED = 1;
KOMADAI_SELECTED = 2;
NARI_SELECTING = 3;

/**
 * 自分の手盤を表す数値
 * @const
 */
SELF_TURN = 1;

/**
 * 相手の手盤を表す数値
 * @const
 */
ENEMY_TURN = 0;

var board = [];
var tegoma = [];

/**
 * 盤外のマスを表す数値
 * @const
 */
OUT_OF_BOARD = 128;

/**
 * 空白マスを表す数値
 * @const
 */
EMPTY = 0;

/**
 * 歩を表す数値
 * @const
 */
FU = 1;

/**
 * 香を表す数値
 * @const
 */
KY = 2;

/**
 * 桂を表す数値
 * @const
 */
KE = 3;

/**
 * 銀を表す数値
 * @const
 */
GI = 4;

/**
 * 金を表す数値
 * @const
 */
KI = 5;

/**
 * 角を表す数値
 * @const
 */
KA = 6;

/**
 * 飛を表す数値
 * @const
 */
HI = 7;

/**
 * 王を表す数値
 * @const
 */
OU = 8;

/**
 * 駒が成っていることを表す数値
 * @const
 */
NARI = 8;

/**
 * と金を表す数値
 * @const
 */
TO = NARI + FU;

/**
 * 成香を表す数値
 * @const
 */
NY = NARI + KY;

/**
 * 成桂を表す数値
 * @const
 */
NK = NARI + KE;

/**
 * 成銀を表す数値
 * @const
 */
NG = NARI + GI;

/**
 * 馬を表す数値
 * @const
 */
UM = NARI + KA;

/**
 * 龍を表す数値
 * @const
 */
RY = NARI + HI;

/**
 * 敵の駒であることを表す数値
 * @const
 */
ENEMY = 16;

/**
 * 敵の歩を表す数値
 * @const
 */
EFU = ENEMY + FU;

/**
 * 敵の香を表す数値
 * @const
 */
EKY = ENEMY + KY;

/**
 * 敵の桂を表す数値
 * @const
 */
EKE = ENEMY + KE;

/**
 * 敵の銀を表す数値
 * @const
 */
EGI = ENEMY + GI;

/**
 * 敵の金を表す数値
 * @const
 */
EKI = ENEMY + KI;

/**
 * 敵の角を表す数値
 * @const
 */
EKA = ENEMY + KA;

/**
 * 敵の飛を表す数値
 * @const
 */
EHI = ENEMY + HI;

/**
 * 敵の王を表す数値
 * @const
 */
EOU = ENEMY + OU;

/**
 * 敵のと金を表す数値
 * @const
 */
ETO = ENEMY + TO;

/**
 * 敵の成香を表す数値
 * @const
 */
ENY = ENEMY + NY;

/**
 * 敵の成桂を表す数値
 * @const
 */
ENK = ENEMY + NK;

/**
 * 敵の成銀を表す数値
 * @const
 */
ENG = ENEMY + NG;

/**
 * 敵の馬を表す数値
 * @const
 */
EUM = ENEMY + UM;

/**
 * 敵の龍を表す数値
 * @const
 */
ERY = ENEMY + RY;

/**
 * 自分の駒か否かをBooleanで返す関数
 * @param {Number} koma 駒を表す数値
 * @return {Boolean} 引数で与えられた駒が自分の駒の場合はtrue，違う場合はfalseを返す
 */
function komaIsSelf(koma) {
    return (FU <= koma && koma <= RY);
}

/**
 * 敵の駒か否かをBooleanで返す関数
 * @param {Number} koma 駒を表す数値
 * @return {Boolean} 引数で与えられた駒が敵の駒の場合はtrue，違う場合はfalseを返す
 */
function komaIsEnemy(koma) {
    return (EFU <= koma && koma <= ERY);
}

/**
 * 成れる駒か否かをBooleanで返す関数
 * @param {Number} koma 駒を表す数値
 * @return {Boolean} 引数で与えられた駒が成れる駒の場合はtrue，違う場合はfalseを返す
 */
function komaCanNari(koma) {
    var k = koma & ~ENEMY;
    return (FU <= k && k <= HI && k != KI && k != OU);
}

/**
 * 駒を表す数値かをBooleanで返す関数
 * @param {Number} koma 数値
 * @return {Boolean} 引数で与えられた数値が駒の場合はtrue，違う場合はfalseを返す
 */
function isKoma(koma) {
    return ((FU <= koma && koma <= RY) || (EFU <= koma && koma <= ERY));
}

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
	return (komaCanNari(koma) && ((komaIsSelf(koma) && isEnemyArea(x, y)) || (komaIsEnemy(koma) && isSelfArea(x, y))));
}

/**
 * 手番の駒を動かすことができる盤を表示する関数
 */
function showBoard() {
    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var square = document.getElementById("s"+x+y);
            square.style.backgroundImage = komaImg[board[x][y]];

            if (board[x][y] != EMPTY) {
                (function() {
                    var xLocal = x, yLocal = y;
                    square.onclick = function() {
                        if (turn == komaIsSelf(board[xLocal][yLocal]) && state == SELECTING) {
                            selectKomaToMove(xLocal, yLocal);
                        }
                    }
                })();
            }
        }
    }

    showTegoma();

    state = SELECTING;
    // var turnMessageElement = document.getElementById("turn_message");
    // (turn) ? turnMessageElement.innerHTML = "??????<br>" : turnMessageElement.innerHTML = "??????<br>";
}

/**
 * 手駒を表示する関数
 */
function showTegoma() {
    for (var i = 0; i <= 1; i++) {
		for (var j = 0; j <= HI; j++) {
            var square;
            if (i == SELF_TURN && isKoma(j)) {
                square = document.getElementById("S"+j);
                square.dataset.num = tegoma[SELF_TURN][j];
            } else if (isKoma(j)) {
                square = document.getElementById("E"+j);
                square.dataset.num = tegoma[ENEMY_TURN][j];
            }

            if (tegoma[i][j] != 0) {
                (function() {
                    var iLocal = i, jLocal = j;
                    square.onclick = function() {
                        if (+turn == iLocal && state == SELECTING) {
                            selectTegoma(iLocal, jLocal);
                        }
                    }
                })();
            }
		}
	}
}

/**
 * 盤上の，与えられたマスにある駒が現在移動することができるマスを明るく表示する関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 */
function showPath(x, y) {
    if (board[x][y] == FU) {
        if (komaIsEnemy(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
    } else if (board[x][y] == EFU) {
        if (komaIsSelf(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
    } else if (board[x][y] == KY) {
        for (var yTo = y-1; yTo >= 1; yTo--) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsEnemy(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+x+","+yTo+")");
                break;
            } else {
                break;
            }
        }
    } else if (board[x][y] == EKY) {
        for (var yTo = y+1; yTo <= 9; yTo++) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsSelf(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+x+","+yTo+")");
                break;
            } else {
                break;
            }
        }
    } else if (board[x][y] == KE) {
        if (komaIsEnemy(board[x-1][y-2])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-2)+")");
        } else if (board[x-1][y-2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-2)+")");
        }
        if (komaIsEnemy(board[x+1][y-2])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-2)+")");
        } else if (board[x+1][y-2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-2)+")");
        }
    } else if (board[x][y] == EKE) {
        if (komaIsSelf(board[x-1][y+2])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+2)+")");
        } else if (board[x-1][y+2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+2)+")");
        }
        if (komaIsSelf(board[x+1][y+2])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+2)+")");
        } else if (board[x+1][y+2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+2));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+2)+")");
        }
    } else if (board[x][y] == GI) {
        if (komaIsEnemy(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsEnemy(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
    } else if (board[x][y] == EGI) {
        if (komaIsSelf(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsSelf(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsSelf(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsSelf(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsSelf(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
    } else if (board[x][y] == KI || (board[x][y] >= TO && board[x][y] <= NG)) {
        if (komaIsEnemy(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsEnemy(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsEnemy(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == EKI || (board[x][y] >= ETO && board[x][y] <= ENG)) {
        if (komaIsSelf(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsSelf(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsSelf(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsSelf(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
        if (komaIsSelf(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsSelf(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == OU) {
        if (komaIsEnemy(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsEnemy(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
        if (komaIsEnemy(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsEnemy(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsEnemy(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsEnemy(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == EOU) {
        if (komaIsSelf(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsSelf(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsSelf(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsSelf(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsSelf(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsSelf(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
        if (komaIsSelf(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsSelf(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            // msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == HI) {
        for (var yTo = y-1; yTo >= 1; yTo--) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsEnemy(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+x+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var yTo = y+1; yTo <= 9; yTo++) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsEnemy(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+x+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x-1; xTo >= 1; xTo--) {
            if (board[xTo][y] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsEnemy(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+y+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x+1; xTo <= 9; xTo++) {
            if (board[xTo][y] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsEnemy(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+y+")");
                break;
            } else {
                break;
            }
        }
    } else if (board[x][y] == EHI) {
        for (var yTo = y+1; yTo <= 9; yTo++) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsSelf(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+x+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var yTo = y-1; yTo >= 1; yTo--) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsSelf(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+x+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x-1; xTo >= 1; xTo--) {
            if (board[xTo][y] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsSelf(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+y+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x+1; xTo <= 9; xTo++) {
            if (board[xTo][y] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsSelf(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+y+")");
                break;
            } else {
                break;
            }
        }
    } else if (board[x][y] == KA) {
        for (var xTo = x-1, yTo = y-1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsEnemy(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x+1, yTo = y-1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsEnemy(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x-1, yTo = y+1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsEnemy(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x+1, yTo = y+1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsEnemy(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
    } else if (board[x][y] == EKA) {
        for (var xTo = x-1, yTo = y-1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSelf(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x+1, yTo = y-1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSelf(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x-1, yTo = y+1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSelf(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
        for (var xTo = x+1, yTo = y+1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSelf(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                // msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
    }
}

/**
 * 動かす駒を選択した時に必要な処理を行う関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 */
function selectKomaToMove(x, y) {
    for (var xLocal = 1; xLocal <= 9; xLocal++) {
        for (var yLocal = 1; yLocal <= 9; yLocal++) {
            if (xLocal == x && yLocal == y) {
                var msquare = document.getElementById("ms"+xLocal+yLocal);
                // msquare.style.backgroundImage = komaImg[board[x][y]];
                msquare.style.opacity = "0.0";
                msquare.onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
            } else {
                var msquare = document.getElementById("ms"+xLocal+yLocal);
                // msquare.style.backgroundImage = "";
                msquare.style.opacity = "0.2";
                msquare.onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
            }
        }
    }

    for (var i = 0; i <= HI; i++) {
        if (isKoma(i)) {
            document.getElementById("mS"+i).onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
            document.getElementById("mE"+i).onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
        }
    }

    document.getElementById("komadai_self_mask").style.visibility = "visible";
    document.getElementById("komadai_enemy_mask").style.visibility = "visible";
    document.getElementById("board_mask").style.visibility = "visible";
    showPath(x, y);
    
    state = BOARD_SELECTED;
    selectedKoma = board[x][y];
    xClicked = x;
    yClicked = y;
}

/**
 * 使う手駒を選択した時に必要な処理を行う関数
 * @param {Number} i 手番(自分=1/敵=0)
 * @param {Number} j 駒を表す数値
 */
function selectTegoma(i, j) {
    for (var iLocal = 0; iLocal <= HI; iLocal++) {
        if (isKoma(iLocal)) {
            document.getElementById("mS"+iLocal).onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
            document.getElementById("mE"+iLocal).onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
        }
    }
    document.getElementById("komadai_self_mask").style.visibility = "visible";
    document.getElementById("komadai_enemy_mask").style.visibility = "visible";
    document.getElementById("board_mask").style.visibility = "visible";

    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var msquare = document.getElementById("ms"+x+y);
            if (board[x][y] != EMPTY) {
                msquare.style.opacity = "0.2";
                msquare.onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
            } else {
                if (i == SELF_TURN) {
                    if ((j == KE && y <= 2) || (j == KY && y == 1)) {
                        msquare.style.opacity = "0.2";
                        msquare.onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
                    } else if (j == FU) {
                        var flg = true;
                        for (var yLocal = 1; yLocal <= 9; yLocal++) {
                            if (board[x][yLocal] == FU) {
                                flg = false;
                                break;
                            }
                        }
                        if (!flg || y == 1) {
                            msquare.style.opacity = "0.2";
                            msquare.onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
                        } else {
                            msquare.style.opacity = "0.0";
                            msquare.onclick = new Function("selectEmpty("+x+","+y+");");
                        }
                    } else {
                        msquare.style.opacity = "0.0";
                        msquare.onclick = new Function("selectEmpty("+x+","+y+");");
                    }
                } else {
                    if ((j == KE && y >= 8) || (j == KY && y == 9)) {
                        msquare.style.opacity = "0.2";
                        msquare.onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
                    } else if (j == FU) {
                        var flg = true;
                        for (var yLocal = 1; yLocal <= 9; yLocal++) {
                            if (board[x][yLocal] == EFU) {
                                flg = false;
                                break;
                            }
                        }
                        if (!flg || y == 9) {
                            msquare.style.opacity = "0.2";
                            msquare.onclick = new Function('state = SELECTING; document.getElementById("board_mask").style.visibility = "hidden"; document.getElementById("komadai_self_mask").style.visibility = "hidden"; document.getElementById("komadai_enemy_mask").style.visibility = "hidden";');
                        } else {
                            msquare.style.opacity = "0.0";
                            msquare.onclick = new Function("selectEmpty("+x+","+y+");");
                        }
                    } else {
                        msquare.style.opacity = "0.0";
                        msquare.onclick = new Function("selectEmpty("+x+","+y+");");
                    }
                }
            }
        }
    }

    state = KOMADAI_SELECTED;
    selectedKoma = j;
    if (i == ENEMY_TURN) {
        selectedKoma |= ENEMY;
    }
}

/**
 * 動かしたい(使いたい)駒を選択した後に，設置可能な空白マスを選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，設置可能な空白マスの筋
 * @param {Number} y 選択した，設置可能な空白マスの段
 */
function selectEmpty(x, y) {
	if (state == BOARD_SELECTED) {
		board[x][y] = selectedKoma;
		board[xClicked][yClicked] = EMPTY;
        
		if (canNari(selectedKoma, x, y) || canNari(selectedKoma, xClicked, yClicked)) {
            // TODO
            // showNariWindow(x, y);
			selectedKoma = EMPTY;
			
            turn = !turn;
            document.getElementById("board_mask").style.visibility = "hidden";
            document.getElementById("komadai_self_mask").style.visibility = "hidden";
            document.getElementById("komadai_enemy_mask").style.visibility = "hidden";

			showBoard();
		} else {
			selectedKoma = EMPTY;
			
            turn = !turn;
            document.getElementById("board_mask").style.visibility = "hidden";
            document.getElementById("komadai_self_mask").style.visibility = "hidden";
            document.getElementById("komadai_enemy_mask").style.visibility = "hidden";

            showBoard();
		}
	} else if (state == KOMADAI_SELECTED) {
        tegoma[+turn][selectedKoma & ~ENEMY]--;
		board[x][y] = selectedKoma;

        selectedKoma = EMPTY;
			
        turn = !turn;
        document.getElementById("board_mask").style.visibility = "hidden";
        document.getElementById("komadai_self_mask").style.visibility = "hidden";
        document.getElementById("komadai_enemy_mask").style.visibility = "hidden";

        showBoard();
    }
}

/**
 * 動かしたい駒を選択した後に，取ることが可能な駒を選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，取ることが可能な駒のマスの筋
 * @param {Number} y 選択した，取ることが可能な駒のマスの段
 */
function selectEnemy(x, y) {
    tegoma[+turn][board[x][y] & ~ENEMY & ~NARI]++;
    board[x][y] = selectedKoma;
    board[xClicked][yClicked] = EMPTY;

    if (canNari(selectedKoma, x, y) || canNari(selectedKoma, xClicked, yClicked)) {
        // TODO
        // showNariWindow(x, y);
        selectedKoma = EMPTY;
        
        turn = !turn;
        document.getElementById("board_mask").style.visibility = "hidden";
        document.getElementById("komadai_self_mask").style.visibility = "hidden";
        document.getElementById("komadai_enemy_mask").style.visibility = "hidden";

        showBoard();
    } else {
        selectedKoma = EMPTY;
        
        turn = !turn;
        document.getElementById("board_mask").style.visibility = "hidden";
        document.getElementById("komadai_self_mask").style.visibility = "hidden";
        document.getElementById("komadai_enemy_mask").style.visibility = "hidden";

        showBoard();
    }
}

/**
 * DOMが構築された後に発生するイベントのハンドラ
 */
window.onload = function() {
    turn = true;

    state = SELECTING;
    nariWindowFlg = false;

    komaImg = [
        "",
        "url(img/FU_pos.png)",
        "url(img/KY_pos.png)",
        "url(img/KE_pos.png)",
        "url(img/GI_pos.png)",
        "url(img/KI_pos.png)",
        "url(img/KA_pos.png)",
        "url(img/HI_pos.png)",
        "url(img/OU_pos.png)",
        "url(img/TO_pos.png)",
        "url(img/NY_pos.png)",
        "url(img/NK_pos.png)",
        "url(img/NG_pos.png)",
        "url(img/KI_pos.png)",
        "url(img/UM_pos.png)",
        "url(img/RY_pos.png)",
        "",
        "url(img/FU_neg.png)",
        "url(img/KY_neg.png)",
        "url(img/KE_neg.png)",
        "url(img/GI_neg.png)",
        "url(img/KI_neg.png)",
        "url(img/KA_neg.png)",
        "url(img/HI_neg.png)",
        "url(img/OU_neg.png)",
        "url(img/TO_neg.png)",
        "url(img/NY_neg.png)",
        "url(img/NK_neg.png)",
        "url(img/NG_neg.png)",
        "url(img/KI_neg.png)",
        "url(img/UM_neg.png)",
        "url(img/RY_neg.png)",
        "",
    ];
    // pw_img = document.getElementById("pw_img");

	for(var i = 0; i <= 10; i++){
		board[i] = [];
		for(var j = 0; j <= 10; j++){
			board[i][j] = OUT_OF_BOARD;	
		}
	}
		
	for(var i = 1; i <= 9; i++){
        for(var j = 1; j <= 9; j++){
            board[i][j] = EMPTY;	
        }
	}

	for(var i = 0; i <= 1; i++){
		tegoma[i] = [];
		for(var j = 0; j <= HI; j++){
			tegoma[i][j] = 0;
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
	board[1][3] = EFU;
	board[2][3] = EFU;
	board[3][3] = EFU;
	board[4][3] = EFU;
	board[5][3] = EFU;
	board[6][3] = EFU;
	board[7][3] = EFU;
	board[8][3] = EFU;
	board[9][3] = EFU;
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
	board[1][7] = FU;
	board[2][7] = FU;
	board[3][7] = FU;
	board[4][7] = FU;
	board[5][7] = FU;
	board[6][7] = FU;
	board[7][7] = FU;
	board[8][7] = FU;
	board[9][7] = FU;

	showBoard();
}