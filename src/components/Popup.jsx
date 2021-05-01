import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import '../styles/Popup.scss';

class Popup extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        if (this.props.show) {
            return (
                <div className='shogi__popup_wrapper'>
                    <div className='shogi__popup'>
                    <button type='button' className='shogi__popup_close' onClick={this.props.handlePopup.bind(this, 'close')}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                        <div className='shogi__popup_content'>{this.props.children}</div>
                    </div>
                </div>
            );
        };
        return (
            <div className='shogi__popup_closed'>
            </div>
        );
        
    };
};

export default Popup;
