// coding rule: https://cou929.nu/data/google_javascript_style_guide/

let komaSet = [];

class Koma {
    static komaImg_ = [
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
    constructor(koma) {
        this.isKoma = (FU <= koma && koma <= RY) || (EFU <= koma && koma <= ERY);
        this.img = Koma.komaImg_[koma];
        this.isSelf = FU <= koma && koma <= RY;
        this.isEnemy = EFU <= koma && koma <= ERY;
        var n = koma & ~ENEMY;
        this.canNari = FU <= n && n <= HI && n != KI && n != OU;
        
        if (koma == FU) {
            this.pathGen = function* (x, y, board) {
                if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                } else if (komaIsEnemy(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };
                }
            };
        } else if (koma == EFU) {
            this.pathGen = function* (x, y, board) {
                if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                } else if (komaIsSelf(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                }
            };
        } else if (koma == KY) {
            this.pathGen = function* (x, y, board) {
                for (var yTo = y-1; yTo >= 1; yTo--) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
            };
        } else if (koma == EKY) {
            this.pathGen = function* (x, y, board) {
                for (var yTo = y+1; yTo <= 9; yTo++) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
            };
        } else if (koma == KE) {
            this.pathGen = function* (x, y, board) {
                if (board[x-1][y-2] == EMPTY) {
                    yield { xTo: x-1, yTo: y-2, isEmpty: true };
                } else if (komaIsEnemy(board[x-1][y-2])) {
                    yield { xTo: x-1, yTo: y-2, isEmpty: false };
                } 
                if (board[x+1][y-2] == EMPTY) {
                    yield { xTo: x+1, yTo: y-2, isEmpty: true };
                } else if (komaIsEnemy(board[x+1][y-2])) {
                    yield { xTo: x+1, yTo: y-2, isEmpty: false };
                }
            };
        } else if (koma == EKE) {
            this.pathGen = function* (x, y, board) {
                if (board[x-1][y+2] == EMPTY) {
                    yield { xTo: x-1, yTo: y+2, isEmpty: true };
                } else if (komaIsSelf(board[x-1][y+2])) {
                    yield { xTo: x-1, yTo: y+2, isEmpty: false };
                } 
                if (board[x+1][y+2] == EMPTY) {
                    yield { xTo: x+1, yTo: y+2, isEmpty: true };
                } else if (komaIsSelf(board[x+1][y+2])) {
                    yield { xTo: x+1, yTo: y+2, isEmpty: false };
                }
            };
        } else if (koma == GI) {
            this.pathGen = function* (x, y, board) {
                if (komaIsEnemy(board[x-1][y-1])) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: false };
                } else if (board[x-1][y-1] == EMPTY) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };
                } else if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y-1])) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: false };
                } else if (board[x+1][y-1] == EMPTY) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x-1][y+1])) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: false };
                } else if (board[x-1][y+1] == EMPTY) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y+1])) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: false };
                } else if (board[x+1][y+1] == EMPTY) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: true };
                }
            };
        } else if (koma == EGI) {
            this.pathGen = function* (x, y, board) {
                if (komaIsSelf(board[x-1][y-1])) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: false };
                } else if (board[x-1][y-1] == EMPTY) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: true};
                }
                if (komaIsSelf(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                } else if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y-1])) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: false };
                } else if (board[x+1][y-1] == EMPTY) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x-1][y+1])) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: false };
                } else if (board[x-1][y+1] == EMPTY) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y+1])) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: false };
                } else if (board[x+1][y+1] == EMPTY) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: true };
                }
            };
        } else if (koma == KI || (koma >= TO && koma <= NG)) {
            this.pathGen = function* (x, y, board) {
                if (komaIsEnemy(board[x-1][y-1])) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: false };
                } else if (board[x-1][y-1] == EMPTY) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };
                } else if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                } else if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y-1])) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: false };
                } else if (board[x+1][y-1] == EMPTY) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x-1][y])) {
                    yield { xTo: x-1, yTo: y, isEmpty: false };
                } else if (board[x-1][y] == EMPTY) {
                    yield { xTo: x-1, yTo: y, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y])) {
                    yield { xTo: x+1, yTo: y, isEmpty: false };
                } else if (board[x+1][y] == EMPTY) {
                    yield { xTo: x+1, yTo: y, isEmpty: true };
                }
            };
        } else if (koma == EKI || (koma >= ETO && koma <= ENG)) {
            this.pathGen = function* (x, y, board) {
                if (komaIsSelf(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                } else if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };
                } else if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x-1][y+1])) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: false };
                } else if (board[x-1][y+1] == EMPTY) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y+1])) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: false };
                } else if (board[x+1][y+1] == EMPTY) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x-1][y])) {
                    yield { xTo: x-1, yTo: y, isEmpty: false };
                } else if (board[x-1][y] == EMPTY) {
                    yield { xTo: x-1, yTo: y, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y])) {
                    yield { xTo: x+1, yTo: y, isEmpty: false };
                } else if (board[x+1][y] == EMPTY) {
                    yield { xTo: x+1, yTo: y, isEmpty: true };
                }
            };
        } else if (koma == OU) {
            this.pathGen = function* (x, y, board) {
                if (komaIsEnemy(board[x-1][y+1])) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: false };
                } else if (board[x-1][y+1] == EMPTY) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y+1])) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: false };
                } else if (board[x+1][y+1] == EMPTY) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: true };
                }
                if (komaIsEnemy(board[x-1][y-1])) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: false };
                } else if (board[x-1][y-1] == EMPTY) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };s
                } else if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                } else if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y-1])) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: false };
                } else if (board[x+1][y-1] == EMPTY) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x-1][y])) {
                    yield { xTo: x-1, yTo: y, isEmpty: false };
                } else if (board[x-1][y] == EMPTY) {
                    yield { xTo: x-1, yTo: y, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y])) {
                    yield { xTo: x+1, yTo: y, isEmpty: false };
                } else if (board[x+1][y] == EMPTY) {
                    yield { xTo: x+1, yTo: y, isEmpty: true };
                }
            };
        } else if (koma == EOU) {
            this.pathGen = function* (x, y, board) {
                if (komaIsSelf(board[x-1][y+1])) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: false };
                } else if (board[x-1][y+1] == EMPTY) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y+1])) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: false };
                } else if (board[x+1][y+1] == EMPTY) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x-1][y-1])) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: false };
                } else if (board[x-1][y-1] == EMPTY) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };s
                } else if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                } else if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y-1])) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: false };
                } else if (board[x+1][y-1] == EMPTY) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x-1][y])) {
                    yield { xTo: x-1, yTo: y, isEmpty: false };
                } else if (board[x-1][y] == EMPTY) {
                    yield { xTo: x-1, yTo: y, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y])) {
                    yield { xTo: x+1, yTo: y, isEmpty: false };
                } else if (board[x+1][y] == EMPTY) {
                    yield { xTo: x+1, yTo: y, isEmpty: true };
                }
            };
        } else if (koma == HI) {
            this.pathGen = function* (x, y, board) {
                for (var yTo = y-1; yTo >= 1; yTo--) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var yTo = y+1; yTo <= 9; yTo++) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1; xTo >= 1; xTo--) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1; xTo <= 9; xTo++) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
            };
        } else if (koma == EHI) {
            this.pathGen = function* (x, y, board) {
                for (var yTo = y-1; yTo >= 1; yTo--) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var yTo = y+1; yTo <= 9; yTo++) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1; xTo >= 1; xTo--) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1; xTo <= 9; xTo++) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
            };
        } else if (koma == KA) {
            this.pathGen = function* (x, y, board) {
                for (var xTo = x-1, yTo = y-1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y-1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1, yTo = y+1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y+1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
            };
        } else if (koma == EKA) {
            this.pathGen = function* (x, y, board) {
                for (var xTo = x-1, yTo = y-1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y-1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1, yTo = y+1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y+1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
            };
        } else if (koma == RY) {
                this.pathGen = function* (x, y, board) {
                for (var yTo = y-1; yTo >= 1; yTo--) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var yTo = y+1; yTo <= 9; yTo++) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1; xTo >= 1; xTo--) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1; xTo <= 9; xTo++) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                if (komaIsEnemy(board[x-1][y-1])) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: false };
                } else if (board[x-1][y-1] == EMPTY) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y-1])) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: false };
                } else if (board[x+1][y-1] == EMPTY) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x-1][y+1])) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: false };
                } else if (board[x-1][y+1] == EMPTY) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y+1])) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: false }
                } else if (board[x+1][y+1] == EMPTY) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: true };
                }
            };
        } else if (koma == ERY) {
            this.pathGen = function* (x, y, board) {
                for (var yTo = y-1; yTo >= 1; yTo--) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var yTo = y+1; yTo <= 9; yTo++) {
                    if (board[x][yTo] == EMPTY) {
                        yield { xTo: x, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[x][yTo])) {
                        yield { xTo: x, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1; xTo >= 1; xTo--) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1; xTo <= 9; xTo++) {
                    if (board[xTo][y] == EMPTY) {
                        yield { xTo: xTo, yTo: y, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][y])) {
                        yield { xTo: xTo, yTo: y, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                if (komaIsSelf(board[x-1][y-1])) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: false };
                } else if (board[x-1][y-1] == EMPTY) {
                    yield { xTo: x-1, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y-1])) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: false };
                } else if (board[x+1][y-1] == EMPTY) {
                    yield { xTo: x+1, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x-1][y+1])) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: false };
                } else if (board[x-1][y+1] == EMPTY) {
                    yield { xTo: x-1, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y+1])) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: false }
                } else if (board[x+1][y+1] == EMPTY) {
                    yield { xTo: x+1, yTo: y+1, isEmpty: true };
                }
            };
        } else if (koma == UM) {
            this.pathGen = function* (x, y, board) {
                for (var xTo = x-1, yTo = y-1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y-1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1, yTo = y+1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y+1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsEnemy(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                if (komaIsEnemy(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };
                } else if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                }
                if (komaIsEnemy(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                } else if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                }
                if (komaIsEnemy(board[x-1][y])) {
                    yield { xTo: x-1, yTo: y, isEmpty: false };
                } else if (board[x-1][y] == EMPTY) {
                    yield { xTo: x-1, yTo: y, isEmpty: true };
                }
                if (komaIsEnemy(board[x+1][y])) {
                    yield { xTo: x+1, yTo: y, isEmpty: false };
                } else if (board[x+1][y] == EMPTY) {
                    yield { xTo: x+1, yTo: y, isEmpty: true };
                }
            };
        } else if (koma == EUM) {
            this.pathGen = function* (x, y, board) {
                for (var xTo = x-1, yTo = y-1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y-1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x-1, yTo = y+1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                for (var xTo = x+1, yTo = y+1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                    if (board[xTo][yTo] == EMPTY) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: true };
                    } else if (komaIsSelf(board[xTo][yTo])) {
                        yield { xTo: xTo, yTo: yTo, isEmpty: false };
                        break;
                    } else {
                        break;
                    }
                }
                if (komaIsSelf(board[x][y-1])) {
                    yield { xTo: x, yTo: y-1, isEmpty: false };
                } else if (board[x][y-1] == EMPTY) {
                    yield { xTo: x, yTo: y-1, isEmpty: true };
                }
                if (komaIsSelf(board[x][y+1])) {
                    yield { xTo: x, yTo: y+1, isEmpty: false };
                } else if (board[x][y+1] == EMPTY) {
                    yield { xTo: x, yTo: y+1, isEmpty: true };
                }
                if (komaIsSelf(board[x-1][y])) {
                    yield { xTo: x-1, yTo: y, isEmpty: false };
                } else if (board[x-1][y] == EMPTY) {
                    yield { xTo: x-1, yTo: y, isEmpty: true };
                }
                if (komaIsSelf(board[x+1][y])) {
                    yield { xTo: x+1, yTo: y, isEmpty: false };
                } else if (board[x+1][y] == EMPTY) {
                    yield { xTo: x+1, yTo: y, isEmpty: true };
                }
            };
        }
    }
}

