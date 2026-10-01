import { rules as bestPractices } from './best-practices';
import { rules as cypress } from './cypress';
import { rules as errors } from './errors';
import { rules as es6 } from './es6';
import { rules as imports } from './imports';
import { rules as jest } from './jest';
import { rules as node } from './node';
import { rules as react } from './react';
import { rules as reactA11y } from './react-a11y';
import { rules as strict } from './strict';
import { rules as style } from './style';
import { rules as typescript } from './typescript';
import { rules as variables } from './variables';

export { kits } from './react';

export const uiRules = {
  ...bestPractices,
  ...errors,
  ...style,
  ...variables,
  ...es6,
  ...imports,
  ...strict,
  ...react,
  ...reactA11y,
  ...typescript,
};

export const unitTestRules = {
  ...uiRules,
  ...node,
  ...jest,
};

export const nodeProjectRules = {
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

export const cypressRules = {
  ...nodeProjectRules,
  ...cypress,
};
