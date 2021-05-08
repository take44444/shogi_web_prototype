import React from 'react';
import '../styles/MenuButton.scss';

/**
 * メニュー画面のボタン
 * @param {Object} props
 * @param {String} props.text ボタンのテキスト\
 * @return {JSX}
 */
function MenuButton(props) {
  return (
    <button type='button' className='shogi--menu_button'>
      <div className='shogi--menu_button-ribbon-left' />
      <div className='shogi--menu_button-ribbon-right' />
      <div className='shogi--menu_button-content'>
        <span className='shogi--menu_button-content-text shogi--root-serif'>
          {props.text}
        </span>
      </div>
    </button>
  );
};

export default MenuButton;
