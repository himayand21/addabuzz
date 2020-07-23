import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {withSocket} from './context';

const Main = withSocket(App);

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);