let xClicked, yClicked;

let selectedKoma;
let turn;
let state;

const SELECTING = 0;
const BOARD_SELECTED = 1;
const KOMADAI_SELECTED = 2;
const SELECTED = 2;
const NARI_SELECTING = 3;

const SELF_TURN = 1;
const ENEMY_TURN = 0;

var board = [];
var tegoma = [];

const OUT_OF_BOARD = 128;
const EMPTY = 0;

const FU = 1;
const KY = 2;
const KE = 3;
const GI = 4;
const KI = 5;
const KA = 6;
const HI = 7;
const OU = 8;
const NARI = 8;
const TO = NARI + FU;
const NY = NARI + KY;
const NK = NARI + KE;
const NG = NARI + GI;
const UM = NARI + KA;
const RY = NARI + HI;
const ENEMY = 16;
const EFU = ENEMY + FU;
const EKY = ENEMY + KY;
const EKE = ENEMY + KE;
const EGI = ENEMY + GI;
const EKI = ENEMY + KI;
const EKA = ENEMY + KA;
const EHI = ENEMY + HI;
const EOU = ENEMY + OU;
const ETO = ENEMY + TO;
const ENY = ENEMY + NY;
const ENK = ENEMY + NK;
const ENG = ENEMY + NG;
const EUM = ENEMY + UM;
const ERY = ENEMY + RY;

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
    turn = !turn;
    hideMask();
}

