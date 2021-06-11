import React from 'react';
import Piece from './components/Piece';
import {BOARD_STATE, ShogiBoard} from './ShogiBoard';
import {Fu, Ky, Ke} from './Koma';
import {Code, point, komaToComponent} from './utils';

/**
 * 自分の陣地ないか否かをBooleanで返す関数
 * @param {Int} x 盤における筋
 * @param {Int} y 盤における段
 * @return {Boolean} 引数で与えられたマスが自分の陣地内の場合はtrue，違う場合はfalseを返す
 */
function isSenteArea(x, y) {
  return (7 <= y && y <= 9 && 1 <= x && x <= 9);
}

/**
* 敵の陣地ないか否かをBooleanで返す関数
* @param {Int} x 盤における筋
* @param {Int} y 盤における段
* @return {Boolean} 引数で与えられたマスが敵の陣地内の場合はtrue，違う場合はfalseを返す
*/
function isGoteArea(x, y) {
  return (1 <= y && y <= 3 && 1 <= x && x <= 9);
}

/**
* 与えられた駒がそのマスに移動した時に成れるか否かをBooleanで返す関数
* @param {Int} koma 駒を表す数値
* @param {Point} p マスの座標
* @return {Boolean} 引数で与えられた駒が，そのマスに移動した時に成れる場合はtrue，違う場合はfalseを返す
*/
function canNari(koma, p) {
  return (koma.canNari &&
  ((koma.isSente && isGoteArea(p.x, p.y)) ||
  (!koma.isSente && isSenteArea(p.x, p.y))));
}

