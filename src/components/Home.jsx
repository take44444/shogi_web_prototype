import React from 'react';
import {changeTitle} from '../scripts/changeTitle';
import Popup from './Popup';
import Triangles from './Triangles';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            namePopup: false,
        };
        this.handleNamePopup = this.handleNamePopup.bind(this);
    };
    componentDidMount() {
        changeTitle('ホーム')
    }
    handleNamePopup(state) {
        this.setState({
            namePopup: state === 'open',
        });
    };
    render() {
        const TrianglesCenterLink = (
            <div onClick={this.handleNamePopup.bind(this, 'open')}>Please click here.</div>
        );
        return (
            <Triangles
            trianglesCenterTitle='Ne:SHOGI'
            trianglesCenterLink={TrianglesCenterLink}>
                <Popup show={this.state.namePopup} handlePopup={this.handleNamePopup}>
                    名前入力ポップアップ
                </Popup>
            </Triangles>
        )
    };
};

export default Home;
