/* eslint-disable */
/**
 * 駒のクラス
 * @param {number} koma 駒を表す数値
 * @constructor
 */
class Koma {
    constructor(isSente) {
        this.isSente = isSente;
        this.isNari_ = false;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = false;
        this.init();
        if (!this.isSente) {
            this.sfen_ = this.sfen_.toLowerCase();
        }
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    /**
     * パラメータ初期化メソッド
     */
    init() {
        this.symbol_ = "";
        this.sfen_ = "";
    }

    get symbol() {
        return this.symbol_;
    }

    get sfen() {
        return this.sfen_;
    }

    get isNari() {
        return this.isNari_;
    }

    get canNari() {
        return this.canNari_;
    }

    get isWall() {
        return this.isWall_;
    }

    get isEmpty() {
        return this.isEmpty_;
    }

    get isKoma() {
        return this.isKoma_;
    }

    get img() {
        return this.img_;
    }

    isEnemy(cmp, board) {
        return this.isSente != board[cmp.x][cmp.y].isSente && !board[cmp.x][cmp.y].isWall;
    }

    /**
     * 駒が移動できるマスのジェネレータ
     * @param {Number} x 選択した駒の筋
     * @param {Number} y 選択した駒の段
     * @param {Array} board 現在の盤の可変参照
     */
    pathGen(x, y, board) {
        if (this.isSente) {
            return this.__pathGen(x, y, board, (y, a)=>{return y-a});
        } else {
            return this.__pathGen(x, y, board, (y, a)=>{return y+a});
        }
    }

    *__pathGen(x, y, board, advance) {
    }

    /**
     * 駒を置けるマスのジェネレータ
     * @param {Array} board 現在の盤の可変参照
     */
    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            for (var y = 1; y <= 9; y++) {
                if (this.canDrop(board, point(x, y))) {
                    yield point(x, y);
                }
            }
        }
    }

    canDrop(board, p){
        return board[p.x][p.y].isEmpty_;
    }
}

class Fu extends Koma {
    init() {
        this.symbol_ = "FU";
        this.sfen_ = "P";
        this.canNari_ = true;
        this.isKoma_ = true;
    }

    createNari() {
        return new To(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x][advance(y, 1)].isEmpty_
        || this.isEnemy(point(x, advance(y, 1)), board)) {
            yield point(x, advance(y, 1));
        }
    }

    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            if (board[x].some(e=>{return e.symbol == "FU" && e.isSente == this.isSente;})) {
                continue;
            }

            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    if (this.isSente && y == 1 || !this.isSente && y == 9) {
                        continue;
                    } else {
                        yield point(x, y);
                    }
                }
            }
        }
    }

    canDrop(board, p){
        return super.canDrop(board, p) &&
            !board[p.x].some(
                e=>{return e instanceof Fu && e.isSente == this.isSente;}
            ) && !(this.isSente && p.y == 1 || !this.isSente && p.y == 9);
    }
}

class Ky extends Koma {
    init() {
        this.symbol_ = "KY";
        this.sfen_ = "L";
        this.canNari_ = true;
        this.isKoma_ = true;
    }

    createNari() {
        return new Ny(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = advance(y, 1); 1 <= yTo && yTo <= 9; yTo = advance(yTo, 1)) {
            if (board[x][yTo].isEmpty_) {
                yield point(x, yTo);
            } else if(this.isEnemy(point(x, yTo), board)) {
                yield point(x, yTo);
                break;
            } else {
                break;
            }
        }
    }

    canDrop(board, p){
        return super.canDrop(board, p) &&
            !(this.isSente && p.y == 1 || !this.isSente && p.y == 9);
    }
}

class Ke extends Koma {
    init() {
        this.symbol_ = "KE";
        this.sfen_ = "N";
        this.canNari_ = true;
        this.isKoma_ = true;
    }

    createNari() {
        return new Nk(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (advance(y, 2) >= 1 && advance(y, 2) <= 9) {
            if (board[x - 1][advance(y, 2)].isEmpty_
            || this.isEnemy(point(x - 1, advance(y, 2)), board)) {
                yield point(x - 1, advance(y, 2));
            }
            if ((board[x + 1][advance(y, 2)].isEmpty_
            || this.isEnemy(point(x + 1, advance(y, 2)), board))) {
                yield point(x + 1, advance(y, 2));
            }
        }
    }

    canDrop(board, p){
        return super.canDrop(board, p) &&
            !(this.isSente && p.y <= 2 || !this.isSente && p.y >= 8);
    }
}

class Gi extends Koma {
    init() {
        this.symbol_ = "GI";
        this.sfen_ = "S";
        this.canNari_ = true;
        this.isKoma_ = true;
    }

