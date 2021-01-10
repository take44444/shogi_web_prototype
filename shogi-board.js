class ShogiBoard {
    constructor(turn) {
        this.sente_ = turn;
        this.turn_ = turn;
        this.csaData_ = [];
        this.board_ = [];
        this.tegoma_ = [];
    
        for (var x = 0; x <= 10; x++) {
            this.board_[x] = [];
            for (var y = 0; y <= 10; y++) {
                if (x == 0 || x == 10 || y == 0 || y == 10) {
                    this.board_[x][y] = OUT_OF_BOARD;
                } else {
                    this.board_[x][y] = EMPTY;
                }
            }
        }
    
        for (var turn = 0; turn <= 1; turn++) {
            this.tegoma_[turn] = [];
            for (var koma = 0; koma <= HI; koma++) {
                this.tegoma_[turn][koma] = 0;
            }
        }
    
        this.board_[1][1] = EKY;
        this.board_[2][1] = EKE;
        this.board_[3][1] = EGI;
        this.board_[4][1] = EKI;
        this.board_[5][1] = EOU;
        this.board_[6][1] = EKI;
        this.board_[7][1] = EGI;
        this.board_[8][1] = EKE;
        this.board_[9][1] = EKY;
        this.board_[8][2] = EHI;
        this.board_[2][2] = EKA;
        this.board_[1][9] = KY;
        this.board_[2][9] = KE;
        this.board_[3][9] = GI;
        this.board_[4][9] = KI;
        this.board_[5][9] = OU;
        this.board_[6][9] = KI;
        this.board_[7][9] = GI;
        this.board_[8][9] = KE;
        this.board_[9][9] = KY;
        this.board_[2][8] = HI;
        this.board_[8][8] = KA;
        for (var i = 1; i <= 9; i++) {
            this.board_[i][3] = EFU;
            this.board_[i][7] = FU;
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

    move(from, to, after) {
        if (from.x != 0) {
            this.board_[from.x][from.y] = EMPTY;
        } else {
            this.tegoma[+this.turn][after & ~ENEMY]--;
        }
        if (this.board_[to.x][to.y] != EMPTY) {
            this.tegoma_[+this.turn_][this.board_[to.x][to.y] & ~ENEMY & ~NARI]++;
        }
        this.board_[to.x][to.y] = after;

        // 棋譜を保存
        var csaMove;
        if (this.turn_ == this.sente_) { csaMove = "+"; } else { csaMove = "-"; }
        csaMove = csaMove + from.x + from.y;
        if (after == FU || after == EFU) {
            csaMove += "FU";
        } else if (after == KY || after == EKY) {
            csaMove += "KY";
        } else if (after == KE || after == EKE) {
            csaMove += "KE";
        } else if (after == GI || after == EGI) {
            csaMove += "GI";
        } else if (after == KI || after == EKI) {
            csaMove += "KI";
        } else if (after == OU || after == EOU) {
            csaMove += "OU";
        } else if (after == HI || after == EHI) {
            csaMove += "HI";
        } else if (after == KA || after == EKA) {
            csaMove += "KA";
        } else if (after == RY || after == ERY) {
            csaMove += "RY";
        } else if (after == UM || after == EUM) {
            csaMove += "UM";
        }
        this.csaData_.push(csaMove);
    }
}