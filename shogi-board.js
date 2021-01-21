const MODE = { BOOL: 0, POINT: 1, ITERATOR: 2 };
const BOARD_STATE = { NOTHING: 0, OUTE: 1, TUMI: 2, SENNICHITE: 3 };

class ShogiBoard {
    constructor() {
        /** 手番を先手番で初期化 */
        this.turn_ = true;
        this.moves_ = 0;
        /** 棋譜 */
        this.kifu_ = new Kifu();
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
            this.tegoma_[turn] = new Map();
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

    get moves() {
        return this.moves_;
    }

    get tegoma() {
        return this.tegoma_;
    }

    get kifu() {
        return this.kifu_;
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
        let ret = BOARD_STATE.NOTHING;
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

        this.moves_++;

        /** 千日手判定 */
        if (this.kifu_.update(from, to, koma, this.board_, this.tegoma_)) {
            ret = BOARD_STATE.SENNICHITE;
        }

        if (koma.symbol == "OU") {
            /** TODO: 動かした駒が王の時は，王座標を更新する */
            this.ou_[+koma.isSente].x = to.x;
            this.ou_[+koma.isSente].y = to.y;
        } else {
            /** 王以外を動かした場合は，王手の可能性がある */
            if (this.isOute(koma.isSente)) {
                /** 王手の時 */
                ret = BOARD_STATE.OUTE;
                if (this.isTumi(koma.isSente)) {
                    /** 詰みの時 */
                    ret = BOARD_STATE.TUMI;
                }
            }
        }
        return ret;
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
        let ret = !sandbox.isOute(!koma.isSente);
        if (ret) {
            ret &&= !(from.x == 0 && koma.symbol == "FU"
                && sandbox.isOute(koma.isSente) && sandbox.isTumi(koma.isSente));
        }
        return ret;
    }

    /**
     * 王手かを調べるメソッド
     * @param {Boolean} checkTurn 王手をかけているかを調べたい手番
     */
    isOute(checkTurn) {
        return this.searchKiller(this.ou_[+!checkTurn], checkTurn, MODE.BOOL);
    }

    /**
     * 詰み判定を行うメソッド
     * @param {Boolean} checkTurn 王手をかけている手番
     */
    isTumi(checkTurn) {
        var target = this.ou_[+!checkTurn];
        var ou = this.board_[target.x][target.y];
        for (var path of ou.pathGen(target.x, target.y, this.board_)) {
            /** 利きがない移動先がある場合は詰みではない */
            var tmp = this.board_[path.x][path.y];
            this.board_[path.x][path.y] = new Ou(!checkTurn);
            this.board_[target.x][target.y] = new Empty();
            if (!this.searchKiller(path, checkTurn, MODE.BOOL)) {
                this.board_[path.x][path.y] = tmp;
                this.board_[target.x][target.y] = new Ou(!checkTurn);
                return false;
            }
            this.board_[path.x][path.y] = tmp;
            this.board_[target.x][target.y] = new Ou(!checkTurn);
        }

        var guardIterList = this.searchKiller(target, checkTurn, MODE.ITERATOR);

        /** 両王手なら詰み */
        if (guardIterList.length >= 2) {
            return true;
        }
        /** 王手を回避することができるか */
        var tegoma = this.tegoma_[+!checkTurn];
        for (var guardPath of guardIterList[0]) {
            /** 手駒を用いて防ぐことができるか */
            if (this.board_[guardPath.x][guardPath.y].isEmpty) {
                for (var key in tegoma) {
                    if (tegoma[key].num > 0 &&
                    tegoma[key].koma.canDrop(this.board_, guardPath)) {
                        return false;
                    }
                }
            }
            /** 盤上の駒を移動させて防ぐことができるか */
            for (var guardPoint of this.searchKiller(guardPath, !checkTurn, MODE.POINT)) {
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

    searchKiller(target, checkTurn, mode=MODE.BOOL) {
        let ret;
        if (mode == MODE.BOOL) {
            ret = false;
        } else {
            ret = [];
        }

        /** 桂馬は，唯一の飛び駒なので，単独で処理する． */
        for (var path of new Ke(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            if (this.board_[path.x][path.y].isSente == checkTurn
            && this.board_[path.x][path.y].symbol == "KE") {
                switch (mode) {
                    case MODE.ITERATOR:
                        ret.push([path]);
                        break;
                    case MODE.POINT:
                        ret.push(path);
                        break;
                    default:
                        return true;
                }
            }
        }

        /** 隣接マスからの利きを調べる */
        for (var path of new Ou(!checkTurn).pathGen(target.x, target.y, this.board_)) {
            var killer = this.board_[path.x][path.y];
            for (var killerPath of killer.pathGen(path.x, path.y, this.board_)) {
                if (killerPath.eq(target)) {
                    switch (mode) {
                        case MODE.ITERATOR:
                            ret.push([path]);
                            break;
                        case MODE.POINT:
                            ret.push(path);
                            break;
                        default:
                            return true;
                    }
                }
            }
        }

        function accumulate(acc, result) {
            if (mode == MODE.BOOL) {
                return acc || result;
            } else {
                !!result && acc.push(result);
                return acc;
            }
        }

        /** 離れたマスからの利きを調べる */
        ret = accumulate(ret, this.searchKillerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y-i;}, mode));
        ret = accumulate(ret, this.searchKillerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y-i;}, mode));
        ret = accumulate(ret, this.searchKillerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y+i;}, mode));
        ret = accumulate(ret, this.searchKillerSub(target, ["KA", "UM"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y+i;}, mode));

