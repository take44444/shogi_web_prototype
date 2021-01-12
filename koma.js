/**
 * 駒のクラス
 * @param {number} koma 駒を表す数値
 * @constructor
 */
class Koma {
    constructor(symbol, isNari, canNari, isSelf) {
        this.symbol_ = symbol;
        this.isNari_ = isNari;
        this.canNari_ = canNari;
        this.isSelf = isSelf;
        this.isWall_ = false;
        this.isEmpty_ = false;
        this.isKoma_ = true;
        this.img_ = `url(img/${this.symbol_}_${this.isSelf?"pos":"neg"}.png)`;
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

    /**
     * 駒が移動できるマスのジェネレータ
     * @param {Number} x 選択した駒の筋
     * @param {Number} y 選択した駒の段
     * @param {Array} board 現在の盤の可変参照
     */
    pathGen(x, y, board) {
        if (this.isSelf) {
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
    constructor(isSelf) {
        super("FU", false, true, isSelf);
    }

    createNari() {
        return new To(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        if ((board[x][advance(y, 1)].isEmpty_
        || board[x][y].isSelf != board[x][advance(y, 1)].isSelf)
        && !board[x][advance(y, 1)].isWall) {
            yield { xTo: x, yTo: advance(y, 1) };
        }
    }

    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            if (this.isSelf && board[x].some(e => {e.symbol == "FU" && e.isSelf})) {
                continue;
            } else if (!this.isSelf && board[x].some(e => {e.symbol == "FU" && !e.isSelf})) {
                continue;
            }

            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    if (this.isSelf && y == 1 || !this.isSelf && y == 9) {
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
    constructor(isSelf) {
        super("KY", false, true, isSelf);
    }

    createNari() {
        return new Ny(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        for (var yTo = advance(y, 1); 1 <= yTo && yTo <= 9; yTo = advance(yTo, 1)) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (board[x][y].isSelf != board[x][yTo].isSelf && !board[x][yTo].isWall) {
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
                    if (this.isSelf && y == 1 || !this.isSelf && y == 9) {
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
    constructor(isSelf) {
        super("KE", false, true, isSelf);
    }

    createNari() {
        return new Nk(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        if ((board[x - 1][advance(y, 2)].isEmpty_
        || board[x - 1][advance(y, 2)].isSelf != self)
        && !board[x - 1][advance(y, 2)].isWall) {
            yield { xTo: x - 1, yTo: advance(y, 2) };
        }
        if ((board[x + 1][advance(y, 2)].isEmpty_
        || board[x + 1][advance(y, 2)].isSelf != self)
        && !board[x + 1][advance(y, 2)].isWall) {
            yield { xTo: x + 1, yTo: advance(y, 2) };
        }
    }

    *dropGen(board) {
        for (var x = 1; x <= 9; x++) {
            for (var y = 1; y <= 9; y++) {
                if (board[x][y].isEmpty_) {
                    if (this.isSelf && y <= 2 || !this.isSelf && y >= 8) {
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
    constructor(isSelf) {
        super("GI", false, true, isSelf);
    }

    createNari() {
        return new Ng(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        if ((board[x - 1][advance(y, 1)].isEmpty_
        || board[x - 1][advance(y, 1)].isSelf != self)
        && !board[x - 1][advance(y, 1)].isWall) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        }
        if ((board[x][advance(y, 1)].isEmpty_
        || board[x][advance(y, 1)].isSelf != self)
        && !board[x][advance(y, 1)].isWall) {
            yield { xTo: x, yTo: advance(y, 1) };
        }
        if ((board[x + 1][advance(y, 1)].isEmpty_
        || board[x + 1][advance(y, 1)].isSelf != self)
        && !board[x + 1][advance(y, 1)].isWall) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        }
        if ((board[x - 1][advance(y, -1)].isEmpty_
        || board[x - 1][advance(y, -1)].isSelf != self)
        && !board[x - 1][advance(y, -1)].isWall) {
            yield { xTo: x - 1, yTo: advance(y, -1) };
        }
        if ((board[x + 1][advance(y, -1)].isEmpty_
        || board[x + 1][advance(y, -1)].isSelf != self)
        && !board[x + 1][advance(y, -1)].isWall) {
            yield { xTo: x + 1, yTo: advance(y, -1) };
        }
    }
}

class Ki extends Koma {
    constructor(isSelf, symbol) {
        super(symbol, false, false, isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        if ((board[x - 1][advance(y, 1)].isEmpty_
        || board[x - 1][advance(y, 1)].isSelf != self)
        && !board[x - 1][advance(y, 1)].isWall) {
            yield { xTo: x - 1, yTo: advance(y, 1) };
        }
        if ((board[x][advance(y, 1)].isEmpty_
        || board[x][advance(y, 1)].isSelf != self)
        && !board[x][advance(y, 1)].isWall) {
            yield { xTo: x, yTo: advance(y, 1) };
        }
        if ((board[x][advance(y, -1)].isEmpty_
        || board[x][advance(y, -1)].isSelf != self)
        && !board[x][advance(y, -1)].isWall) {
            yield { xTo: x, yTo: advance(y, -1) };
        }
        if ((board[x + 1][advance(y, 1)].isEmpty_
        || board[x + 1][advance(y, 1)].isSelf != self)
        && !board[x + 1][advance(y, 1)].isWall) {
            yield { xTo: x + 1, yTo: advance(y, 1) };
        }
        if ((board[x - 1][y].isEmpty_
        || board[x - 1][y].isSelf != self)
        && !board[x - 1][y].isWall) {
            yield { xTo: x - 1, yTo: y };
        }
        if ((board[x + 1][y].isEmpty_
        || board[x + 1][y].isSelf != self)
        && !board[x + 1][y].isWall) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class Ka extends Koma {
    constructor(isSelf) {
        super("KA", false, true, isSelf);
    }

    createNari() {
        return new Um(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
    }
}

class Hi extends Koma {
    constructor(isSelf) {
        super("HI", false, true, isSelf);
    }

    createNari() {
        return new Ry(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (board[x][yTo].isSelf != self && !board[x][yTo].isWall) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (board[x][yTo].isSelf != self && !board[x][yTo].isWall) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (board[xTo][y].isSelf != self && !board[xTo][y].isWall) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (board[xTo][y].isSelf != self && !board[xTo][y].isWall) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
    }
}

class Ou extends Koma {
    constructor(isSelf) {
        super("OU", false, false, isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        if ((board[x - 1][y + 1].isEmpty_
        || board[x - 1][y + 1].isSelf != self)
        && !board[x - 1][y + 1].isWall) {
            yield { xTo: x - 1, yTo: y + 1 };
        }
        if ((board[x + 1][y + 1].isEmpty_
        || board[x + 1][y + 1].isSelf != self)
        && !board[x + 1][y + 1].isWall) {
            yield { xTo: x + 1, yTo: y + 1 };
        }
        if ((board[x - 1][y - 1].isEmpty_
        || board[x - 1][y - 1].isSelf != self)
        && !board[x - 1][y - 1].isWall) {
            yield { xTo: x - 1, yTo: y - 1 };
        }
        if ((board[x][y - 1].isEmpty_
        || board[x][y - 1].isSelf != self)
        && !board[x][y - 1].isWall) {
            yield { xTo: x, yTo: y - 1 };
        }
        if ((board[x][y + 1].isEmpty_
        || board[x][y + 1].isSelf != self)
        && !board[x][y + 1].isWall) {
            yield { xTo: x, yTo: y + 1 };
        }
        if ((board[x + 1][y - 1].isEmpty_
        || board[x + 1][y - 1].isSelf != self)
        && !board[x + 1][y - 1].isWall) {
            yield { xTo: x + 1, yTo: y - 1 };
        }
        if ((board[x - 1][y].isEmpty_
        || board[x - 1][y].isSelf != self)
        && !board[x - 1][y].isWall) {
            yield { xTo: x - 1, yTo: y };
        }
        if ((board[x + 1][y].isEmpty_
        || board[x + 1][y].isSelf != self)
        && !board[x + 1][y].isWall) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class To extends Ki {
    constructor(isSelf) {
        super(isSelf, "TO");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Fu(this.isSelf);
    }
}

class Ny extends Ki {
    constructor(isSelf) {
        super(isSelf, "NY");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Ky(this.isSelf);
    }
}

class Nk extends Ki {
    constructor(isSelf) {
        super(isSelf, "NK");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Ke(this.isSelf);
    }
}

class Ng extends Ki {
    constructor(isSelf) {
        super(isSelf, "NG");
        this.isNari_ = true;
    }

    createNarazu() {
        return new Gi(this.isSelf);
    }
}

class Um extends Koma {
    constructor(isSelf) {
        super("UM", true, false, isSelf);
    }

    createNarazu() {
        return new Ka(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        for (var xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
            if (board[xTo][yTo].isEmpty_) {
                yield { xTo: xTo, yTo: yTo };
            } else if (board[xTo][yTo].isSelf != self && !board[xTo][yTo].isWall) {
                yield { xTo: xTo, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        if ((board[x][y - 1].isEmpty_
        || board[x][y - 1].isSelf != self)
        && !board[x][y - 1].isWall) {
            yield { xTo: x, yTo: y - 1 };
        }
        if ((board[x][y + 1].isEmpty_
        || board[x][y + 1].isSelf != self)
        && !board[x][y + 1].isWall) {
            yield { xTo: x, yTo: y + 1 };
        }
        if ((board[x - 1][y].isEmpty_
        || board[x - 1][y].isSelf != self)
        && !board[x - 1][y].isWall) {
            yield { xTo: x - 1, yTo: y };
        }
        if ((board[x + 1][y].isEmpty_
        || board[x - 1][y].isSelf != self)
        && !board[x - 1][y].isWall) {
            yield { xTo: x + 1, yTo: y };
        }
    }
}

class Ry extends Koma {
    constructor(isSelf) {
        super("RY", true, false, isSelf);
    }

    createNarazu() {
        return new Hi(this.isSelf);
    }
    
    *__pathGen(x, y, board, advance) {
        var self = board[x][y].isSelf;
        for (var yTo = y - 1; yTo >= 1; yTo--) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (board[x][yTo].isSelf != self && !board[x][yTo].isWall) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var yTo = y + 1; yTo <= 9; yTo++) {
            if (board[x][yTo].isEmpty_) {
                yield { xTo: x, yTo: yTo };
            } else if (board[x][yTo].isSelf != self && !board[x][yTo].isWall) {
                yield { xTo: x, yTo: yTo };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x - 1; xTo >= 1; xTo--) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (board[xTo][y].isSelf != self && !board[xTo][y].isWall) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        for (var xTo = x + 1; xTo <= 9; xTo++) {
            if (board[xTo][y].isEmpty_) {
                yield { xTo: xTo, yTo: y };
            } else if (board[xTo][y].isSelf != self && !board[xTo][y].isWall) {
                yield { xTo: xTo, yTo: y };
                break;
            } else {
                break;
            }
        }
        if ((board[x - 1][y - 1].isEmpty_
        || board[x - 1][y - 1].isSelf != self)
        && !board[x - 1][y - 1].isWall) {
            yield { xTo: x - 1, yTo: y - 1 };
        }
        if ((board[x + 1][y - 1].isEmpty_
        || board[x + 1][y - 1].isSelf != self)
        && !board[x + 1][y - 1].isWall) {
            yield { xTo: x + 1, yTo: y - 1 };
        }
        if ((board[x - 1][y + 1].isEmpty_
        || board[x - 1][y + 1].isSelf != self)
        && !board[x - 1][y + 1].isWall) {
            yield { xTo: x - 1, yTo: y + 1 };
        }
        if ((board[x + 1][y + 1].isEmpty_
        || board[x + 1][y + 1].isSelf != self)
        && !board[x + 1][y + 1].isWall) {
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