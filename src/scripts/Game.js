import React from 'react';
import Piece from './components/Piece';
import ShogiBoard from './ShogiBoard';
import {Fu, Ky, Ke} from './Koma';
import {point, komaToComponent} from './utils';

/**
 * 自分の陣地ないか否かをBooleanで返す関数
 * @param {Number} x 盤における筋
 * @param {Number} y 盤における段
 * @return {Boolean} 引数で与えられたマスが自分の陣地内の場合はtrue，違う場合はfalseを返す
 */
function isSenteArea(x, y) {
  return (7 <= y && y <= 9 && 1 <= x && x <= 9);
}

/**
* 敵の陣地ないか否かをBooleanで返す関数
* @param {Number} x 盤における筋
* @param {Number} y 盤における段
* @return {Boolean} 引数で与えられたマスが敵の陣地内の場合はtrue，違う場合はfalseを返す
*/
function isGoteArea(x, y) {
  return (1 <= y && y <= 3 && 1 <= x && x <= 9);
}

/**
* 与えられた駒がそのマスに移動した時に成れるか否かをBooleanで返す関数
* @param {Number} koma 駒を表す数値
* @param {Number} x 盤における筋
* @param {Number} y 盤における段
* @return {Boolean} 引数で与えられた駒が，そのマスに移動した時に成れる場合はtrue，違う場合はfalseを返す
*/
function canNari(koma, x, y) {
  return (koma.canNari &&
  ((koma.isSente && isGoteArea(x, y)) || (!koma.isSente && isSenteArea(x, y))));
}

/**
 * 与えられた駒がそのマスに移動したときに成らずを選択できるか否かをBooleanで返す関数
 * @param {Number} koma 駒を表す数値
 * @param {Number} y 盤における段
 * @return {Boolean} 引数で与えられた駒が，そのマスに移動した時に成らずを選択できる場合はtrue，違う場合はfalseを返す
 */
function canNarazu(koma, y) {
  return !((koma instanceof Ke && koma.isSente && y <= 2) ||
  (koma instanceof Ky && koma.isSente && y == 1) ||
  (koma instanceof Fu && koma.isSente && y == 1) ||
  (koma instanceof Ke && !koma.isSente && y >= 8) ||
  (koma instanceof Ky && !koma.isSente && y == 9) ||
  (koma instanceof Fu && !koma.isSente && y == 9));
}

/**
 * ゲームクラス
 */
class Game {
  /**
   * コンストラクタ
   * @param {Function} handleChange 将棋盤イベントハンドラ
   * @param {Object} order 自分が先手か後手か
   */
  constructor(handleChange, order) {
    this.shogiBoard = new ShogiBoard(),
    this.order = order;
    this.gameState = {
      boardState: {
        board: [],
        myTegoma: [],
        yourTegoma: [],
      },
      verify: false,
      history: [],
      events: [],
    };
    this.handleChange = handleChange;
    this.handleChange(this.gameState);
  };

  /**
   * 指し手を一度行う
   * @param {String} code 指し手の情報
   */
  move(code) {
    // 何らかの処理
    this.setCurrentBoard();
    // 何らかの処理
    this.handleChange(this.gameState);
  };

  /**
   * 駒をアクティブ(選択状態)にする
   * @param {String} code
   */
  getActive(code) {
    if (code === null) {
      this.setCurrentBoard();
      this.handleChange(this.gameState);
      return;
    }
    let koma;
    /** 手駒が選択されたとき */
    if (code.startsWith('0')) {
      const index = code[1];
      koma = this.shogiBoard.tegoma[+this.order][code.substr(2, 2)].koma;
      this.setDrop(koma, index);
      this.handleChange(this.gameState);
      return;
    }
    /** ボード上の駒が選択されたとき */
    const x = Number(code[0]);
    const y = Number(code[1]);
    koma = this.shogiBoard.board[x][y];
    this.setPath(koma, x, y);
    this.handleChange(this.gameState);
  };

  /**
   * 駒を現在打つことができるマスを示す
   * @param {Koma} koma
   * @param {String} index
   */
  setDrop(koma, index) {
    for (const path of koma.dropGen(this.shogiBoard.board)) {
      const props = {
        key: `${path.x}${path.y}`,
        active: true,
        code: `0${index}${path.x}${path.y}${koma.symbol}`,
      };
      /** その場所に動かした時，自分の王様に利きがないかを調べる */
      if (!this.shogiBoard.canMove(point(0, 0), path, koma)) {
        continue;
      }
      const x = path.x - 1;
      const y = path.y - 1;
      this.gameState.boardState.board[y*9+x] = <Piece.Empty {...props}/>;
    }
  }

  /**
   * 駒を現在動かすことができるマスを示す
   * @param {Koma} koma
   * @param {Int} fromX
   * @param {Int} fromY
   */
  setPath(koma, fromX, fromY) {
    for (const path of koma.pathGen(fromX, fromY, this.shogiBoard.board)) {
      const to = this.shogiBoard.board[path.x][path.y];
      const props = {
        key: `${path.x}${path.y}`,
        mine: to.isSente == this.order,
        active: true,
      };
      /** その場所に動かした時，自分の王様に利きがないかを調べる */
      if (canNari(koma, fromX, fromY) || canNari(koma, path.x, path.y)) {
        if (!this.shogiBoard.canMove(point(fromX, fromY),
            path, koma.createNari())) {
          continue;
        }
        if (!canNarazu(koma, path.y)) {
          props.code =
            `${fromX}${fromY}${path.x}${path.y}${koma.createNari().symbol}`;
        } else {
          props.choose = [
            `${fromX}${fromY}${path.x}${path.y}${koma.symbol}`,
            `${fromX}${fromY}${path.x}${path.y}${koma.createNari().symbol}`,
          ];
        }
      } else if (this.shogiBoard.canMove(point(fromX, fromY), path, koma)) {
        props.code = `${fromX}${fromY}${path.x}${path.y}${koma.symbol}`;
      }
      const x = path.x - 1;
      const y = path.y - 1;
      this.gameState.boardState.board[y*9+x] = komaToComponent(to, props);
    }
  }

  /**
   * 現在の盤面を表示する
   */
  setCurrentBoard() {
    /** ボード */
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        const koma = this.shogiBoard.board[x+1][y+1];
        const props = {
          key: `${x+1}${y+1}`,
          mine: koma.isSente == this.order,
        };
        this.gameState.boardState.board[y*9+x] = komaToComponent(koma, props);
      }
    }
    /** 手駒 */
    for (let turn = 0; turn <= 1; turn++) {
      let tegoma = this.gameState.boardState.myTegoma;
      if (turn != +this.order) {
        tegoma = this.gameState.boardState.yourTegoma;
      }
      tegoma.length = 0;
      for (const koma of ['FU', 'KY', 'KE', 'GI', 'KI', 'KA', 'HI']) {
        for (let i = 0; i < shogiBoard.tegoma[turn][koma].num; i++) {
          const props = {
            mine: turn == +this.order,
            key: `0${i.toString(20)}${koma}`,
          };
          tegoma.push(
              komaToComponent(shogiBoard.tegoma[turn][koma].koma, props),
          );
        }
      }
    }
  }
};

export default Game;
