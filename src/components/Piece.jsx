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
  Fu: function Fu(props) {
    return (<PieceTemplate notation='歩' {...props} />);
  },
  To: function To(props) {
    return (<PieceTemplate notation='と' isReverse {...props} />);
  },

  Ky: function Ky(props) {
    return (<PieceTemplate notation='香' {...props} />);
  },
  Ny: function Ny(props) {
    return (<PieceTemplate notation='成香' isReverse {...props} />);
  },

  Ke: function Ke(props) {
    return (<PieceTemplate notation='桂' {...props} />);
  },
  Nk: function Nk(props) {
    return (<PieceTemplate notation='成桂' isReverse {...props} />);
  },

  Gi: function Gi(props) {
    return (<PieceTemplate notation='銀' {...props} />);
  },
  Ng: function Ng(props) {
    return (<PieceTemplate notation='成銀' isReverse {...props} />);
  },

  Ki: function Ki(props) {
    return (<PieceTemplate notation='金' {...props} />);
  },

  Ka: function Ka(props) {
    return (<PieceTemplate notation='角' {...props} />);
  },
  Um: function Um(props) {
    return (<PieceTemplate notation='馬' isReverse {...props} />);
  },

  Hi: function Hi(props) {
    return (<PieceTemplate notation='飛' {...props} />);
  },
  Ry: function Ry(props) {
    return (<PieceTemplate notation='龍' isReverse {...props} />);
  },

  Ou: function Ou(props) {
    return (<PieceTemplate notation='王' {...props} />);
  },

  Empty: function Empty(props) {
    return (<PieceTemplate notation=' ' {...props} />);
  },
  Replace: function Replace(props) {
    return (<PieceTemplate {...props} />);
  },
  Reverse: function Reverse(props) {
    return (<PieceTemplate {...props} />);
  },
};

export default Piece;
