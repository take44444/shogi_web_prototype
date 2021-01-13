/**
 * 駒のクラス
 * @param {number} koma 駒を表す数値
 * @constructor
 */
class Koma {
    constructor(symbol, isNari, canNari, isSente) {
        this.symbol_ = symbol;
        this.isNari_ = isNari;
        this.canNari_ = canNari;
        this.isSente = isSente;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSente?"pos":"neg"}.png)`;
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

    static isEnemy(from, to, board) {
        return board[from.x][from.y].isSente != board[to.x][to.y].isSente && !board[to.x][to.y].isWall;
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
        yield false;
    }

    /**
     * 駒を置けるマスのジェネレータ
     * @param {Array} board 現在の盤の可変参照
     */
    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    yield { xTo: x, yTo: y };
                }
            }
        }
    }
}

class Fu extends Koma {
    constructor(isSente) {
        super("FU", false, true, isSente);
    }

    createNari() {
        return new To(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        console.log("FU");
        if (board[x][advance(y, 1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: advance(y, 1) }, board)) {
            yield { xTo: x, yTo: advance(y, 1) };
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
                        yield { xTo: x, yTo: y };
                    }
                }
            }
        }
    }
}

class Ky extends Koma {
    constructor(isSente) {
        super("KY", false, true, isSente);
    }

    createNari() {
        return new Ny(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = advance(y, 1); 1 <= yTo && yTo <= 9; yTo = advance(yTo, 1)) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if(Koma.isEnemy({ x: x, y: y }, { x: x, y: yTo }, board)) {
                yield { xTo: x, yTo: yTo };
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
                        yield { xTo: x, yTo: y };
                    }
                }
            }
        }
    }
}

class Ke extends Koma {
    constructor(isSente) {
        super("KE", false, true, isSente);
    }

    createNari() {
        return new Nk(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 2)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: advance(y, 2) }, board)) {
            yield { xTo: x - 1, yTo: advance(y, 2) };
        }
        if ((board[x + 1][advance(y, 2)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: advance(y, 2) }, board))) {
            yield { xTo: x + 1, yTo: advance(y, 2) };
        }
    }

    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    if (this.isSente && y <= 2 || !this.isSente && y >= 8) {
                        continue;
                    } else {
                        yield { xTo: x, yTo: y };
                    }
                }
            }
        }
    }
}

class Gi extends Koma {
    constructor(isSente) {
        super("GI", false, true, isSente);
    }

    createNari() {
        return new Ng(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: advance(y, 1) }, board)) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        }
        if (board[x][advance(y, 1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: advance(y, 1) }, board)) {
            yield { xTo: x, yTo: advance(y, 1) };
        }
        if (board[x + 1][advance(y, 1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: advance(y, 1) }, board)) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        }
        if (board[x - 1][advance(y, -1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: advance(y, -1) }, board)) {
            yield { xTo: x - 1, yTo: advance(y, -1) };
        }
        if (board[x + 1][advance(y, -1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: advance(y, -1) }, board)) {
            yield { xTo: x + 1, yTo: advance(y, -1) };
        }
    }
}

class Ki extends Koma {
    constructor(isSente, symbol) {
        super(symbol, false, false, isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][advance(y, 1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: advance(y, 1) }, board)) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        }
        if (board[x][advance(y, 1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: advance(y, 1) }, board)) {
            yield { xTo: x, yTo: advance(y, 1) };
        }
        if (board[x][advance(y, -1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: advance(y, -1) }, board)) {
            yield { xTo: x, yTo: advance(y, -1) };
        }
        if (board[x + 1][advance(y, 1)].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: advance(y, 1) }, board)) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        }
        if (board[x - 1][y].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: y }, board)) {
            yield { xTo: x - 1, yTo: y };
        }
        if (board[x + 1][y].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: y }, board)) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class Ka extends Koma {
    constructor(isSente) {
        super("KA", false, true, isSente);
    }

    createNari() {
        return new Um(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
    }
}

class Hi extends Koma {
    constructor(isSente) {
        super("HI", false, true, isSente);
    }

    createNari() {
        return new Ry(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: x, y: yTo }, board)) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: x, y: yTo }, board)) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: y }, board)) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: y }, board)) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
    }
}

class Ou extends Koma {
    constructor(isSente) {
        super("OU", false, false, isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        if (board[x - 1][y + 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: y + 1 }, board)) {
            yield { xTo: x - 1, yTo: y + 1 };
        }
        if (board[x + 1][y + 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: y + 1 }, board)) {
            yield { xTo: x + 1, yTo: y + 1 };
        }
        if (board[x - 1][y - 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: y - 1 }, board)) {
            yield { xTo: x - 1, yTo: y - 1 };
        }
        if (board[x][y - 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: y - 1 }, board)) {
            yield { xTo: x, yTo: y - 1 };
        }
        if (board[x][y + 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: y + 1 }, board)) {
            yield { xTo: x, yTo: y + 1 };
        }
        if (board[x + 1][y - 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: y - 1 }, board)) {
            yield { xTo: x + 1, yTo: y - 1 };
        }
        if (board[x - 1][y].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: y }, board)) {
            yield { xTo: x - 1, yTo: y };
        }
        if (board[x + 1][y].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: y }, board)) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class To extends Ki {
    constructor(isSente) {
        super(isSente, "TO");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Fu(this.isSente);
    }
}

class Ny extends Ki {
    constructor(isSente) {
        super(isSente, "NY");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Ky(this.isSente);
    }
}

class Nk extends Ki {
    constructor(isSente) {
        super(isSente, "NK");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Ke(this.isSente);
    }
}

class Ng extends Ki {
    constructor(isSente) {
        super(isSente, "NG");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Gi(this.isSente);
    }
}

class Um extends Koma {
    constructor(isSente) {
        super("UM", true, false, isSente);
    }

    createNarazu() {
        return new Ka(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: yTo }, board)) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        if (board[x][y - 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: y - 1 }, board)) {
            yield { xTo: x, yTo: y - 1 };
        }
        if (board[x][y + 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x, y: y + 1 }, board)) {
            yield { xTo: x, yTo: y + 1 };
        }
        if (board[x - 1][y].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: y }, board)) {
            yield { xTo: x - 1, yTo: y };
        }
        if (board[x + 1][y].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: y }, board)) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class Ry extends Koma {
    constructor(isSente) {
        super("RY", true, false, isSente);
    }

    createNarazu() {
        return new Hi(this.isSente);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: x, y: yTo }, board)) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: x, y: yTo }, board)) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: y }, board)) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (Koma.isEnemy({ x: x, y: y }, { x: xTo, y: y }, board)) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        if (board[x - 1][y - 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: y - 1 }, board)) {
            yield { xTo: x - 1, yTo: y - 1 };
        }
        if (board[x + 1][y - 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: y - 1 }, board)) {
            yield { xTo: x + 1, yTo: y - 1 };
        }
        if (board[x - 1][y + 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x - 1, y: y + 1 }, board)) {
            yield { xTo: x - 1, yTo: y + 1 };
        }
        if (board[x + 1][y + 1].isEmpty_
        || Koma.isEnemy({ x: x, y: y }, { x: x + 1, y: y + 1 }, board)) {
            yield { xTo: x + 1, yTo: y + 1 };
        }
    }
}

class Empty extends Koma {
    constructor() {
        super("", false, false, false);
        this.img_ = "";
        this.isEmpty_ = true;
        this.isKoma_ = false;
    }
}

class Wall extends Koma {
    constructor() {
        super("", false, false, false);
        this.img_ = "";
        this.isWall_ = true;
        this.isKoma_ = false;
    }    
}
