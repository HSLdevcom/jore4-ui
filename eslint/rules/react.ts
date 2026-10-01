/* eslint-disable no-continue,no-bitwise,eqeqeq */
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { RuleFunction, merge } from '@eslint-react/kit';
import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint';

/**
 * Replaces: react/destructuring-assignment
 *
 * @returns {RuleFunction}
 */
function noDirectAccessProps(): RuleFunction {
  return (context, { collect }) => {
    const { query, visitor } = collect.components(context);

    return merge(visitor, {
      'Program:exit': (program) => {
        for (const { node } of query.all(program)) {
          const [props] = node.params;
          if (props == null) {
            continue;
          }

          if (props.type !== 'Identifier') {
            continue;
          }

          const propName = props.name;
          const propVariable = context.sourceCode
            .getScope(node)
            .variables.find((v) => v.name === propName);
          const propReferences = propVariable?.references ?? [];
          for (const ref of propReferences) {
            const { parent } = ref.identifier;
            if (parent.type !== 'MemberExpression') {
              continue;
            }

            context.report({
              message: 'Use destructuring assignment for component props.',
              node: parent,
            });
          }
        }
      },
    });
  };
}
/**
 * Replaces: react/function-component-definition
 *
 * @returns {RuleFunction}
 */
function functionComponentDefinition(): RuleFunction {
  return (context, { collect, hint }) => {
    const { query, visitor } = collect.components(context, {
      hint:
        hint.component.Default &
        ~hint.component.DoNotIncludeFunctionDefinedAsObjectMethod,
    });
    return merge(visitor, {
      'Program:exit': (program) => {
        for (const { node } of query.all(program)) {
          // Guard: must not already be arrow function
          if (node.type === 'ArrowFunctionExpression') {
            continue;
          }
          context.report({
            node,
            message:
              'Function components must be defined with arrow functions.',
            suggest: [
              {
                desc: 'Convert to arrow function.',
                fix(fixer) {
                  const src = context.sourceCode;
                  if (node.generator) {
                    return null;
                  }
                  const prefix = node.async ? 'async ' : '';
                  const typeParams =
                    node.typeParameters != null
                      ? src.getText(node.typeParameters)
                      : '';
                  const params = `(${node.params.map((p) => src.getText(p)).join(', ')})`;
                  const returnType =
                    node.returnType != null ? src.getText(node.returnType) : '';
                  const body = src.getText(node.body);
                  if (node.type === 'FunctionDeclaration' && node.id != null) {
                    // dprint-ignore
                    return fixer.replaceText(
                      node,
                      `const ${node.id.name} = ${prefix}${typeParams}${params}${returnType} => ${body};`,
                    );
                  }
                  if (
                    node.type === 'FunctionExpression' &&
                    node.parent.type === 'VariableDeclarator'
                  ) {
                    // dprint-ignore
                    return fixer.replaceText(
                      node,
                      `${prefix}${typeParams}${params}${returnType} => ${body}`,
                    );
                  }
                  if (
                    node.type === 'FunctionExpression' &&
                    node.parent.type === 'Property'
                  ) {
                    // dprint-ignore
                    return fixer.replaceText(
                      node.parent,
                      `${src.getText(node.parent.key)}: ${prefix}${typeParams}${params}${returnType} => ${body}`,
                    );
                  }
                  return null;
                },
              },
            ],
          });
        }
      },
    });
  };
}

export const rules: SharedConfig.RulesRecord = {
  'no-underscore-dangle': [
    'error',
    {
      allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
      enforceInMethodNames: true,
    },
  ],

  // Prevent extra closing tags for components without children
  // https://eslint.style/rules/jsx-self-closing-comp
  '@stylistic/jsx-self-closing-comp': 'error',

  // Prevent unused propType definitions
  // https://eslint-react.xyz/docs/rules/no-unused-props
  '@eslint-react/no-unused-props': 'error',

  // Require style prop value be an object or var
  // https://eslint-react.xyz/docs/rules/dom-no-string-style-prop
  '@eslint-react/dom-no-string-style-prop': 'error',

  // Prevent unused state values
  // https://eslint-react.xyz/docs/rules/no-unused-state
  '@eslint-react/no-unused-state': 'error',

  // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
  '@stylistic/jsx-curly-brace-presence': ['error'],

  // Prevent usage of button elements without an explicit type attribute
  // https://eslint-react.xyz/docs/rules/dom-no-missing-button-type
  '@eslint-react/dom-no-missing-button-type': 'error',

  // Disallow unnecessary fragments
  // https://eslint-react.xyz/docs/rules/jsx-no-useless-fragment
  '@eslint-react/jsx-no-useless-fragment': 'error',

  // Prevent react contexts from taking non-stable values
  // https://eslint-react.xyz/docs/rules/no-unstable-context-value
  '@eslint-react/no-unstable-context-value': 'error',

  // Prevent usage of unknown attributes
  // https://eslint-react.xyz/docs/rules/dom-no-unknown-property
  '@eslint-react/dom-no-unknown-property': [
    'error',
    { requireDataLowercase: true },
  ],

  // Allow calling setState in useEffect
  '@eslint-react/set-state-in-effect': 0,

  // Allow wonky Context variable names
  '@eslint-react/naming-convention-context-name': 0,
};

export const kits = [noDirectAccessProps, functionComponentDefinition];
