import React from 'react';
import Piece from './components/Piece';
import {Fu, Ky, Ke, Gi, Ki, Ka, Hi, Ou, To, Ny, Nk, Ng, Um, Ry} from './Koma';

/**
 * 座標のクラス
 */
class Point {
  /**
   * コンストラクタ
   * @param {Int} x
   * @param {Int} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 2つの座標が等しいか調べるメソッド
   * @param {Point} other
   * @return {Boolean}
   */
  eq(other) {
    return this.x == other.x && this.y == other.y;
  }

  /**
   * クローンを生成するメソッド
   * @return {Point}
   */
  clone() {
    return new Point(this.x, this.y);
  }
}

/**
 * Pointを生成する関数
 * @param {Int} x
 * @param {Int} y
 * @return {Point}
 */
function point(x, y) {
  return new Point(x, y);
}


/**
 * KomaクラスのインスタンスからReactのコンポーネントに変換する関数
 * @param {Koma} koma
 * @param {Object} props
 * @return {React}
 */
function komaToComponent(koma, props) {
  if (koma instanceof Ry) {
    return <Piece.Ry {...props}/>;
  } else if (koma instanceof Um) {
    return <Piece.Um {...props}/>;
  } else if (koma instanceof Ng) {
    return <Piece.Ng {...props}/>;
  } else if (koma instanceof Nk) {
    return <Piece.Nk {...props}/>;
  } else if (koma instanceof Ny) {
    return <Piece.Ny {...props}/>;
  } else if (koma instanceof To) {
    return <Piece.To {...props}/>;
  } else if (koma instanceof Ou) {
    return <Piece.Ou {...props}/>;
  } else if (koma instanceof Hi) {
    return <Piece.Hi {...props}/>;
  } else if (koma instanceof Ka) {
    return <Piece.Ka {...props}/>;
  } else if (koma instanceof Ki) {
    return <Piece.Ki {...props}/>;
  } else if (koma instanceof Gi) {
    return <Piece.Gi {...props}/>;
  } else if (koma instanceof Ke) {
    return <Piece.Ke {...props}/>;
  } else if (koma instanceof Ky) {
    return <Piece.Ky {...props}/>;
  } else if (koma instanceof Fu) {
    return <Piece.Fu {...props}/>;
  }
}

export default {point, komaToComponent};
