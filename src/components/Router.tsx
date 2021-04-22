import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Main } from './Main';
import { Navbar } from './Navbar';

function ExampleRoute() {
  return <h2>Example route</h2>;
}

export const Router: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Navbar />
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
