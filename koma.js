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
    constructor(koma) {
        this.init();
        this.isSelf = koma<ENEMY;
        this.img = `url(img/${this.symbol}_${this.isSelf?"pos":"neg"}.png)`;
    }

    /**
     * パラメータ初期化関数
     */
    init(){
        this.symbol = "";
        this.canNari = false;
    }
    
    /**
     * 駒が移動できるマスのジェネレータ
     * @param {Number} x 選択した駒の筋
     * @param {Number} y 選択した駒の段
     * @param {Array} board 現在の盤の可変参照
     */
    pathGen(x, y, board) {
        if(this.isSelf_()){
            return this.__pathGen(x, y, board, (y, a)=>{return y-a});
        }else{
            return this.__pathGen(x, y, board, (y, a)=>{return y+a});
        }
    }

    *__pathGen(x, y, board, advance=(a, b)=>{return a+b}){
        yield false;
    }

    /**
     * 駒を置けるマスのジェネレータ
     * @param {Array} board 現在の盤の可変参照
     */
    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            var nifuFlg = false;
            if (this.value == FU) {
                for (var y = 1; y <= 9; y++) {
                    if (board[x][y] == FU) { nifuFlg = true; break; }
                }
            } else if (this.value == EFU) {
                for (var y = 1; y <= 9; y++) {
                    if (board[x][y] == EFU) { nifuFlg = true; break; }
                }
            }
            if (nifuFlg) { continue; }

            for (var y = 1; y <= 9; y++) {
                if (board[x][y] == EMPTY) {
                    if ((this.value == KE && y <= 2) || ((this.value == KY || this.value == FU) && y == 1)
                        || (this.value == EKE && y >= 8) || ((this.value == EKY || this.value == EFU) && y == 9)) {
                        continue;
                    } else {
                        yield { xTo: x, yTo: y };
                    }
                }
            }
        }
    }

    /**
     * 自分の駒か否かをBooleanで返す関数
     * @param {Number} koma 駒を表す数値
     * @return {Boolean} 引数で与えられた駒が自分の駒の場合はtrue，違う場合はfalseを返す
     */
    isSelf_() {
        return this.isSelf
        return (FU <= koma && koma <= RY);
    }

    /**
     * 敵の駒か否かをBooleanで返す関数
     * @param {Number} koma 駒を表す数値
     * @return {Boolean} 引数で与えられた駒が敵の駒の場合はtrue，違う場合はfalseを返す
     */
    isEnemy_(koma) {
        if (this.isSelf){
            return (EFU <= koma && koma <= ERY);
        }else{
            return (FU <= koma && koma <= RY);
        }
    }


    static is_in_range(x){
        return 1 <= x && x <= 9;
    }

}

class Fu extends Koma{
    init() {
        this.symbol = "FU"
        this.canNari = true;
    }
    
    *__pathGen(x, y, board, advance) {
        yield { xTo: x, yTo: advance(y, 1) };
    }
}

class Ky extends Koma{
    init() {
        this.symbol = "KY"
        this.canNari = true;
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = advance(y, 1); 1 <= yTo && yTo <= 9; y = advance(y, 1)) {
            if (board[x][yTo] == EMPTY) {
                yield { xTo: x, yTo: yTo };
            } else if (this.isEnemy_(board[x][yTo])) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
    }
}

class Ke extends Koma{
    init() {
        this.symbol = "KE"
        this.canNari = true;
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 2)] == EMPTY) {
            yield { xTo: x - 1, yTo: advance(y, 2) };
        } else if (this.isEnemy_(board[x - 1][advance(y, 2)])) {
            yield { xTo: x - 1, yTo: advance(y, 2) };
        }
        if (board[x + 1][advance(y, 2)] == EMPTY) {
            yield { xTo: x + 1, yTo: advance(y, 2) };
        } else if (this.isEnemy_(board[x + 1][advance(y, 2)])) {
            yield { xTo: x + 1, yTo: advance(y, 2) };
        }
    }
}

class Gi extends Koma{
    init() {
        this.symbol = "GI"
        this.canNari = true;
    }
    
