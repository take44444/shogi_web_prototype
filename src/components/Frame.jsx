import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Home';
import MainMenu from './MainMenu';
import NotFound from './NotFound';

/**
 * ルーティングコンポーネント
 * @return {JSX} ルーティング先のコンポーネント
 */
function Frame() {
  const [appState, handleAppState] = useState({
    user: {
      name: '',
    },
  });

  const commonProps = {
    appState: appState,
    handleAppState: handleAppState,
  };

  return (
    <Router>
      <Switch>
        <Route
          path='/' exact
          render={() => <Home {...commonProps} />}
        />
        <Route
          path='/main' exact
          render={() => <MainMenu {...commonProps} />}
        />
        <Route
          path='/'
          component={NotFound}
        />
      </Switch>
    </Router>
  );
};

export default Frame;
