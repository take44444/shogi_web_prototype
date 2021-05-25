import React from 'react';

/**
 * 駒コンポーネントのテンプレート
 * @param {Object} props
 * @param {String} props.notation
 * @param {Boolean} props.isMine
 * @param {Boolean} props.isReverse
 * @return {JSX}
 */
function PieceTemplate(props) {
  return (<div>{props.notation}</div>);
};

const Piece = {
  Fu: function Fu() {
    return (<PieceTemplate notation='歩' />);
  },
  To: function To() {
    return (<PieceTemplate notation='と' isReverse />);
  },
  Replace: function Replace(props) {
    return (<PieceTemplate from={props.from} to={props.to} />);
  },
};

export default Piece;
