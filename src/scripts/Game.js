import ShogiBoard from './ShogiBoard';

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
    this.gameState = {
      boardState: [],
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
    this.handleChange(this.gameState);
  };

  /**
   * 駒をアクティブ(選択状態)にする
   * @param {Int} x アクティブにする駒のx座標
   * @param {Int} y アクティブにする駒のy座標
   */
  getActive(x, y) {
    // 何らかの処理
    this.handleChange(this.gameState);
  };
};

export default Game;
