/**
 * 駒のクラス
 * @param {number} koma 駒を表す数値
 * @constructor
 */
class Koma {
    constructor(isSente) {
        this.isSente = isSente;
        this.init();
    }

    /**
     * パラメータ初期化メソッド
     */
    init() {
        this.symbol_ = "";
        this.isNari_ = false;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = false;
        this.img_ = "";
    }

    get symbol() {
        return this.symbol_;
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
                if (board[x][y].isEmpty_) {
                    yield sq(x, y);
                }
            }
        }
    }
}

class Fu extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "FU";
        this.isNari_ = false;
        this.canNari_ = true;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNari() {
        return new To(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x][advance(y, 1)].isEmpty_
        || this.isEnemy(sq(x, advance(y, 1)), board)) {
            yield sq(x, advance(y, 1));
        }
    }

    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            if (this.isSente && board[x].some(e=>{return e.symbol == "FU" && e.isSente;})) {
                continue;
            } else if (!this.isSente && board[x].some(e=>{return e.symbol == "FU" && !e.isSente;})) {
                continue;
            }

            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    if (this.isSente && y == 1 || !this.isSente && y == 9) {
                        continue;
                    } else {
                        yield sq(x, y);
                    }
                }
            }
        }
    }
}

class Ky extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "KY";
        this.isNari_ = false;
        this.canNari_ = true;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNari() {
        return new Ny(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = advance(y, 1); 1 <= yTo && yTo <= 9; yTo = advance(yTo, 1)) {
            if (board[x][yTo].isEmpty_) {
                yield sq(x, yTo);
            } else if(this.isEnemy(sq(x, yTo), board)) {
                yield sq(x, yTo);
                break;
            } else {
                break;
            }
        }
    }

    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    if (this.isSente && y == 1 || !this.isSente && y == 9) {
                        continue;
                    } else {
                        yield sq(x, y);
                    }
                }
            }
        }
    }
}

class Ke extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "KE";
        this.isNari_ = false;
        this.canNari_ = true;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNari() {
        return new Nk(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 2)].isEmpty_
        || this.isEnemy(sq(x - 1, advance(y, 2)), board)) {
            yield sq(x - 1, advance(y, 2));
        }
        if ((board[x + 1][advance(y, 2)].isEmpty_
        || this.isEnemy(sq(x + 1, advance(y, 2)), board))) {
            yield sq(x + 1, advance(y, 2));
        }
    }

    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    if (this.isSente && y <= 2 || !this.isSente && y >= 8) {
                        continue;
                    } else {
                        yield sq(x, y);
                    }
                }
            }
        }
    }
}

class Gi extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "GI";
        this.isNari_ = false;
        this.canNari_ = true;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNari() {
        return new Ng(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 1)].isEmpty_
        || this.isEnemy(sq(x - 1, advance(y, 1)), board)) {
            yield sq(x - 1, advance(y, 1));
        }
        if (board[x][advance(y, 1)].isEmpty_
        || this.isEnemy(sq(x, advance(y, 1)), board)) {
            yield sq(x, advance(y, 1));
        }
        if (board[x + 1][advance(y, 1)].isEmpty_
        || this.isEnemy(sq(x + 1, advance(y, 1)), board)) {
            yield sq(x + 1, advance(y, 1));
        }
        if (board[x - 1][advance(y, -1)].isEmpty_
        || this.isEnemy(sq(x - 1, advance(y, -1)), board)) {
            yield sq(x - 1, advance(y, -1));
        }
        if (board[x + 1][advance(y, -1)].isEmpty_
        || this.isEnemy(sq(x + 1, advance(y, -1)), board)) {
            yield sq(x + 1, advance(y, -1));
        }
    }
}

class Ki extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "KI";
        this.isNari_ = false;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 1)].isEmpty_
        || this.isEnemy(sq(x - 1, advance(y, 1)), board)) {
            yield sq(x - 1, advance(y, 1));
        }
        if (board[x][advance(y, 1)].isEmpty_
        || this.isEnemy(sq(x, advance(y, 1)), board)) {
            yield sq(x, advance(y, 1));
        }
        if (board[x][advance(y, -1)].isEmpty_
        || this.isEnemy(sq(x, advance(y, -1)), board)) {
            yield sq(x, advance(y, -1));
        }
        if (board[x + 1][advance(y, 1)].isEmpty_
        || this.isEnemy(sq(x + 1, advance(y, 1)), board)) {
            yield sq(x + 1, advance(y, 1));
        }
        if (board[x - 1][y].isEmpty_
        || this.isEnemy(sq(x - 1, y), board)) {
            yield sq(x - 1, y);
        }
        if (board[x + 1][y].isEmpty_
        || this.isEnemy(sq(x + 1, y), board)) {
            yield sq(x + 1, y);
        }
    }
}

class Ka extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "KA";
        this.isNari_ = false;
        this.canNari_ = true;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNari() {
        return new Um(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
    }
}

