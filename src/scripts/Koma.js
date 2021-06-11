/**
 * 駒のクラス
 */
class Koma {
  /**
   * コンストラクタ
   * @param {Boolean} isSente
   */
  constructor(isSente) {
    this.isSente = isSente;
    this.isNari_ = false;
    this.canNari_ = false;
    this.isWall_ = false;
    this.isEmpty_ = false;
    this.isKoma_ = false;
    this.init();
    if (!this.isSente) {
      this.sfen_ = this.sfen_.toLowerCase();
    }
  }

  /**
   * パラメータ初期化メソッド
   */
  init() {
    this.symbol_ = '';
    this.sfen_ = '';
  }

  /**
   * symbolのgetter
   */
  get symbol() {
    return this.symbol_;
  }

  /**
   * sfenのgetter
   */
  get sfen() {
    return this.sfen_;
  }

  /**
   * isNariのgetter
   */
  get isNari() {
    return this.isNari_;
  }

  /**
   * canNariのgetter
   */
  get canNari() {
    return this.canNari_;
  }

  /**
   * isWallのgetter
   */
  get isWall() {
    return this.isWall_;
  }

  /**
   * isEmptyのgetter
   */
  get isEmpty() {
    return this.isEmpty_;
  }

  /**
   * isKomaのgetter
   */
  get isKoma() {
    return this.isKoma_;
  }

  /**
   * 指定されたマスにある駒が敵の駒か調べるメソッド
   * @param {point} cmp
   * @param {Array} board
   * @return {Boolean}
   */
  isEnemy(cmp, board) {
    return this.isSente != board[cmp.x][cmp.y].isSente &&
      !board[cmp.x][cmp.y].isWall;
  }

  /**
   * 駒が移動できるマスのジェネレータ
   * @param {Int} x 選択した駒の筋
   * @param {Int} y 選択した駒の段
   * @param {Array} board 現在の盤の可変参照
   * @return {Generator}
   */
  pathGen(x, y, board) {
    if (this.isSente) {
      return this.__pathGen(x, y, board, (y, a) => {
        return y-a;
      });
    } else {
      return this.__pathGen(x, y, board, (y, a) => {
        return y+a;
      });
    }
  }

  /**
   * 駒を動かせるマスのジェネレータ
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
  }

  /**
   * 駒を置けるマスのジェネレータ
   * @param {Array} board 現在の盤の可変参照
   */
  * dropGen(board) {
    for (const x = 1; x <= 9; x++) {
      for (const y = 1; y <= 9; y++) {
        if (this.canDrop(board, point(x, y))) {
          yield point(x, y);
        }
      }
    }
  }

  /**
   * 指定された場所に駒を置けるかを調べるメソッド
   * @param {Array} board
   * @param {Point} p
   * @return {Boolean}
   */
  canDrop(board, p) {
    return board[p.x][p.y].isEmpty_;
  }
}

/**
 * 歩クラス
 */
class Fu extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'FU';
    this.sfen_ = 'P';
    this.canNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 成駒のインスタンスを生成する
   * @return {To}
   */
  createNari() {
    return new To(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    if (board[x][advance(y, 1)].isEmpty_ ||
    this.isEnemy(point(x, advance(y, 1)), board)) {
      yield point(x, advance(y, 1));
    }
  }

  /**
   * 駒を置けるマスのジェネレータを生成するメソッド
   * @param {Array} board
   */
  * dropGen(board) {
    for (let x = 1; x <= 9; x++) {
      if (board[x].some((e) => {
        return e.symbol == 'FU' && e.isSente == this.isSente;
      })) {
        continue;
      }
      for (let y = 1; y <= 9; y++) {
        if (board[x][y].isEmpty_) {
          if (this.isSente && y == 1 || !this.isSente && y == 9) {
            continue;
          } else {
            yield point(x, y);
          }
        }
      }
    }
  }

  /**
   * 指定された場所に駒を置けるかを調べるメソッド
   * @param {Array} board
   * @param {Point} p
   * @return {Boolean}
   */
  canDrop(board, p) {
    return super.canDrop(board, p) && !board[p.x].some((e) => {
      return e instanceof Fu && e.isSente == this.isSente;
    }) && !(this.isSente && p.y == 1 || !this.isSente && p.y == 9);
  }
}

/**
 * 香車クラス
 */