/**
 * 与えられた駒がそのマスに移動したときに成らずを選択できるか否かをBooleanで返す関数
 * @param {Int} koma 駒を表す数値
 * @param {Int} y 盤における段
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
    this.setCurrentBoard();
    this.setCurrentTegoma(null, null, null);
    this.handleChange = handleChange;
    this.handleChange(this.gameState);
  };

  /**
   * 指し手を一度行う
   * @param {String} code 指し手(CSA)
   */
  move(code) {
    code = new Code(code);
    let koma;
    let event;
    const killee = this.shogiBoard.board[code.to.x][code.to.y];
    let nariFlg = false;

    if (code.from.x == 0) {
      /** 手駒を使った場合 */
      koma = this.shogiBoard.tegoma[+this.shogiBoard.turn][code.komaStr].koma;
      event = this.shogiBoard.move(code.from, code.to, koma);
      this.setCurrentBoard();
      this.setCurrentTegoma(koma, code.index, null);
    } else {
      /** ボード上の駒を動かした場合 */
      komaBefore = this.shogiBoard.board[code.from.x][code.from.y];
      koma = komaBefore;
      if (this.shogiBoard
          .board[code.from.x][code.from.y].symbol != code.komaStr) {
        koma = koma.createNari();
        nariFlg = true;
      }
      event = this.shogiBoard.move(code.from, code.to, koma);
      this.setCurrentBoard();
      this.setCurrentTegoma(null, null, killee);
      const x = code.from.x - 1;
      const y = code.from.y - 1;
      this.gameState.boardState.board[y*9+x] = <Piece.Replace {...{
        key: code.from.toString(),
        from: komaToComponent(komaBefore, {
          mine: koma.isSente == this.order,
        }),
        to: <Piece.Empty />,
      }} />;
    }
    this.shogiBoard.rotateTurn();

    const props = {
      from: komaToComponent(killee, {
        mine: (!(killee instanceof Empty)) && killee.isSente == this.order,
      }),
    };
    if (nariFlg) {
      props.to = <Piece.Reverse {...{
        from: komaToComponent(koma.createNarazu(), {
          mine: koma.isSente == this.order,
        }),
        to: komaToComponent(koma, {
          mine: koma.isSente == this.order,
        }),
      }}/>;
    } else {
      props.to = komaToComponent(koma, {
        mine: koma.isSente == this.order,
      });
    }
    const x = code.to.x - 1;
    const y = code.to.y - 1;
    this.gameState.boardState.board[y*9+x] = <Piece.Replace {...props}/>;

    this.setEvents(event);
    this.handleChange(this.gameState);
  };

  /**
   * 駒をアクティブ(選択状態)にする
   * @param {String} code
   */
  getActive(code) {
    this.gameState.events.length = 0;
    if (code === null) {
      this.setCurrentBoard();
      this.setCurrentTegoma(null, null, null);
      this.handleChange(this.gameState);
      return;
    }
    code = new Code(code);
    let koma;
    if (code.from.x == 0) {
      /** 手駒が選択されたとき */
      koma = this.shogiBoard.tegoma[+this.order][code.komaStr].koma;
      this.setDrop(koma, code.index);
    } else {
      /** ボード上の駒が選択されたとき */
      koma = this.shogiBoard.board[code.from.x][code.from.y];
      this.setPath(koma, code.from);
    }
    this.handleChange(this.gameState);
  };

  /**
   * 駒を現在打つことができるマスを示す
   * @param {Koma} koma
   * @param {Int} index
   */
  setDrop(koma, index) {
    index = index.toString(20);
    for (const path of koma.dropGen(this.shogiBoard.board)) {
      /** その場所に動かした時，自分の王様に利きがないかを調べる */
      if (!this.shogiBoard.canMove(point(0, 0), path, koma)) {
        continue;
      }
      const x = path.x - 1;
      const y = path.y - 1;
      // 移動先はEmpty
      this.gameState.boardState.board[y*9+x] = <Piece.Empty {...{
        // 移動先に駒はないため，mineではない
        key: path.toString(),
        active: true,
        code: `0${index}${path}${koma}`,
      }}/>;
    }
  }

  /**
   * 駒を現在動かすことができるマスを示す
   * @param {Koma} koma
   * @param {Point} from
   */
  setPath(koma, from) {
    for (const path of koma.pathGen(from.x, from.y, this.shogiBoard.board)) {
      const to = this.shogiBoard.board[path.x][path.y];
      const props = {
        // このメソッドはturn==orderの時しか呼ばれないため，移動先はmineではない
        key: path.toString(),
        active: true,
      };
      /** その場所に動かした時，自分の王様に利きがないかを調べる */
      if (canNari(koma, from) || canNari(koma, path)) {
        if (!this.shogiBoard.canMove(from, path, koma.createNari())) {
          continue;
        }
        if (!canNarazu(koma, path.y)) {
          props.code = `${from}${path}${koma.createNari()}`;
        } else {
          props.choose = [ // TODO
            `${from}${path}${koma}`,
            `${from}${path}${koma}`,
          ];
        }
      } else if (this.shogiBoard.canMove(from, path, koma)) {
        props.code = `${from}${path}${koma}`;
      }
      const x = path.x - 1;
      const y = path.y - 1;
      this.gameState.boardState.board[y*9+x] = komaToComponent(to, props);
    }
  }

  /**
   * 現在のボードをセット
   */
  setCurrentBoard() {
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        const koma = this.shogiBoard.board[x+1][y+1];
        this.gameState.boardState.board[y*9+x] = komaToComponent(koma, {
          key: `${x+1}${y+1}`,
          mine: (!(koma instanceof Empty)) && (koma.isSente == this.order),
        });
      }
    }
  }

  /**
   * 現在の手駒をセット
   * @param {Koma} komaUsed
   * @param {Int} index
   * @param {Koma} komaCaptured
   */
  setCurrentTegoma(komaUsed, index, komaCaptured) {
    if (komaCaptured.isNari) {
      komaCaptured = komaCaptured.createNarazu();
    }
    for (let turn = 0; turn <= 1; turn++) {
      let tegoma = this.gameState.boardState.myTegoma;
      if (turn != +this.order) {
        tegoma = this.gameState.boardState.yourTegoma;
      }
      tegoma.length = 0;
      for (const komaStr of ['FU', 'KY', 'KE', 'GI', 'KI', 'KA', 'HI']) {
        const koma = this.shogiBoard.tegoma[turn][komaStr].koma;
        for (let i = 0; i < this.shogiBoard.tegoma[turn][komaStr].num; i++) {
          if ((!(komaUsed === null)) && (+komaUsed.isSente) == turn &&
          komaUsed.symbol == komaStr && index == i) {
            tegoma.push(
                <Piece.Replace {...{
                  key: `--${koma}`,
                  from: komaToComponent(koma, {
                    mine: koma.isSente == this.order,
                  }),
                  to: <Piece.Empty />,
                }}/>,
            );
          }
          tegoma.push(
              komaToComponent(koma, {
                mine: turn == +this.order,
                key: `0${i.toString(20)}${koma}`,
              }),
          );
        }
        if ((!(komaCaptured === null)) && (+komaCaptured.isSente) != turn &&
          komaCaptured.symbol == komaStr) {
          tegoma[tegoma.length-1] = <Piece.Replace {...{
            from: <Piece.Empty />,
            to: komaToComponent(koma, {
              mine: koma.isSente == this.order,
            }),
          }}/>;
        }
      }
    }
  }

  /**
   * イベントをセットするメソッド
   * @param {Int} event
   */
  setEvents(event) {
    this.gameState.events = ['put'];
    switch (event) {
      case BOARD_STATE.NOTHING:
        break;
      case BOARD_STATE.OUTE:
        this.gameState.events.push('oute');
        break;
      case BOARD_STATE.TUMI:
        if (this.shogiBoard.turn == this.order) {
          this.gameState.events.push('tumi-mine');
        } else {
          this.gameState.events.push('tumi-your');
        }
        break;
      case BOARD_STATE.SENNICHITE:
        this.gameState.events.push('sennichite');
        break;
    }
  }
};

export default Game;
