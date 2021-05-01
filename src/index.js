import React from 'react';
import ReactDOM from 'react-dom';
import { init } from './scripts/init';
import Frame from './components/Frame';
import './styles/index.scss';

init();
const appRoot = document.getElementById('shogi__root');
ReactDOM.render(<Frame />, appRoot);