class Ky extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'KY';
    this.sfen_ = 'L';
    this.canNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 成駒のインスタンスを生成する
   * @return {Ny}
   */
  createNari() {
    return new Ny(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    for (let yTo = advance(y, 1); 1 <= yTo && yTo <= 9; yTo = advance(yTo, 1)) {
      if (board[x][yTo].isEmpty_) {
        yield point(x, yTo);
      } else if (this.isEnemy(point(x, yTo), board)) {
        yield point(x, yTo);
        break;
      } else {
        break;
      }
    }
  }

  /**
   * 指定された場所に駒を置けるかを調べるメソッド
   * @param {Array} board
   * @param {Point} p
   * @return {Boolean}
   */
  canDrop(board, p) {
    return super.canDrop(board, p) &&
      !(this.isSente && p.y == 1 || !this.isSente && p.y == 9);
  }
}

/**
 * 桂馬クラス
 */
class Ke extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'KE';
    this.sfen_ = 'N';
    this.canNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 成駒のインスタンスを生成する
   * @return {Nk}
   */
  createNari() {
    return new Nk(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    if (advance(y, 2) >= 1 && advance(y, 2) <= 9) {
      if (board[x - 1][advance(y, 2)].isEmpty_ ||
      this.isEnemy(point(x - 1, advance(y, 2)), board)) {
        yield point(x - 1, advance(y, 2));
      }
      if ((board[x + 1][advance(y, 2)].isEmpty_ ||
      this.isEnemy(point(x + 1, advance(y, 2)), board))) {
        yield point(x + 1, advance(y, 2));
      }
    }
  }

  /**
   * 指定された場所に駒を置けるかを調べるメソッド
   * @param {Array} board
   * @param {Point} p
   * @return {Boolean}
   */
  canDrop(board, p) {
    return super.canDrop(board, p) &&
      !(this.isSente && p.y <= 2 || !this.isSente && p.y >= 8);
  }
}

/**
 * 銀クラス
 */
class Gi extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'GI';
    this.sfen_ = 'S';
    this.canNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 成駒のインスタンスを生成するメソッド
   * @return {Ng}
   */
  createNari() {
    return new Ng(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    if (board[x - 1][advance(y, 1)].isEmpty_ ||
    this.isEnemy(point(x - 1, advance(y, 1)), board)) {
      yield point(x - 1, advance(y, 1));
    }
    if (board[x][advance(y, 1)].isEmpty_ ||
    this.isEnemy(point(x, advance(y, 1)), board)) {
      yield point(x, advance(y, 1));
    }
    if (board[x + 1][advance(y, 1)].isEmpty_ ||
    this.isEnemy(point(x + 1, advance(y, 1)), board)) {
      yield point(x + 1, advance(y, 1));
    }
    if (board[x - 1][advance(y, -1)].isEmpty_ ||
    this.isEnemy(point(x - 1, advance(y, -1)), board)) {
      yield point(x - 1, advance(y, -1));
    }
    if (board[x + 1][advance(y, -1)].isEmpty_ ||
    this.isEnemy(point(x + 1, advance(y, -1)), board)) {
      yield point(x + 1, advance(y, -1));
    }
  }
}

/**
 * 金クラス
 */
class Ki extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'KI';
    this.sfen_ = 'G';
    this.isKoma_ = true;
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    if (board[x - 1][advance(y, 1)].isEmpty_ ||
    this.isEnemy(point(x - 1, advance(y, 1)), board)) {
      yield point(x - 1, advance(y, 1));
    }
    if (board[x][advance(y, 1)].isEmpty_ ||
    this.isEnemy(point(x, advance(y, 1)), board)) {
      yield point(x, advance(y, 1));
    }
    if (board[x][advance(y, -1)].isEmpty_ ||
    this.isEnemy(point(x, advance(y, -1)), board)) {
      yield point(x, advance(y, -1));
    }
    if (board[x + 1][advance(y, 1)].isEmpty_ ||
    this.isEnemy(point(x + 1, advance(y, 1)), board)) {
      yield point(x + 1, advance(y, 1));
    }
    if (board[x - 1][y].isEmpty_ ||
    this.isEnemy(point(x - 1, y), board)) {
      yield point(x - 1, y);
    }
    if (board[x + 1][y].isEmpty_ ||
    this.isEnemy(point(x + 1, y), board)) {
      yield point(x + 1, y);
    }
  }
}

/**
 * 角クラス
 */