class Hi extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "HI";
        this.isNari_ = false;
        this.canNari_ = true;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNari() {
        return new Ry(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield sq(x, yTo);
            } else if (this.isEnemy(sq(x, yTo), board)) {
                yield sq(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield sq(x, yTo);
            } else if (this.isEnemy(sq(x, yTo), board)) {
                yield sq(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield sq(xTo, y);
            } else if (this.isEnemy(sq(xTo, y), board)) {
                yield sq(xTo, y);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield sq(xTo, y);
            } else if (this.isEnemy(sq(xTo, y), board)) {
                yield sq(xTo, y);
                break;
            } else {
                break;
            }
        }
    }
}

class Ou extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "OU";
        this.isNari_ = false;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][y + 1].isEmpty_
        || this.isEnemy(sq(x - 1, y + 1), board)) {
            yield sq(x - 1, y + 1);
        }
        if (board[x + 1][y + 1].isEmpty_
        || this.isEnemy(sq(x + 1, y + 1), board)) {
            yield sq(x + 1, y + 1);
        }
        if (board[x - 1][y - 1].isEmpty_
        || this.isEnemy(sq(x - 1, y - 1), board)) {
            yield sq(x - 1, y - 1);
        }
        if (board[x][y - 1].isEmpty_
        || this.isEnemy(sq(x, y - 1), board)) {
            yield sq(x, y - 1);
        }
        if (board[x][y + 1].isEmpty_
        || this.isEnemy(sq(x, y + 1), board)) {
            yield sq(x, y + 1);
        }
        if (board[x + 1][y - 1].isEmpty_
        || this.isEnemy(sq(x + 1, y - 1), board)) {
            yield sq(x + 1, y - 1);
        }
        if (board[x - 1][y].isEmpty_
        || this.isEnemy(sq(x - 1, y), board)) {
            yield sq(x - 1, y);
        }
        if (board[x + 1][y].isEmpty_
        || this.isEnemy(sq(x + 1, y), board)) {
            yield sq(x + 1, y);
        }
    }
}

class To extends Ki {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "TO";
        this.isNari_ = true;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNarazu() {
        return new Fu(this.isSente);
    }
}

class Ny extends Ki {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "NY";
        this.isNari_ = true;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNarazu() {
        return new Ky(this.isSente);
    }
}

class Nk extends Ki {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "NK";
        this.isNari_ = true;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNarazu() {
        return new Ke(this.isSente);
    }
}

class Ng extends Ki {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "NG";
        this.isNari_ = true;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNarazu() {
        return new Gi(this.isSente);
    }
}

class Um extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "UM";
        this.isNari_ = true;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNarazu() {
        return new Ka(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield sq(xTo, yTo);
            } else if (this.isEnemy(sq(xTo, yTo), board)) {
                yield sq(xTo, yTo);
                break;
            } else {
                break;
            }
        }
        if (board[x][y - 1].isEmpty_
        || this.isEnemy(sq(x, y - 1), board)) {
            yield sq(x, y - 1);
        }
        if (board[x][y + 1].isEmpty_
        || this.isEnemy(sq(x, y + 1), board)) {
            yield sq(x, y + 1);
        }
        if (board[x - 1][y].isEmpty_
        || this.isEnemy(sq(x - 1, y), board)) {
            yield sq(x - 1, y);
        }
        if (board[x + 1][y].isEmpty_
        || this.isEnemy(sq(x + 1, y), board)) {
            yield sq(x + 1, y);
        }
    }
}

class Ry extends Koma {
    constructor(isSente) {
        super(isSente);
    }

    init() {
        this.symbol_ = "RY";
        this.isNari_ = true;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
    }

    createNarazu() {
        return new Hi(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield sq(x, yTo);
            } else if (this.isEnemy(sq(x, yTo), board)) {
                yield sq(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield sq(x, yTo);
            } else if (this.isEnemy(sq(x, yTo), board)) {
                yield sq(x, yTo);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield sq(xTo, y);
            } else if (this.isEnemy(sq(xTo, y), board)) {
                yield sq(xTo, y);
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield sq(xTo, y);
            } else if (this.isEnemy(sq(xTo, y), board)) {
                yield sq(xTo, y);
                break;
            } else {
                break;
            }
        }
        if (board[x - 1][y - 1].isEmpty_
        || this.isEnemy(sq(x - 1, y - 1), board)) {
            yield sq(x - 1, y - 1);
        }
        if (board[x + 1][y - 1].isEmpty_
        || this.isEnemy(sq(x + 1, y - 1), board)) {
            yield sq(x + 1, y - 1);
        }
        if (board[x - 1][y + 1].isEmpty_
        || this.isEnemy(sq(x - 1, y + 1), board)) {
            yield sq(x - 1, y + 1);
        }
        if (board[x + 1][y + 1].isEmpty_
        || this.isEnemy(sq(x + 1, y + 1), board)) {
            yield sq(x + 1, y + 1);
        }
    }
}

class Empty extends Koma {
    constructor() {
        super(false);
    }

    init() {
        this.symbol_ = "";
        this.isNari_ = false;
        this.canNari_ = false;
        this.isWall_ = false;
        this.isEmpty_ = true;
        this.isKoma_ = false;
        this.img_ = "";
    }
}

class Wall extends Koma {
    constructor() {
        super(false);
    }

    init() {
        this.symbol_ = "";
        this.isNari_ = false;
        this.canNari_ = false;
        this.isWall_ = true;
        this.isEmpty_ = false;
        this.isKoma_ = false;
        this.img_ = "";
    }
}
