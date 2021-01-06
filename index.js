// coding rule: https://cou929.nu/data/google_javascript_style_guide/

var komaImg;
var komaNariWindowImg;
var nariWindow;

var boardSelected;
var komadaiSelected;
var nariWindowFlg;

var xClicked, yClicked;

var selectedKoma;
var turn;

SENTE = 1;
GOTE = 0;

var board = [];
var tegoma = [];

OUT_OF_BOARD = 128;
EMPTY = 0;
FU = 1;
KY = 2;
KE = 3;
GI = 4;
KI = 5;
KA = 6;
HI = 7;
OU = 8;
NARI = 8;
TO = NARI + FU;
NY = NARI + KY;
NK = NARI + KE;
NG = NARI + GI;
UM = NARI + KA;
RY = NARI + HI;
ENEMY = 16;
EFU = ENEMY + FU;
EKY = ENEMY + KY;
EKE = ENEMY + KE;
EGI = ENEMY + GI;
EKI = ENEMY + KI;
EKA = ENEMY + KA;
EHI = ENEMY + HI;
EOU = ENEMY + OU;
ETO = ENEMY + TO;
ENY = ENEMY + NY;
ENK = ENEMY + NK;
ENG = ENEMY + NG;
EUM = ENEMY + UM;
ERY = ENEMY + RY;

function komaIsSente(koma) {
    return (FU <= koma && koma <= RY);
}

function komaIsGote(koma) {
    return (EFU <= koma && koma <= ERY);
}

function komaCanNari(koma) {
    var k = koma & ~ENEMY;
    return (FU <= k && k <= HI && k != KI && k != OU);
}

function isKoma(koma) {
    return ((FU <= koma && koma <= RY) || (EFU <= koma && koma <= ERY));
}

function isSenteArea(x, y) {
    return (7 <= y && y <= 9 && 1 <= x && x <= 9);
}

function isGoteArea(x, y) {
	return (1 <= y && y <= 3 && 1 <= x && x <= 9);
}

function canNari(koma, x, y) {
	return (komaCanNari(koma) && ((komaIsSente(koma) && isGoteArea(x, y)) || (komaIsGote(koma) && isSenteArea(x, y))));
}

function showBoard() {
    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var square = document.getElementById("s"+x+y);
            square.style.backgroundImage = komaImg[board[x][y]];

            if (board[x][y] != EMPTY && board[x][y] != OUT_OF_BOARD) {
                (function() {
                    var xLocal = x, yLocal = y;
                    square.onclick = function() {
                        if (turn == komaIsSente(board[xLocal][yLocal]) && !nariWindowFlg) {
                            selectSelfKoma(xLocal, yLocal);
                        }
                    }
                })();
            }
        }
    }

    showTegoma()

    // var turnMessageElement = document.getElementById("turn_message");
    // (turn) ? turnMessageElement.innerHTML = "??????<br>" : turnMessageElement.innerHTML = "??????<br>";
}

function showTegoma() {
    document.getElementById("HI").dataset.num = tegoma[1][HI];
    document.getElementById("KA").dataset.num = tegoma[1][KA];
    document.getElementById("KI").dataset.num = tegoma[1][KI];
    document.getElementById("GI").dataset.num = tegoma[1][GI];
    document.getElementById("KE").dataset.num = tegoma[1][KE];
    document.getElementById("KY").dataset.num = tegoma[1][KY];
    document.getElementById("FU").dataset.num = tegoma[1][FU];
    document.getElementById("EHI").dataset.num = tegoma[0][HI];
    document.getElementById("EKA").dataset.num = tegoma[0][KA];
    document.getElementById("EKI").dataset.num = tegoma[0][KI];
    document.getElementById("EGI").dataset.num = tegoma[0][GI];
    document.getElementById("EKE").dataset.num = tegoma[0][KE];
    document.getElementById("EKY").dataset.num = tegoma[0][KY];
    document.getElementById("EFU").dataset.num = tegoma[0][FU];
}