class Ka extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'KA';
    this.sfen_ = 'B';
    this.canNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 成駒のインスタンスを生成するメソッド
   * @return {Um}
   */
  createNari() {
    return new Um(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    for (let xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
  }
}

/**
 * 飛車クラス
 */
class Hi extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'HI';
    this.sfen_ = 'R';
    this.canNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 成駒のインスタンスを生成するメソッド
   * @return {Ry}
   */
  createNari() {
    return new Ry(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    for (let yTo = y - 1; yTo >= 1; yTo--) {
      if (board[x][yTo].isEmpty_) {
        yield point(x, yTo);
      } else if (this.isEnemy(point(x, yTo), board)) {
        yield point(x, yTo);
        break;
      } else {
        break;
      }
    }
    for (let yTo = y + 1; yTo <= 9; yTo++) {
      if (board[x][yTo].isEmpty_) {
        yield point(x, yTo);
      } else if (this.isEnemy(point(x, yTo), board)) {
        yield point(x, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x - 1; xTo >= 1; xTo--) {
      if (board[xTo][y].isEmpty_) {
        yield point(xTo, y);
      } else if (this.isEnemy(point(xTo, y), board)) {
        yield point(xTo, y);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x + 1; xTo <= 9; xTo++) {
      if (board[xTo][y].isEmpty_) {
        yield point(xTo, y);
      } else if (this.isEnemy(point(xTo, y), board)) {
        yield point(xTo, y);
        break;
      } else {
        break;
      }
    }
  }
}

/**
 * 王クラス
 */
class Ou extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'OU';
    this.sfen_ = 'K';
    this.isKoma_ = true;
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    if (board[x - 1][y + 1].isEmpty_ ||
    this.isEnemy(point(x - 1, y + 1), board)) {
      yield point(x - 1, y + 1);
    }
    if (board[x + 1][y + 1].isEmpty_ ||
    this.isEnemy(point(x + 1, y + 1), board)) {
      yield point(x + 1, y + 1);
    }
    if (board[x - 1][y - 1].isEmpty_ ||
    this.isEnemy(point(x - 1, y - 1), board)) {
      yield point(x - 1, y - 1);
    }
    if (board[x][y - 1].isEmpty_ ||
    this.isEnemy(point(x, y - 1), board)) {
      yield point(x, y - 1);
    }
    if (board[x][y + 1].isEmpty_ ||
    this.isEnemy(point(x, y + 1), board)) {
      yield point(x, y + 1);
    }
    if (board[x + 1][y - 1].isEmpty_ ||
    this.isEnemy(point(x + 1, y - 1), board)) {
      yield point(x + 1, y - 1);
    }
    if (board[x - 1][y].isEmpty_ ||
    this.isEnemy(point(x - 1, y), board)) {
      yield point(x - 1, y);
    }
    if (board[x + 1][y].isEmpty_ ||
    this.isEnemy(point(x + 1, y), board)) {
      yield point(x + 1, y);
    }
  }
}

/**
 * とクラス
 */
class To extends Ki {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'TO';
    this.sfen_ = '+P';
    this.isNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 元の駒のインスタンスを生成するメソッド
   * @return {Fu}
   */
  createNarazu() {
    return new Fu(this.isSente);
  }
}

/**
 * 成香クラス
 */
class Ny extends Ki {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'NY';
    this.sfen_ = '+L';
    this.isNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 元の駒のインスタンスを生成するメソッド
   * @return {Ky}
   */
  createNarazu() {
    return new Ky(this.isSente);
  }
}

/**
 * 成桂クラス
 */
class Nk extends Ki {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'NK';
    this.sfen_ = '+N';
    this.isNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 元の駒のインスタンスを生成するメソッド
   * @return {Ke}
   */
  createNarazu() {
    return new Ke(this.isSente);
  }
}

/**
 * 成銀クラス
 */
class Ng extends Ki {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'NG';
    this.sfen_ = '+S';
    this.isNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 元の駒のインスタンスを生成するメソッド
   * @return {Gi}
   */
  createNarazu() {
    return new Gi(this.isSente);
  }
}

/**
 * 馬クラス
 */
class Um extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'UM';
    this.sfen_ = '+B';
    this.isNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 元の駒のインスタンスを生成するメソッド
   * @return {Ka}
   */
  createNarazu() {
    return new Ka(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    for (let xTo = x - 1, yTo = y - 1; xTo >= 1 && yTo >= 1; xTo--, yTo--) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x + 1, yTo = y - 1; xTo <= 9 && yTo >= 1; xTo++, yTo--) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x - 1, yTo = y + 1; xTo >= 1 && yTo <= 9; xTo--, yTo++) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x + 1, yTo = y + 1; xTo <= 9 && yTo <= 9; xTo++, yTo++) {
      if (board[xTo][yTo].isEmpty_) {
        yield point(xTo, yTo);
      } else if (this.isEnemy(point(xTo, yTo), board)) {
        yield point(xTo, yTo);
        break;
      } else {
        break;
      }
    }
    if (board[x][y - 1].isEmpty_ || this.isEnemy(point(x, y - 1), board)) {
      yield point(x, y - 1);
    }
    if (board[x][y + 1].isEmpty_ || this.isEnemy(point(x, y + 1), board)) {
      yield point(x, y + 1);
    }
    if (board[x - 1][y].isEmpty_ || this.isEnemy(point(x - 1, y), board)) {
      yield point(x - 1, y);
    }
    if (board[x + 1][y].isEmpty_ || this.isEnemy(point(x + 1, y), board)) {
      yield point(x + 1, y);
    }
  }
}

