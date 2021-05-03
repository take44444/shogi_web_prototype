import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import '../styles/Popup.scss';

/**
 * ポップアップコンポーネント
 * @param {Object} props
 * @return {JSX}
 */
function Popup(props) {
  if (props.show) {
    return (
      <div className='shogi__popup_wrapper'>
        <div className='shogi__popup'>
          <button type='button'
            className='shogi__popup_close'
            onClick={props.handlePopup.bind(this, false)}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
          <div className='shogi__popup_content'>{props.children}</div>
        </div>
      </div>
    );
  };
  return (
    <div className='shogi__popup_closed'>
    </div>
  );
}

export default Popup;
