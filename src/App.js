import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Game from './pages/Game';
import Login from './pages/Login';
import Ranking from './pages/Ranking';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/settings" component={ Settings } />
        <Route exact path="/game" component={ Game } />
        <Route exact path="/ranking" component={ Ranking } />
        <Route exact path="/" component={ Login } />
      </Switch>
    </div>
  );
}
