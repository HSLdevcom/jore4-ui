import { Tag } from '../enums/tags';

describe('Login tests', () => {
  beforeEach(() => {
    cy.setupTests();
  });

  it(
    'User is not logged in by default',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { tags: [Tag.Login, Tag.Smoke] },
    () => {
      cy.visit('/');
      // If login button is visible, user is logged out
      cy.getByTestId('UserNavMenu::loginButton');
    },
  );
});

// workaround for "cypress/integration/login.spec.ts:1:1 - error TS1208: 'login.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module."
// eslint-disable-next-line jest/no-export
export {};
