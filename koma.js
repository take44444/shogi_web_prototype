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
 * 駒のクラス
 * @param {number} koma 駒を表す数値
 * @constructor
 */
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
        this.value = koma;
        this.isKoma = Koma.isSelf_(koma) || Koma.isEnemy_(koma);
        this.img = Koma.komaImg_[koma];
        this.isSelf = Koma.isSelf_(koma);
        this.isEnemy = Koma.isEnemy_(koma);
        var n = koma & ~ENEMY;
        this.canNari = FU <= n && n <= HI && n != KI && n != OU;
    }

    *pathGen(x, y, board) {
        if (this.value == FU) {
            if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            } else if (Koma.isEnemy_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false };
            }
        } else if (this.value == EFU) {
            if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            } else if (Koma.isSelf_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            }
        } else if (this.value == KY) {
            for (var yTo = y - 1; yTo >= 1; yTo--) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (nemy_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
        } else if (this.value == EKY) {
            for (var yTo = y + 1; yTo <= 9; yTo++) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
        } else if (this.value == KE) {
            if (board[x - 1][y - 2] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 2, isEmpty: true };
            } else if (Koma.isEnemy_(board[x - 1][y - 2])) {
                yield { xTo: x - 1, yTo: y - 2, isEmpty: false };
            }
            if (board[x + 1][y - 2] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 2, isEmpty: true };
            } else if (Koma.isEnemy_(board[x + 1][y - 2])) {
                yield { xTo: x + 1, yTo: y - 2, isEmpty: false };
            }
        } else if (this.value == EKE) {
            if (board[x - 1][y + 2] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 2, isEmpty: true };
            } else if (Koma.isSelf_(board[x - 1][y + 2])) {
                yield { xTo: x - 1, yTo: y + 2, isEmpty: false };
            }
            if (board[x + 1][y + 2] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 2, isEmpty: true };
            } else if (Koma.isSelf_(board[x + 1][y + 2])) {
                yield { xTo: x + 1, yTo: y + 2, isEmpty: false };
            }
        } else if (this.value == GI) {
            if (Koma.isEnemy_(board[x - 1][y - 1])) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: false };
            } else if (board[x - 1][y - 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false };
            } else if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y - 1])) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: false };
            } else if (board[x + 1][y - 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x - 1][y + 1])) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: false };
            } else if (board[x - 1][y + 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y + 1])) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: false };
            } else if (board[x + 1][y + 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: true };
            }
        } else if (this.value == EGI) {
            if (Koma.isSelf_(board[x - 1][y - 1])) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: false };
            } else if (board[x - 1][y - 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            } else if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y - 1])) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: false };
            } else if (board[x + 1][y - 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x - 1][y + 1])) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: false };
            } else if (board[x - 1][y + 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y + 1])) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: false };
            } else if (board[x + 1][y + 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: true };
            }
        } else if (this.value == KI || (this.value >= TO && this.value <= NG)) {
            if (Koma.isEnemy_(board[x - 1][y - 1])) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: false };
            } else if (board[x - 1][y - 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false };
            } else if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            } else if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y - 1])) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: false };
            } else if (board[x + 1][y - 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x - 1][y])) {
                yield { xTo: x - 1, yTo: y, isEmpty: false };
            } else if (board[x - 1][y] == EMPTY) {
                yield { xTo: x - 1, yTo: y, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y])) {
                yield { xTo: x + 1, yTo: y, isEmpty: false };
            } else if (board[x + 1][y] == EMPTY) {
                yield { xTo: x + 1, yTo: y, isEmpty: true };
            }
        } else if (this.value == EKI || (this.value >= ETO && this.value <= ENG)) {
            if (Koma.isSelf_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            } else if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false };
            } else if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x - 1][y + 1])) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: false };
            } else if (board[x - 1][y + 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y + 1])) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: false };
            } else if (board[x + 1][y + 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x - 1][y])) {
                yield { xTo: x - 1, yTo: y, isEmpty: false };
            } else if (board[x - 1][y] == EMPTY) {
                yield { xTo: x - 1, yTo: y, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y])) {
                yield { xTo: x + 1, yTo: y, isEmpty: false };
            } else if (board[x + 1][y] == EMPTY) {
                yield { xTo: x + 1, yTo: y, isEmpty: true };
            }
        } else if (this.value == OU) {
            if (Koma.isEnemy_(board[x - 1][y + 1])) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: false };
            } else if (board[x - 1][y + 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y + 1])) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: false };
            } else if (board[x + 1][y + 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x - 1][y - 1])) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: false };
            } else if (board[x - 1][y - 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false }; s
            } else if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            } else if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y - 1])) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: false };
            } else if (board[x + 1][y - 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x - 1][y])) {
                yield { xTo: x - 1, yTo: y, isEmpty: false };
            } else if (board[x - 1][y] == EMPTY) {
                yield { xTo: x - 1, yTo: y, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y])) {
                yield { xTo: x + 1, yTo: y, isEmpty: false };
            } else if (board[x + 1][y] == EMPTY) {
                yield { xTo: x + 1, yTo: y, isEmpty: true };
            }
        } else if (this.value == EOU) {
            if (Koma.isSelf_(board[x - 1][y + 1])) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: false };
            } else if (board[x - 1][y + 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y + 1])) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: false };
            } else if (board[x + 1][y + 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x - 1][y - 1])) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: false };
            } else if (board[x - 1][y - 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false }; s
            } else if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            } else if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y - 1])) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: false };
            } else if (board[x + 1][y - 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x - 1][y])) {
                yield { xTo: x - 1, yTo: y, isEmpty: false };
            } else if (board[x - 1][y] == EMPTY) {
                yield { xTo: x - 1, yTo: y, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y])) {
                yield { xTo: x + 1, yTo: y, isEmpty: false };
            } else if (board[x + 1][y] == EMPTY) {
                yield { xTo: x + 1, yTo: y, isEmpty: true };
            }
        } else if (this.value == HI) {
            for (var yTo = y - 1; yTo >= 1; yTo--) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var yTo = y + 1; yTo <= 9; yTo++) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1; xTo >= 1; xTo--) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1; xTo <= 9; xTo++) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
        } else if (this.value == EHI) {
            for (var yTo = y - 1; yTo >= 1; yTo--) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var yTo = y + 1; yTo <= 9; yTo++) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1; xTo >= 1; xTo--) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1; xTo <= 9; xTo++) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
        } else if (this.value == KA) {
            for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
        } else if (this.value == EKA) {
            for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
        } else if (this.value == RY) {
            for (var yTo = y - 1; yTo >= 1; yTo--) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var yTo = y + 1; yTo <= 9; yTo++) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1; xTo >= 1; xTo--) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1; xTo <= 9; xTo++) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            if (Koma.isEnemy_(board[x - 1][y - 1])) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: false };
            } else if (board[x - 1][y - 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y - 1])) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: false };
            } else if (board[x + 1][y - 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x - 1][y + 1])) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: false };
            } else if (board[x - 1][y + 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y + 1])) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: false }
            } else if (board[x + 1][y + 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: true };
            }
        } else if (this.value == ERY) {
            for (var yTo = y - 1; yTo >= 1; yTo--) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var yTo = y + 1; yTo <= 9; yTo++) {
                if (board[x][yTo] == EMPTY) {
                    yield { xTo: x, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[x][yTo])) {
                    yield { xTo: x, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1; xTo >= 1; xTo--) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1; xTo <= 9; xTo++) {
                if (board[xTo][y] == EMPTY) {
                    yield { xTo: xTo, yTo: y, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][y])) {
                    yield { xTo: xTo, yTo: y, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            if (Koma.isSelf_(board[x - 1][y - 1])) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: false };
            } else if (board[x - 1][y - 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y - 1])) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: false };
            } else if (board[x + 1][y - 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x - 1][y + 1])) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: false };
            } else if (board[x - 1][y + 1] == EMPTY) {
                yield { xTo: x - 1, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y + 1])) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: false }
            } else if (board[x + 1][y + 1] == EMPTY) {
                yield { xTo: x + 1, yTo: y + 1, isEmpty: true };
            }
        } else if (this.value == UM) {
            for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isEnemy_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            if (Koma.isEnemy_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false };
            } else if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            } else if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x - 1][y])) {
                yield { xTo: x - 1, yTo: y, isEmpty: false };
            } else if (board[x - 1][y] == EMPTY) {
                yield { xTo: x - 1, yTo: y, isEmpty: true };
            }
            if (Koma.isEnemy_(board[x + 1][y])) {
                yield { xTo: x + 1, yTo: y, isEmpty: false };
            } else if (board[x + 1][y] == EMPTY) {
                yield { xTo: x + 1, yTo: y, isEmpty: true };
            }
        } else if (this.value == EUM) {
            for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
                if (board[xTo][yTo] == EMPTY) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: true };
                } else if (Koma.isSelf_(board[xTo][yTo])) {
                    yield { xTo: xTo, yTo: yTo, isEmpty: false };
                    break;
                } else {
                    break;
                }
            }
            if (Koma.isSelf_(board[x][y - 1])) {
                yield { xTo: x, yTo: y - 1, isEmpty: false };
            } else if (board[x][y - 1] == EMPTY) {
                yield { xTo: x, yTo: y - 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x][y + 1])) {
                yield { xTo: x, yTo: y + 1, isEmpty: false };
            } else if (board[x][y + 1] == EMPTY) {
                yield { xTo: x, yTo: y + 1, isEmpty: true };
            }
            if (Koma.isSelf_(board[x - 1][y])) {
                yield { xTo: x - 1, yTo: y, isEmpty: false };
            } else if (board[x - 1][y] == EMPTY) {
                yield { xTo: x - 1, yTo: y, isEmpty: true };
            }
            if (Koma.isSelf_(board[x + 1][y])) {
                yield { xTo: x + 1, yTo: y, isEmpty: false };
            } else if (board[x + 1][y] == EMPTY) {
                yield { xTo: x + 1, yTo: y, isEmpty: true };
            }
        }
    }

    /**
     * 自分の駒か否かをBooleanで返す関数
     * @param {Number} koma 駒を表す数値
     * @return {Boolean} 引数で与えられた駒が自分の駒の場合はtrue，違う場合はfalseを返す
     */
    static isSelf_(koma) {
        return (FU <= koma && koma <= RY);
    }

    /**
     * 敵の駒か否かをBooleanで返す関数
     * @param {Number} koma 駒を表す数値
     * @return {Boolean} 引数で与えられた駒が敵の駒の場合はtrue，違う場合はfalseを返す
     */
    static isEnemy_(koma) {
        return (EFU <= koma && koma <= ERY);
    }
}