    *__pathGen(x, y, board, advance) {
        if (this.isEnemy_(board[x - 1][advance(y, 1)])) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        } else if (board[x - 1][advance(y, 1)] == EMPTY) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        }
        if (this.isEnemy_(board[x][advance(y, 1)])) {
            yield { xTo: x, yTo: advance(y, 1) };
        } else if (board[x][advance(y, 1)] == EMPTY) {
            yield { xTo: x, yTo: advance(y, 1) };
        }
        if (this.isEnemy_(board[x + 1][advance(y, 1)])) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        } else if (board[x + 1][advance(y, 1)] == EMPTY) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        }
        if (this.isEnemy_(board[x - 1][advance(y, -1)])) {
            yield { xTo: x - 1, yTo: advance(y, -1) };
        } else if (board[x - 1][advance(y, -1)] == EMPTY) {
            yield { xTo: x - 1, yTo: advance(y, -1) };
        }
        if (this.isEnemy_(board[x + 1][advance(y, -1)])) {
            yield { xTo: x + 1, yTo: advance(y, -1) };
        } else if (board[x + 1][advance(y, -1)] == EMPTY) {
            yield { xTo: x + 1, yTo: advance(y, -1) };
        }
    }
}

class Ki extends Koma{
    init() {
        this.symbol = "KI"
        this.canNari = false;
    }
    
    *__pathGen(x, y, board, advance) {
        if (this.isEnemy_(board[x - 1][advance(y, 1)])) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        } else if (board[x - 1][advance(y, 1)] == EMPTY) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        }
        if (this.isEnemy_(board[x][advance(y, 1)])) {
            yield { xTo: x, yTo: advance(y, 1) };
        } else if (board[x][advance(y, 1)] == EMPTY) {
            yield { xTo: x, yTo: advance(y, 1) };
        }
        if (this.isEnemy_(board[x][advance(y, -1)])) {
            yield { xTo: x, yTo: advance(y, -1) };
        } else if (board[x][advance(y, -1)] == EMPTY) {
            yield { xTo: x, yTo: advance(y, -1) };
        }
        if (this.isEnemy_(board[x + 1][advance(y, 1)])) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        } else if (board[x + 1][advance(y, 1)] == EMPTY) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        }
        if (this.isEnemy_(board[x - 1][y])) {
            yield { xTo: x - 1, yTo: y };
        } else if (board[x - 1][y] == EMPTY) {
            yield { xTo: x - 1, yTo: y };
        }
        if (this.isEnemy_(board[x + 1][y])) {
            yield { xTo: x + 1, yTo: y };
        } else if (board[x + 1][y] == EMPTY) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class Ka extends Koma{
    init() {
        this.symbol = "KA"
        this.canNari = true;
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
    }
}

class Hi extends Koma{
    init() {
        this.symbol = "HI"
        this.canNari = true;
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo] == EMPTY) {
                yield { xTo: x, yTo: yTo };
            } else if (this.isEnemy_(board[x][yTo])) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo] == EMPTY) {
                yield { xTo: x, yTo: yTo };
            } else if (this.isEnemy_(board[x][yTo])) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y] == EMPTY) {
                yield { xTo: xTo, yTo: y };
            } else if (this.isEnemy_(board[xTo][y])) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y] == EMPTY) {
                yield { xTo: xTo, yTo: y };
            } else if (this.isEnemy_(board[xTo][y])) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
    }
}

class Ou extends Koma{
    init() {
        this.symbol = "OU"
        this.canNari = false;
    }
    
