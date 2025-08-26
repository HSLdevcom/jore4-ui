const { rules: bestPractices } = require('./best-practices');
const { rules: errors } = require('./errors');
const { rules: node } = require('./node');
const { rules: style } = require('./style');
const { rules: variables } = require('./variables');
const { rules: es6 } = require('./es6');
const { rules: imports } = require('./imports');
const { rules: strict } = require('./strict');
const { rules: react } = require('./react');
const { rules: reactA11y } = require('./react-a11y');
const { rules: reactHooks } = require('./react-hooks');
const { rules: typescript } = require('./typescript');
const { rules: cypress } = require('./cypress');
const { rules: jest } = require('./jest');

const { rules: i18nRules } = require('./i18n.js');

const uiRules = {
  ...bestPractices,
  ...errors,
  ...style,
  ...variables,
  ...es6,
  ...imports,
  ...strict,
  ...react,
  ...reactA11y,
  ...reactHooks,
  ...typescript,
};

const unitTestRules = {
  ...uiRules,
  ...node,
  ...jest,
};

const nodeProjectRules = {
  ...bestPractices,
  ...errors,
  ...node,
  ...style,
  ...variables,
  ...es6,
  ...imports,
  ...strict,
  ...typescript,
};

const testDBManagerRules = nodeProjectRules;

const cypressRules = {
  ...nodeProjectRules,
  ...cypress,
};

module.exports = {
  uiRules,
  unitTestRules,
  cypressRules,
  testDBManagerRules,
  i18nRules,
};
