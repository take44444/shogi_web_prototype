import React from 'react';
import {changeTitle} from '../scripts/changeTitle';

class NotFound extends React.Component {
    componentDidMount() {
        changeTitle('エラー')
    }
    render() {
        return (<div>404 Not Found</div>)
    };
};

export default NotFound;