    *__pathGen(x, y, board, advance) {
        if (this.isEnemy_(board[x - 1][y + 1])) {
            yield { xTo: x - 1, yTo: y + 1 };
        } else if (board[x - 1][y + 1] == EMPTY) {
            yield { xTo: x - 1, yTo: y + 1 };
        }
        if (this.isEnemy_(board[x + 1][y + 1])) {
            yield { xTo: x + 1, yTo: y + 1 };
        } else if (board[x + 1][y + 1] == EMPTY) {
            yield { xTo: x + 1, yTo: y + 1 };
        }
        if (this.isEnemy_(board[x - 1][y - 1])) {
            yield { xTo: x - 1, yTo: y - 1 };
        } else if (board[x - 1][y - 1] == EMPTY) {
            yield { xTo: x - 1, yTo: y - 1 };
        }
        if (this.isEnemy_(board[x][y - 1])) {
            yield { xTo: x, yTo: y - 1 };
        } else if (board[x][y - 1] == EMPTY) {
            yield { xTo: x, yTo: y - 1 };
        }
        if (this.isEnemy_(board[x][y + 1])) {
            yield { xTo: x, yTo: y + 1 };
        } else if (board[x][y + 1] == EMPTY) {
            yield { xTo: x, yTo: y + 1 };
        }
        if (this.isEnemy_(board[x + 1][y - 1])) {
            yield { xTo: x + 1, yTo: y - 1 };
        } else if (board[x + 1][y - 1] == EMPTY) {
            yield { xTo: x + 1, yTo: y - 1 };
        }
        if (this.isEnemy_(board[x - 1][y])) {
            yield { xTo: x - 1, yTo: y };
        } else if (board[x - 1][y] == EMPTY) {
            yield { xTo: x - 1, yTo: y };
        }
        if (this.isEnemy_(board[x + 1][y])) {
            yield { xTo: x + 1, yTo: y };
        } else if (board[x + 1][y] == EMPTY) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class To extends Ki{
    init() {
        this.symbol = "TO"
        this.canNari = false;
    }
}

class Ny extends Ki{
    init() {
        this.symbol = "NY"
        this.canNari = false;
    }
}

class Nk extends Ki{
    init() {
        this.symbol = "NK"
        this.canNari = false;
    }
}

class Ng extends Ki{
    init() {
        this.symbol = "NG"
        this.canNari = false;
    }
}

class Um extends Koma{
    init() {
        this.symbol = "UM"
        this.canNari = false;
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo] == EMPTY) {
                yield { xTo: xTo, yTo: yTo };
            } else if (this.isEnemy_(board[xTo][yTo])) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        if (this.isEnemy_(board[x][y - 1])) {
            yield { xTo: x, yTo: y - 1 };
        } else if (board[x][y - 1] == EMPTY) {
            yield { xTo: x, yTo: y - 1 };
        }
        if (this.isEnemy_(board[x][y + 1])) {
            yield { xTo: x, yTo: y + 1 };
        } else if (board[x][y + 1] == EMPTY) {
            yield { xTo: x, yTo: y + 1 };
        }
        if (this.isEnemy_(board[x - 1][y])) {
            yield { xTo: x - 1, yTo: y };
        } else if (board[x - 1][y] == EMPTY) {
            yield { xTo: x - 1, yTo: y };
        }
        if (this.isEnemy_(board[x + 1][y])) {
            yield { xTo: x + 1, yTo: y };
        } else if (board[x + 1][y] == EMPTY) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class Ry extends Koma{
    init() {
        this.symbol = "RY"
        this.canNari = false;
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo] == EMPTY) {
                yield { xTo: x, yTo: yTo };
            } else if (this.isEnemy_(board[x][yTo])) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo] == EMPTY) {
                yield { xTo: x, yTo: yTo };
            } else if (this.isEnemy_(board[x][yTo])) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y] == EMPTY) {
                yield { xTo: xTo, yTo: y };
            } else if (this.isEnemy_(board[xTo][y])) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y] == EMPTY) {
                yield { xTo: xTo, yTo: y };
            } else if (this.isEnemy_(board[xTo][y])) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        if (this.isEnemy_(board[x - 1][y - 1])) {
            yield { xTo: x - 1, yTo: y - 1 };
        } else if (board[x - 1][y - 1] == EMPTY) {
            yield { xTo: x - 1, yTo: y - 1 };
        }
        if (this.isEnemy_(board[x + 1][y - 1])) {
            yield { xTo: x + 1, yTo: y - 1 };
        } else if (board[x + 1][y - 1] == EMPTY) {
            yield { xTo: x + 1, yTo: y - 1 };
        }
        if (this.isEnemy_(board[x - 1][y + 1])) {
            yield { xTo: x - 1, yTo: y + 1 };
        } else if (board[x - 1][y + 1] == EMPTY) {
            yield { xTo: x - 1, yTo: y + 1 };
        }
        if (this.isEnemy_(board[x + 1][y + 1])) {
            yield { xTo: x + 1, yTo: y + 1 };
        } else if (board[x + 1][y + 1] == EMPTY) {
            yield { xTo: x + 1, yTo: y + 1 };
        }
    }
}

class Empty extends Koma {
    constructor(koma) {
        super()
        this.img = "";
    }
}

class Wall extends Koma {
    constructor(koma) {
        super()
        this.img = "";
    }    
}