    createNari() {
        return new Ng(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 1)].isEmpty_
        || this.isEnemy(point(x - 1, advance(y, 1)), board)) {
            yield point(x - 1, advance(y, 1));
        }
        if (board[x][advance(y, 1)].isEmpty_
        || this.isEnemy(point(x, advance(y, 1)), board)) {
            yield point(x, advance(y, 1));
        }
        if (board[x + 1][advance(y, 1)].isEmpty_
        || this.isEnemy(point(x + 1, advance(y, 1)), board)) {
            yield point(x + 1, advance(y, 1));
        }
        if (board[x - 1][advance(y, -1)].isEmpty_
        || this.isEnemy(point(x - 1, advance(y, -1)), board)) {
            yield point(x - 1, advance(y, -1));
        }
        if (board[x + 1][advance(y, -1)].isEmpty_
        || this.isEnemy(point(x + 1, advance(y, -1)), board)) {
            yield point(x + 1, advance(y, -1));
        }
    }
}

class Ki extends Koma {
    init() {
        this.symbol_ = "KI";
        this.sfen_ = "G";
        this.isKoma_ = true;
    }

    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 1)].isEmpty_
        || this.isEnemy(point(x - 1, advance(y, 1)), board)) {
            yield point(x - 1, advance(y, 1));
        }
        if (board[x][advance(y, 1)].isEmpty_
        || this.isEnemy(point(x, advance(y, 1)), board)) {
            yield point(x, advance(y, 1));
        }
        if (board[x][advance(y, -1)].isEmpty_
        || this.isEnemy(point(x, advance(y, -1)), board)) {
            yield point(x, advance(y, -1));
        }
        if (board[x + 1][advance(y, 1)].isEmpty_
        || this.isEnemy(point(x + 1, advance(y, 1)), board)) {
            yield point(x + 1, advance(y, 1));
        }
        if (board[x - 1][y].isEmpty_
        || this.isEnemy(point(x - 1, y), board)) {
            yield point(x - 1, y);
        }
        if (board[x + 1][y].isEmpty_
        || this.isEnemy(point(x + 1, y), board)) {
            yield point(x + 1, y);
        }
    }
}

class Ka extends Koma {
    init() {
        this.symbol_ = "KA";
        this.sfen_ = "B";
        this.canNari_ = true;
        this.isKoma_ = true;
    }

    createNari() {
        return new Um(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
    }
}

class Hi extends Koma {
    init() {
        this.symbol_ = "HI";
        this.sfen_ = "R";
        this.canNari_ = true;
        this.isKoma_ = true;
    }

    createNari() {
        return new Ry(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield point(x, yTo);
            } else if (this.isEnemy(point(x, yTo), board)) {
                yield point(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield point(x, yTo);
            } else if (this.isEnemy(point(x, yTo), board)) {
                yield point(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield point(xTo, y);
            } else if (this.isEnemy(point(xTo, y), board)) {
                yield point(xTo, y);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield point(xTo, y);
            } else if (this.isEnemy(point(xTo, y), board)) {
                yield point(xTo, y);
                break;
            } else {
                break;
            }
        }
    }
}

class Ou extends Koma {
    init() {
        this.symbol_ = "OU";
        this.sfen_ = "K";
        this.isKoma_ = true;
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][y + 1].isEmpty_
        || this.isEnemy(point(x - 1, y + 1), board)) {
            yield point(x - 1, y + 1);
        }
        if (board[x + 1][y + 1].isEmpty_
        || this.isEnemy(point(x + 1, y + 1), board)) {
            yield point(x + 1, y + 1);
        }
        if (board[x - 1][y - 1].isEmpty_
        || this.isEnemy(point(x - 1, y - 1), board)) {
            yield point(x - 1, y - 1);
        }
        if (board[x][y - 1].isEmpty_
        || this.isEnemy(point(x, y - 1), board)) {
            yield point(x, y - 1);
        }
        if (board[x][y + 1].isEmpty_
        || this.isEnemy(point(x, y + 1), board)) {
            yield point(x, y + 1);
        }
        if (board[x + 1][y - 1].isEmpty_
        || this.isEnemy(point(x + 1, y - 1), board)) {
            yield point(x + 1, y - 1);
        }
        if (board[x - 1][y].isEmpty_
        || this.isEnemy(point(x - 1, y), board)) {
            yield point(x - 1, y);
        }
        if (board[x + 1][y].isEmpty_
        || this.isEnemy(point(x + 1, y), board)) {
            yield point(x + 1, y);
        }
    }
}

