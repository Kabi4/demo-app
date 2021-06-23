import React from 'react';
import { Redirect, Switch } from 'react-router';
import './App.css';
import { PrivateRoutes, AuthRoute } from './Routes/Index';
import { Home, Signin } from './Container/Index';
function App() {
    return (
        <Switch>
            <AuthRoute fallback="/main" path="/" exact>
                <Signin />
            </AuthRoute>
            <PrivateRoutes fallback="/" path="/main">
                <Home />
            </PrivateRoutes>
            <Redirect to="/" exact />
        </Switch>
    );
}

export default App;
