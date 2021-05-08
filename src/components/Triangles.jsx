import React from 'react';
import '../styles/Triangles.scss';

/**
 * 右上と左下に三角形があるフルスクリーンフレームコンポーネント
 * @param {Object} props
 * @param {JSX} props.trianglesCenter centerのコンテンツ
 * @param {Object} props.handleClick centerクリック時のハンドラ
 * @return {JSX}
 */
function Triangles(props) {
  return (
    <div className='shogi--triangles'>
      <div className='shogi--triangles-right_top' />
      <div className='shogi--triangles-left_bottom' />
      <div
        className='shogi--triangles-center shogi--triangles-link'
        onClick={props.handleClick.bind(this, true)}
      >
        <div className='shogi--triangles-center-content'>
          {props.TrianglesCenterContent}
        </div>
      </div>
      {props.children}
    </div>
  );
}

export default Triangles;