function showPath(x, y) {
    if (board[x][y] == FU) {
        if (komaIsGote(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
    } else if (board[x][y] == EFU) {
        if (komaIsSente(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
    } else if (board[x][y] == KY) {
        for (var yTo = y-1; yTo >= 1; yTo--) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsGote(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsSente(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+x+","+yTo+")");
                break;
            } else {
                break;
            }
        }
    } else if (board[x][y] == KE) {
        if (komaIsGote(board[x-1][y-2])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-2)+")");
        } else if (board[x-1][y-2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-2)+")");
        }
        if (komaIsGote(board[x+1][y-2])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-2)+")");
        } else if (board[x+1][y-2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-2)+")");
        }
    } else if (board[x][y] == EKE) {
        if (komaIsSente(board[x-1][y+2])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+2)+")");
        } else if (board[x-1][y+2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+2)+")");
        }
        if (komaIsSente(board[x+1][y+2])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+2)+")");
        } else if (board[x+1][y+2] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+2));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+2)+")");
        }
    } else if (board[x][y] == GI) {
        if (komaIsGote(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsGote(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsGote(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsGote(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsGote(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
    } else if (board[x][y] == EGI) {
        if (komaIsSente(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsSente(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsSente(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsSente(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsSente(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
    } else if (board[x][y] == KI || (board[x][y] >= TO && board[x][y] <= NG)) {
        if (komaIsGote(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsGote(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsGote(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsGote(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsGote(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsGote(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == EKI || (board[x][y] >= ETO && board[x][y] <= ENG)) {
        if (komaIsSente(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsSente(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsSente(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsSente(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
        if (komaIsSente(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsSente(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == OU) {
        if (komaIsGote(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsGote(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
        if (komaIsGote(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsGote(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsGote(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsGote(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsGote(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsGote(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == EOU) {
        if (komaIsSente(board[x-1][y-1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y-1)+")");
        } else if (board[x-1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y-1)+")");
        }
        if (komaIsSente(board[x+1][y-1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y-1)+")");
        } else if (board[x+1][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y-1)+")");
        }
        if (komaIsSente(board[x][y+1])) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y+1)+")");
        } else if (board[x][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y+1)+")");
        }
        if (komaIsSente(board[x][y-1])) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+x+","+(y-1)+")");
        } else if (board[x][y-1] == EMPTY) {
            var msquare = document.getElementById("ms"+x+(y-1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+x+","+(y-1)+")");
        }
        if (komaIsSente(board[x-1][y+1])) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+(y+1)+")");
        } else if (board[x-1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+(y+1)+")");
        }
        if (komaIsSente(board[x+1][y+1])) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+(y+1)+")");
        } else if (board[x+1][y+1] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+(y+1));
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+(y+1)+")");
        }
        if (komaIsSente(board[x-1][y])) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x-1)+","+y+")");
        } else if (board[x-1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x-1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x-1)+","+y+")");
        }
        if (komaIsSente(board[x+1][y])) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEnemy("+(x+1)+","+y+")");
        } else if (board[x+1][y] == EMPTY) {
            var msquare = document.getElementById("ms"+(x+1)+y);
            msquare.style.opacity = "0.0";
            msquare.style.backgroundImage = "";
            msquare.onclick = new Function("selectEmpty("+(x+1)+","+y+")");
        }
    } else if (board[x][y] == HI) {
        for (var yTo = y-1; yTo >= 1; yTo--) {
            if (board[x][yTo] == EMPTY) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsGote(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsGote(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsGote(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsGote(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsSente(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+x+","+yTo+")");
            } else if (komaIsSente(board[x][yTo])) {
                var msquare = document.getElementById("ms"+x+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsSente(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+y+")");
            } else if (komaIsSente(board[xTo][y])) {
                var msquare = document.getElementById("ms"+xTo+y);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsGote(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsGote(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsGote(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsGote(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSente(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSente(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSente(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
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
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEmpty("+xTo+","+yTo+")");
            } else if (komaIsSente(board[xTo][yTo])) {
                var msquare = document.getElementById("ms"+xTo+yTo);
                msquare.style.opacity = "0.0";
                msquare.style.backgroundImage = "";
                msquare.onclick = new Function("selectEnemy("+xTo+","+yTo+")");
                break;
            } else {
                break;
            }
        }
    }
}

function selectSelfKoma(x, y) {
    for (var xLocal = 1; xLocal <= 9; xLocal++) {
        for (var yLocal = 1; yLocal <= 9; yLocal++) {
            if (xLocal == x && yLocal == y) {
                var msquare = document.getElementById("ms"+xLocal+yLocal);
                // msquare.style.backgroundImage = komaImg[board[x][y]];
                msquare.style.opacity = "0.0";
                msquare.onclick = new Function('boardSelected = false; document.getElementById("mask").style.visibility = "hidden";');
            } else {
                var msquare = document.getElementById("ms"+xLocal+yLocal);
                msquare.style.backgroundImage = "";
                msquare.style.opacity = "0.2";
                msquare.onclick = new Function('boardSelected = false; document.getElementById("mask").style.visibility = "hidden";');
            }
        }
    }

    document.getElementById("mask").style.visibility = "visible";
    showPath(x, y);
    
    boardSelected = true;
    komadaiSelected = false;
    selectedKoma = board[x][y];
    xClicked = x;
    yClicked = y;
}

function selectEmpty(x, y) {
	if (boardSelected) {
		board[x][y] = selectedKoma;   
		board[xClicked][yClicked] = EMPTY;  
		boardSelected = false;   
        komadaiSelected = false;
        for (var xLocal = 1; xLocal <= 9; xLocal++) {
            for (var yLocal = 1; yLocal <= 9; yLocal++) {
                document.getElementById("s"+xLocal+yLocal).onclick = "";
            }
        }
        
		if (canNari(selectedKoma, x, y) || canNari(selectedKoma, xClicked, yClicked)) {
            // TODO
            // showNariWindow(x, y);
			selectedKoma = EMPTY;
			
            turn = !turn;
            document.getElementById("mask").style.visibility = "hidden";
			showBoard();
		} else {
			selectedKoma = EMPTY;
			
            turn = !turn;
            document.getElementById("mask").style.visibility = "hidden";
            showBoard();
		}
	}
}

function selectEnemy(x, y) {
    tegoma[+turn][board[x][y] & ~ENEMY & ~NARI]++;
    board[x][y] = selectedKoma;
    board[xClicked][yClicked] = EMPTY;
    boardSelected = false;
    komadaiSelected = false;
    for (var xLocal = 1; xLocal <= 9; xLocal++) {
        for (var yLocal = 1; yLocal <= 9; yLocal++) {
            document.getElementById("s"+xLocal+yLocal).onclick = "";
        }
    }

    if (canNari(selectedKoma, x, y) || canNari(selectedKoma, xClicked, yClicked)) {
        // TODO
        // showNariWindow(x, y);
        selectedKoma = EMPTY;
        
        turn = !turn;
        document.getElementById("mask").style.visibility = "hidden";
        showBoard();
    } else {
        selectedKoma = EMPTY;
        
        turn = !turn;
        document.getElementById("mask").style.visibility = "hidden";
        showBoard();
    }
}

window.onload = function() {
    turn = true;

    boardSelected = false;
    komadaiSelected = false;
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