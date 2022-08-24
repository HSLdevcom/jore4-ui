describe('Verify that login mocking works', () => {
  let userInfo: { givenName: string };

  before(() => {
    cy.fixture('users/e2e.json').then((user) => {
      userInfo = user;
    });
  });

  it('User is not logged in by default', () => {
    cy.visit('/');
    // If login button is visible, user is logged out
    cy.getByTestId('UserNavMenu::loginButton');
  });

  it('cy.mockLogin() logs user in', () => {
    cy.mockLogin();
    cy.visit('/');
    // If dropdown contains user's name, they are logged in
    cy.getByTestId('UserNavMenu::toggleDropdown').should(
      'contain',
      userInfo.givenName,
    );
  });
});

// workaround for "cypress/integration/login.spec.ts:1:1 - error TS1208: 'login.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module."
// eslint-disable-next-line jest/no-export
export {};
