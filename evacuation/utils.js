/* eslint-disable */
class Kifu {
    constructor() {
        this.moves = 1;
        /** 対局者情報や初期盤面など */
        this.csaData = [""];
        this.sfenData = new Map();
    }

    /**
     * 棋譜の保存，千日手の判定を行うメソッド
     * @param {Point} from 移動元s
     * @param {Point} to 移動先
     * @param {Koma} koma 駒
     * @param {Array} board 盤
     * @param {Array} tegoma 手駒
     * @return {Boolean} 千日手か
     */
    update(from, to, koma, board, tegoma) {
        /** CSA形式に従う */
        var csaMove;
        if (koma.isSente) { csaMove = "+"; } else { csaMove = "-"; }
        csaMove += `${from.x}${from.y}${to.x}${to.y}${koma.symbol}`;
        this.csaData.push(csaMove);
        var key = Kifu.sfen(board, tegoma, !koma.isSente);
        if (!(key in this.sfenData)) {
            this.sfenData[key] = 0;
        }
        var cnt = ++this.sfenData[key];
        if (cnt >= 4) {
            return true;
        }
        return false;
    }

    static sfen(board, tegoma, nextTurn) {
        let sfen = "";
        var emptyCnt = 0;
        for (var y = 1; y <= 9; y++) {
            for (var x = 9; x >= 1; x--) {
                if (board[x][y].isEmpty) {
                    emptyCnt++;
                    continue;
                }
                if (emptyCnt > 0) {
                    sfen += emptyCnt;
                }
                sfen += board[x][y].sfen;
                emptyCnt = 0;
            }
            if (emptyCnt > 0) {
                sfen += emptyCnt;
                emptyCnt = 0;
            }
            sfen += "/";
        }
        sfen = sfen.slice(0, -1);
        sfen += nextTurn?"b":"w";
        /** 持ち駒 */
        for (var turn = 1; turn >= 0; turn--) {
            sfen += this.sfenTegoma(tegoma[turn]["HI"]);
            sfen += this.sfenTegoma(tegoma[turn]["KA"]);
            sfen += this.sfenTegoma(tegoma[turn]["KI"]);
            sfen += this.sfenTegoma(tegoma[turn]["GI"]);
            sfen += this.sfenTegoma(tegoma[turn]["KE"]);
            sfen += this.sfenTegoma(tegoma[turn]["KY"]);
            sfen += this.sfenTegoma(tegoma[turn]["FU"]);
        }
        return sfen;
    }

    static sfenTegoma(tegoma) {
        let sfen = "";
        if (tegoma.num > 1) {
            sfen += tegoma.num;
        }
        if (tegoma.num > 0) {
            sfen += tegoma.koma.sfen;
        }
        return sfen;
    }
}

/**
 * 座標のクラス
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    eq(other) {
        return this.x == other.x && this.y == other.y;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}

function point(x, y) {
    return new Point(x, y);
}