/**
 * 龍クラス
 */
class Ry extends Koma {
  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = 'RY';
    this.sfen_ = '+R';
    this.isNari_ = true;
    this.isKoma_ = true;
  }

  /**
   * 元の駒のインスタンスを生成するメソッド
   * @return {Hi}
   */
  createNarazu() {
    return new Hi(this.isSente);
  }

  /**
   * 動けるマスのジェネレータを生成するメソッド
   * @param {Int} x
   * @param {Int} y
   * @param {Array} board
   * @param {Function} advance
   */
  * __pathGen(x, y, board, advance) {
    for (let yTo = y - 1; yTo >= 1; yTo--) {
      if (board[x][yTo].isEmpty_) {
        yield point(x, yTo);
      } else if (this.isEnemy(point(x, yTo), board)) {
        yield point(x, yTo);
        break;
      } else {
        break;
      }
    }
    for (let yTo = y + 1; yTo <= 9; yTo++) {
      if (board[x][yTo].isEmpty_) {
        yield point(x, yTo);
      } else if (this.isEnemy(point(x, yTo), board)) {
        yield point(x, yTo);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x - 1; xTo >= 1; xTo--) {
      if (board[xTo][y].isEmpty_) {
        yield point(xTo, y);
      } else if (this.isEnemy(point(xTo, y), board)) {
        yield point(xTo, y);
        break;
      } else {
        break;
      }
    }
    for (let xTo = x + 1; xTo <= 9; xTo++) {
      if (board[xTo][y].isEmpty_) {
        yield point(xTo, y);
      } else if (this.isEnemy(point(xTo, y), board)) {
        yield point(xTo, y);
        break;
      } else {
        break;
      }
    }
    if (board[x - 1][y - 1].isEmpty_ ||
    this.isEnemy(point(x - 1, y - 1), board)) {
      yield point(x - 1, y - 1);
    }
    if (board[x + 1][y - 1].isEmpty_ ||
    this.isEnemy(point(x + 1, y - 1), board)) {
      yield point(x + 1, y - 1);
    }
    if (board[x - 1][y + 1].isEmpty_ ||
    this.isEnemy(point(x - 1, y + 1), board)) {
      yield point(x - 1, y + 1);
    }
    if (board[x + 1][y + 1].isEmpty_ ||
    this.isEnemy(point(x + 1, y + 1), board)) {
      yield point(x + 1, y + 1);
    }
  }
}

/**
 * 空クラス
 */
class Empty extends Koma {
  /**
   * コンストラクタ
   */
  constructor() {
    super(false);
  }

  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = '';
    this.sfen_ = '';
    this.isEmpty_ = true;
  }
}

/**
 * 壁クラス
 */
class Wall extends Koma {
  /**
   * コンストラクタ
   */
  constructor() {
    super(false);
  }

  /**
   * 初期化処理
   */
  init() {
    this.symbol_ = '';
    this.sfen_ = '';
    this.isWall_ = true;
  }
}

export default {
  Fu, Ky, Ke, Gi, Ki, Ka, Hi, Ou, To, Ny, Nk, Ng, Um, Ry, Empty, Wall,
};
