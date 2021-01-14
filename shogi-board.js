class ShogiBoard {
    constructor() {
        this.turn_ = true;
        this.csaData_ = [];
        this.board_ = [];
        this.tegoma_ = [];
        this.ou_ = [];
        this.ou_[SENTE] = sq(5, 9);
        this.ou_[GOTE] = sq(5, 1);
        /** 持将棋判定用のカウンターを用意 */
    
        for (var x = 0; x <= 10; x++) {
            this.board_[x] = [];
            for (var y = 0; y <= 10; y++) {
                if (x == 0 || x == 10 || y == 0 || y == 10) {
                    this.board_[x][y] = new Wall();
                } else {
                    this.board_[x][y] = new Empty();
                }
            }
        }
    
        for (var turn = 0; turn <= 1; turn++) {
            this.tegoma_[turn] = {};
            this.tegoma_[turn]["FU"] = { koma: new Fu(turn == SENTE), num: 0 };
            this.tegoma_[turn]["KY"] = { koma: new Ky(turn == SENTE), num: 0 };
            this.tegoma_[turn]["KE"] = { koma: new Ke(turn == SENTE), num: 0 };
            this.tegoma_[turn]["GI"] = { koma: new Gi(turn == SENTE), num: 0 };
            this.tegoma_[turn]["KI"] = { koma: new Ki(turn == SENTE, "KI"), num: 0 };
            this.tegoma_[turn]["HI"] = { koma: new Hi(turn == SENTE), num: 0 };
            this.tegoma_[turn]["KA"] = { koma: new Ka(turn == SENTE), num: 0 };
        }
    
        this.board_[1][1] = new Ky(false);
        this.board_[2][1] = new Ke(false);
        this.board_[3][1] = new Gi(false);
        this.board_[4][1] = new Ki(false, "KI");
        this.board_[5][1] = new Ou(false);
        this.board_[6][1] = new Ki(false, "KI");
        this.board_[7][1] = new Gi(false);
        this.board_[8][1] = new Ke(false);
        this.board_[9][1] = new Ky(false);
        this.board_[8][2] = new Hi(false);
        this.board_[2][2] = new Ka(false);
        this.board_[1][9] = new Ky(true);
        this.board_[2][9] = new Ke(true);
        this.board_[3][9] = new Gi(true);
        this.board_[4][9] = new Ki(true, "KI");
        this.board_[5][9] = new Ou(true);
        this.board_[6][9] = new Ki(true, "KI");
        this.board_[7][9] = new Gi(true);
        this.board_[8][9] = new Ke(true);
        this.board_[9][9] = new Ky(true);
        this.board_[2][8] = new Hi(true);
        this.board_[8][8] = new Ka(true);
        for (var i = 1; i <= 9; i++) {
            this.board_[i][3] = new Fu(false);
            this.board_[i][7] = new Fu(true);
        }
    }

    get board() {
        return this.board_;
    }

    get turn() {
        return this.turn_;
    }

    get tegoma() {
        return this.tegoma_;
    }

    rotateTurn() {
        this.turn_ = !this.turn_;
    }

    move(from, to, afterKoma) {
        if (from.x != 0) {
            this.board_[from.x][from.y] = new Empty();
        } else {
            this.tegoma[+this.turn_][afterKoma.symbol].num--;
        }
        if (!this.board_[to.x][to.y].isEmpty) {
            if (this.board_[to.x][to.y].isNari) {
                this.tegoma_[+this.turn_][this.board_[to.x][to.y].createNarazu().symbol].num++;
            } else {
                this.tegoma_[+this.turn_][this.board_[to.x][to.y].symbol].num++;
            }
        }
        this.board_[to.x][to.y] = afterKoma;

        if (afterKoma.symbol == "OU") {
            this.ou_[+afterKoma.isSente].x = to.x;
            this.ou_[+afterKoma.isSente].y = to.y;
        } else {
            console.log(this.checkOute(to, afterKoma));
        }

        // 棋譜を保存
        var csaMove;
        if (this.turn_ == SENTE) { csaMove = "+"; } else { csaMove = "-"; }
        csaMove = csaMove + from.x + from.y + afterKoma.symbol;
        this.csaData_.push(csaMove);
    }

    /**
     * 王手をかけている駒を調べるメソッド
     * @param {Dictionary} lastMove 最後に指した手
     * @param {Koma} koma 動かした駒
     * @param {Array} this.board_ 現在の盤面
     * @return {Array} 王手をかけている駒のマスのリスト
     */
    checkOute(lastMove, koma) {
        let ret = [];
        var ou = this.ou_[+!koma.isSente];

        /** 直前に指した駒による王手 */
        for (var path of koma.pathGen(lastMove.x, lastMove.y, this.board_)) {
            if (path.eq(ou)) {
                ret.push(lastMove);
                break;
            }
        }

        function pushSet(sqArray, sqElement) {
            if (sqElement != null
            && !sqArray.some(e=>{return sqElement.eq(e);})) {
                sqArray.push(sqElement);
            }
        }

        pushSet(ret, this.isLookingAt(ou, ["KA", "UM"], koma.isSente
            , (x, i)=>{return x-i;}, (y, i)=>{return y-i;}));
        pushSet(ret, this.isLookingAt(ou, ["KA", "UM"], koma.isSente
            , (x, i)=>{return x+i;}, (y, i)=>{return y-i;}));
        pushSet(ret, this.isLookingAt(ou, ["KA", "UM"], koma.isSente
            , (x, i)=>{return x-i;}, (y, i)=>{return y+i;}));
        pushSet(ret, this.isLookingAt(ou, ["KA", "UM"], koma.isSente
            , (x, i)=>{return x+i;}, (y, i)=>{return y+i;}));

        pushSet(ret, this.isLookingAt(ou, ["HI", "RY"], koma.isSente
            , (x, i)=>{return x-i;}, (y, i)=>{return y;}));
        pushSet(ret, this.isLookingAt(ou, ["HI", "RY"], koma.isSente
            , (x, i)=>{return x+i;}, (y, i)=>{return y;}));

        if (koma.isSente) {
            pushSet(ret, this.isLookingAt(ou, ["HI", "RY", "KY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y+i;}));
            pushSet(ret, this.isLookingAt(ou, ["HI", "RY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y-i;}));
        } else {
            pushSet(ret, this.isLookingAt(ou, ["HI", "RY", "KY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y-i;}));
            pushSet(ret, this.isLookingAt(ou, ["HI", "RY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y+i;}));
        }
        return ret;
    }

    /**
     * 指定した座標に指定した駒が利いているかを調べるメソッド
     * @param {Sq} target 駒の利きを調べたいマス
     * @param {Array} checkList 探索する駒のリスト
     * @param {Boolean} checkTurn 探索する駒の手盤
     * @param {Function} updateX 探索時にxの値を更新するための関数オブジェクト
     * @param {Function} updateY 探索時にyの値を更新するための関数オブジェクト
     * @return {Dictionary} 暗殺者のマス
     */
    isLookingAt(target, checkList, checkTurn, updateX, updateY) {
        for (var dif = 1; ; dif++) {
            var x = updateX(target.x, dif);
            var y = updateY(target.y, dif);
            var killer = this.board_[x][y];
            if (killer.isEmpty) {
                continue;
            }
            /** 壁か，調べたい手盤ではない駒にたどり着いた場合はbreak */
            if (killer.isWall || (killer.isSente != checkTurn)) {
                return null;
            }
            /** 引数で与えられたチェックリストに存在する駒の場合座標をreturn */
            for (var check of checkList) {
                if (killer.symbol == check) {
                    return sq(x, y);
                }
            }
            /** チェックリストにない駒にたどり着いた場合はreturn */
            if (killer.isKoma) {
                return null;
            }
        }
    }
}

/**
 * 座標のクラス
 */
class Sq {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    eq(other) {
        return this.x == other.x && this.y == other.y;
    }
}

function sq(x, y) {
    return new Sq(x, y);
}