/**
 * 手番の駒を動かすことができる盤を表示する関数
 */
function showBoard() {
    for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
            var square = document.getElementById("s"+x+y);
            square.style.backgroundImage = komaSet[board[x][y]].img;

            if (board[x][y] != EMPTY) {
                (function() {
                    var xLocal = x, yLocal = y;
                    square.onclick = function() {
                        if (turn == komaSet[board[xLocal][yLocal]].isSelf && state == SELECTING) {
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
            if (i == SELF_TURN && komaSet[j].isKoma) {
                square = document.getElementById("S"+j);
                square.dataset.num = tegoma[SELF_TURN][j];
            } else if (komaSet[j].isKoma) {
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
    for (var path of komaSet[board[x][y]].pathGen(x, y, board)) {
        var msquare = document.getElementById("ms"+path.xTo+path.yTo);
        msquare.style.opacity = "0.0";
        // msquare.style.backgroundImage = "";
        if (path.isEmpty) {
            msquare.onclick = new Function("selectEmpty("+path.xTo+","+path.yTo+")");
        } else {
            msquare.onclick = new Function("selectEnemy("+path.xTo+","+path.yTo+")");
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
                // msquare.style.backgroundImage = komaSet[board[x][y]].img;
                msquare.style.opacity = "0.0";
                msquare.onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
            } else {
                var msquare = document.getElementById("ms"+xLocal+yLocal);
                // msquare.style.backgroundImage = "";
                msquare.style.opacity = "0.2";
                msquare.onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
            }
        }
    }

    for (var i = 0; i <= HI; i++) {
        if (komaSet[i].isKoma) {
            document.getElementById("mS"+i).onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
            document.getElementById("mE"+i).onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
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
        if (komaSet[iLocal].isKoma) {
            document.getElementById("mS"+iLocal).onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
            document.getElementById("mE"+iLocal).onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
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
                msquare.onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
            } else {
                if (i == SELF_TURN) {
                    if ((j == KE && y <= 2) || (j == KY && y == 1)) {
                        msquare.style.opacity = "0.2";
                        msquare.onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
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
                            msquare.onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
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
                        msquare.onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
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
                            msquare.onclick = new Function('if (state <= SELECTED) { state = SELECTING; hideMask(); }');
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
        
		if (canNari(komaSet[selectedKoma], x, y) || canNari(komaSet[selectedKoma], xClicked, yClicked)) {
            if (((selectedKoma == KE && y <= 2) || ((selectedKoma == KY || selectedKoma == FU) && y == 1))
            || ((selectedKoma == EKE && y >= 8) || ((selectedKoma == EKY || selectedKoma == EFU) && y == 9))) {
                board[x][y] += NARI;
                rotateTurn();
                showBoard();
            } else {
                showNariWindow(x, y);
            }
		} else {
			selectedKoma = EMPTY;
			
            rotateTurn();
            showBoard();
		}
	} else if (state == KOMADAI_SELECTED) {
        tegoma[+turn][selectedKoma & ~ENEMY]--;
		board[x][y] = selectedKoma;

        selectedKoma = EMPTY;

        rotateTurn();
        showBoard();
    }
}

/**
 * 動かしたい駒を選択した後に，取ることが可能な駒を選択した時に必要な処理を行う関数
 * @param {Number} x 選択した，取ることが可能な駒のマスの筋
 * @param {Number} y 選択した，取ることが可能な駒のマスの段
 */
function selectEnemy(x, y) {
    if (state == BOARD_SELECTED) {
        tegoma[+turn][board[x][y] & ~ENEMY & ~NARI]++;
        board[x][y] = selectedKoma;
        board[xClicked][yClicked] = EMPTY;

        if (canNari(komaSet[selectedKoma], x, y) || canNari(komaSet[selectedKoma], xClicked, yClicked)) {
            if (((selectedKoma == KE && y <= 2) || ((selectedKoma == KY || selectedKoma == FU) && y == 1))
            || ((selectedKoma == EKE && y >= 8) || ((selectedKoma == EKY || selectedKoma == EFU) && y == 9))) {
               board[x][y] += NARI;
               rotateTurn();
               showBoard();
           } else {
               showNariWindow(x, y);
           }
        } else {
            selectedKoma = EMPTY;

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
    state = NARI_SELECTING;
    var nariWindow = document.getElementById("nari_window");
    nariWindow.style.left = ""+(196+52*(9-x)-26)+"px";
    nariWindow.style.top = ""+(21+59*(y-1))+"px";
    var nari = document.getElementById("NARI");
    nari.style.backgroundImage = komaSet[selectedKoma + NARI].img;
    nari.onclick = new Function("board["+x+"]["+y+"] += NARI; document.getElementById('nari_window').style.visibility = 'hidden'; selectedKoma = EMPTY; rotateTurn(); showBoard();");
    var narazu = document.getElementById("NARAZU");
    narazu.style.backgroundImage = komaSet[selectedKoma].img;
    narazu.onclick = new Function("document.getElementById('nari_window').style.visibility = 'hidden'; selectedKoma = EMPTY; rotateTurn(); showBoard();");
    nariWindow.style.visibility = "visible";
}

/**
 * DOMが構築された後に発生するイベントのハンドラ
 */
window.onload = function() {
    turn = true;

    state = SELECTING;

    for (var i = 0; i <= 32; i++) {
        komaSet[i] = new Koma(i);
    }

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