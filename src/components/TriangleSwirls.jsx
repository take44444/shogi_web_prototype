import React from 'react';
import '../styles/TriangleSwirls.scss';
import TriangleSwirlsImage from '../vectors/triangle-swirls.svg';

/**
 * メインメニュー
 * @param {Object} props
 * @return {JSX}
 */
function TriangleSwirls(props) {
  return (
    <div className='shogi--triangle_swirls'>
      <div className='shogi--triangle_swirls-right_top-wrapper'>
        <TriangleSwirlsImage
          className='shogi--triangle_swirls-right_top'
          height='100%' width='100%'
        />
      </div>
      <div className='shogi--triangle_swirls-left_bottom-wrapper'>
        <TriangleSwirlsImage
          className='shogi--triangle_swirls-left_bottom'
          height='100%' width='100%'
        />
      </div>
      <div className='shogi--triangle_swirls-content-wrapper'>
        <div className='shogi--triangle_swirls-content'>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default TriangleSwirls;