class To extends Ki {
    init() {
        this.symbol_ = "TO";
        this.sfen_ = "+P";
        this.isNari_ = true;
        this.isKoma_ = true;
    }

    createNarazu() {
        return new Fu(this.isSente);
    }
}

class Ny extends Ki {
    init() {
        this.symbol_ = "NY";
        this.sfen_ = "+L";
        this.isNari_ = true;
        this.isKoma_ = true;
    }

    createNarazu() {
        return new Ky(this.isSente);
    }
}

class Nk extends Ki {
    init() {
        this.symbol_ = "NK";
        this.sfen_ = "+N";
        this.isNari_ = true;
        this.isKoma_ = true;
    }

    createNarazu() {
        return new Ke(this.isSente);
    }
}

class Ng extends Ki {
    init() {
        this.symbol_ = "NG";
        this.sfen_ = "+S";
        this.isNari_ = true;
        this.isKoma_ = true;
    }

    createNarazu() {
        return new Gi(this.isSente);
    }
}

class Um extends Koma {
    init() {
        this.symbol_ = "UM";
        this.sfen_ = "+B";
        this.isNari_ = true;
        this.isKoma_ = true;
    }

    createNarazu() {
        return new Ka(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield point(xTo, yTo);
            } else if (this.isEnemy(point(xTo, yTo), board)) {
                yield point(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        if (board[x][y - 1].isEmpty_
        || this.isEnemy(point(x, y - 1), board)) {
            yield point(x, y - 1);
        }
        if (board[x][y + 1].isEmpty_
        || this.isEnemy(point(x, y + 1), board)) {
            yield point(x, y + 1);
        }
        if (board[x - 1][y].isEmpty_
        || this.isEnemy(point(x - 1, y), board)) {
            yield point(x - 1, y);
        }
        if (board[x + 1][y].isEmpty_
        || this.isEnemy(point(x + 1, y), board)) {
            yield point(x + 1, y);
        }
    }
}

class Ry extends Koma {
    init() {
        this.symbol_ = "RY";
        this.sfen_ = "+R";
        this.isNari_ = true;
        this.isKoma_ = true;
    }

    createNarazu() {
        return new Hi(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield point(x, yTo);
            } else if (this.isEnemy(point(x, yTo), board)) {
                yield point(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield point(x, yTo);
            } else if (this.isEnemy(point(x, yTo), board)) {
                yield point(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield point(xTo, y);
            } else if (this.isEnemy(point(xTo, y), board)) {
                yield point(xTo, y);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield point(xTo, y);
            } else if (this.isEnemy(point(xTo, y), board)) {
                yield point(xTo, y);
                break;
            } else {
                break;
            }
        }
        if (board[x - 1][y - 1].isEmpty_
        || this.isEnemy(point(x - 1, y - 1), board)) {
            yield point(x - 1, y - 1);
        }
        if (board[x + 1][y - 1].isEmpty_
        || this.isEnemy(point(x + 1, y - 1), board)) {
            yield point(x + 1, y - 1);
        }
        if (board[x - 1][y + 1].isEmpty_
        || this.isEnemy(point(x - 1, y + 1), board)) {
            yield point(x - 1, y + 1);
        }
        if (board[x + 1][y + 1].isEmpty_
        || this.isEnemy(point(x + 1, y + 1), board)) {
            yield point(x + 1, y + 1);
        }
    }
}

class Empty extends Koma {
    constructor() {
        super(false);
    }

    init() {
        this.symbol_ = "";
        this.sfen_ = "";
        this.isEmpty_ = true;
    }
}

class Wall extends Koma {
    constructor() {
        super(false);
    }

    init() {
        this.symbol_ = "";
        this.sfen_ = "";
        this.isWall_ = true;
    }
}

export default {Fu, Ky, Ke, Gi, Ki, Ka, Hi, Ou, To, Ny, Nk, Ng, Um, Ry, Empty, Wall};
