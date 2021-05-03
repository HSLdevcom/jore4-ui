/* eslint-disable no-underscore-dangle */
import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { routes } from 'routes';
import { Navbar } from './navbar';

export const Router: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        {Object.values(routes).map((route) => (
          <Route
            key={route._routerRoute}
            path={route._routerRoute}
            exact={route._exact || false}
            component={route.component}
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
};