        ret = accumulate(ret, this.searchKillerSub(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x-i;}, (y, i)=>{return y;}, mode));
        ret = accumulate(ret, this.searchKillerSub(target, ["HI", "RY"], checkTurn
            , (x, i)=>{return x+i;}, (y, i)=>{return y;}, mode));

        if (checkTurn) {
            ret = accumulate(ret, this.searchKillerSub(target, ["HI", "RY", "KY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y+i;}, mode));
            ret = accumulate(ret, this.searchKillerSub(target, ["HI", "RY"], true
                , (x, i)=>{return x;}, (y, i)=>{return y-i;}, mode));
        } else {
            ret = accumulate(ret, this.searchKillerSub(target, ["HI", "RY", "KY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y-i;}, mode));
            ret = accumulate(ret, this.searchKillerSub(target, ["HI", "RY"], false
                , (x, i)=>{return x;}, (y, i)=>{return y+i;}, mode));
        }
        return ret;
    }

    searchKillerSub(target, checkList, checkTurn, updateX, updateY
    , mode=MODE.BOOL) {
        let iter = [];
        search:
        for (var dif = 1; ; dif++) {
            var x = updateX(target.x, dif);
            var y = updateY(target.y, dif);
            var killer = this.board_[x][y];
            if (mode == MODE.ITERATOR) {
                iter.push(point(x, y));
            }
            if (killer.isEmpty) {
                continue;
            }
            /** 壁か，調べたい手盤ではない駒にたどり着いた場合 */
            if (killer.isWall || (killer.isSente != checkTurn)) {
                switch (mode) {
                    case MODE.ITERATOR:
                        return null;
                    case MODE.POINT:
                        return null;
                    default:
                        return false;
                }
            }
            /** 隣接ゴマからの利きの場合 */
            if (dif == 1) {
                switch (mode) {
                    case MODE.ITERATOR:
                        return null;
                    case MODE.POINT:
                        return null;
                    default:
                        return false;
                }
            }
            /** 引数で与えられたチェックリストに存在する駒の場合 */
            for (var check of checkList) {
                if (killer.symbol == check) {
                    switch (mode) {
                        case MODE.ITERATOR:
                            break search;
                        case MODE.POINT:
                            return point(x, y);
                        default:
                            return true;
                    }
                }
            }
            /** チェックリストにない駒にたどり着いた場合 */
            switch (mode) {
                case MODE.ITERATOR:
                    return null;
                case MODE.POINT:
                    return null;
                default:
                    return false;
            }
        }
        /** ITERATORモードのみ */
        return iter;
    }
}
