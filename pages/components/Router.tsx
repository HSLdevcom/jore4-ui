import React, { FunctionComponent } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Main } from '../Main';

function ExampleRoute() {
  return <h2>Example route</h2>;
}

export const Router: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/example-route">Example route</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>
        <Route path="/example-route">
          <ExampleRoute />
        </Route>
        <Route path="*">
          <p>Page not found</p>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
