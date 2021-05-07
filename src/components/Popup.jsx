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
      <div className='shogi--popup-wrapper'>
        <div className='shogi--popup'>
          <button type='button'
            className='shogi--popup-close'
            onClick={props.handlePopup.bind(this, false)}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
          <div className='shogi--popup-content'>{props.children}</div>
        </div>
      </div>
    );
  };
  return (
    <div className='shogi--popup-closed'>
    </div>
  );
}

export default Popup;
