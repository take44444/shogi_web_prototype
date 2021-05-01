import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import NotFound from './NotFound';

class Frame extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/' component={NotFound} />
                </Switch>
            </Router>
        );
    }
};

export default Frame;
