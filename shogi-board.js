class ShogiBoard {
    constructor() {
        /** 手番を先手番で初期化 */
        this.turn_ = true;
        /** 棋譜 */
        this.csaData_ = [];
        /** 盤面 */
        this.board_ = [];
        /** 手駒 */
        this.tegoma_ = [];
        /** TODO: 王の位置 */
        this.ou_ = [];
        this.ou_[SENTE] = point(5, 9);
        this.ou_[GOTE] = point(5, 1);
        /** TODO: 持将棋判定用のカウンターを用意 */

        /** 壁と空マスで盤面を初期化 */
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

        /** 全ての手駒の数を0で初期化 */
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

        /** 平手時の初期盤面配置 */
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

    /**
     * 反則手判定のために使用するテスト環境を作るメソッド
     * @return {ShogiBoard} テスト環境（ほぼクローン）
     */
    sandbox() {
        let sandbox = new ShogiBoard();
        sandbox.turn_ = this.turn_;
        sandbox.ou_[SENTE] = this.ou_[SENTE].clone();
        sandbox.ou_[GOTE] = this.ou_[GOTE].clone();
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

    /**
     * 手番を変更するメソッド
     */
    rotateTurn() {
        this.turn_ = !this.turn_;
    }

    /**
     * 手を指すためのメソッド
     * @param {Point} from 移動元
     * @param {Point} to 移動先
     * @param {Koma} koma 駒
     */
    move(from, to, koma) {
        if (from.x != 0) {
            /** 盤上の駒を動かした場合は移動元のマスを空にする */
            this.board_[from.x][from.y] = new Empty();
        } else {
            /** 手駒から打った場合は手駒の数を減らす */
            this.tegoma_[+this.turn_][koma.symbol].num--;
        }
        /** 移動先のマスに敵の駒がある場合 */
        if (!this.board_[to.x][to.y].isEmpty) {
            if (this.board_[to.x][to.y].isNari) {
                /** 取る駒が，成っている駒の場合 */
                this.tegoma_[+this.turn_][this.board_[to.x][to.y].createNarazu().symbol].num++;
            } else {
                /** 取る駒が，成ってない駒の場合 */
                this.tegoma_[+this.turn_][this.board_[to.x][to.y].symbol].num++;
            }
        }
        /** 移動先のマスに駒を設置 */
        this.board_[to.x][to.y] = koma;

        if (koma.symbol == "OU") {
            /** TODO: 動かした駒が王の時は，王座標を更新する */
            this.ou_[+koma.isSente].x = to.x;
            this.ou_[+koma.isSente].y = to.y;
        } else {
            /** 王以外を動かした場合は，王手の可能性がある */
            if (this.isOute(koma.isSente)) {
                /** 王手の時 */
                console.log("oute!");
                if (this.isTumi(koma.isSente)) {
                    /** 詰みの時 */
                    console.log("tumi!");
                }
            }
        }

        /** 棋譜を保存 */
        var csaMove;
        /** CSA形式に従う */
        if (this.turn_ == SENTE) { csaMove = "+"; } else { csaMove = "-"; }
        csaMove = csaMove + from.x + from.y + koma.symbol;
        this.csaData_.push(csaMove);
    }

    /**
     * 駒を指定通りに動かすことができるかを調べるメソッド
     * @param {Point} from 移動元
     * @param {Point} to 移動先
     * @param {Koma} koma 駒
     * @return {Boolean} 動かせるか
     */
    canMove(from, to, koma) {
        /** テスト環境を用意 */
        let sandbox = this.sandbox();
        /** テスト環境上で指す */
        sandbox.move(from, to, koma);
        /** テスト環境上で指した後に自玉に王手がかかっている場合はその手は指せない */
        return !sandbox.isOute(!koma.isSente);
    }

    /**
     * 王手かを調べるメソッド
     * @param {Boolean} checkTurn 王手をかけているかを調べたい手番
     */
    isOute(checkTurn) {
        return this.isLookedAt(this.ou_[+!checkTurn], checkTurn);
    }

    /**
     * 指定した座標に指定した駒が遠くから利いているかを調べるメソッド
     * @param {Point} target 駒の利きを調べたいマス
     * @param {Array} checkList 探索する駒のリスト
     * @param {Boolean} checkTurn 探索する駒の手盤
     * @param {Function} updateX 探索時にxの値を更新するための関数オブジェクト
     * @param {Function} updateY 探索時にyの値を更新するための関数オブジェクト
     * @return {Boolean} 利いているか
     */
    isLookedAtSub(target, checkList, checkTurn, updateX, updateY) {
        for (var dif = 1; ; dif++) {
            var x = updateX(target.x, dif);
            var y = updateY(target.y, dif);
            var killer = this.board_[x][y];
            if (killer.isEmpty) {
                continue;
            }
            /** 壁か，調べたい手盤ではない駒にたどり着いた場合はfalse */
            if (killer.isWall || (killer.isSente != checkTurn)) {
                return false;
            }
            /** 隣接ゴマからの利きの場合はfalse */
            if (dif == 1) {
                return false;
            }
            /** 引数で与えられたチェックリストに存在する駒の場合座標をtrue */
            for (var check of checkList) {
                if (killer.symbol == check) {
                    return true;
                }
            }
            /** チェックリストにない駒にたどり着いた場合はfalse */
            return false;
        }
    }

    /**
     * 指定されたマスに，敵駒からの利きがあるかを調べる関数
     * @param {Point} target 駒の利きを調べたいマス
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
        ret ||= this.isLookedAtSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y-i;});
        ret ||= this.isLookedAtSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y-i;});
        ret ||= this.isLookedAtSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y+i;});
        ret ||= this.isLookedAtSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y+i;});

        ret ||= this.isLookedAtSub(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y;});
        ret ||= this.isLookedAtSub(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y;});

        if (checkTurn) {
            ret ||= this.isLookedAtSub(target, ["HI", "RY", "KY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y+i;});
            ret ||= this.isLookedAtSub(target, ["HI", "RY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y-i;});
        } else {
            ret ||= this.isLookedAtSub(target, ["HI", "RY", "KY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y-i;});
            ret ||= this.isLookedAtSub(target, ["HI", "RY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y+i;});
        }
        return ret;
    }

    /**
     * 詰み判定を行うメソッド
     * @param {Boolean} checkTurn 王手をかけている手番
     */
    isTumi(checkTurn) {
        var target = this.ou_[+!checkTurn];
        var ou = this.board_[target.x][target.y];
        var ouCanMove = false;
        for (var path of ou.pathGen(target.x, target.y, this.board_)) {
            /** 利きがない移動先がある場合は詰みではない */
            if (!this.isLookedAt(path, checkTurn)) {
                return false;
            }
            ouCanMove = true;
        }

        var guardIterList = [];
        /** 桂馬は，唯一の飛び駒なので，単独で処理する． */
        for (var path of new Ke(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            if (this.board_[path.x][path.y].isSente == checkTurn
            && this.board_[path.x][path.y].symbol == "KE") {
                guardIterList.push([path]);
            }
        }

        /** 隣接マスからの利きを調べる */
        for (var path of new Ou(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            var killer = this.board_[path.x][path.y];
            for (var killerPath of killer.pathGen(path.x, path.y, this.board_)) {
                if (killerPath.eq(target)) {
                    guardIterList.push([path]);
                    break;
                }
            }
        }

        /** 離れたマスからの利きを調べる */
        if (this.isLookedAtSub(target, ["KA", "UM"], checkTurn
        , (x, i)=>{return x-i;}, (y, i)=>{return y-i;})) {
            guardIterList.push(
                this.guardOuGen(target, (x, i)=>{return x-i;}, (y, i)=>{return y-i;})
            );
        }
        if (this.isLookedAtSub(target, ["KA", "UM"], checkTurn
        , (x, i)=>{return x+i;}, (y, i)=>{return y-i;})) {
            guardIterList.push(
                this.guardOuGen(target, (x, i)=>{return x+i;}, (y, i)=>{return y-i;})
            );
        }
        if (this.isLookedAtSub(target, ["KA", "UM"], checkTurn
        , (x, i)=>{return x-i;}, (y, i)=>{return y+i;})) {
            guardIterList.push(
                this.guardOuGen(target, (x, i)=>{return x-i;}, (y, i)=>{return y+i;})
            );
        }
        if (this.isLookedAtSub(target, ["KA", "UM"], checkTurn
        , (x, i)=>{return x+i;}, (y, i)=>{return y+i;})) {
            guardIterList.push(
                this.guardOuGen(target, (x, i)=>{return x+i;}, (y, i)=>{return y+i;})
            );
        }

        if (this.isLookedAtSub(target, ["HI", "RY"], checkTurn
        , (x, i)=>{return x-i;}, (y, i)=>{return y;})) {
            guardIterList.push(
                this.guardOuGen(target, (x, i)=>{return x-i;}, (y, i)=>{return y;})
            );
        }
        if (this.isLookedAtSub(target, ["HI", "RY"], checkTurn
        , (x, i)=>{return x+i;}, (y, i)=>{return y;})) {
            guardIterList.push(
                this.guardOuGen(target, (x, i)=>{return x+i;}, (y, i)=>{return y;})
            );
        }

        if (checkTurn) {
            if (this.isLookedAtSub(target, ["HI", "RY", "KY"], true
            , (x, i)=>{return x;}, (y, i)=>{return y+i;})) {
                guardIterList.push(
                    this.guardOuGen(target, (x, i)=>{return x;}, (y, i)=>{return y+i;})
                );
            }
            if (this.isLookedAtSub(target, ["HI", "RY"], true
            , (x, i)=>{return x;}, (y, i)=>{return y-i;})) {
                guardIterList.push(
                    this.guardOuGen(target, (x, i)=>{return x;}, (y, i)=>{return y-i;})
                );
            }
        } else {
            if (this.isLookedAtSub(target, ["HI", "RY", "KY"], false
            , (x, i)=>{return x;}, (y, i)=>{return y-i;})) {
                guardIterList.push(
                    this.guardOuGen(target, (x, i)=>{return x;}, (y, i)=>{return y-i;})
                );
            }
            if (this.isLookedAtSub(target, ["HI", "RY"], false
            , (x, i)=>{return x;}, (y, i)=>{return y+i;})) {
                guardIterList.push(
                    this.guardOuGen(target, (x, i)=>{return x;}, (y, i)=>{return y+i;})
                );
            }
        }
        /** 王の移動先がなく，両王手なら詰み */
        if (!ouCanMove && guardIterList.length >= 2) {
            return true;
        }
        /** 王手を回避することができるか */
        for (var guardPath of guardIterList[0]) {
            /** 手駒を用いて防ぐことができるか */
            if (this.board_[guardPath.x][guardPath.y].isEmpty) {
                for (var koma in this.tegoma_[+!checkTurn]) {
                    if ((this.tegoma_[+!checkTurn][koma].num > 0)
                    && !((koma == "FU" && guardPath.y == (checkTurn?9:1))
                    || (koma == "KY" && guardPath.y == (checkTurn?9:1))
                    || (koma == "KE" && guardPath.y >= 8 && checkTurn)
                    || (koma == "KE" && guardPath.y <= 2 && !checkTurn))) {
                        return false;
                    }
                }
            }
            /** 盤上の駒を移動させて防ぐことができるか */
            for (var guardPoint of this.killer(guardPath, !checkTurn)) {
                var guard = this.board_[guardPoint.x][guardPoint.y];
                /** その場所に動かした時，自分の王様に利きがないかを調べる */
                if (canNari(guard, guardPoint.x, guardPoint.y)
                || canNari(guard, guardPath.x, guardPath.y)) {
                    if (this.canMove(guardPoint, guardPath, guard.createNari())) {
                        return false;
                    }
                } else if (this.canMove(guardPoint, guardPath, guard)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 指定した駒の利きを防ぐマスのジェネレータ
     * @param {Point} target 利きを調べるマス
     * @param {Function} updateX 探索時にxの値を更新するための関数オブジェクト
     * @param {Function} updateY 探索時にyの値を更新するための関数オブジェクト
     * @return {Boolean} 利いているか
     */
    *guardOuGen(target, updateX, updateY) {
        for (var dif = 1; ; dif++) {
            var x = updateX(target.x, dif);
            var y = updateY(target.y, dif);
            var killer = this.board_[x][y];
            yield point(x, y);
            if (killer.isEmpty) {
                continue;
            } else {
                break;
            }
        }
    }

    /**
     * 指定されたマスに，利いている駒のマスを取得するメソッド
     * @param {Point} target 駒の利きを調べたいマス
     * @param {Boolean} checkTurn 探索する駒の手盤
     * @return {Array} 駒のマス
     */
    killer(target, checkTurn) {
        let ret = [];
        /** 桂馬は，唯一の飛び駒なので，単独で処理する． */
        for (var path of new Ke(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            if (this.board_[path.x][path.y].isSente == checkTurn
            && this.board_[path.x][path.y].symbol == "KE") {
                ret.push(path);
            }
        }

        /** 隣接マスからの利きを調べる */
        for (var path of new Ou(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            var killer = this.board_[path.x][path.y];
            for (var killerPath of killer.pathGen(path.x, path.y, this.board_)) {
                if (killerPath.eq(target)) {
                    ret.push(path);
                    break;
                }
            }
        }

        /** 離れたマスからの利きを調べる */
        ret = ret.concat(this.killerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y-i;}));
        ret = ret.concat(this.killerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y-i;}));
        ret = ret.concat(this.killerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y+i;}));
        ret = ret.concat(this.killerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y+i;}));

        ret = ret.concat(this.killerSub(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y;}));
        ret = ret.concat(this.killerSub(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y;}));

        if (checkTurn) {
            ret = ret.concat(this.killerSub(target, ["HI", "RY", "KY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y+i;}));
            ret = ret.concat(this.killerSub(target, ["HI", "RY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y-i;}));
        } else {
            ret = ret.concat(this.killerSub(target, ["HI", "RY", "KY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y-i;}));
            ret = ret.concat(this.killerSub(target, ["HI", "RY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y+i;}));
        }
        return ret;
    }

    /**
     * 指定した座標に指定した駒が遠くから利いている駒のマスを取得するメソッド
     * @param {Point} target 駒の利きを調べたいマス
     * @param {Array} checkList 探索する駒のリスト
     * @param {Boolean} checkTurn 探索する駒の手盤
     * @param {Function} updateX 探索時にxの値を更新するための関数オブジェクト
     * @param {Function} updateY 探索時にyの値を更新するための関数オブジェクト
     * @return {Array} 駒のマス
     */
    killerSub(target, checkList, checkTurn, updateX, updateY) {
        for (var dif = 1; ; dif++) {
            var x = updateX(target.x, dif);
            var y = updateY(target.y, dif);
            var killer = this.board_[x][y];
            if (killer.isEmpty) {
                continue;
            }
            /** 壁か，調べたい手盤ではない駒にたどり着いた場合 */
            if (killer.isWall || (killer.isSente != checkTurn)) {
                return [];
            }
            /** 隣接ゴマからの利きの場合 */
            if (dif == 1) {
                return [];
            }
            /** 引数で与えられたチェックリストに存在する駒の場合 */
            for (var check of checkList) {
                if (killer.symbol == check) {
                    return [point(x, y)];
                }
            }
            /** チェックリストにない駒にたどり着いた場合 */
            return [];
        }
    }
}
