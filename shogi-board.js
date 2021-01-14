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
            this.tegoma_[turn]["KI"] = { koma: new Ki(turn == SENTE), num: 0 };
            this.tegoma_[turn]["HI"] = { koma: new Hi(turn == SENTE), num: 0 };
            this.tegoma_[turn]["KA"] = { koma: new Ka(turn == SENTE), num: 0 };
        }
    
        this.board_[1][1] = new Ky(false);
        this.board_[2][1] = new Ke(false);
        this.board_[3][1] = new Gi(false);
        this.board_[4][1] = new Ki(false);
        this.board_[5][1] = new Ou(false);
        this.board_[6][1] = new Ki(false);
        this.board_[7][1] = new Gi(false);
        this.board_[8][1] = new Ke(false);
        this.board_[9][1] = new Ky(false);
        this.board_[8][2] = new Hi(false);
        this.board_[2][2] = new Ka(false);
        this.board_[1][9] = new Ky(true);
        this.board_[2][9] = new Ke(true);
        this.board_[3][9] = new Gi(true);
        this.board_[4][9] = new Ki(true);
        this.board_[5][9] = new Ou(true);
        this.board_[6][9] = new Ki(true);
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

    sandbox() {
        let sandbox = new ShogiBoard();
        sandbox.turn_ = this.turn_;
        sandbox.ou_[SENTE] = this.ou_[SENTE].sandbox();
        sandbox.ou_[GOTE] = this.ou_[GOTE].sandbox();
        for (var x = 1; x <= 9; x++) {
            for (var y = 1; y <= 9; y++) {
                sandbox.board_[x][y] = this.board_[x][y];
            }
        }
        for (var turn = 0; turn <= 1; turn++) {
            for (var koma in this.tegoma_[turn]) {
                sandbox.tegoma_[turn][koma].num = this.tegoma_[turn][koma].num;
            }
        }
        return sandbox;
    }

    rotateTurn() {
        this.turn_ = !this.turn_;
    }

    move(from, to, afterKoma) {
        if (from.x != 0) {
            this.board_[from.x][from.y] = new Empty();
        } else {
            this.tegoma_[+this.turn_][afterKoma.symbol].num--;
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
            this.isLookedAt(this.ou_[+!afterKoma.isSente], afterKoma.isSente);
        }

        // 棋譜を保存
        var csaMove;
        if (this.turn_ == SENTE) { csaMove = "+"; } else { csaMove = "-"; }
        csaMove = csaMove + from.x + from.y + afterKoma.symbol;
        this.csaData_.push(csaMove);
    }

    canMove(from, to, afterKoma) {
        let sandbox = this.sandbox();
        sandbox.move(from, to, afterKoma);
        return !sandbox.isLookedAt(sandbox.ou_[+afterKoma.isSente], !afterKoma.isSente);
    }

    /**
     * 指定した座標に指定した駒が利いているかを調べるメソッド
     * @param {Sq} target 駒の利きを調べたいマス
     * @param {Array} checkList 探索する駒のリスト
     * @param {Boolean} checkTurn 探索する駒の手盤
     * @param {Function} updateX 探索時にxの値を更新するための関数オブジェクト
     * @param {Function} updateY 探索時にyの値を更新するための関数オブジェクト
     * @return {Boolean} 利いているか
     */
    isLookedAtBy(target, checkList, checkTurn, updateX, updateY) {
        for (var dif = 1; ; dif++) {
            var x = updateX(target.x, dif);
            var y = updateY(target.y, dif);
            var killer = this.board_[x][y];
            if (killer.isEmpty) {
                continue;
            }
            /** 壁か，調べたい手盤ではない駒にたどり着いた場合はbreak */
            if (killer.isWall || (killer.isSente != checkTurn)) {
                return false;
            }
            /** 引数で与えられたチェックリストに存在する駒の場合座標をreturn */
            for (var check of checkList) {
                if (killer.symbol == check) {
                    return true;
                }
            }
            /** チェックリストにない駒にたどり着いた場合はreturn */
            if (killer.isKoma) {
                return false;
            }
        }
    }

    /**
     * 指定されたマスに，敵駒からの利きがあるかを調べる関数
     * @param {Sq} target 駒の利きを調べたいマス
     * @param {Boolean} checkTurn 探索する駒の手盤
     */
    isLookedAt(target, checkTurn) {
        /** 桂馬は，唯一の飛び駒なので，単独で処理する． */
        for (var path of new Ke(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            if (this.board_[path.x][path.y].isSente == checkTurn
            && this.board_[path.x][path.y].symbol == "KE") {
                return true;
            }
        }

        /** 隣接マスからの利きを調べる */
        for (var path of new Ou(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            var killer = this.board_[path.x][path.y];
            for (var killerPath of killer.pathGen(path.x, path.y, this.board_)) {
                if (killerPath.eq(target)) {
                    return true;
                }
            }
        }

        /** 離れたマスからの利きを調べる */
        var ret = false;
        ret ||= this.isLookedAtBy(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y-i;});
        ret ||= this.isLookedAtBy(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y-i;});
        ret ||= this.isLookedAtBy(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y+i;});
        ret ||= this.isLookedAtBy(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y+i;});

        ret ||= this.isLookedAtBy(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y;});
        ret ||= this.isLookedAtBy(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y;});

        if (checkTurn) {
            ret ||= this.isLookedAtBy(target, ["HI", "RY", "KY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y+i;});
            ret ||= this.isLookedAtBy(target, ["HI", "RY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y-i;});
        } else {
            ret ||= this.isLookedAtBy(target, ["HI", "RY", "KY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y-i;});
            ret ||= this.isLookedAtBy(target, ["HI", "RY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y+i;});
        }
        return ret;
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

    sandbox() {
        return new Sq(this.x, this.y);
    }
}

function sq(x, y) {
    return new Sq(x, y);
}