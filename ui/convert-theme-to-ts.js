#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

// this script reads our `./theme.js` file and converts it to
// `./src/generated/theme.ts` file.
// JS file is used by tailwind config file as it understands only module.exports
// syntax and JavaScript
// TS file is used in our source code. Having file in TS has two benefits:
// - TS doesn't understand module.exports syntax. This script converts its to
//   use es module syntax
// - TS compiler can't infer types of JS but it can for TS files

const fs = require('fs');
const path = require('path');
// prettier is installed to workspace root
// eslint-disable-next-line import/no-extraneous-dependencies
const prettier = require('prettier');
const theme = require('./theme.js');

const themeStr = JSON.stringify(theme);
const js = `
export const theme = ${themeStr}
`;

try {
  fs.writeFileSync(
    path.resolve(process.cwd(), './src/generated/theme.ts'),
    prettier.format(js, { parser: 'babel' }),
    'utf-8',
  );
} catch (err) {
  console.log(err.message);
}
