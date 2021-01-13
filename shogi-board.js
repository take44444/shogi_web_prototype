class ShogiBoard {
    constructor() {
        this.turn_ = true;
        this.csaData_ = [];
        this.board_ = [];
        this.tegoma_ = [];
        this.ouSquare_ = [];
        this.ouSquare_[SENTE] = { x: 5, y: 9 };
        this.ouSquare_[GOTE] = { x: 5, y: 1 };
    
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

        // 棋譜を保存
        var csaMove;
        if (this.turn_ == SENTE) { csaMove = "+"; } else { csaMove = "-"; }
        csaMove = csaMove + from.x + from.y + afterKoma.symbol;
        this.csaData_.push(csaMove);
    }
}