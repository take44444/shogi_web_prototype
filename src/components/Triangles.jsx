import React from 'react';
import '../styles/Triangles.scss';

/**
 * 右上と左下に三角形があるフルスクリーンフレームコンポーネント
 * @param {Object} props
 * @return {JSX}
 */
function Triangles(props) {
  return (
    <div className='shogi__triangles_wrapper'>
      <div className='shogi__triangles_right-top'></div>
      <div className='shogi__triangles_left-bottom'></div>
      <div className='shogi__triangles_center shogi__triangles_link'>
        <div className='shogi__triangles_center-content'>
          <h1>{props.trianglesCenterTitle}</h1>
          <div>{props.trianglesCenterLink}</div>
        </div>
      </div>
      {props.children}
    </div>
  );
}

export default Triangles;
