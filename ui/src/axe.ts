import React from 'react';
import ReactDOM from 'react-dom';

// axe is accessibility monitoring tool that logs errors to console
// if it detects accessibility problems runtime.
// https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);
}
