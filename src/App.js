import React from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Home} from './pages/Home';
import {Landing} from './pages/Landing';

import {backgroundYellow} from './constants/colors';

import './polyfill';
import './App.css';

const App = () => {
    return (
        <AppContainer>
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                    >
                        <Landing />
                    </Route>
                    <Route
                        path="/meet/:meetingId"
                    >
                        <Home />
                    </Route>
                    <Route>
                        Nothing here
                    </Route>
                </Switch>
            </Router>
        </AppContainer>
    );
};

const AppContainer = styled.div`
    background-color: ${backgroundYellow};
`;

export default App;