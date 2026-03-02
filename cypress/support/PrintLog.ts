// Based on: https://github.com/cypress-io/cypress/issues/2134#issuecomment-1692593562

/**
 *  Helper function to convert hex colors to rgb
 * @param {string} hex - hex color
 * @returns {string}
 *
 * @example
 * // returns "255 255 255"
 * hex2rgb("#ffffff")
 */
function hex2rgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${r} ${g} ${b}`;
}

/**
 * Create a custom log
 * @param {string} name - Name of the custom log
 * @param {string} baseColor - Base color of the custom log in hex format
 *
 * @example
 * // Create a custom log with name "misc" and base color "#9333ea"
 * createCustomLog("misc", "#9333ea")
 */
export function createCustomLog(name: string, baseColor: string) {
  if (!name || !baseColor) {
    throw new Error('Missing parameters');
  }

  const logStyle = document.createElement('style');

  logStyle.textContent = `
        .command.command-name-ptf-${name} span.command-method {
            margin-right: 0.5rem;
            min-width: 10px;
            border-radius: 0.125rem;
            border-width: 1px;
            padding-left: 0.375rem;
            padding-right: 0.375rem;
            padding-top: 0.125rem;
            padding-bottom: 0.125rem;
            text-transform: uppercase;

            border-color: rgb(${hex2rgb(baseColor)} / 1);
            background-color: rgb(${hex2rgb(baseColor)} / 0.2);
            color: rgb(${hex2rgb(baseColor)} / 1) !important;
        }

        .command.command-name-ptf-${name} span.command-message{
            color: rgb(${hex2rgb(baseColor)} / 1);
            font-weight: normal;
        }

        .command.command-name-ptf-${name} span.command-message strong,
        .command.command-name-ptf-${name} span.command-message em {
            color: rgb(${hex2rgb(baseColor)} / 1);
        }
    `;

  if (window.top) {
    Cypress.$(window.top.document.head).append(logStyle);
  } else {
    throw new Error('window.top is NULL!');
  }
}

const baseStyles = [
  {
    name: 'info',
    color: '#E5F2FA',
  },
  {
    name: 'success',
    color: '#B1DF8E',
  },
  {
    name: 'warning',
    color: '#FED100',
  },
  {
    name: 'error',
    color: '#CA4000',
  },
  {
    name: 'section',
    color: '#C5A3CC',
  },
];

export function registerBaseStyles() {
  for (const { name, color } of baseStyles) {
    createCustomLog(name, color);
  }
}
