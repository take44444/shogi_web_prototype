import React from 'react';
import '../styles/Triangles.scss';

class Triangles extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return (
            <div className='shogi__triangles_wrapper'>
                <div className='shogi__triangles_right-top'></div>
                <div className='shogi__triangles_left-bottom'></div>
                <div className='shogi__triangles_center'>
                    <div className='shogi__triangles_center-content'>
                        <h1>{this.props.trianglesCenterTitle}</h1>
                        <div className='shogi__triangles_link'>{this.props.trianglesCenterLink}</div>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    };
};

export default Triangles;
