/**
 * 駒の位置情報を保持するクラス
 */
class KomaPositions {
    constructor() {
        for (var turn = 0; turn <= 1; turn++) {
            this.positions_[turn] = {};
            this.positions_[turn]["FU"] = [];
            this.positions_[turn]["TO"] = [];
            this.positions_[turn]["KY"] = [];
            this.positions_[turn]["NY"] = [];
            this.positions_[turn]["KE"] = [];
            this.positions_[turn]["NK"] = [];
            this.positions_[turn]["GI"] = [];
            this.positions_[turn]["NG"] = [];
            this.positions_[turn]["KI"] = [];
            this.positions_[turn]["KA"] = [];
            this.positions_[turn]["UM"] = [];
            this.positions_[turn]["HI"] = [];
            this.positions_[turn]["RY"] = [];
            this.positions_[turn]["OU"] = [];
        }
        this.board_ = [];
        this.tegoma_ = [];
        for (var turn = 0; turn <= 1; turn++) {
            this.tegoma_[turn] = {};
            this.tegoma_[turn]["FU"] = 0;
            this.tegoma_[turn]["KY"] = 0;
            this.tegoma_[turn]["KE"] = 0;
            this.tegoma_[turn]["GI"] = 0;
            this.tegoma_[turn]["KI"] = 0;
            this.tegoma_[turn]["HI"] = 0;
            this.tegoma_[turn]["KA"] = 0;
        }
    }

    move(from, to, afterKoma, capturedKoma) {
        /** 移動元の座標情報を削除 */
        if (from.x == 0) {
            this.tegoma_[+afterKoma.isSente][afterKoma.symbol]--;
        } else {
            this.positions_[+afterKoma.isSente][afterKoma.symbol]
                = this.positions_[+afterKoma.isSente][afterKoma.symbol]
                .filter(e=>{return !e.eq(from);});
        }
        if (afterKoma.isNari) {
            var komaNarazu = afterKoma.createNarazu();
            this.positions_[+afterKoma.isSente][komaNarazu.symbol]
                = this.positions_[+afterKoma.isSente][komaNarazu.symbol]
                .filter(e=>{return !e.eq(from);});
        }
        /** 移動先に駒があった場合 */
        if (!capturedKoma.isEmpty) {
            /** 取られた駒の座標情報を削除 */
            this.positions_[+capturedKoma.isSente][capturedKoma.symbol]
                = this.positions_[+capturedKoma.isSente][capturedKoma.symbol]
                .filter(e=>{return !e.eq(to);});
            /** 手駒情報を追加 */
            this.tegoma_[+!capturedKoma.isSente][capturedKoma.symbol]++;
        }
        /** 移動先の座標情報を追加 */
        this.positions_[+afterKoma.isSente][afterKoma.symbol].push(to);
    }

    preprocess() {

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